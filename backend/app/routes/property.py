from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.core.db import get_session
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyRead
import json

router = APIRouter()

@router.post("/properties", response_model=PropertyRead)
def create_property(property_in: PropertyCreate, session: Session = Depends(get_session)):
    # For now, hardcode host_id=1 (later you can extract from login if using JWTs)
    host_id = 1  # TO BE FIXED later with real user authentication

    property = Property(
        title=property_in.title,
        address=property_in.address,
        city=property_in.city,
        state=property_in.state,
        pictures_urls=json.dumps(property_in.pictures_urls), # serialization because SQLite doesnt support arrays
        host_id=host_id,
    )

    session.add(property)
    session.commit()
    session.refresh(property)

    # Deserialize picture_urls back for response
    property.pictures_urls = json.loads(property.pictures_urls) # deserialization
    return property
