from __future__ import annotations

from sqlmodel import Field
from typing import Optional, ClassVar, Any
from sqlalchemy.orm import relationship
from .base import SQLModelBase
from datetime import date

class Booking(SQLModelBase, table=True):
    __tablename__ = "bookings"

    booking_id: Optional[int] = Field(default=None, primary_key=True)
    guest_id: int = Field(foreign_key="users.user_id")
    property_id: int = Field(foreign_key="properties.property_id")
    date_in: date
    date_out: date

    # Define relationships using SQLAlchemy's relationship directly
    guest: ClassVar[Any] = relationship("User", back_populates="bookings")
    property: ClassVar[Any] = relationship("Property", back_populates="bookings")