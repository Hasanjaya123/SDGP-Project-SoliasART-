from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.image_kit import imagekit
from app.core.database import get_db
from app.core.supabase import supabase
from app.modules.PostUpload.model import Post
from app.modules.PostUpload.schemas import PostUploadRequest, PostResponse

router = APIRouter(prefix="/artists", tags=["PostUpload"])


@router.post(
    "/posts/{artist_id}",
    response_model=PostResponse,
    status_code=201,
)
async def upload_post(
    artist_id: str,
    form_data: PostUploadRequest = Depends(PostUploadRequest),
    images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    """
    Create a new post for an artist.

    - **artist_id**: UUID of the artist (path param)
    - **title**: optional post title (form field)
    - **description**: optional post description (form field)
    - **images**: optional list of image files (multipart)

    Images are uploaded to ImageKit under the /Posts folder and the
    returned URLs are stored in the `post` table.
    """

    # 1. Verify artist exists
    profile_response = (
        supabase.table("artists").select("id").eq("id", artist_id).execute()
    )
    if not profile_response.data:
        raise HTTPException(status_code=404, detail="Artist not found.")

    # 2. Require at least some content
    has_images = images and any(img.filename for img in images)
    if not form_data.title and not form_data.description and not has_images:
        raise HTTPException(
            status_code=422,
            detail="A post must have at least a title, description, or image.",
        )

    # 3. Upload images to ImageKit → /Posts folder
    image_links: List[str] = []

    if has_images:
        for image in images:
            if not image.filename:
                continue

            image_content = await image.read()

            upload_result = await run_in_threadpool(
                imagekit.files.upload,
                file=image_content,
                file_name=image.filename,
                folder="/Posts",          # dedicated ImageKit folder for posts
                tags=["post", "artist-post"],
                is_private_file=False,
            )

            image_links.append(upload_result.url)

    # 4. Persist to the `post` table via SQLAlchemy
    new_post = Post(
        title=form_data.title or None,
        description=form_data.description or None,
        image_url=image_links,
        artist_id=artist_id,
    )

    try:
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
    except Exception as e:
        db.rollback()
        print(f"DB error while saving post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return new_post
