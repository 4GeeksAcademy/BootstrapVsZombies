from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    display_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("GameSession", back_populates="user", cascade="all, delete-orphan")
    stats = relationship("GameStats", back_populates="user", uselist=False, cascade="all, delete-orphan")

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer, default=0)
    level_reached = Column(Integer, default=1)
    zombies_defeated = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class GameStats(Base):
    __tablename__ = "game_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_games = Column(Integer, default=0)
    high_score = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    levels_completed = Column(Integer, default=0)
    zombies_defeated = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="stats")
