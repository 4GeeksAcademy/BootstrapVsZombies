import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from flask_backend.app import app, db, User, GameSession

@pytest.fixture()
def client(tmp_path):
    db_path = tmp_path / 'test.db'
    os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()
        db.session.remove()

def create_user():
    user = User(email='test@example.com', name='Test', password_hash='x')
    db.session.add(user)
    db.session.commit()
    return user

def test_session_crud(client):
    with app.app_context():
        user = create_user()
        user_id = user.id
    # create
    rv = client.post('/sessions', json={'user_id': user_id, 'score': 5})
    assert rv.status_code == 201
    data = rv.get_json()
    session_id = data['id']

    # get single
    rv = client.get(f'/sessions/{session_id}')
    assert rv.status_code == 200
    assert rv.get_json()['score'] == 5

    # list
    rv = client.get('/sessions', query_string={'user_id': user_id})
    assert rv.status_code == 200
    assert len(rv.get_json()) == 1

    # update
    rv = client.put(f'/sessions/{session_id}', json={'score': 20})
    assert rv.status_code == 200
    assert rv.get_json()['score'] == 20

    # stats
    rv = client.get(f'/stats/{user_id}')
    assert rv.status_code == 200
    stats = rv.get_json()
    assert stats['high_score'] == 20
    assert stats['total_games'] == 1

    # delete
    rv = client.delete(f'/sessions/{session_id}')
    assert rv.status_code == 200
    rv = client.get(f'/sessions/{session_id}')
    assert rv.status_code == 404
