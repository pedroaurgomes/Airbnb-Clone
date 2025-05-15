from __future__ import annotations

from sqlmodel import Field
from typing import Optional, ClassVar, Any
from sqlalchemy.orm import relationship
from .base import SQLModelBase


class Property(SQLModelBase, table=True):
    __tablename__ = "properties"

    property_id: Optional[int] = Field(default=None, primary_key=True)
    host_id: int = Field(foreign_key="users.user_id")
    title: str
    address: str
    city: str
    state: str
    picture_urls: str  # JSON serialized list of URLs

    # Define relationships using SQLAlchemy's relationship directly
    host: ClassVar[Any] = relationship("User", back_populates="properties")
    bookings: ClassVar[Any] = relationship("Booking", back_populates="property")
