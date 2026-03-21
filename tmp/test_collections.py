import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.modules.Collection.model import Collection
from app.modules.Collection.schemas import CollectionOut
# Ensure all models are imported so metadata knows about them
from app.modules.ArtistOnboarding.model import Artist
from app.modules.ArtUpload.model import ArtWork

def test_get_collections():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        collections = db.query(Collection).all()
        print(f"Found {len(collections)} collections")
        for col in collections:
            print(f"Processing collection: {col.name}")
            col.curator = col.artist.display_name if col.artist else "Unknown"
            # Try to validate with Pydantic
            try:
                pydantic_col = CollectionOut.model_validate(col)
                print(f"  Validated: {pydantic_col.name} by {pydantic_col.curator}")
            except Exception as e:
                print(f"  Validation error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_get_collections()
