from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SoliasArt"
    API_V1_STR: str = "/api/v1"
    
    #  replace the actual database URL here later
    DATABASE_URL: str = "sqlite:///./test.db"
    
    SUPABASE_URL: str
    SUPABASE_KEY: str
    JWT_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()