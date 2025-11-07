"""Request-scoped metadata shared across connector interactions."""

from dataclasses import dataclass

from opentelemetry.context import Context


@dataclass(frozen=True)
class RequestContext:
    """Typed container for per-request metadata and tracing context."""

    publication_id: str
    otel_context: Context
