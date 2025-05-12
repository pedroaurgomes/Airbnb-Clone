from sqlmodel import SQLModel, Field, UniqueConstraint
from datetime import date
from typing import Optional

class Booking(SQLModel, table=True):
    # __tablename__ = "bookings"

    booking_id: Optional[int] = Field(default=None, primary_key=True)
    guest_id: int = Field(foreign_key="user.user_id")
    property_id: int = Field(foreign_key="property.property_id")
    date_in: date
    date_out: date

    class Config:
        table_constraints = (
            UniqueConstraint("guest_id", "property_id", "date_in"),
        )