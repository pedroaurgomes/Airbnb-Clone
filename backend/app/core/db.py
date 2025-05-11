from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
from .config import settings

# Explicitly importing the models into memory so we can create our tables with create_all()
from app.models.user import User
from app.models.property import Property
from app.models.booking import Booking

engine = create_engine(
    settings.database_url,
    echo=True  # echo logs SQL statements, good for dev (set to False in production)
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@contextmanager
def get_session():
    with Session(engine) as session:
        yield session