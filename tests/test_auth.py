import os
import pytest
import flask

if not hasattr(flask.Flask, "before_first_request"):
    def before_first_request(self, func):
        self.before_request(func)
        return func

    flask.Flask.before_first_request = before_first_request

from backend.app import app, db

@pytest.fixture()
def client(tmp_path):
    test_db = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{test_db}"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    with app.app_context():
        db.create_all()
    with app.test_client() as client:
        yield client
    with app.app_context():
        db.drop_all()


def register(client, email="test@example.com", name="Tester", password="Password123"):
    return client.post(
        "/api/auth/register",
        json={"email": email, "name": name, "password": password},
    )


def login(client, email="test@example.com", password="Password123"):
    return client.post("/api/auth/login", json={"email": email, "password": password})


def test_register_and_login(client):
    response = register(client)
    assert response.status_code == 201
    data = response.get_json()
    assert "token" in data

    response = login(client)
    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
