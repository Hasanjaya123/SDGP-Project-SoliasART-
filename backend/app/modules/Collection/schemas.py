from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ArtworkSimple(BaseModel):
    id: UUID
    title: str
    image_url: List[str]
    price: float

    class Config:
        orm_mode = True

class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    artwork_ids: List[UUID]

class CollectionOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    artist_id: UUID
    created_at: datetime
    artworks: List[ArtworkSimple]

    class Config:
        orm_mode = True
