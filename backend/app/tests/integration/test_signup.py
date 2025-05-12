from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_success():
    response = client.post("/v1/users/signup", json={
        "name": "Pedro Test",
        "email": "pedrotest@example.com",
        "password": "securepassword123",
        "role": "guest"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Pedro Test"
    assert data["email"] == "pedrotest@example.com"
    assert data["role"] == "guest"
    assert "user_id" in data

def test_signup_duplicate_email():
    # First signup
    client.post("/v1/users/signup", json={
        "name": "Pedro Test 2",
        "email": "duplicatetest@example.com",
        "password": "securepassword123",
        "role": "guest"
    })

    # Second signup with same email
    response = client.post("/v1/users/signup", json={
        "name": "Pedro Test 3",
        "email": "duplicatetest@example.com",
        "password": "differentpassword123",
        "role": "guest"
    })

    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Email already registered."
