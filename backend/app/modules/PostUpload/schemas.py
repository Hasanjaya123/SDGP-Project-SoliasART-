from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from fastapi import Form

# --- INPUT SCHEMA (Request) ---
# Receives title + description as form fields; images arrive as separate File uploads.
class PostUploadRequest:
    def __init__(
        self,
        title: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
    ):
        self.title = title
        self.description = description


# --- OUTPUT SCHEMA (Response) ---
class PostResponse(BaseModel):
    id: UUID
    title: Optional[str]
    description: Optional[str]
    image_url: List[str]
    artist_id: UUID
    created_at: datetime
    likes: str

    class Config:
        from_attributes = True  # lets Pydantic read SQLAlchemy model instances