from sqlmodel import SQLModel, Field
import uuid
from datetime import date

class Booking(SQLModel, table=True):
    __tablename__ = "bookings"

    guest_id: uuid.UUID = Field(foreign_key="users.user_id", primary_key=True)
    property_id: uuid.UUID = Field(foreign_key="properties.property_id", primary_key=True)
    date_in: date = Field(primary_key=True)
    date_out: date