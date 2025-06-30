from fastapi.testclient import TestClient
from backend_py.main import app

client = TestClient(app)

def test_game_session_crud():
    # create
    create_resp = client.post("/sessions", json={"user_id": 1, "score": 10})
    assert create_resp.status_code == 200
    session_id = create_resp.json()["id"]

    # list
    list_resp = client.get("/sessions")
    assert list_resp.status_code == 200
    assert any(s["id"] == session_id for s in list_resp.json())

    # get
    get_resp = client.get(f"/sessions/{session_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == session_id

    # update
    update_resp = client.put(f"/sessions/{session_id}", json={"score": 50})
    assert update_resp.status_code == 200
    assert update_resp.json()["score"] == 50

    # delete
    delete_resp = client.delete(f"/sessions/{session_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.json()["detail"] == "Session deleted"

    # confirm deletion
    not_found_resp = client.get(f"/sessions/{session_id}")
    assert not_found_resp.status_code == 404
