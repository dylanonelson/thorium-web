from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, Enum as SQLAlchemyEnum, JSON, func, Index
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


class ReadingLocation(SQLModel, table=True):
    __tablename__: str = "reading_locations"
    __table_args__ = (
        Index(
            "ix_reading_locations_user_pub_recorded_at",
            "user_id",
            "publication_id",
            "recorded_at",
        ),
        Index(
            "ix_reading_locations_user_recorded_at",
            "user_id",
            "recorded_at",
        ),
        Index(
            "ix_reading_locations_user_pub_created_at",
            "user_id",
            "publication_id",
            "created_at",
        ),
        Index(
            "ix_reading_locations_user_created_at",
            "user_id",
            "created_at",
        ),
    )

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False,
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        sa_column_kwargs={
            "comment": "User associated with the reading location",
        },
    )
    publication_id: str = Field(
        max_length=255,
        nullable=False,
        sa_column_kwargs={
            "comment": "Publication identifier",
        },
    )
    locator: dict[str, object] = Field(
        sa_column=Column(
            JSON,
            nullable=False,
            comment=(
                "Serialized Readium locator representing the user's position"
            ),
        ),
        # A Readium locator can contain nested JSON structures; the `object`
        # type is required to capture the supported primitive values.
    )
    recorded_at: datetime | None = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=True,
            comment="Timestamp supplied by the client for this reading location",
        ),
        default=None,
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
            comment="Timestamp when the location was saved",
        ),
        default_factory=lambda: datetime.now(tz=timezone.utc),
    )

