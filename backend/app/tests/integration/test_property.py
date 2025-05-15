from fastapi.testclient import TestClient
from sqlmodel import Session
from app.main import app
from app.models.user import User
from app.core.db import get_session
from app.core.security import hash_password
from app.core.config import settings
import pytest
from app.tests.utils.factories import create_test_user
from app.tests.utils.auth import get_token


client = TestClient(app)


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
            "picture_urls": ["https://example.com/photo.jpg"]
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
            "picture_urls": ["https://example.com/guest.jpg"]
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
            "picture_urls": ["https://example.com/nopic.jpg"]
        }
    )

    assert response.status_code == 401

def test_guest_can_view_property_details(setup_users):
    # Host logs in
    host_token = get_token(setup_users["host_email"], setup_users["password"])

    # Host creates a property
    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {host_token}"},
        json={
            "title": "Luxury Villa",
            "address": "999 Rich Street",
            "city": "Beverly Hills",
            "state": "CA",
            "picture_urls": ["https://example.com/villa1.jpg"]
        }
    )
    assert response.status_code == 200
    created_property = response.json()
    property_id = created_property["property_id"]

    # Guest logs in
    guest_token = get_token(setup_users["guest_email"], setup_users["password"])

    # Guest fetches property details
    response = client.get(
        f"/v1/properties/{property_id}",
        headers={"Authorization": f"Bearer {guest_token}"}
    )

    assert response.status_code == 200
    property_detail = response.json()

    # Validate property details
    assert property_detail["title"] == "Luxury Villa"
    assert property_detail["address"] == "999 Rich Street"
    assert property_detail["city"] == "Beverly Hills"
    assert property_detail["state"] == "CA"
    assert "https://example.com/villa1.jpg" in property_detail["picture_urls"]