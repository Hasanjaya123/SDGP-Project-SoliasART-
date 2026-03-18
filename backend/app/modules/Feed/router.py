from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from math import ceil
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.modules.ArtUpload.model import ArtWork
from app.modules.ArtistOnboarding.model import Artist
from app.modules.auth.models import User
from app.modules.Post.model import Post
from app.modules.Feed.model import FeedLike, FeedComment, FeedSave, FeedInteraction
from app.modules.Feed.schemas import FeedCard, FeedResponse, CommentCreate, CommentResponse
from app.modules.Feed.ml_ranker import get_unified_feed

router = APIRouter(prefix="/feed", tags=["Feed"])

# Helper to fetch a post/artwork by ID and raise 404 if not found
def get_target_or_404(target_type: str, target_id: UUID, db: Session):
    if target_type == "post":
        item = db.query(Post).filter(Post.id == target_id).first()
    elif target_type == "artwork":
        item = db.query(ArtWork).filter(ArtWork.id == target_id).first()
    else:
        raise HTTPException(
            status_code=400, detail="target_type must be 'post' or 'artwork'"
        )

    if not item:
        raise HTTPException(
            status_code=404, detail=f"{target_type} not found"
        )
    return item

def _to_card(item : dict) -> FeedCard:
    return FeedCard(**{k: v for k, v in item.items() if k != "score"})

# Get Feed endpoint
@router.get("/", response_model=FeedResponse)
def get_feed(
    page : int = Query(default=1, ge=1),
    page_size : int = Query(default=10, ge=1, le=50),
    user_id : Optional[UUID] = Query(default=None),
    db : Session = Depends(get_db)
):
    if user_id:
        raw_items, total, is_personalised = get_unified_feed(
            user_id=str(user_id), db=db, page=page, page_size=page_size
        )
        total_pages = ceil(total / page_size) if total > 0 else 1
        cards = [_to_card(item) for item in raw_items]
    else:
        # Guest: merge posts + artworks sorted by date
        posts = db.query(Post).all()
        artworks = db.query(ArtWork).all()
        artist_names = {
            artist.id: artist.display_name
            for artist in db.query(Artist.id, Artist.display_name).all()
        }
        merged = []
        for p in posts:
            merged.append({"type": "post", "obj": p, "created_at": p.created_at})
        for a in artworks:
            merged.append({"type": "artwork", "obj": a, "created_at": a.create_at})
        merged.sort(key=lambda x: x["created_at"], reverse=True)
        total = len(merged)
        total_pages = ceil(total / page_size) if total > 0 else 1
        paged = merged[(page-1)*page_size : page*page_size]
        is_personalised = False

        cards = []
        for item in paged:
            obj = item["obj"]
            is_artwork = item["type"] == "artwork"
            cards.append(FeedCard(
                id=obj.id, type=item["type"], created_at=item["created_at"],
                artist_id=obj.artist_id,
                artist_name=artist_names.get(obj.artist_id),
                title=obj.title, description=obj.description, image_url=obj.image_url,
                price=obj.price if is_artwork else None,
                medium=obj.medium if is_artwork else None,
                is_framed=obj.is_framed if is_artwork else None,
            ))

    return FeedResponse(
        cards=cards, total=total, page=page, page_size=page_size,
        total_pages=total_pages, has_next=page < total_pages,
        has_prev=page > 1, is_personalised=is_personalised
    )

#Like Toggle
@router.post("/{target_type}/{target_id}/like")
def toggle_like(target_type: str, target_id: UUID, user_id: UUID = Query(...), db: Session = Depends(get_db)):

    # Ensure the target exists
    get_target_or_404(target_type, target_id, db)

    if target_type not in ("post", "artwork"):
        raise HTTPException(status_code=400, detail="target_type must be 'post' or 'artwork'")

    existing = db.query(FeedLike).filter(
        FeedLike.user_id == user_id, FeedLike.target_id == target_id,
        FeedLike.target_type == target_type
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        liked = False
    else:
        db.add(FeedLike(user_id=user_id, target_id=target_id, target_type=target_type))
        db.commit()
        liked = True

    like_count = db.query(func.count(FeedLike.id)).filter(
        FeedLike.target_id == target_id, FeedLike.target_type == target_type
    ).scalar()
    return {"target_id": target_id, "like_count": like_count, "is_liked_by_me": liked}

# Save Toggle
@router.post("/{target_type}/{target_id}/save")
def toggle_save(target_type: str, target_id: UUID, user_id: UUID = Query(...), db: Session = Depends(get_db)):
        
    # Ensure the target exists
    get_target_or_404(target_type, target_id, db)

    if target_type not in ("post", "artwork"):
        raise HTTPException(status_code=400, detail="target_type must be 'post' or 'artwork'")

    existing = db.query(FeedSave).filter(
        FeedSave.user_id == user_id, FeedSave.target_id == target_id,
        FeedSave.target_type == target_type
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"target_id": target_id, "is_saved": False}

    db.add(FeedSave(user_id=user_id, target_id=target_id, target_type=target_type))
    db.commit()
    return {"target_id": target_id, "is_saved": True}

# Comment Creation
@router.post("/{target_type}/{target_id}/comments", response_model=CommentResponse)
def add_comment(target_type: str, target_id: UUID, body: CommentCreate, db: Session = Depends(get_db)):
        
    # Ensure the target exists
    get_target_or_404(target_type, target_id, db)

    if target_type not in ("post", "artwork"):
        raise HTTPException(status_code=400, detail="target_type must be 'post' or 'artwork'")
    comment = FeedComment(user_id=body.user_id, target_id=target_id, target_type=target_type, content=body.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)

    user_name = db.query(User.full_name).filter(User.id == comment.user_id).scalar()
    return {
        "user_id": comment.user_id,
        "user_name": user_name or "Unknown User",
        "content": comment.content,
    }


@router.get("/{target_type}/{target_id}/comments", response_model=list[CommentResponse])
def get_comments(target_type: str, target_id: UUID, db: Session = Depends(get_db)):
    rows = db.query(FeedComment, User.full_name).outerjoin(User, User.id == FeedComment.user_id).filter(
        FeedComment.target_id == target_id, FeedComment.target_type == target_type
    )
    return [
        {
            "user_id": comment.user_id,
            "user_name": user_name or "Unknown User",
            "content": comment.content,
        }
        for comment, user_name in rows
    ]

# Track Views
@router.post("/{target_type}/{target_id}/view")
def track_view(target_type: str, target_id: UUID, user_id: UUID = Query(...), db: Session = Depends(get_db)):

    # Ensure the target exists
    get_target_or_404(target_type, target_id, db)

    # Only records one view per user per target to prevent over scoreing
    already_viewed = db.query(FeedInteraction).filter(
        FeedInteraction.user_id == user_id,
        FeedInteraction.target_id == target_id,
        FeedInteraction.target_type == target_type,
        FeedInteraction.event_type == "view",
    ).first()

    if not already_viewed:
        db.add(FeedInteraction(user_id=user_id, target_id=target_id, target_type=target_type, event_type="view"))
        db.commit()

    return {"message": "view recorded"}