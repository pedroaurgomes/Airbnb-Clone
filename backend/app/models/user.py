from sqlmodel import SQLModel, Field
from enum import Enum
from typing import Optional

class Role(str, Enum):
    guest = "guest"
    host = "host"

class User(SQLModel, table=True):
    # __tablename__ = "users"

    user_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: Role