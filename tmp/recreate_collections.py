import sys
import os
from sqlalchemy import text

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from app.core.database import engine, Base
from app.modules.Collection.model import Collection
from app.modules.ArtistOnboarding.model import Artist
from app.modules.ArtUpload.model import ArtWork

def recreate_tables():
    with engine.connect() as conn:
        print("Dropping tables...")
        conn.execute(text('DROP TABLE IF EXISTS collection_artwork CASCADE'))
        conn.execute(text('DROP TABLE IF EXISTS collection_artworks CASCADE'))
        conn.execute(text('DROP TABLE IF EXISTS collections CASCADE'))
        conn.commit()
        print("Tables dropped.")
        
    print("Recreating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables recreated successfully.")

if __name__ == "__main__":
    recreate_tables()
