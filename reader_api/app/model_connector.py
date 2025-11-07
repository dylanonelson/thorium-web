"""
LLM connector using LiteLLM for flexible model provider support.
"""

import asyncio
import json
import logging
import os
from collections.abc import Mapping, Sequence
from typing import (
    Any,
    AsyncIterator,
    Coroutine,
    Dict,
    List,
    Optional,
    Tuple,
    Union,
)

import litellm
from litellm import ChatCompletionToolParam, acompletion
from litellm.cost_calculator import completion_cost
from litellm.litellm_core_utils.streaming_handler import CustomStreamWrapper
from litellm.types.utils import (
    Choices,
    Function,
    Message,
    ModelResponse,
    StreamingChoices,
)
from opentelemetry import context as context_api
from opentelemetry import trace
from opentelemetry.context import Context
from opentelemetry.trace import Span, SpanKind
from opentelemetry.trace.status import Status, StatusCode

from app import publication_reader
from app.request_context import RequestContext

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)


SEARCH_PUBLICATION_TOOL_NAME = "search_publication"
MAX_TOOL_CALL_ITERATIONS = 15
DEFAULT_MAX_RESULTS = 20
DEFAULT_CONTEXT_CHARS = 120


JsonPrimitive = Union[str, int, float, bool, None]
JsonValue = Union[
    JsonPrimitive,
    Sequence["JsonValue"],
    Mapping[str, "JsonValue"],
]


class ModelConfig:
    """Configuration for LLM models and API keys."""

    def __init__(
        self,
        default_model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 10000,
    ):
        self.default_model = default_model or os.getenv("DEFAULT_MODEL", "gpt-4")
        self.temperature = temperature
        self.max_tokens = max_tokens

        # Load API keys from environment
        # LiteLLM automatically looks for these env vars:
        # - OPENAI_API_KEY
        # - ANTHROPIC_API_KEY
        # - GEMINI_API_KEY
        # - AZURE_API_KEY, AZURE_API_BASE, AZURE_API_VERSION

        # Optional: Set LiteLLM options
        litellm.drop_params = True  # Drop unsupported params instead of erroring

        litellm_verbose = os.getenv("LITELLM_VERBOSE", "false").lower() == "true"
        # set_verbose is present at runtime but missing from type hints; setattr avoids lint issues
        setattr(litellm, "set_verbose", litellm_verbose)


