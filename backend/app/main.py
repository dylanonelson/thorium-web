from datetime import datetime
from typing import AsyncIterator

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse, StreamingResponse, Response
from sse_starlette.sse import EventSourceResponse

from echo.v1 import echo_pb2  # type: ignore

app = FastAPI(title="Test API", version="0.1.0")


@app.get("/health")
def health():
    return {"ok": True}