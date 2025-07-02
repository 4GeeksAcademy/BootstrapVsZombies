"""add game related tables

Revision ID: 0001
Revises: a5cffa318ac2
Create Date: 2024-07-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = 'a5cffa318ac2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'profile',
        sa.Column('id', sa.Integer(), sa.ForeignKey('user.id'), primary_key=True),
        sa.Column('display_name', sa.String(length=50), nullable=False),
        sa.Column('avatar_url', sa.String(length=200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_table(
        'game_stats',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('user.id'), nullable=False),
        sa.Column('total_games', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('high_score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('levels_completed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('zombies_defeated', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('user_id')
    )
    op.create_table(
        'game_session',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('user.id'), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('level_reached', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('zombies_defeated', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('duration_seconds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completed_at', sa.DateTime(), nullable=False)
    )


def downgrade():
    op.drop_table('game_session')
    op.drop_table('game_stats')
    op.drop_table('profile')
