from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

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
