from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from app.modules.PostUpload.form import as_form


# --- INPUT SCHEMA ---
@as_form
class PostUploadRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# --- OUTPUT SCHEMA ---
class PostResponse(BaseModel):
    id: UUID
    title: Optional[str]
    description: Optional[str]
    image_url: List[str]
    artist_id: UUID

    model_config = {
        "from_attributes": True
    }