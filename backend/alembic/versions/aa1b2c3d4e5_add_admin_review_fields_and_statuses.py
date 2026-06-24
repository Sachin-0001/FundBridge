"""add admin review fields and statuses

Revision ID: aa1b2c3d4e5
Revises: 3dda4c053c43
Create Date: 2026-06-24 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa1b2c3d4e5'
down_revision: Union[str, Sequence[str], None] = '3dda4c053c43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new enum values to applicationstatus
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'PENDING_ADMIN_REVIEW'")
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'FORWARDED_TO_BANK'")
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'UNDER_BANK_REVIEW'")
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'REJECTED_BY_BANK'")
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'REJECTED_BY_ADMIN'")
    op.execute("ALTER TYPE applicationstatus ADD VALUE 'FUNDED'")

    # Add columns for admin review metadata
    op.add_column('applications', sa.Column('reviewed_by_admin', sa.Integer(), nullable=True))
    op.add_column('applications', sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('applications', sa.Column('admin_notes', sa.String(), nullable=True))
    op.add_column('applications', sa.Column('blocked_reason', sa.String(), nullable=True))
    op.add_column('applications', sa.Column('forwarded_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    # Drop added columns (enum values cannot be safely removed)
    op.drop_column('applications', 'forwarded_at')
    op.drop_column('applications', 'blocked_reason')
    op.drop_column('applications', 'admin_notes')
    op.drop_column('applications', 'reviewed_at')
    op.drop_column('applications', 'reviewed_by_admin')
    pass
