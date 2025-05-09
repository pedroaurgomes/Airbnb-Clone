from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    frontend_url: str
    
    class Config:
        env_file = ".env"

settings = Settings()
