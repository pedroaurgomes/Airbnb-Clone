from fastapi.testclient import TestClient
from sqlmodel import Session
from app.main import app
from app.models.user import User
from app.core.db import get_session
from app.core.security import hash_password
from app.core.config import settings
import pytest
from app.tests.utils.factories import create_test_user


client = TestClient(app)

# Helper: Login and retrieve token
def get_token(email: str, password: str):
    response = client.post(
        "/v1/users/login",
        data={
            "username": email,  # OAuth2 expects username field
            "password": password
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return response.json()["access_token"]

@pytest.fixture
def setup_users():
    # Setup: create one host and one guest
    with next(get_session()) as session:
        host = create_test_user(session, "host@example.com", "strongpassword", role="host")
        guest = create_test_user(session, "guest@example.com", "strongpassword", role="guest")
    return {
        "host_email": host["email"],
        "guest_email": guest["email"],
        "password": "strongpassword"
    }

def test_host_can_create_property(setup_users):
    token = get_token(setup_users["host_email"], setup_users["password"])

    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Property",
            "address": "123 Test Street",
            "city": "Test City",
            "state": "TS",
            "pictures_urls": ["https://example.com/photo.jpg"]
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Property"
    assert "property_id" in data

def test_guest_cannot_create_property(setup_users):
    token = get_token(setup_users["guest_email"], setup_users["password"])

    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Guest Property",
            "address": "123 Guest Road",
            "city": "Guest City",
            "state": "GC",
            "pictures_urls": ["https://example.com/guest.jpg"]
        }
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Only hosts can create properties."

def test_unauthenticated_user_cannot_create_property():
    response = client.post(
        "/v1/properties",
        json={
            "title": "Unauthorized Property",
            "address": "123 Nowhere",
            "city": "No City",
            "state": "NC",
            "pictures_urls": ["https://example.com/nopic.jpg"]
        }
    )

    assert response.status_code == 401
