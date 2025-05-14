from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.db import get_session
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyRead
import json
from app.core.dependencies import get_current_user
from typing import List
from sqlmodel import Session, select


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

    property = Property(
        title=property_in.title,
        address=property_in.address,
        city=property_in.city,
        state=property_in.state,
        picture_urls=json.dumps(property_in.picture_urls), # serialization because SQLite doesnt support arrays
        host_id=host_id,
    )

    session.add(property)
    session.commit()
    session.refresh(property)

    # Deserialize picture_urls back for response
    property.picture_urls = json.loads(property.picture_urls) # deserialization
    return property


@router.get("/mine", response_model=List[PropertyRead])
def list_my_properties(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "host":
        raise HTTPException(status_code=403, detail="Only hosts can view their properties.")

    properties = session.exec(
        select(Property).where(Property.host_id == current_user["user_id"])
    ).all()

    # Deserialize picture_urls before returning
    for property in properties:
        property.picture_urls = json.loads(property.picture_urls)

    return properties


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

    properties = session.exec(select(Property)).all()

    # Deserialize picture_urls field
    for property in properties:
        property.picture_urls = json.loads(property.picture_urls)

    return properties


@router.get("/{property_id}", response_model=PropertyRead)
def get_property_details(
    property_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    # Authorization: only guests can view property details
    if current_user["role"] != "guest":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guests can view property details."
        )

    property = session.get(Property, property_id)

    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found."
        )

    # Deserialize pictures
    property.picture_urls = json.loads(property.picture_urls)

    return property
