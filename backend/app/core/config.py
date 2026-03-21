import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SoliasArt"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    # Token active time
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300
    DATABASE_URL: str = os.getenv("DATABASE_URL")

<<<<<<< HEAD
settings = Settings()
=======
    # PayHere Payment Gateway
    PAYHERE_MERCHANT_ID: str = ""
    PAYHERE_MERCHANT_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

#create object
settings = Settings()
>>>>>>> 5ce0b5e9ce6c18b80759345a233b7e2f9778a360
