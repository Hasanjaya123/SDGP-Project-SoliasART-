from pydantic import BaseModel
from typing import Optional, List


class ArtworkCard(BaseModel):
    id: str
    title: Optional[str] = None
    medium: Optional[str] = None
    price: Optional[float] = None
    image_url: List[str] = []
    height_in: Optional[float] = None
    width_in: Optional[float] = None
    artist_id: Optional[str] = None
    artist_name: Optional[str] = None
    year_created: Optional[int] = None
    description: Optional[str] = None
    is_framed: Optional[bool] = None

    class Config:
        from_attributes = True