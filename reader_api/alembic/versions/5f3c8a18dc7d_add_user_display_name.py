"""add user display name

Revision ID: 5f3c8a18dc7d
Revises: 07a8eeac58a5
Create Date: 2025-11-17 15:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5f3c8a18dc7d"
down_revision: Union[str, Sequence[str], None] = "07a8eeac58a5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column(
            "display_name",
            sa.String(length=255),
            nullable=True,
            comment="User display name",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "display_name")



