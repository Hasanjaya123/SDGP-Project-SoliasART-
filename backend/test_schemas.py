
from app.modules.Collection.schemas import CollectionOut, ArtworkSimple
import uuid
from datetime import datetime

print("Testing Collection schemas...")
try:
    art = ArtworkSimple(
        id=uuid.uuid4(),
        title="Test",
        image_url=["http://example.com/image.jpg"],
        price=10.0
    )
    print("ArtworkSimple created successfully")
    
    col = CollectionOut(
        id=uuid.uuid4(),
        name="Test Col",
        description="Test Desc",
        artist_id=uuid.uuid4(),
        created_at=datetime.now(),
        artworks=[art]
    )
    print("CollectionOut created successfully")
    print("All schemas are valid Pydantic V2!")
except Exception as e:
    print(f"Schema Error: {e}")
