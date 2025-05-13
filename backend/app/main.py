from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.db import create_db_and_tables
from app.routes.user import router as users_router
from app.routes.property import router as properties_router


# for now we dont need the "async" because there are no async operations on startup or shutdown
# However, when scaling the app we will definitely have some, so we are future-proofing it.
@asynccontextmanager 
async def lifespan(app: FastAPI):
    create_db_and_tables() # sync operation but okay to be inside async since it is really light
    yield
    
app = FastAPI(lifespan=lifespan)

app.include_router(users_router, prefix="/v1/users", tags=["users"])
app.include_router(properties_router, prefix="/v1", tags=["properties"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint (simple /ping)
@app.get("/ping")
def ping():
    return {"message": "pong"}

