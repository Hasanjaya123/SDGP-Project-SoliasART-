import numpy as np
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from sklearn.metrics.pairwise import cosine_similarity

from app.modules.ArtUpload.model import ArtWork
from app.modules.ArtistOnboarding.model import Artist
from app.modules.Post.model import Post
from app.modules.Feed.model import FeedLike, FeedSave, FeedInteraction

EVENT_WEIGHTS = {
    "view":1,
    "like":3,
    "save":5
}

def _recency_factor(created_at: datetime) -> float:
    age_days = (datetime.now(timezone.utc) - created_at).days
    if age_days <= 1: return 1.0
    if age_days <= 7: return 0.8
    if age_days <= 30: return 0.5
    return 0.2

def get_unified_feed(user_id: str, db:Session, page: int = 1, page_size: int = 10):
    liked_ids = {
        str(r.target_id): r.target_type
        for r in db.query(FeedLike).filter(FeedLike.user_id == user_id).all()
    }
    saved_ids = {
        str(r.target_id): r.target_type
        for r in db.query(FeedSave).filter(FeedSave.user_id == user_id).all()
    }
    viewed_ids = {
        str(r.target_id): r.target_type
        for r in db.query(FeedInteraction).filter(FeedInteraction.user_id == user_id, FeedInteraction.event_type == "view").all()
    }

    all_interacted = set(liked_ids) | set(saved_ids) | set(viewed_ids)
    is_new_user = len(all_interacted) == 0

    # get like counts for posts and artworks keyed by (target_id, target_type)
    like_count = {
        (target_id, target_type): count
        for target_id, target_type, count in db.query(
            FeedLike.target_id,
            FeedLike.target_type,
            func.count(FeedLike.id)
        ).group_by(FeedLike.target_id, FeedLike.target_type).all()
    }
    
    #get view counts for posts and artworks — count distinct users to prevent inflation
    view_counts = {
        (target_id, target_type): count
        for target_id, target_type, count in db.query(
            FeedInteraction.target_id,
            FeedInteraction.target_type,
            func.count(FeedInteraction.user_id.distinct())
        )
        .filter(FeedInteraction.event_type == "view")
        .group_by(FeedInteraction.target_id, FeedInteraction.target_type).all()
    }
    
    # get all comments for posts and artworks
    from app.modules.Feed.model import FeedComment
    comment_counts = {
        (target_id, target_type): count
        for target_id, target_type, count in db.query(
            FeedComment.target_id,
            FeedComment.target_type,
            func.count(FeedComment.id)
        ).group_by(FeedComment.target_id, FeedComment.target_type).all()
    }
    
    scored_items = []
    artist_names = {
        artist.id: artist.display_name
        for artist in db.query(Artist.id, Artist.display_name).all()
    }

    #score the artworks using embedding similarity
    artworks = db.query(ArtWork).all()
    taste_profile = None

    #base on user interest create with their interaction history
    if not is_new_user:
        weighted_embeddings = []
        for artwork in artworks:
            aid = str(artwork.id)
            if artwork.embedding is None:
                continue
            weight = 0
            if aid in liked_ids and liked_ids[aid] == "artwork":
                weight += EVENT_WEIGHTS["like"]
            elif aid in saved_ids and saved_ids[aid] == "artwork":
                weight += EVENT_WEIGHTS["save"]
            elif aid in viewed_ids and viewed_ids[aid] == "artwork":
                weight += EVENT_WEIGHTS["view"]
            if weight > 0:
                weighted_embeddings.append((np.array(artwork.embedding) * weight))

        
        if weighted_embeddings:
            # Average all weighted embeddings to create a user taste as vector
            taste_profile = np.mean(weighted_embeddings, axis=0).reshape(1, -1)

    for artwork in artworks:
        aid = str(artwork.id)
        recency = _recency_factor(artwork.create_at)
        likes = like_count.get((artwork.id, "artwork"), 0)
        views = view_counts.get((artwork.id, "artwork"), 0)

        if taste_profile is not None and artwork.embedding is not None:
            similarity = cosine_similarity(taste_profile, np.array(artwork.embedding).reshape(1, -1))[0][0]
            score = (similarity * 5 + likes * 3 + views * 1 + 1.0) * recency
        else:
            # +1.0 baseline ensures new/unseen content surfaces instead of scoring 0
            score = (likes * 3 + views * 1 + 1.0) * recency

        scored_items.append({
            "score": score,
            "type": "artwork",
            "id": artwork.id,
            "created_at": artwork.create_at,
            "artist_id": artwork.artist_id,
            "artist_name": artist_names.get(artwork.artist_id),
            "title": artwork.title,
            "description": artwork.description,
            "image_url": artwork.image_url,
            "like_count": int(likes),
            "is_liked_by_me": aid in liked_ids and liked_ids[aid] == "artwork",
            "comment_count": int(comment_counts.get((artwork.id, "artwork"), 0)),
            "is_saved": aid in saved_ids and saved_ids[aid] == "artwork",
            "price": artwork.price,
            "medium": artwork.medium,
            "is_framed": artwork.is_framed,
        })

    #score posts using enagement and collaborative filtering
    posts = db.query(Post).all()

    #collaborative filtering for posts
    bonus_post_ids = set()
    if not is_new_user:
        my_liked_posts = {k for k, v in liked_ids.items() if v == "post"}
        if my_liked_posts:
            similar_users = {str(r.user_id)
                             for r in db.query(FeedLike.user_id).filter(
                                FeedLike.target_type == "post",
                                FeedLike.target_id.in_(my_liked_posts),
                                FeedLike.user_id != user_id).all()
                                }
            if similar_users:
                bonus_post_ids = {
                    str(r.target_id)
                    for r in db.query(FeedLike.target_id).filter(
                        FeedLike.target_type == "post",
                        FeedLike.user_id.in_(similar_users)).all()
                }
    
    for post in posts:
        pid = str(post.id)
        recency = _recency_factor(post.created_at)
        likes = like_count.get((post.id, "post"), 0)
        views = view_counts.get((post.id, "post"), 0)
        bonus = 2 if pid in bonus_post_ids else 0
        # +1.0 baseline ensures new posts surface regardless of engagement
        score = (likes * 3 + views * 1 + bonus + 1.0) * recency

        scored_items.append({
            "score"       : score,
            "type"        : "post",
            "id"          : post.id,
            "created_at"  : post.created_at,
            "artist_id"   : post.artist_id,
            "artist_name" : artist_names.get(post.artist_id),
            "title"       : post.title,
            "description" : post.description,
            "image_url"   : post.image_url,
            "like_count"      : int(likes),
            "is_liked_by_me"  : pid in liked_ids and liked_ids[pid] == "post",
            "comment_count"   : int(comment_counts.get((post.id, "post"), 0)),
            "is_saved"        : pid in saved_ids and saved_ids[pid] == "post",
            "price"       : None,    # posts never have price or buy button
            "medium"      : None,
            "is_framed"   : None,
        })

    # Sort everything by score, then paginate
    scored_items.sort(key=lambda x: x["score"], reverse=True)
    start = (page - 1) * page_size
    paged = scored_items[start: start + page_size]

    # Keep a small content mix on page 1 so posts do not disappear behind artwork ranking.
    if page == 1 and paged and not any(item["type"] == "post" for item in paged):
        post_candidates = [item for item in scored_items if item["type"] == "post"]
        existing_ids = {item["id"] for item in paged}
        injected_posts = []

        for post_item in post_candidates:
            if post_item["id"] not in existing_ids:
                injected_posts.append(post_item)
            if len(injected_posts) == 2:
                break

        if injected_posts:
            keep_count = max(len(paged) - len(injected_posts), 0)
            paged = paged[:keep_count] + injected_posts

    total = len(scored_items)

    return paged, total, not is_new_user