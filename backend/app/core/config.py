from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    frontend_url: str
    database_url: str
    environment: str = "development"
    secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env.test" if os.getenv("ENVIRONMENT") == "test" else ".env" # use 'ENVIRONMENT=test pytest' when testing

    @property
    def is_testing(self) -> bool:
        return self.environment == "test"    

settings = Settings()
