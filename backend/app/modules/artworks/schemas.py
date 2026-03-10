from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ArtworkBase(BaseModel):
    title: str = Field(..., example="Sunsets in Galle")
    description: Optional[str] = Field(None, example="A beautiful oil painting of Galle fort at sunset.")
    price: float = Field(..., gt=0)
    artist_id: UUID
    medium: Optional[str] = None
    year_created: Optional[int] = None
    width_in: Optional[float] = None
    height_in: Optional[float] = None
    depth_in: Optional[float] = None
    weight_kg: Optional[float] = None
    is_framed: Optional[bool] = False

class ArtworkCreate(ArtworkBase):
    pass

class ArtworkResponse(ArtworkBase):
    id: UUID
    image_url: Optional[str] = None
    create_at: Optional[datetime] = None
    
    # Frontend aliases/mappings
    @computed_field
    def artist(self) -> str:
        return str(self.artist_id) if self.artist_id else "Unknown Artist"
        
    @computed_field
    def imageUrls(self) -> List[str]:
        return [self.image_url] if self.image_url else []
        
    @computed_field
    def isNewRelease(self) -> bool:
        return True
        
    @computed_field
    def category(self) -> str:
        return self.medium if self.medium else "Artwork"

    model_config = ConfigDict(from_attributes=True)
