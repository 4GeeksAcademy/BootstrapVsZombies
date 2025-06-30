from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/sessions", response_model=schemas.GameSessionOut)
def create_session(session: schemas.GameSessionCreate, db: Session = Depends(get_db)):
    db_session = models.GameSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@app.get("/sessions", response_model=List[schemas.GameSessionOut])
def list_sessions(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.GameSession)
    if user_id is not None:
        query = query.filter(models.GameSession.user_id == user_id)
    return query.all()


@app.get("/sessions/{session_id}", response_model=schemas.GameSessionOut)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session_obj = db.query(models.GameSession).get(session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_obj


@app.put("/sessions/{session_id}", response_model=schemas.GameSessionOut)
def update_session(session_id: int, update: schemas.GameSessionUpdate, db: Session = Depends(get_db)):
    db_session = db.query(models.GameSession).get(session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_session, key, value)
    db.commit()
    db.refresh(db_session)
    return db_session


@app.delete("/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    db_session = db.query(models.GameSession).get(session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(db_session)
    db.commit()
    return {"detail": "Session deleted"}


@app.get("/stats/{user_id}")
def get_stats(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(models.GameSession).filter(models.GameSession.user_id == user_id).all()
    if not sessions:
        return {
            "total_games": 0,
            "high_score": 0,
            "total_score": 0,
            "levels_completed": 0,
            "zombies_defeated": 0,
        }
    return {
        "total_games": len(sessions),
        "high_score": max(s.score for s in sessions),
        "total_score": sum(s.score for s in sessions),
        "levels_completed": max(s.level_reached for s in sessions),
        "zombies_defeated": sum(s.zombies_defeated for s in sessions),
    }
