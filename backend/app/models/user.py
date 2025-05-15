from __future__ import annotations

from sqlmodel import Field
from typing import Optional, ClassVar, Any
from sqlalchemy.orm import relationship
from .base import SQLModelBase


class User(SQLModelBase, table=True):
    __tablename__ = "users"

    user_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: str = Field(default="guest")

    # Define relationships using SQLAlchemy's relationship directly
    properties: ClassVar[Any] = relationship("Property", back_populates="host")
    bookings: ClassVar[Any] = relationship("Booking", back_populates="guest")