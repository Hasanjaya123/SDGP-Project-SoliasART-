from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    SECRET_KEY: str = Field(..., alias="SECRET_KEY")

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    # ImageKit
    IMAGEKIT_PRIVATE_KEY: str

    # PayHere
    PAYHERE_MERCHANT_ID: str
    PAYHERE_MERCHANT_SECRET: str

    class Config:
        env_file = ".env"


settings = Settings()