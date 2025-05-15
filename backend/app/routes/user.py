from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserLogin
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

class SignupResponse(BaseModel):
    user: UserRead
    access_token: str
    token_type: str = "bearer"

router = APIRouter()

@router.post("/signup", response_model=SignupResponse)
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
    session.refresh(user)

    # 5. Create access token
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}
    )

    # 6. Return both user data and access token
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
    ):

    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password.",
            headers={"WWW-Authenticate" : "Bearer"})

    access_token = create_access_token (
        data={"sub" : str(user.user_id), "role": user.role}
        )
 

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }