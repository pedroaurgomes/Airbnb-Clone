from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import Role

# singup request model
class UserCreate(BaseModel):
    name: str
    email: EmailStr # validates email format automatically
    password: str
    role: Role # accepting only "guest" or "host"

# signup/login response model
class UserRead(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    role: Role

# login request model
class UserLogin(BaseModel):
    email: EmailStr
    password: str