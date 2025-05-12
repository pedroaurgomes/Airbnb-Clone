from fastapi.testclient import TestClient
from app.main import app
from app.core.security import hash_password
from app.models.user import User
from app.core.db import get_session
from sqlmodel import Session

client = TestClient(app)

# Helper function to create a user manually inside DB
def create_test_user(session: Session, email: str, password: str):
    user = User(
        name="Test User",
        email=email,
        hashed_password=hash_password(password),
        role="guest"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def test_login_success():
    with next(get_session()) as session:
        create_test_user(session, "loginsuccess@example.com", "strongpassword123")

    response = client.post("/v1/users/login", json={
        "email": "loginsuccess@example.com",
        "password": "strongpassword123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "loginsuccess@example.com"
    assert "user_id" in data

def test_login_wrong_password():
    with next(get_session()) as session:
        create_test_user(session, "wrongpassword@example.com", "rightpassword123")

    response = client.post("/v1/users/login", json={
        "email": "wrongpassword@example.com",
        "password": "wrongpassword123"
    })
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Invalid email or password."

def test_login_non_existent_email():
    response = client.post("/v1/users/login", json={
        "email": "doesnotexist@example.com",
        "password": "any_password"
    })
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Invalid email or password."
