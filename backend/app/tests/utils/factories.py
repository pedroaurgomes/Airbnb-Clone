from app.models.user import User
from app.core.security import hash_password
from app.core.db import get_session
from sqlmodel import Session

# Helper function to create a user manually inside DB
def create_test_user(session: Session, email: str, password: str, role:str):
    user = User(
        name="Test User",
        email=email,
        hashed_password=hash_password(password),
        role=role
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "password": password
    }