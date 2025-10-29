from datetime import datetime
import time
from typing import AsyncIterator
import os
from pathlib import Path

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse, StreamingResponse, Response
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv

from app.models import HealthResponseModel, AskRequestModel, AskResponseModel
from app.model_connector import get_connector
from app.prompts import get_messages

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Tabula", version="0.1.0")


@app.get("/health", response_model=HealthResponseModel)
def health() -> HealthResponseModel:
    return HealthResponseModel(ok=True, timestamp_ms=int(time.time() * 1000))


@app.post("/ask", response_model=AskResponseModel)
async def ask(request: AskRequestModel) -> AskResponseModel:
    """
    Ask a question about the current reading position.
    """
    model_connector = get_connector()

    messages = get_messages(
        request.question,
        request.locator,
        title="David Copperfield",
        author="Charles Dickens",
        prompt_version="v0",
    )
    answer = await model_connector.chat_sync(messages)
    return AskResponseModel(answer=answer)
