from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Helper: Login and retrieve token
def get_token(email: str, password: str) -> str:
    response = client.post(
        "/v1/users/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]