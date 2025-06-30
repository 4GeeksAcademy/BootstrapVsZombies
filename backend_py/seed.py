from datetime import datetime

from .database import SessionLocal, engine
from . import models

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data
for table in [models.GameSession, models.GameStats, models.User]:
    db.query(table).delete()

db.commit()

# Create sample users
users = [
    models.User(email="alice@example.com", display_name="Alice"),
    models.User(email="bob@example.com", display_name="Bob"),
]

db.add_all(users)

db.commit()

# Create sessions and stats for each user
sample_sessions = [
    models.GameSession(user_id=users[0].id, score=1200, level_reached=3, zombies_defeated=40, duration_seconds=180),
    models.GameSession(user_id=users[0].id, score=2000, level_reached=5, zombies_defeated=80, duration_seconds=300),
    models.GameSession(user_id=users[1].id, score=1500, level_reached=4, zombies_defeated=60, duration_seconds=240),
]

db.add_all(sample_sessions)

db.commit()

db.close()
print("Database seeded with sample data.")
