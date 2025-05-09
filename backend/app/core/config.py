from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    frontend_url: str
    # backend_url: str

    class Config:
        env_file = ".env"

settings = Settings()
