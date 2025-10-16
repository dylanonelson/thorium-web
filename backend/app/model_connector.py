"""
LLM connector using LiteLLM for flexible model provider support.
"""

import os
from typing import List, Dict, Optional, AsyncIterator
from litellm import acompletion, completion_cost
import litellm


class ModelConfig:
    """Configuration for LLM models and API keys."""

    def __init__(
        self,
        default_model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
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
        litellm.set_verbose = os.getenv("LITELLM_VERBOSE", "false").lower() == "true"


class ModelConnector:
    """Main interface for LLM interactions."""

    def __init__(self, config: Optional[ModelConfig] = None):
        self.config = config or ModelConfig()

    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
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
            stream: If True, returns async iterator of response chunks

        Returns:
            Response string, or async iterator if stream=True
        """
        model = model or self.config.default_model
        temperature = (
            temperature if temperature is not None else self.config.temperature
        )
        max_tokens = max_tokens if max_tokens is not None else self.config.max_tokens

        try:
            response = await acompletion(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            return self._stream_response(response)

        except Exception as e:
            raise RuntimeError(f"Error calling LLM: {str(e)}") from e

    async def chat_sync(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Send chat messages to LLM and get response. Wrapper around chat() to get a synchronous response.
        """
        response_stream = await self.chat(messages, model, temperature, max_tokens)
        full_response = ""
        async for chunk in response_stream:
            full_response += chunk
        return full_response

    async def _stream_response(self, response) -> AsyncIterator[str]:
        """Helper to stream response chunks."""
        async for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

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
