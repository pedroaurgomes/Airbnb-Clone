from sqlmodel import SQLModel
from sqlalchemy.orm import declarative_base

# Create a base class that combines SQLModel and SQLAlchemy's declarative base
Base = declarative_base()

class SQLModelBase(SQLModel, Base):
    pass 