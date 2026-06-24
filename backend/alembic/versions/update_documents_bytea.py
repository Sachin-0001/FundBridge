"""Update documents table to use BYTEA storage

Revision ID: update_documents_bytea
Revises: d6a656e6c91a
Create Date: 2026-06-24 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import BYTEA


# revision identifiers, used by Alembic.
revision: str = 'update_documents_bytea'
down_revision: Union[str, Sequence[str], None] = 'd6a656e6c91a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to use BYTEA storage."""
    # Add new columns
    op.add_column('documents', sa.Column('mime_type', sa.String(), nullable=True))
    op.add_column('documents', sa.Column('file_size', sa.Integer(), nullable=True))
    op.add_column('documents', sa.Column('file_data', BYTEA(), nullable=True))
    
    # Add uploaded_at column if it doesn't exist
    op.add_column('documents', sa.Column('uploaded_at', sa.DateTime(timezone=True), 
                                        server_default=sa.text('now()'), nullable=True))
    
    # For migration: Set defaults for existing records
    # We set mime_type to 'application/octet-stream' and file_size to 0
    # The file_data will be NULL until documents are re-uploaded
    op.execute("UPDATE documents SET mime_type = 'application/octet-stream' WHERE mime_type IS NULL")
    op.execute("UPDATE documents SET file_size = 0 WHERE file_size IS NULL")
    op.execute("UPDATE documents SET uploaded_at = created_at WHERE uploaded_at IS NULL")
    
    # Make columns non-nullable after setting defaults
    op.alter_column('documents', 'mime_type', existing_type=sa.String(), nullable=False)
    op.alter_column('documents', 'file_size', existing_type=sa.Integer(), nullable=False)
    op.alter_column('documents', 'uploaded_at', existing_type=sa.DateTime(timezone=True), nullable=False)
    
    # Drop the file_url column (no longer needed)
    op.drop_column('documents', 'file_url')


def downgrade() -> None:
    """Downgrade schema."""
    # Add file_url back
    op.add_column('documents', sa.Column('file_url', sa.String(), nullable=False, server_default=''))
    
    # Drop new columns
    op.drop_column('documents', 'mime_type')
    op.drop_column('documents', 'file_size')
    op.drop_column('documents', 'file_data')
    op.drop_column('documents', 'uploaded_at')
