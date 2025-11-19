import time
import logging
from datetime import datetime, timezone
from fastapi_plugin import Auth0FastAPI
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from opentelemetry import context as context_api
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config import Config
from app.data.users import Auth0UserInfoError, get_or_create_user
from app.db import ReadingLocation, User, get_db_session
from app.model_connector import SEARCH_PUBLICATION_TOOL_NAME, get_connector
from app.api_models import (
    AskRequestModel,
    AskResponseModel,
    HealthResponseModel,
    ReadingLocationResponseModel,
    StoreReadingLocationRequestModel,
    UserResponseModel,
    LocatorModel,
)
from app.prompts import get_messages
from app.request_context import RequestContext
from app.publications_catalog import (
    CatalogError,
    UnknownPublicationError,
    get_publication,
)
from app.tracing import setup_tracing
from app.data import (
    create_reading_location,
    get_latest_reading_location,
)

Config.initialize()
setup_tracing()

app = FastAPI(title="Apparatus API", version="0.1.0")
FastAPIInstrumentor().instrument_app(app)

auth0 = Auth0FastAPI(
    domain=Config.get_instance().auth0.issuer_domain,
    audience=Config.get_instance().auth0.api_audience,
)
require_auth = auth0.require_auth
bearer_scheme = HTTPBearer()


async def get_authenticated_user(
    claims: dict[str, object] = Depends(require_auth()),
    session: AsyncSession = Depends(get_db_session),
    token: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> User:
    auth0_subject = claims.get("sub")
    if not isinstance(auth0_subject, str) or not auth0_subject:
        raise HTTPException(status_code=400, detail="Missing subject claim")
    credentials = token.credentials
    if not isinstance(credentials, str) or not credentials:
        raise HTTPException(status_code=401, detail="Missing access token")

    try:
        user = await get_or_create_user(
            session,
            auth0_id=auth0_subject,
            access_token=credentials,
        )
    except Auth0UserInfoError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return user


def _build_reading_location_response(
    location: ReadingLocation,
) -> ReadingLocationResponseModel:
    return ReadingLocationResponseModel(
        id=location.id,
        publication_id=location.publication_id,
        locator=LocatorModel.model_validate(location.locator),
        recorded_at=location.recorded_at,
        created_at=location.created_at,
    )


@app.get("/health", response_model=HealthResponseModel)
def health() -> HealthResponseModel:
    return HealthResponseModel(ok=True, timestamp_ms=int(time.time() * 1000))


@app.get("/protected")
async def protected(claims: dict = Depends(auth0.require_auth())):
    logging.getLogger(__name__).info(f"Protected route accessed with claims: {claims}")
    return {"message": "This is a protected route"}


@app.get("/users/me", response_model=UserResponseModel)
async def get_current_user(
    user: User = Depends(get_authenticated_user),
) -> UserResponseModel:
    logging.getLogger(__name__).info(f"User: {user}")
    return UserResponseModel.model_validate(user, extra="ignore")


@app.post(
    "/reading-locations",
    response_model=ReadingLocationResponseModel,
    status_code=status.HTTP_201_CREATED,
)
async def create_reading_location_entry(
    reading_location_request: StoreReadingLocationRequestModel,
    user: User = Depends(get_authenticated_user),
    session: AsyncSession = Depends(get_db_session),
) -> ReadingLocationResponseModel:
    location = await create_reading_location(
        session,
        user_id=user.id,
        publication_id=reading_location_request.publication_id,
        locator=reading_location_request.locator.model_dump(mode="json", exclude_none=True),
        recorded_at=reading_location_request.recorded_at,
    )
    return _build_reading_location_response(location)


@app.get(
    "/reading-locations/latest",
    response_model=ReadingLocationResponseModel,
)
async def get_latest_reading_location_entry(
    publication_id: str | None = None,
    user: User = Depends(get_authenticated_user),
    session: AsyncSession = Depends(get_db_session),
) -> ReadingLocationResponseModel:
    location = await get_latest_reading_location(
        session,
        user_id=user.id,
        publication_id=publication_id,
    )
    if location is None:
        raise HTTPException(status_code=404, detail="No reading location found")
    return _build_reading_location_response(location)


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
