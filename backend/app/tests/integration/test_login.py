from fastapi.testclient import TestClient
from app.main import app
from app.core.security import hash_password
from app.models.user import User
from app.core.db import get_session
from sqlmodel import Session
from app.tests.utils.factories import create_test_user

client = TestClient(app)

def test_login_success():
    with next(get_session()) as session:
        create_test_user(session, "loginsuccess@example.com", "strongpassword123", "guest")

    response = client.post(
        "/v1/users/login",
        data={
            "username": "loginsuccess@example.com",
            "password": "strongpassword123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password():
    with next(get_session()) as session:
        create_test_user(session, "wrongpassword@example.com", "rightpassword123", "guest")

    response = client.post(
        "/v1/users/login", 
        data={
            "username": "wrongpassword@example.com",
            "password": "wrongpassword123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},)

    assert response.status_code == 401 # unauthorized
    data = response.json()
    assert data["detail"] == "Invalid email or password."

def test_login_non_existent_email():
    response = client.post(
        "/v1/users/login", 
        data={
            "username": "doesnotexist@example.com",
            "password": "any_password"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"})

    assert response.status_code == 401 # unauthorized
    data = response.json()
    assert data["detail"] == "Invalid email or password."
