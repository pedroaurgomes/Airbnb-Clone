from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyRead
import json
from app.core.dependencies import get_current_user
from typing import List
from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.models.user import User
from app.schemas.booking import BookingResponse


router = APIRouter()


@router.post("", response_model=PropertyRead)
def create_property(
    property_in: PropertyCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
    ):

    host_id = current_user["user_id"]

    if current_user["role"] != "host":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only hosts can create properties."
        ) 

    # Check for duplicate properties
    existing_property = session.exec(
        select(Property)
        .where(
            Property.host_id == host_id,
            Property.title == property_in.title,
            Property.address == property_in.address
        )
    ).first()

    if existing_property:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A property with this title and address already exists."
        )

    # Ensure picture_urls is stored as a JSON string
    property = Property(
        title=property_in.title,
        address=property_in.address,
        city=property_in.city,
        state=property_in.state,
        picture_urls=json.dumps(property_in.picture_urls),
        host_id=host_id,
    )

    session.add(property)
    session.commit()
    session.refresh(property)

    # Create PropertyRead instance with host_name
    property_read = PropertyRead(
        property_id=property.property_id,
        title=property.title,
        address=property.address,
        city=property.city,
        state=property.state,
        picture_urls=json.loads(property.picture_urls),  # Deserialize for response
        host_name=property.host.name
    )

    return property_read


@router.get("/mine", response_model=List[PropertyRead])
def list_my_properties(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "host":
        raise HTTPException(status_code=403, detail="Only hosts can view their properties.")

    # Query properties with a more specific distinct clause
    properties = session.exec(
        select(Property)
        .where(Property.host_id == current_user["user_id"])
        .distinct(Property.property_id)  # Ensure distinct by property_id
        .order_by(Property.property_id)  # Add ordering for consistent results
    ).all()

    # Convert to PropertyRead objects
    result = []
    seen_ids = set()  # Track seen property IDs to prevent duplicates
    for property in properties:
        if property.property_id not in seen_ids:
            seen_ids.add(property.property_id)
            property_read = PropertyRead(
                property_id=property.property_id,
                title=property.title,
                address=property.address,
                city=property.city,
                state=property.state,
                picture_urls=json.loads(property.picture_urls),
                host_name=property.host.name
            )
            result.append(property_read)

    return result


@router.get("", response_model=List[PropertyRead])
def browse_properties(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    # Authorization: only guests can browse
    if current_user["role"] != "guest":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guests can browse available properties."
        )
    
    properties = session.exec(
        select(Property)
    ).all()

    result = []
    for property in properties:
        property_read = PropertyRead(
            property_id=property.property_id,
            title=property.title,
            address=property.address,
            city=property.city,
            state=property.state,
            picture_urls=json.loads(property.picture_urls),  # Deserialize for response
            host_name=property.host.name
        )
        result.append(property_read)

    return result


@router.get("/{property_id}", response_model=PropertyRead)
def get_property_details(
    property_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    # Authorization: both guests and hosts can view property details
    if current_user["role"] not in ["guest", "host"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guests and hosts can view property details."
        )

    property = session.get(Property, property_id)

    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found."
        )

    property_read = PropertyRead(
        property_id=property.property_id,
        title=property.title,
        address=property.address,
        city=property.city,
        state=property.state,
        picture_urls=json.loads(property.picture_urls),  # Deserialize for response
        host_name=property.host.name
    )

    return property_read


@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    # Authorization: only hosts can delete their own properties
    if current_user["role"] != "host":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only hosts can delete properties."
        )

    property = session.get(Property, property_id)

    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found."
        )

    # Check if the property belongs to the current host
    if property.host_id != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own properties."
        )

    session.delete(property)
    session.commit()

    return {"message": "Property deleted successfully"}


@router.get("/{property_id}/bookings", response_model=List[BookingResponse])
def get_property_bookings(
    property_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Get all bookings for a specific property"""
    # Check if property exists
    property = session.get(Property, property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Get all bookings for this property
    bookings = session.exec(
        select(Booking)
        .where(Booking.property_id == property_id)
    ).all()
    
    return bookings
