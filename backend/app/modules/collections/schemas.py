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
