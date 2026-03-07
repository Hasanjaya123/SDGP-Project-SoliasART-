from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.modules.PostUpload.form import as_form

# --- INPUT SCHEMA (Request) ---
@as_form
class PostUploadRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

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
        from_attributes = True