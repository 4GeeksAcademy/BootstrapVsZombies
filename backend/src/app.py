"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from utils import APIException, generate_sitemap
from admin import setup_admin
from models import db, User, Profile, GameStats, GameSession
#from models import Person

app = Flask(__name__)
app.url_map.strict_slashes = False

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-me')

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
jwt = JWTManager(app)
setup_admin(app)

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    return generate_sitemap(app)

@app.route('/user', methods=['GET'])
def handle_hello():

    response_body = {
        "msg": "Hello, this is your GET /user response "
    }

    return jsonify(response_body), 200


@app.post('/api/auth/register')
def register_user():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name') or data.get('display_name')
    if not email or not password or not name:
        return jsonify({'msg': 'Missing fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'User already exists'}), 400
    user = User(email=email, password=generate_password_hash(password), is_active=True)
    db.session.add(user)
    db.session.commit()
    profile = Profile(id=user.id, display_name=name)
    stats = GameStats(user_id=user.id)
    db.session.add(profile)
    db.session.add(stats)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify(token=token, user=user.serialize()), 201


@app.post('/api/auth/login')
def login_user():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'Invalid credentials'}), 401
    token = create_access_token(identity=user.id)
    return jsonify(token=token, user=user.serialize()), 200


@app.get('/api/auth/me')
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    profile = Profile.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    data = user.serialize()
    if profile:
        data['display_name'] = profile.display_name
    return jsonify(data)


@app.put('/profiles/<int:user_id>')
@jwt_required()
def update_profile_api(user_id):
    identity = get_jwt_identity()
    if identity != user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    profile = Profile.query.filter_by(id=user_id).first()
    if not profile:
        return jsonify({'msg': 'Profile not found'}), 404
    data = request.get_json() or {}
    profile.display_name = data.get('display_name', profile.display_name)
    profile.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(profile.serialize())


@app.get('/leaderboard')
def leaderboard():
    rows = (
        db.session.query(Profile.display_name, GameStats.high_score,
                        GameStats.total_games, GameStats.levels_completed)
        .join(GameStats, GameStats.user_id == Profile.id)
        .order_by(GameStats.high_score.desc())
        .limit(20)
        .all()
    )
    result = [
        {
            'display_name': r.display_name,
            'high_score': r.high_score,
            'total_games': r.total_games,
            'levels_completed': r.levels_completed,
        }
        for r in rows
    ]
    return jsonify(result)


@app.post('/sessions')
def create_session():
    data = request.get_json() or {}
    session = GameSession(
        user_id=data['user_id'],
        score=data.get('score', 0),
        level_reached=data.get('level_reached', 1),
        zombies_defeated=data.get('zombies_defeated', 0),
        duration_seconds=data.get('duration_seconds', 0)
    )
    db.session.add(session)
    stats = GameStats.query.filter_by(user_id=data['user_id']).first()
    if stats:
        stats.total_games += 1
        stats.total_score += session.score
        stats.high_score = max(stats.high_score, session.score)
        stats.levels_completed = max(stats.levels_completed, session.level_reached)
        stats.zombies_defeated += session.zombies_defeated
        stats.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(session.serialize()), 201


@app.get('/sessions')
def list_sessions():
    user_id = request.args.get('user_id')
    query = GameSession.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    sessions = query.all()
    return jsonify([s.serialize() for s in sessions])


@app.get('/sessions/<int:session_id>')
def get_session(session_id):
    session = GameSession.query.get(session_id)
    if not session:
        return jsonify({'msg': 'Not found'}), 404
    return jsonify(session.serialize())


@app.put('/sessions/<int:session_id>')
def update_session(session_id):
    session = GameSession.query.get(session_id)
    if not session:
        return jsonify({'msg': 'Not found'}), 404
    data = request.get_json() or {}
    session.score = data.get('score', session.score)
    session.level_reached = data.get('level_reached', session.level_reached)
    session.zombies_defeated = data.get('zombies_defeated', session.zombies_defeated)
    session.duration_seconds = data.get('duration_seconds', session.duration_seconds)
    db.session.commit()
    return jsonify(session.serialize())


@app.delete('/sessions/<int:session_id>')
def delete_session(session_id):
    session = GameSession.query.get(session_id)
    if not session:
        return jsonify({'msg': 'Not found'}), 404
    db.session.delete(session)
    db.session.commit()
    return jsonify({'detail': 'Session deleted'})


@app.get('/stats/<int:user_id>')
def stats(user_id):
    stats = GameStats.query.filter_by(user_id=user_id).first()
    if not stats:
        return jsonify({'msg': 'Not found'}), 404
    return jsonify(stats.serialize())

# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
