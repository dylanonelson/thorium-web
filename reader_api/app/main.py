import time
import logging
from fastapi_plugin import Auth0FastAPI
from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from opentelemetry import context as context_api
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config import Config
from app.data import Auth0UserInfoError, get_or_create_user
from app.db import User, get_session
from app.model_connector import SEARCH_PUBLICATION_TOOL_NAME, get_connector
from app.api_models import (
    AskRequestModel,
    AskResponseModel,
    HealthResponseModel,
    UserResponseModel,
)
from app.prompts import get_messages
from app.request_context import RequestContext
from app.publications_catalog import (
    CatalogError,
    UnknownPublicationError,
    get_publication,
)
from app.tracing import setup_tracing

Config.initialize()
setup_tracing()

app = FastAPI(title="Apparatus API", version="0.1.0")
FastAPIInstrumentor().instrument_app(app)

auth0 = Auth0FastAPI(
    domain=Config.get_instance().auth0.issuer_domain,
    audience=Config.get_instance().auth0.api_audience,
)
bearer_scheme = HTTPBearer()

@app.get("/health", response_model=HealthResponseModel)
def health() -> HealthResponseModel:
    return HealthResponseModel(ok=True, timestamp_ms=int(time.time() * 1000))


@app.get("/protected")
async def protected(claims: dict = Depends(auth0.require_auth())):
    logging.getLogger(__name__).info(f"Protected route accessed with claims: {claims}")
    return {"message": "This is a protected route"}


@app.get("/users/me", response_model=UserResponseModel)
async def get_current_user(
    claims: dict[str, object] = Depends(auth0.require_auth()),
    session: AsyncSession = Depends(get_session),
    token: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> UserResponseModel:
    auth0_subject = claims.get("sub")
    if not isinstance(auth0_subject, str) or not auth0_subject:
        raise HTTPException(status_code=400, detail="Missing subject claim")

    try:
        user = await get_or_create_user(
            session,
            auth0_id=auth0_subject,
            access_token=token.credentials,
        )
        logging.getLogger(__name__).info(f"User: {user}")
    except Auth0UserInfoError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return UserResponseModel.model_validate(user, extra="ignore")


@app.post("/ask", response_model=AskResponseModel)
async def ask(request: AskRequestModel) -> AskResponseModel:
    """
    Ask a question about the current reading position.
    """
    try:
        publication = get_publication(request.publication_id)
    except UnknownPublicationError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except CatalogError as exc:
        raise HTTPException(
            status_code=500, detail="Publications catalog is not available"
        ) from exc

    request_context = RequestContext(
        publication_id=request.publication_id,
        otel_context=context_api.get_current(),
    )

    model_connector = get_connector()

    messages = get_messages(
        request.question,
        request.locator,
        title=publication.title,
        author=publication.author,
        prompt_version="v0",
    )
    answer = await model_connector.chat_sync(
        messages,
        enabled_tools=[SEARCH_PUBLICATION_TOOL_NAME],
        request_context=request_context,
    )
    return AskResponseModel(answer=answer)
