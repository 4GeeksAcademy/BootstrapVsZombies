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
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }

@app.before_first_request
def create_tables():
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
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()})

if __name__ == '__main__':
    app.run(debug=True)
