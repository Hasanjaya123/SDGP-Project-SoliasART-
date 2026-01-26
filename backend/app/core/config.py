from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    DATABASE_URL: str


    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    JWT_SECRET: str | None = None


    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()