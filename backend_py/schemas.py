from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class GameSessionBase(BaseModel):
    user_id: int
    score: Optional[int] = 0
    level_reached: Optional[int] = 1
    zombies_defeated: Optional[int] = 0
    duration_seconds: Optional[int] = 0
    completed_at: Optional[datetime] = None

class GameSessionCreate(GameSessionBase):
    pass

class GameSessionUpdate(BaseModel):
    score: Optional[int] = None
    level_reached: Optional[int] = None
    zombies_defeated: Optional[int] = None
    duration_seconds: Optional[int] = None
    completed_at: Optional[datetime] = None

class GameSessionOut(GameSessionBase):
    id: int

    class Config:
        orm_mode = True
