from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Profile(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey('user.id'), primary_key=True)
    display_name: Mapped[str] = mapped_column(String(50), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    user = relationship('User', backref='profile', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "display_name": self.display_name,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class GameStats(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), unique=True, nullable=False)
    total_games: Mapped[int] = mapped_column(Integer(), default=0)
    high_score: Mapped[int] = mapped_column(Integer(), default=0)
    total_score: Mapped[int] = mapped_column(Integer(), default=0)
    levels_completed: Mapped[int] = mapped_column(Integer(), default=0)
    zombies_defeated: Mapped[int] = mapped_column(Integer(), default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    user = relationship('User', backref='stats', uselist=False)

    def serialize(self):
        return {
            "user_id": self.user_id,
            "total_games": self.total_games,
            "high_score": self.high_score,
            "total_score": self.total_score,
            "levels_completed": self.levels_completed,
            "zombies_defeated": self.zombies_defeated,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class GameSession(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    score: Mapped[int] = mapped_column(Integer(), default=0)
    level_reached: Mapped[int] = mapped_column(Integer(), default=1)
    zombies_defeated: Mapped[int] = mapped_column(Integer(), default=0)
    duration_seconds: Mapped[int] = mapped_column(Integer(), default=0)
    completed_at: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)
    user = relationship('User', backref='sessions')

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "score": self.score,
            "level_reached": self.level_reached,
            "zombies_defeated": self.zombies_defeated,
            "duration_seconds": self.duration_seconds,
            "completed_at": self.completed_at.isoformat(),
        }
