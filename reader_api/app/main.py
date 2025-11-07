import time

from fastapi import FastAPI
from opentelemetry import context as context_api
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from app.config import Config
from app.model_connector import SEARCH_PUBLICATION_TOOL_NAME, get_connector
from app.models import AskRequestModel, AskResponseModel, HealthResponseModel
from app.prompts import get_messages
from app.request_context import RequestContext
from app.tracing import setup_tracing

Config.initialize()
setup_tracing()

app = FastAPI(title="Tabula", version="0.1.0")
FastAPIInstrumentor().instrument_app(app)


@app.get("/health", response_model=HealthResponseModel)
def health() -> HealthResponseModel:
    return HealthResponseModel(ok=True, timestamp_ms=int(time.time() * 1000))


@app.post("/ask", response_model=AskResponseModel)
async def ask(request: AskRequestModel) -> AskResponseModel:
    """
    Ask a question about the current reading position.
    """
    request_context = RequestContext(
        publication_id=request.publication_id,
        otel_context=context_api.get_current(),
    )

    model_connector = get_connector()

    messages = get_messages(
        request.question,
        request.locator,
        title="Anna Karenina",
        author="Leo Tolstoy",
        prompt_version="v0",
    )
    answer = await model_connector.chat_sync(
        messages,
        enabled_tools=[SEARCH_PUBLICATION_TOOL_NAME],
        request_context=request_context,
    )
    return AskResponseModel(answer=answer)
