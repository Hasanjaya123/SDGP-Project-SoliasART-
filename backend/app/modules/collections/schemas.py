from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ArtworkInCollection(BaseModel):
    id: UUID
    title: str
    artist_id: Optional[UUID] = None
    artist_name: Optional[str] = "Unknown Artist"
    price: float
    image_url: Optional[str] = None
    medium: Optional[str] = None
    year_created: Optional[int] = None
    description: Optional[str] = None

    @computed_field
    def artist(self) -> str:
        return self.artist_name or "Unknown Artist"
        
    @computed_field
    def imageUrls(self) -> List[str]:
        return [self.image_url] if self.image_url else []

    @computed_field
    def isNewRelease(self) -> bool:
        return True
        
    @computed_field
    def category(self) -> str:
        return self.medium if self.medium else "Artwork"

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
    artwork_ids: List[str] = [] # added from DB mapping
    
    model_config = ConfigDict(from_attributes=True)

class CollectionDetailResponse(CollectionResponse):
    artworks: List[ArtworkInCollection]
