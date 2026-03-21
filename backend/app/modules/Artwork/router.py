from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.ArtUpload.model import ArtWork
from app.modules.ArtistProfile.model import Artist 
from app.modules.Artwork.model import UserLike
from app.modules.Artwork.schemas import LikeRequest
from app.modules.auth.dependencies import get_current_user

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
        
        # Likes and default category
        "likes": artwork.likes if artwork.likes is not None else 0,
        "category": "New Release", 
        
        #  Injecting the real artist data from 'artists' table
        "artist": {
            "id": str(artist.id) if artist else None,
            "name": artist.display_name if artist else "Unknown Artist",
            "location": artist.dispatch_address if artist else "Unknown Location",
            "profileImageUrl": artist.profile_image_url if artist else "https://shorturl.at/3ywNl"
        }
    }

@router.post("/{artwork_id}/like")
async def toggle_artwork_like(artwork_id: str, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    # Check if the artwork exists in the database
    artwork = db.query(ArtWork).filter(ArtWork.id == artwork_id).first()
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    # Check if this specific user has already liked this specific artwork
    existing_like = db.query(UserLike).filter(
        UserLike.user_id == str(current_user.id), 
        UserLike.artwork_id == artwork_id
    ).first()

    # Get the current count safely
    current_likes = artwork.likes if artwork.likes is not None else 0

    if existing_like:
        # UNLIKE
        # If the record exists, the user is clicking "Unlike"
        db.delete(existing_like)
        
        # Decrease the master count on the Artwork table
        new_total = max(0, current_likes - 1) # Ensure we never go below 0 likes
        db.query(ArtWork).filter(ArtWork.id == artwork_id).update({ArtWork.likes: new_total})
        
        message = "Like removed"
    else:
        # LIKE 
        # If no record exists, create a new row in the user_likes table
        new_like = UserLike(
            user_id=str(current_user.id), 
            artwork_id=artwork_id
        )
        db.add(new_like)
        
        # Increase the master count on the Artwork table
        new_total = current_likes + 1
        db.query(ArtWork).filter(ArtWork.id == artwork_id).update({ArtWork.likes: new_total})
        
        message = "Like added"

    # Save all changes to Supabase
    db.commit()

    return {
        "status": "success",
        "message": message,
        "new_likes": new_total
    }

@router.get("/{artwork_id}/check-like")
async def check_artwork_like(
    artwork_id: str, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Search the database to check whether the user has liked the artwork
    existing_like = db.query(UserLike).filter(
        UserLike.user_id == str(current_user.id), 
        UserLike.artwork_id == artwork_id
    ).first()

    # If it finds a record, it returns true. If not, it returns false.
    return {"is_liked": existing_like is not None}

@router.get("/")
def get_all_artworks(
    artist_id: str = Query(None), 
    db: Session = Depends(get_db)
):
    query = db.query(ArtWork)
    if artist_id is not None:
        query = query.filter(ArtWork.artist_id == artist_id)
    
    artworks = query.all()
    
    return [
        {
            "id": str(art.id),
            "title": art.title,
            "price": art.price,
            "imageUrls": art.image_url,
            "medium": art.medium,
            "height_in": art.height_in,
            "width_in": art.width_in,
            "artist_id": art.artist_id
        }
        for art in artworks
    ]