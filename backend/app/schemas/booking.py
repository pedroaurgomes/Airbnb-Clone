from pydantic import BaseModel
from uuid import UUID
from datetime import date
from typing import Optional, List

# request model
class BookingCreate(BaseModel):
    property_id: int
    date_in: date
    date_out: date
    # no guest_id because it comes from the logged-in user token (JWT)

# response model
class BookingRead(BaseModel):
    booking_id: int
    guest_id: int
    property_id: int
    date_in: date
    date_out: date

class BookingResponse(BaseModel):
    booking_id: int
    guest_id: int
    property_id: int
    date_in: date
    date_out: date

    class Config:
        from_attributes = True

class PropertyInBooking(BaseModel):
    property_id: int
    title: str
    city: str
    state: str
    picture_urls: List[str]
    host_name: str

    class Config:
        from_attributes = True

class BookingWithProperty(BaseModel):
    booking_id: int
    date_in: date
    date_out: date
    property: PropertyInBooking

    class Config:
        from_attributes = True
