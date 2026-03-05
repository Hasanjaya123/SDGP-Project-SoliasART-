from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import List
from uuid import UUID
from app.modules.artworks import schemas, services

router = APIRouter(
    prefix="/artworks",
    tags=["Artworks"]
)

@router.post("/", response_model=schemas.ArtworkResponse)
async def upload_artwork(
    title: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    artist_name: str = Form(...),
    artist_id: UUID = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload an artwork image and save its metadata.
    """
    # 1. Upload image to storage
    image_url = services.upload_artwork_image(file)
    
    # 2. Save metadata to DB
    artwork_in = schemas.ArtworkCreate(
        title=title,
        description=description,
        price=price,
        artist_name=artist_name,
        artist_id=artist_id
    )
    return services.create_artwork(artwork_in, image_url)

@router.get("/artist/{artist_id}", response_model=List[schemas.ArtworkResponse])
def get_artist_artworks(artist_id: UUID):
    """
    Get all artworks uploaded by a specific artist.
    """
    return services.get_artworks_by_artist(str(artist_id))
