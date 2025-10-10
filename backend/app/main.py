from datetime import datetime
import time
from typing import AsyncIterator

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse, StreamingResponse, Response
from sse_starlette.sse import EventSourceResponse
from app.models import HealthResponseModel, AskRequestModel, AskResponseModel

app = FastAPI(title="Test API", version="0.1.0")


@app.get("/health", response_model=HealthResponseModel)
def health() -> HealthResponseModel:
    return HealthResponseModel(ok=True, timestamp_ms=int(time.time() * 1000))

@app.get("/ask", response_model=AskResponseModel)
def ask(request: AskRequestModel) -> AskResponseModel:
    return AskResponseModel(answer=request.question)