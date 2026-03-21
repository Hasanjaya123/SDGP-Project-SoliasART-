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
        from_attributes = True

class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    artwork_ids: List[UUID]

class CollectionOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    curator: Optional[str] = None
    created_at: datetime
    artworks: List[ArtworkSimple]

    class Config:
        from_attributes = True
