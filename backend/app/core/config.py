from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    DATABASE_URL: str
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None

    SECRET_KEY: str

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    PAYHERE_MERCHANT_ID: str = ""
    PAYHERE_MERCHANT_SECRET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()