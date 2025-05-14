from pydantic import BaseModel
from uuid import UUID
from datetime import date

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
