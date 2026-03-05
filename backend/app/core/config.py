from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    API_V1_STR: str = "/api/v1"
    
    #  replace the actual database URL here later
    DATABASE_URL: str = "sqlite:///./test.db"
    
    SUPABASE_URL: str = "https://example.supabase.co"
    SUPABASE_KEY: str = "example_key"
    JWT_SECRET: str = "example_jwt_secret"

    model_config = ConfigDict(extra="allow", env_file=".env")

settings = Settings()