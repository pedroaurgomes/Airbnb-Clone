from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

# Define valid roles as a Literal type
RoleType = Literal["guest", "host"]

# singup request model
class UserCreate(BaseModel):
    name: str
    email: EmailStr # validates email format automatically
    password: str
    role: RoleType # accepting only "guest" or "host"

# signup/login response model
class UserRead(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    role: RoleType

# login request model
class UserLogin(BaseModel):
    email: EmailStr
    password: str