class ModelConnector:
    """Main interface for LLM interactions."""

    def __init__(self, config: Optional[ModelConfig] = None):
        self.config = config or ModelConfig()

    async def chat(
        self,
        messages: List[Message],
        request_context: RequestContext,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        enabled_tools: Optional[List[str]] = None,
    ) -> AsyncIterator[str]:
        """
        Send chat messages to LLM and get response.

        Args:
            messages: List of message dicts with 'role' and 'content' keys
                     Example: [{"role": "user", "content": "Hello"}]
            model: Model to use. If None, uses default from config.
                  Examples: "gpt-4", "claude-3-5-sonnet-20241022", "ollama/llama2"
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens in response
            request_context: Optional contextual metadata for tracing/tooling

        Returns:
            Response string, or async iterator if stream=True
        """
        if enabled_tools:
            raise NotImplementedError(
                "Streaming chat with tools enabled is not supported."
            )

        model = model or self.config.default_model
        temperature = (
            temperature if temperature is not None else self.config.temperature
        )
        max_tokens = max_tokens if max_tokens is not None else self.config.max_tokens

        parent_context = request_context.otel_context
        span = tracer.start_span(
            "litellm.acompletion.stream",
            kind=SpanKind.CLIENT,
            context=parent_context,
        )
        self._set_llm_span_attributes(
            span,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
            tool_count=0,
        )

        token: Optional[object] = None
        try:
            span_context = trace.set_span_in_context(span, parent_context)
            token = context_api.attach(parent_context)
            with trace.use_span(span, end_on_exit=False):
                response = await acompletion(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stream=True,
                )
            return self._stream_response(
                response,
                span,
                span_context,
            )
        except Exception as exc:
            self._record_span_exception(span, exc)
            span.end()
            raise RuntimeError(f"Error calling LLM: {str(exc)}") from exc
        finally:
            if token is not None:
                context_api.detach(token)

    async def chat_sync(
        self,
        messages: List[Message],
        request_context: RequestContext,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        enabled_tools: Optional[List[str]] = None,
    ) -> str:
        """
        Send chat messages to LLM and get response. Wrapper around chat() to get a synchronous response.
        """
        model = model or self.config.default_model
        temperature = (
            temperature if temperature is not None else self.config.temperature
        )
        max_tokens = max_tokens if max_tokens is not None else self.config.max_tokens
        tools = self._resolve_tools(enabled_tools, request_context)

        if not tools:
            response_stream = await self.chat(
                messages,
                request_context,
                model,
                temperature,
                max_tokens,
                enabled_tools=None,
            )
            full_response = ""
            async for chunk in response_stream:
                full_response += chunk
            return full_response

        return await self._chat_sync_with_tools(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            tools=tools,
            request_context=request_context,
        )

    def _resolve_tools(
        self,
        enabled_tools: Optional[List[str]],
        request_context: RequestContext,
    ) -> List[ChatCompletionToolParam]:
        if not enabled_tools:
            return []

        resolved_tools: List[ChatCompletionToolParam] = []
        for tool_name in enabled_tools:
            if tool_name == SEARCH_PUBLICATION_TOOL_NAME:
                resolved_tools.append(self._search_tool_definition())
            else:
                logger.warning("Unknown tool requested: %s", tool_name)
        return resolved_tools

    async def _chat_sync_with_tools(
        self,
        messages: List[Message],
        model: str,
        temperature: float,
        max_tokens: int,
        tools: List[ChatCompletionToolParam],
        request_context: RequestContext,
    ) -> str:
        conversation: List[Message] = [message for message in messages]
        tool_iterations = 0

        while True:
            completion_kwargs: Dict[str, Any] = {
                "model": model,
                "messages": conversation,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False,
                "tools": tools,
                "tool_choice": "auto",
            }

            parent_context = request_context.otel_context
            span = tracer.start_span(
                "litellm.acompletion",
                kind=SpanKind.CLIENT,
                context=parent_context,
            )
            self._set_llm_span_attributes(
                span,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False,
                tool_count=len(tools),
            )

            token: Optional[object] = None
            try:
                if parent_context is not None:
                    token = context_api.attach(parent_context)
                with trace.use_span(span, end_on_exit=False):
                    response = await acompletion(**completion_kwargs)
            except Exception as exc:
                self._record_span_exception(span, exc)
                span.end()
                raise
            finally:
                if token is not None:
                    context_api.detach(token)

            if isinstance(response, CustomStreamWrapper):
                error = TypeError(
                    "Tool-enabled chat does not support streaming responses"
                )
                self._record_span_exception(span, error)
                span.end()
                raise error

            choice = self._get_first_choice(response)
            conversation.append(choice.message)

            tool_calls = self._get_tool_calls(choice)
            span.set_attribute("gen_ai.response.tool_call_count", len(tool_calls))
            span.end()
            logger.info("Number of tool calls: %s", len(tool_calls))
            if tool_calls:
                tool_iterations += len(tool_calls)
                if tool_iterations > MAX_TOOL_CALL_ITERATIONS:
                    raise RuntimeError("Tool call loop exceeded iteration limit")
                parent_context = request_context.otel_context
                batch_token = context_api.attach(parent_context)
                try:
                    with tracer.start_as_current_span(
                        "litellm.tool.batch",
                    ) as tool_batch_span:
                        tool_batch_span.set_attribute(
                            "gen_ai.tool_call.count", len(tool_calls)
                        )
                        tool_parent_context = trace.set_span_in_context(
                            tool_batch_span, parent_context
                        )
                        tool_tasks: List[Coroutine[object, object, JsonValue]] = []
                        task_metadata: List[Tuple[str, str]] = []
                        for tool_call_id, function in tool_calls:
                            logger.info("Function: %s", function)
                            logger.info("Executing tool call: %s", tool_call_id)
                            tool_name = function.name
                            arguments_json = function.arguments
                            if not tool_name or not arguments_json:
                                raise ValueError(
                                    "Tool call is missing a name or arguments"
                                )
                            tool_tasks.append(
                                self._dispatch_tool(
                                    tool_name,
                                    arguments_json,
                                    tool_parent_context,
                                    request_context,
                                )
                            )
                            task_metadata.append((tool_call_id, tool_name))
                        results = await asyncio.gather(*tool_tasks)
                        for (tool_call_id, tool_name), result in zip(
                            task_metadata, results
                        ):
                            conversation.append(
                                Message(
                                    tool_call_id=tool_call_id,
                                    role="tool",
                                    name=tool_name,
                                    content=json.dumps(result),
                                )
                            )
                finally:
                    if batch_token is not None:
                        context_api.detach(batch_token)
            else:
                break

        logger.info("Conversation[-1].content: %s", conversation[-1].content)
        return self._extract_message_content(conversation[-1])

    async def _dispatch_tool(
        self,
        tool_name: str,
        arguments_json: str,
        parent_context: Context,
        request_context: RequestContext,
    ) -> JsonValue:
        token = context_api.attach(parent_context)

        try:
            with tracer.start_as_current_span(
                "litellm.tool.execute",
            ) as span:
                span.set_attribute("gen_ai.tool.name", tool_name)
                span.set_attribute("gen_ai.tool.arguments", arguments_json)
                publication_id = request_context.publication_id
                span.set_attribute("gen_ai.tool.publication_id", publication_id)
                try:
                    return await self._execute_tool(
                        tool_name,
                        arguments_json,
                        request_context,
                    )
                except Exception as exc:  # noqa: BLE001
                    self._record_span_exception(span, exc)
                    logger.exception("Tool %s failed: %s", tool_name, exc)
                    return {"error": str(exc)}
        finally:
            context_api.detach(token)

    def _get_first_choice(self, response: ModelResponse) -> Choices:
        if not response.choices:
            raise ValueError("Response choices sequence is empty")
        first_choice = response.choices[0]
        if isinstance(first_choice, StreamingChoices):
            raise TypeError(
                "Received streaming choice in non-streaming response context"
            )
        if not isinstance(first_choice, Choices):
            raise TypeError("Unexpected choice payload type in ModelResponse")
        return first_choice

    def _get_tool_calls(self, choice: Choices) -> List[Tuple[str, Function]]:
        if not choice.message.tool_calls:
            return []
        return [
            (t.id, t.function)
            for t in choice.message.tool_calls
            if isinstance(t.function, Function)
            and t.function.name == SEARCH_PUBLICATION_TOOL_NAME
        ]

    async def _execute_tool(
        self,
        tool_name: str,
        arguments_json: str,
        request_context: RequestContext,
    ) -> JsonValue:
        if tool_name != SEARCH_PUBLICATION_TOOL_NAME:
            raise ValueError(f"Unsupported tool: {tool_name}")

        publication_id = request_context.publication_id

        search_args = self._parse_search_arguments(arguments_json)

        hits = await publication_reader.search_publication(
            publication_id=publication_id,
            query=search_args["query"],
            max_results=search_args["max_results"],
            context_chars=search_args["context_chars"],
        )
        return {"hits": hits}

    def _parse_search_arguments(self, arguments_json: str) -> Dict[str, Any]:
        try:
            args = json.loads(arguments_json or "{}")
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON arguments: {exc}") from exc

        if not isinstance(args, dict):
            raise ValueError("Tool arguments must be a JSON object")

        query = args.get("query")
        if not query or not isinstance(query, str):
            raise ValueError("`query` is required and must be a string")

        max_results = self._coerce_positive_int(
            args.get("max_results"), DEFAULT_MAX_RESULTS
        )
        context_chars = self._coerce_positive_int(
            args.get("context_chars"), DEFAULT_CONTEXT_CHARS
        )

        return {
            "query": query,
            "max_results": max_results,
            "context_chars": context_chars,
        }

    def _coerce_positive_int(self, value: Any, default: int) -> int:
        if value is None:
            return default
        try:
            int_value = int(value)
        except (TypeError, ValueError):
            return default
        return int_value if int_value > 0 else default

    def _search_tool_definition(self) -> ChatCompletionToolParam:
        return {
            "type": "function",
            "function": {
                "name": SEARCH_PUBLICATION_TOOL_NAME,
                "description": (
                    "Search the current publication for passages matching a keyword or phrase. "
                    "This search is very simple and will only search literally for the phrase "
                    "you provide, so it must appear exactly as you provide it in the book to "
                    "return results."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Keyword or phrase to search for in the publication. The search is case-insensitive. This search tool is very simple and will only return exact matches for the provided phrase.",
                        },
                        "max_results": {
                            "type": "integer",
                            "minimum": 1,
                            "description": "Maximum number of search results to return. Defaults to 20.",
                        },
                        "context_chars": {
                            "type": "integer",
                            "minimum": 20,
                            "description": "Number of surrounding characters to include for each hit. Defaults to 120.",
                        },
                    },
                    "required": ["query"],
                    "additionalProperties": False,
                },
            },
        }

    def _set_llm_span_attributes(
        self,
        span: Span,
        *,
        model: str,
        temperature: float,
        max_tokens: int,
        stream: bool,
        tool_count: int,
    ) -> None:
        span.set_attribute("gen_ai.system", "litellm")
        span.set_attribute("gen_ai.request.model", model)
        span.set_attribute("gen_ai.request.temperature", temperature)
        span.set_attribute("gen_ai.request.max_output_tokens", max_tokens)
        span.set_attribute("gen_ai.request.stream", stream)
        span.set_attribute("gen_ai.request.tool_count", tool_count)
        span.set_attribute("gen_ai.request.has_tools", tool_count > 0)

    @staticmethod
    def _record_span_exception(span: Span, exc: Exception) -> None:
        span.record_exception(exc)
        span.set_status(Status(StatusCode.ERROR, str(exc)))

    def _extract_message_content(self, message: Message) -> str:
        if not message.content:
            raise ValueError("Message content is empty")
        return message.content

    async def _stream_response(
        self,
        response,
        span: Optional[Span] = None,
        span_context: Optional[Context] = None,
    ) -> AsyncIterator[str]:
        """Helper to stream response chunks."""
        token: Optional[object] = None
        if span_context is not None:
            token = context_api.attach(span_context)
        try:
            async for chunk in response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as exc:
            if span is not None:
                self._record_span_exception(span, exc)
            raise
        finally:
            if token is not None:
                context_api.detach(token)
            if span is not None:
                span.end()

    def get_cost(self, response) -> Optional[float]:
        """
        Calculate cost of a completion response.

        Args:
            response: Response object from acompletion()

        Returns:
            Cost in USD, or None if cost can't be calculated
        """
        try:
            return completion_cost(completion_response=response)
        except Exception:
            return None


# Singleton instance for convenience
_connector: Optional[ModelConnector] = None


def get_connector() -> ModelConnector:
    """Get or create the global ModelConnector instance."""
    global _connector
    if _connector is None:
        _connector = ModelConnector()
    return _connector
