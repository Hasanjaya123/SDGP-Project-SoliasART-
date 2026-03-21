import sys
import os
from sqlalchemy import create_engine, text

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from app.core.database import engine, Base
from app.modules.Collection.model import Collection
from app.modules.ArtistOnboarding.model import Artist
from app.modules.ArtUpload.model import ArtWork

def sync_tables():
    with engine.connect() as conn:
        try:
            count = conn.execute(text('SELECT count(*) FROM collections')).scalar()
            print(f"Current collection count: {count}")
        except Exception as e:
            print(f"Error checking count (maybe table missing?): {e}")
            count = 0
            
    if count == 0:
        print("Empty or missing table. Dropping and recreating collections and collection_artwork...")
        with engine.connect() as conn:
            conn.execute(text('DROP TABLE IF EXISTS collection_artwork CASCADE'))
            conn.execute(text('DROP TABLE IF EXISTS collection_artworks CASCADE'))
            conn.execute(text('DROP TABLE IF EXISTS collections CASCADE'))
            conn.commit()
        
        # Now recreate
        Base.metadata.create_all(bind=engine)
        print("Tables recreated successfully.")
    else:
        print("Table contains data. Skipping recreate. Please manually migrate or confirm if data can be deleted.")

if __name__ == "__main__":
    sync_tables()
