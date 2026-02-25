from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ArtworkInCollection(BaseModel):
    id: UUID
    title: str
    artist_name: str
    price: float
    image_url: str
    likes: Optional[int] = 0
    views: Optional[int] = 0

class CollectionBase(BaseModel):
    title: str = Field(..., example="Island Hues")
    description: Optional[str] = Field(None, example="A collection celebrating the vibrant and diverse color palette of Sri Lanka")
    curator_name: str = Field(..., example="Priya Balasooriya")

class CollectionCreate(CollectionBase):
    curator_id: UUID
    artwork_ids: List[UUID]

class CollectionResponse(CollectionBase):
    id: UUID
    total_artworks: int
    total_value: float
    preview_images: List[str] = [] 
    created_at: datetime

    class Config:
        from_attributes = True

class CollectionDetailResponse(CollectionResponse):
    artworks: List[ArtworkInCollection]
