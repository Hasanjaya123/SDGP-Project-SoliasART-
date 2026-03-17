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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

#create object
settings = Settings()