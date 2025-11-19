"""add reading_locations table

Revision ID: 27b0c39f4a9c
Revises: d428a772f942
Create Date: 2025-11-18 20:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "27b0c39f4a9c"
down_revision: Union[str, Sequence[str], None] = "d428a772f942"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "reading_locations",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            comment="User associated with the reading location",
        ),
        sa.Column(
            "publication_id",
            sa.String(length=255),
            nullable=False,
            comment="Publication identifier",
        ),
        sa.Column(
            "locator",
            sa.JSON(),
            nullable=False,
            comment="Serialized Readium locator representing the user's position",
        ),
        sa.Column(
            "recorded_at",
            sa.DateTime(timezone=True),
            nullable=True,
            comment="Timestamp supplied by the client for this reading location",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            comment="Timestamp when the location was saved",
        ),
    )
    op.create_index(
        "ix_reading_locations_user_pub_recorded_at",
        "reading_locations",
        ["user_id", "publication_id", "recorded_at"],
        unique=False,
    )
    op.create_index(
        "ix_reading_locations_user_recorded_at",
        "reading_locations",
        ["user_id", "recorded_at"],
        unique=False,
    )
    op.create_index(
        "ix_reading_locations_user_pub_created_at",
        "reading_locations",
        ["user_id", "publication_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_reading_locations_user_created_at",
        "reading_locations",
        ["user_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        "ix_reading_locations_user_recorded_at",
        table_name="reading_locations",
    )
    op.drop_index(
        "ix_reading_locations_user_created_at",
        table_name="reading_locations",
    )
    op.drop_index(
        "ix_reading_locations_user_pub_recorded_at",
        table_name="reading_locations",
    )
    op.drop_index(
        "ix_reading_locations_user_pub_created_at",
        table_name="reading_locations",
    )
    op.drop_table("reading_locations")


