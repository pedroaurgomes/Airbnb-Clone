from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from models.user import Role

# request model
class UserCreate(BaseModel):
    name: str
    email: EmailStr # validates email format automatically
    password: str
    role: Role # accepting only "guest" or "host"

# response model
class UserRead(BaseModel):
    user_id: UUID
    name: str
    email: EmailStr
    role: Role