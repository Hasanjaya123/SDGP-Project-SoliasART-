<<<<<<< HEAD
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("JWT_SECRET", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
=======
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    DATABASE_URL: str
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    SECRET_KEY: str = Field(alias="JWT_SECRET")

    # "HS256" is the industry standard math formula for signing JWTs.
    ALGORITHM: str = "HS256"
    # Token active time
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

#create object
settings = Settings()
>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
