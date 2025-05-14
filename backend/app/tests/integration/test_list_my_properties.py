from fastapi.testclient import TestClient
from app.main import app
from app.tests.utils.factories import create_test_user
from app.core.security import hash_password
from app.core.db import get_session
from sqlmodel import Session
import pytest
import json
from app.tests.utils.auth import get_token


client = TestClient(app)

@pytest.fixture
def setup_hosts():
    with next(get_session()) as session:
        host1 = create_test_user(session, "host1@example.com", "strongpassword", role="host")
        host2 = create_test_user(session, "host2@example.com", "strongpassword", role="host")
    return {
        "host1_email": host1["email"],
        "host2_email": host2["email"],
        "password": "strongpassword"
    }


def test_list_my_properties(setup_hosts):
    # Log in as host 1
    host1_token = get_token(setup_hosts["host1_email"], setup_hosts["password"])

    # Create two properties for host 1
    for i in range(2):
        response = client.post(
            "/v1/properties",
            headers={"Authorization": f"Bearer {host1_token}"},
            json={
                "title": f"Host1 Property {i}",
                "address": f"{i} Host1 Street",
                "city": "HostCity",
                "state": "HC",
                "picture_urls": ["https://example.com/photo1.jpg"]
            }
        )
        assert response.status_code == 200


    # Log in as host 2
    host2_token = get_token(setup_hosts["host2_email"], setup_hosts["password"])

    # Create one property for host 2
    client.post(
        "/v1/properties",
        headers={"Authorization": f"Bearer {host2_token}"},
        json={
            "title": "Host2 Property",
            "address": "1 Host2 Street",
            "city": "OtherCity",
            "state": "OC",
            "picture_urls": ["https://example.com/photo2.jpg"]
        }
    )

    # Request list of my properties
    response = client.get(
        "/v1/properties/mine",
        headers={"Authorization": f"Bearer {host1_token}"} # just reusing the host1_token - still valid
    )

    assert response.status_code == 200
    properties = response.json()

    # Assert only host1 properties are returned
    assert len(properties) == 2
    for property in properties:
        assert "Host1" in property["title"]
