from pydantic import BaseModel
from typing import List

# request model
class PropertyCreate(BaseModel):
    title: str
    address: str
    city: str
    state: str
    picture_urls: List[str]
    # host_id filled automactiacally by backend based on the logged-in user

# response model
class PropertyRead(BaseModel):
    property_id: int
    title: str
    address: str
    city: str
    state: str
    picture_urls: List[str]
    host_name: str
    # no need to expose the host_id to the frontend
