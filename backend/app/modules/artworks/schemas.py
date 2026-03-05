from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ArtworkBase(BaseModel):
    title: str = Field(..., example="Sunsets in Galle")
    description: Optional[str] = Field(None, example="A beautiful oil painting of Galle fort at sunset.")
    price: float = Field(..., gt=0)
    artist_name: str
    artist_id: UUID

class ArtworkCreate(ArtworkBase):
    pass

class ArtworkResponse(ArtworkBase):
    id: UUID
    image_url: str
    likes: int
    views: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
