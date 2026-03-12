from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Connects to your Supabase URL
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
# Creates the session for querying
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base class for your models to inherit from
Base = declarative_base()

def get_db():
  
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
