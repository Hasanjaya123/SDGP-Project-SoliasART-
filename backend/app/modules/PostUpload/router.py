from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.modules.PostUpload.model import Post
from app.modules.PostUpload.schemas import PostUploadRequest, PostResponse

router = APIRouter(prefix="/artists", tags=["PostUpload"])


@router.post("/posts/{artist_id}", response_model=PostResponse, status_code=201)
async def upload_post(
    artist_id: str,
    form_data: PostUploadRequest = Depends(PostUploadRequest),
    images: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_links = []

    try:
        # ✅ TEMP: Skip Supabase check (assume artist exists)

        # 1. Require at least some content
        has_images = images and images.filename
        if not form_data.title and not form_data.description and not has_images:
            raise HTTPException(
                status_code=422,
                detail="A post must have at least a title, description, or image.",
            )

        # 2. Handle image (skip ImageKit)
        if has_images:
            await images.read()
            image_links.append("https://via.placeholder.com/300")

        # 3. Save to DB
        new_post = Post(
            title=form_data.title or None,
            description=form_data.description or None,
            image_url=image_links,
            artist_id=artist_id,
        )

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        return new_post

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))