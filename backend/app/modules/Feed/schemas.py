from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class FeedCard(BaseModel):
    id: UUID
    type: str
    created_at: datetime
    artist_id: Optional[UUID]
    artist_name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: list[str]

    # Engagement fields
    like_count: int = 0
    is_liked_by_me: bool = False
    comment_count: int = 0
    is_saved: bool = False

    # Artwork-specific fields
    price: Optional[Decimal] = None
    medium: Optional[str] = None
    is_framed: Optional[bool] = None

class FeedResponse(BaseModel):
    cards : list[FeedCard]
    total : int
    page : int
    page_size : int
    total_pages : int
    has_next : bool
    has_prev : bool
    is_personalised : bool = False 
    
class CommentCreate(BaseModel):
    user_id: UUID
    content: str

class CommentResponse(BaseModel):
    user_id : UUID
    content : str
    user_name : Optional[str] = None

    class Config:
        from_attributes = True