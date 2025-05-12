from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserLogin

router = APIRouter()

@router.post("/signup", response_model=UserRead)
def signup(user_create: UserCreate, session: Session = Depends(get_session)):
    # 1. Check if the user already exists
    statement = select(User).where(User.email == user_create.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    # 2. Hash the password
    hashed_password = hash_password(user_create.password)

    # 3. Create a new User instance
    user = User(
        name=user_create.name,
        email=user_create.email,
        hashed_password=hashed_password,
        role=user_create.role
    )

    # 4. Insert into database
    session.add(user)
    session.commit()
    session.refresh(user) # making our user python object consistent to its current respective row in the db

    # 5. Return the created user (without password)
    return user # pydantic will match it with our response model UserRead

@router.post("/login", response_model=UserRead)
def login(user_login: UserLogin, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_login.email)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    return user