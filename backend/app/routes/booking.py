from fastapi import APIRouter, Depends, HTTPException, status
from app.models.booking import Booking
from app.models.property import Property
from app.schemas.booking import BookingCreate, BookingRead
from app.core.db import get_session
from app.core.dependencies import get_current_user
from sqlmodel import Session, select


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
