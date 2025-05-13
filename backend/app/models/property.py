from sqlmodel import SQLModel, Field
from typing import Optional
from typing import List

class Property(SQLModel, table=True):
    __tablename__ = "properties"

    property_id: Optional[int] = Field(default=None, primary_key=True)
    host_id: int = Field(foreign_key="users.user_id")
    title: str
    address: str
    city: str
    state: str
    pictures_urls: str  # JSON serialized list of URLs
