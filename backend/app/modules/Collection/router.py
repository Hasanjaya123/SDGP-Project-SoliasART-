from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import User
from app.modules.ArtistProfile.model import Artist
from app.modules.ArtUpload.model import ArtWork
from app.modules.Collection.model import Collection
from app.modules.Collection.schemas import CollectionCreate, CollectionOut

router = APIRouter(prefix="/api/collections", tags=["Collections"])

@router.post("/", response_model=CollectionOut)
async def create_collection(
    payload: CollectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify the user is an artist
    artist = db.query(Artist).filter(Artist.user_id == current_user.id).first()
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only registered artists can create collections"
        )
    
    # Create the collection
    new_collection = Collection(
        name=payload.name,
        description=payload.description,
        artist_id=artist.id
    )
    
    # Add artworks to the collection
    if payload.artwork_ids:
        artworks = db.query(ArtWork).filter(
            ArtWork.id.in_(payload.artwork_ids),
            ArtWork.artist_id == artist.id # Ensure the artist owns these artworks
        ).all()
        
        if len(artworks) != len(payload.artwork_ids):
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more artwork IDs are invalid or do not belong to you"
            )
        
        new_collection.artworks = artworks
    
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)
    
    return new_collection

@router.get("/", response_model=List[CollectionOut])
async def get_all_collections(
    db: Session = Depends(get_db)
):
    collections = db.query(Collection).all()
    for col in collections:
        col.curator = col.artist.display_name if col.artist else "Unknown"
    return collections

@router.get("/artist/{artist_id}", response_model=List[CollectionOut])
async def get_artist_collections(
    artist_id: UUID,
    db: Session = Depends(get_db)
):
    collections = db.query(Collection).filter(Collection.artist_id == artist_id).all()
    for col in collections:
        col.curator = col.artist.display_name if col.artist else "Unknown"
    return collections

@router.get("/{collection_id}", response_model=CollectionOut)
async def get_collection_details(
    collection_id: UUID,
    db: Session = Depends(get_db)
):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    collection.curator = collection.artist.display_name if collection.artist else "Unknown"
    return collection

@router.delete("/{collection_id}")
async def delete_collection(
    collection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    artist = db.query(Artist).filter(Artist.user_id == current_user.id).first()
    if not artist:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.artist_id == artist.id
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found or access denied")
    
    db.delete(collection)
    db.commit()
    
    return {"message": "Collection deleted successfully"}
