from fastapi.testclient import TestClient
from app.main import app
from app.tests.utils.factories import create_test_user
from app.tests.utils.auth import get_token
from app.core.db import get_session
from sqlmodel import Session
import pytest

client = TestClient(app)

@pytest.fixture
def setup_guest_and_host():
    with next(get_session()) as session:
        host = create_test_user(session, "hostbooking@example.com", "password123", role="host")
        guest = create_test_user(session, "guestbooking@example.com", "password123", role="guest")
    return {
        "host_email": host["email"],
        "guest_email": guest["email"],
        "password": "password123"
    }

def create_property(token):
    response = client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Property",
            "address": "123 Test Street",
            "city": "Test City",
            "state": "TS",
            "picture_urls": ["https://example.com/test.jpg"]
        }
    )
    assert response.status_code == 200
    return response.json()["property_id"]

def test_booking_successful(setup_guest_and_host):
    # Host creates a property
    host_token = get_token(setup_guest_and_host["host_email"], setup_guest_and_host["password"])
    property_id = create_property(host_token)

    # Guest logs in and books
    guest_token = get_token(setup_guest_and_host["guest_email"], setup_guest_and_host["password"])

    response = client.post(
        "/v1/bookings",
        headers={"Authorization": f"Bearer {guest_token}"},
        json={
            "property_id": property_id,
            "date_in": "2025-06-01",
            "date_out": "2025-06-05"
        }
    )

    assert response.status_code == 200
    booking = response.json()
    assert booking["property_id"] == property_id
    assert booking["date_in"] == "2025-06-01"
    assert booking["date_out"] == "2025-06-05"

def test_booking_fails_due_to_invalid_dates(setup_guest_and_host):
    host_token = get_token(setup_guest_and_host["host_email"], setup_guest_and_host["password"])
    property_id = create_property(host_token)

    guest_token = get_token(setup_guest_and_host["guest_email"], setup_guest_and_host["password"])

    response = client.post(
        "/v1/bookings",
        headers={"Authorization": f"Bearer {guest_token}"},
        json={
            "property_id": property_id,
            "date_in": "2025-06-10",
            "date_out": "2025-06-05"  # invalid: check-in after check-out
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Check-in date must be before check-out date."

def test_booking_fails_due_to_overlap(setup_guest_and_host):
    host_token = get_token(setup_guest_and_host["host_email"], setup_guest_and_host["password"])
    property_id = create_property(host_token)

    guest_token = get_token(setup_guest_and_host["guest_email"], setup_guest_and_host["password"])

    # First booking (successful)
    response = client.post(
        "/v1/bookings",
        headers={"Authorization": f"Bearer {guest_token}"},
        json={
            "property_id": property_id,
            "date_in": "2025-06-10",
            "date_out": "2025-06-15"
        }
    )
    assert response.status_code == 200

    # Attempt overlapping booking
    response = client.post(
        "/v1/bookings",
        headers={"Authorization": f"Bearer {guest_token}"},
        json={
            "property_id": property_id,
            "date_in": "2025-06-12",
            "date_out": "2025-06-18"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Property already booked for the selected dates."
