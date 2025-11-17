from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, Enum as SQLAlchemyEnum, func
from sqlmodel import Field, SQLModel

class AuthType(str, Enum):
    AUTH0_PASSWORD = "auth0_password"
    GOOGLE_OAUTH2 = "google_oauth2"



class User(SQLModel, table=True):
    __tablename__: str = "users"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False,
    )
    auth0_id: str = Field(
        nullable=False,
        unique=True,
        index=True,
        sa_column_kwargs={"comment": "Auth0 user identifier"},
    )
    email: str | None = Field(
        default=None,
        index=True,
        sa_column_kwargs={"comment": "Primary email address"},
    )
    display_name: str | None = Field(
        default=None,
        max_length=255,
        sa_column_kwargs={"comment": "User display name"},
    )
    auth_type: AuthType = Field(
        sa_column=SQLAlchemyEnum(AuthType, name="auth_type", nullable=False),
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
        ),
        default_factory=lambda: datetime.now(tz=timezone.utc),
    )

