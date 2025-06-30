from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-secret')
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'another-secret')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sessions = db.relationship(
        "GameSession", back_populates="user", cascade="all, delete-orphan"
    )
    stats = db.relationship(
        "GameStats", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class GameSession(db.Model):
    __tablename__ = 'game_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, default=0)
    level_reached = db.Column(db.Integer, default=1)
    zombies_defeated = db.Column(db.Integer, default=0)
    duration_seconds = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='sessions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'score': self.score,
            'level_reached': self.level_reached,
            'zombies_defeated': self.zombies_defeated,
            'duration_seconds': self.duration_seconds,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }


class GameStats(db.Model):
    __tablename__ = 'game_stats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_games = db.Column(db.Integer, default=0)
    high_score = db.Column(db.Integer, default=0)
    total_score = db.Column(db.Integer, default=0)
    levels_completed = db.Column(db.Integer, default=0)
    zombies_defeated = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='stats')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_games': self.total_games,
            'high_score': self.high_score,
            'total_score': self.total_score,
            'levels_completed': self.levels_completed,
            'zombies_defeated': self.zombies_defeated,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }

def init_db():
    with app.app_context():
        db.create_all()

@app.post('/api/auth/register')
def register():
    data = request.get_json() or {}
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, name=name, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    return jsonify({'user': user.to_dict(), 'token': access_token}), 201

@app.post('/api/auth/login')
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({'user': user.to_dict(), 'token': access_token})

@app.get('/api/auth/me')
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()})


@app.post('/sessions')
def create_session():
    data = request.get_json() or {}
    try:
        user_id = int(data.get('user_id'))
    except (TypeError, ValueError):
        return jsonify({'error': 'user_id is required'}), 400

    session_obj = GameSession(
        user_id=user_id,
        score=data.get('score', 0),
        level_reached=data.get('level_reached', 1),
        zombies_defeated=data.get('zombies_defeated', 0),
        duration_seconds=data.get('duration_seconds', 0),
        completed_at=datetime.fromisoformat(data['completed_at']) if data.get('completed_at') else datetime.utcnow(),
    )
    db.session.add(session_obj)
    db.session.commit()
    return jsonify(session_obj.to_dict()), 201


@app.get('/sessions')
def list_sessions():
    user_id = request.args.get('user_id', type=int)
    query = GameSession.query
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
    sessions = [s.to_dict() for s in query.all()]
    return jsonify(sessions)


@app.get('/sessions/<int:session_id>')
def get_session(session_id):
    session_obj = db.session.get(GameSession, session_id)
    if not session_obj:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(session_obj.to_dict())


@app.put('/sessions/<int:session_id>')
def update_session(session_id):
    session_obj = db.session.get(GameSession, session_id)
    if not session_obj:
        return jsonify({'error': 'Session not found'}), 404
    data = request.get_json() or {}
    for field in [
        'score',
        'level_reached',
        'zombies_defeated',
        'duration_seconds',
        'completed_at',
    ]:
        if field in data:
            value = data[field]
            if field == 'completed_at' and value is not None:
                value = datetime.fromisoformat(value)
            setattr(session_obj, field, value)
    db.session.commit()
    return jsonify(session_obj.to_dict())


@app.delete('/sessions/<int:session_id>')
def delete_session(session_id):
    session_obj = db.session.get(GameSession, session_id)
    if not session_obj:
        return jsonify({'error': 'Session not found'}), 404
    db.session.delete(session_obj)
    db.session.commit()
    return jsonify({'detail': 'Session deleted'})


@app.get('/stats/<int:user_id>')
def get_stats(user_id):
    sessions = GameSession.query.filter_by(user_id=user_id).all()
    if not sessions:
        return jsonify({
            'total_games': 0,
            'high_score': 0,
            'total_score': 0,
            'levels_completed': 0,
            'zombies_defeated': 0,
        })
    return jsonify({
        'total_games': len(sessions),
        'high_score': max(s.score for s in sessions),
        'total_score': sum(s.score for s in sessions),
        'levels_completed': max(s.level_reached for s in sessions),
        'zombies_defeated': sum(s.zombies_defeated for s in sessions),
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
