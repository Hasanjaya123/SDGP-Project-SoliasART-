from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.ArtUpload.model import ArtWork
from app.modules.ArtistOnboarding.model import Artist 

router = APIRouter()

@router.get("/{artwork_id}")
# Increment the view count and return the artwork details
async def get_artwork_details(artwork_id: str, db: Session = Depends(get_db)):
    db.query(ArtWork).filter(ArtWork.id == artwork_id).update(
        {ArtWork.view_count: ArtWork.view_count + 1}
    )
    db.commit()
    
    #  Get the artwork
    artwork = db.query(ArtWork).filter(ArtWork.id == artwork_id).first()
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
        
    # Get the real artist using the relational ID
    artist = db.query(Artist).filter(Artist.id == artwork.artist_id).first()

    # Map the exact columns from your schema to the React JSON
    return {
        "id": str(artwork.id),
        "title": artwork.title,
        "price": artwork.price,
        "year": str(artwork.year_created),
        "imageUrls": artwork.image_url, 
        "description": artwork.description,
        "medium": artwork.medium,
        "dimensions": f"{artwork.width_in} x {artwork.height_in} in",
        
        # Using your newly added real view_count!
        "views": artwork.view_count if artwork.view_count is not None else 0,
        
        # Still using defaults for these two until you add them to the DB
        "likes": 45, 
        "category": "New Release", 
        
        #  Injecting the REAL artist data from your 'artists' table!
        "artist": {
            "id": str(artist.id) if artist else None,
            "name": artist.display_name if artist else "Unknown Artist",
            "location": artist.dispatch_address if artist else "Unknown Location",
            "profileImageUrl": artist.profile_image_url if artist else "https://shorturl.at/3ywNl"
        }
    }