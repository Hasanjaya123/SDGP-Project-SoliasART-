from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Connects to your Supabase URL
if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is missing in environment variables.")

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
# Creates the session for querying
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base class for your models to inherit from
Base = declarative_base()

def get_db():
    print(f"get_db engine dialect: {engine.dialect.name}")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
