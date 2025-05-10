from sqlmodel import SQLModel, Field
import uuid

class Property(SQLModel, table=True):
    __tablename__ = "properties"

    property_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    host_id: uuid.UUID = Field(foreign_key="users.user_id")
    title: str
    address: str
    city: str
    state: str
    pictures_urls: str  # JSON serialized list of URLs
