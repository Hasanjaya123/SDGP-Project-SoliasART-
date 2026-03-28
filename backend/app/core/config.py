from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    # Token active time
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300
    DATABASE_URL: str | None = os.getenv("DATABASE_URL")

    # PayHere Payment Gateway
    PAYHERE_MERCHANT_ID: str | None = os.getenv("PAYHERE_MERCHANT_ID")
    PAYHERE_MERCHANT_SECRET: str | None = os.getenv("PAYHERE_MERCHANT_SECRET")
    
    FRONTEND_URL: str | None = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL: str | None = os.getenv("BACKEND_URL", "http://localhost:8000")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

#create object
settings = Settings()
