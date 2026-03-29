from fastapi import APIRouter, File, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.concurrency import run_in_threadpool
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.modules.PostUpload.model import Post
from app.modules.ArtUpload.image_kit import imagekit

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/")
async def create_post(
    artist_id: UUID = Form(...),
    description: str = Form(...),
    title: Optional[str] = Form(default = None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Read the raw image bytes from the uploaded file
    image_content = await image.read()

    # Upload the image to ImageKit
    upload_result = await run_in_threadpool(
    imagekit.files.upload,
    file=image_content,
    file_name=image.filename,
    folder="/Posts",
    tags=["post"],
    is_private_file=False)

    try:
        # save post to database
        new_post = Post(
            artist_id = artist_id,
            title = title,
            description = description,
            image_url = [upload_result.url],
            likes = 0)

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        return {"id": new_post.id, "message": "Post created successfully"}

    except IntegrityError:
        db.rollback()
        # if artist_id doesn't exist in artists table, hanndle the foreign key violation
        raise HTTPException(
            status_code=403,
            detail="Only artists can upload posts"
        )