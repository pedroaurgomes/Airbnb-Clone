from fastapi.testclient import TestClient
from app.main import app
from app.tests.utils.factories import create_test_user
from app.tests.utils.auth import get_token
from app.core.db import get_session
from sqlmodel import Session
import pytest

client = TestClient(app)

@pytest.fixture
def setup_users():
    with next(get_session()) as session:
        host1 = create_test_user(session, "host1@example.com", "password123", role="host")
        host2 = create_test_user(session, "host2@example.com", "password123", role="host")
        guest = create_test_user(session, "guest@example.com", "password123", role="guest")
    return {
        "host1_email": host1["email"],
        "host2_email": host2["email"],
        "guest_email": guest["email"],
        "password": "password123"
    }

def test_guest_can_browse_properties(setup_users):
    # Log in as Host 1 and create a property
    host1_token = get_token(setup_users["host1_email"], setup_users["password"])

    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {host1_token}"},
        json={
            "title": "Beach House",
            "address": "123 Ocean Drive",
            "city": "Miami",
            "state": "FL",
            "picture_urls": ["https://example.com/beach1.jpg"]
        }
    )
    assert response.status_code == 200

    # Log in as Host 2 and create a property
    host2_token = get_token(setup_users["host2_email"], setup_users["password"])

    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {host2_token}"},
        json={
            "title": "Mountain Cabin",
            "address": "456 Peak Road",
            "city": "Denver",
            "state": "CO",
            "picture_urls": ["https://example.com/cabin1.jpg"]
        }
    )
    assert response.status_code == 200

    # Log in as Guest
    guest_token = get_token(setup_users["guest_email"], setup_users["password"])

    # Guest fetches properties
    response = client.get(
        "/v1/properties",
        headers={"Authorization": f"Bearer {guest_token}"}
    )
    assert response.status_code == 200

    properties = response.json()

    # Check that both properties are returned
    assert len(properties) == 2

    titles = {property["title"] for property in properties}
    assert "Beach House" in titles
    assert "Mountain Cabin" in titles
