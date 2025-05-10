from sqlmodel import SQLModel, Field
from enum import Enum
import uuid

class Role(str, Enum):
    guest = "guest"
    host = "host"

class User(SQLModel, table=True):
    __tablename__ = "users"

    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: Role