from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    SECRET_KEY: str = Field(..., alias="SECRET_KEY")

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    # PayHere Payment Gateway
    PAYHERE_MERCHANT_ID: str = ""
    PAYHERE_MERCHANT_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()