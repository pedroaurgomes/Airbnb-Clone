from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.db import get_session
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyRead
import json
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/properties", response_model=PropertyRead)
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
        pictures_urls=json.dumps(property_in.pictures_urls), # serialization because SQLite doesnt support arrays
        host_id=host_id,
    )

    session.add(property)
    session.commit()
    session.refresh(property)

    # Deserialize picture_urls back for response
    property.pictures_urls = json.loads(property.pictures_urls) # deserialization
    return property
