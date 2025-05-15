from fastapi import APIRouter, Depends, HTTPException, status
from app.models.booking import Booking
from app.models.property import Property
from app.schemas.booking import BookingCreate, BookingRead
from app.core.db import get_session
from app.core.dependencies import get_current_user
from sqlmodel import Session, select
from typing import List
from app.schemas.booking import BookingWithProperty
import json


router = APIRouter()

@router.post("", response_model=BookingRead)
def create_booking(
    booking: BookingCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    # 1. Authorization: Only guests
    if current_user["role"] != "guest":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guests can book properties."
        )

    # 2. Validate dates
    if booking.date_in >= booking.date_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date must be before check-out date."
        )

    # 3. Check if property exists
    property_obj = session.get(Property, booking.property_id)
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found."
        )

    # 4. Check for overlapping bookings
    statement = select(Booking).where(
        Booking.property_id == booking.property_id,
        Booking.date_in < booking.date_out,
        Booking.date_out > booking.date_in
    )
    overlapping_booking = session.exec(statement).first()
    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property already booked for the selected dates."
        )

    # 5. Create the booking
    new_booking = Booking(
        guest_id=current_user["user_id"],
        property_id=booking.property_id,
        date_in=booking.date_in,
        date_out=booking.date_out
    )
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)

    return new_booking

@router.get("/my-bookings", response_model=List[BookingWithProperty])
def get_my_bookings(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Get all bookings for the current user with property details"""
    # Only guests can view their bookings
    if current_user["role"] != "guest":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guests can view their bookings."
        )

    # Get all bookings for this user with property details
    statement = (
        select(Booking)
        .join(Property)
        .where(Booking.guest_id == current_user["user_id"])
        .order_by(Booking.date_in.desc())
    )
    bookings = session.exec(statement).all()
    
    # Transform the bookings to include property details with parsed picture_urls
    result = []
    for booking in bookings:
        property_data = booking.property
        result.append({
            "booking_id": booking.booking_id,
            "date_in": booking.date_in,
            "date_out": booking.date_out,
            "property": {
                "property_id": property_data.property_id,
                "title": property_data.title,
                "city": property_data.city,
                "state": property_data.state,
                "picture_urls": json.loads(property_data.picture_urls),
                "host_name": property_data.host.name
            }
        })
    
    return result
