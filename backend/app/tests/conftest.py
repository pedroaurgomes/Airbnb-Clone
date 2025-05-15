import pytest
from app.core.db import get_session
from sqlalchemy import text

@pytest.fixture(autouse=True, scope="function")
def clean_test_database():
    with next(get_session()) as session:
        # session.exec(text("DELETE FROM bookings")) -> not yet implemented
        session.exec(text("DELETE FROM properties"))
        session.exec(text("DELETE FROM users"))
        session.commit()
