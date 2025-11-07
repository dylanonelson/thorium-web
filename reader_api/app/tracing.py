from __future__ import annotations

from os import getenv
from typing import Final

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.asyncio import AsyncioInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.propagate import set_global_textmap
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

_TRACING_INITIALIZED: bool = False
_SERVICE_NAME: Final[str] = "reader-api"
_OTLP_ENDPOINT_ENV_VAR: Final[str] = "OTLP_ENDPOINT"
_DEFAULT_OTLP_ENDPOINT: Final[str] = "http://localhost:4317"


def setup_tracing() -> None:
    """
    Configure OpenTelemetry tracing for the service.
    """
    global _TRACING_INITIALIZED
    if _TRACING_INITIALIZED:
        return

    resource = Resource.create({"service.name": _SERVICE_NAME})
    provider = TracerProvider(resource=resource)
    endpoint = getenv(_OTLP_ENDPOINT_ENV_VAR)
    resolved_endpoint = endpoint if endpoint else _DEFAULT_OTLP_ENDPOINT
    exporter = OTLPSpanExporter(endpoint=resolved_endpoint, insecure=True)
    processor = BatchSpanProcessor(exporter)
    provider.add_span_processor(processor)

    trace.set_tracer_provider(provider)

    set_global_textmap(TraceContextTextMapPropagator())

    AsyncioInstrumentor().instrument()
    HTTPXClientInstrumentor().instrument()

    _TRACING_INITIALIZED = True
