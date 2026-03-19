from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.modules.savework.schemas import ArtworkCard
from app.core.database import get_db
from app.modules.savework.models import UserSave
from app.modules.auth.dependencies import get_current_user

router = APIRouter()

# ─── Supabase REST helpers ────────────────────────────────────

def _headers() -> dict:
    return {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


async def _supabase_get(path: str, params: dict = None) -> list:
    url = f"{settings.SUPABASE_URL}/rest/v1/{path}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=_headers(), params=params)
        resp.raise_for_status()
        return resp.json()


# ─── Utility ──────────────────────────────────────────────────

def _parse_image_url(raw) -> List[str]:
    """
    Supabase returns text[] as either a Python list (via JSON)
    or a Postgres array literal string: {"url1","url2"}
    """
    if not raw:
        return []
    if isinstance(raw, list):
        return [str(u) for u in raw if u]
    if isinstance(raw, str):
        cleaned = raw.strip("{}")
        return [p.strip().strip('"') for p in cleaned.split(",") if p.strip()]
    return []


def _map_row(row: dict, artist_name: str = None) -> ArtworkCard:
    return ArtworkCard(
        id=str(row.get("id", "")),
        title=row.get("title"),
        medium=row.get("medium"),
        price=row.get("price"),
        image_url=_parse_image_url(row.get("image_url")),
        height_in=row.get("height_in"),
        width_in=row.get("width_in"),
        artist_id=str(row["artist_id"]) if row.get("artist_id") else None,
        artist_name=artist_name,
        year_created=row.get("year_created"),
        description=row.get("description"),
        is_framed=row.get("is_framed"),
    )


async def _fetch_artist_names(rows: list) -> dict:
    """Returns {artist_id: display_name} for all rows that have an artist_id."""
    artist_ids = list({str(r["artist_id"]) for r in rows if r.get("artist_id")})
    if not artist_ids:
        return {}
    try:
        artists = await _supabase_get(
            "artists",
            params={
                "id": "in.(" + ",".join(artist_ids) + ")",
                "select": "id,display_name",
            },
        )
        return {str(a["id"]): a.get("display_name") for a in artists}
    except Exception:
        return {}


# ─── Endpoints ────────────────────────────────────────────────

@router.get("/artworks", response_model=List[ArtworkCard])
async def get_artworks(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
):
    """
    Fetch artworks from Supabase for the SaveWork page.
    Returns title, medium, price, images, dimensions, and artist name.
    No DB schema changes required.
    """
    try:
        rows = await _supabase_get(
            "artwork",
            params={
                "select": "id,title,medium,price,image_url,height_in,width_in,artist_id,year_created,description,is_framed",
                "order": "create_at.desc.nullslast",
                "limit": str(limit),
                "offset": str(offset),
            },
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Supabase error: {e.response.text}")

    artist_map = await _fetch_artist_names(rows)
    return [_map_row(r, artist_name=artist_map.get(str(r.get("artist_id")))) for r in rows]


@router.get("/artworks/{artwork_id}", response_model=ArtworkCard)
async def get_single_artwork(artwork_id: str):
    """Fetch a single artwork by UUID."""
    try:
        rows = await _supabase_get(
            "artwork",
            params={
                "id": f"eq.{artwork_id}",
                "select": "id,title,medium,price,image_url,height_in,width_in,artist_id,year_created,description,is_framed",
                "limit": "1",
            },
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Supabase error: {e.response.text}")

    if not rows:
        raise HTTPException(status_code=404, detail="Artwork not found")

    artist_map = await _fetch_artist_names(rows)
    return _map_row(rows[0], artist_name=artist_map.get(str(rows[0].get("artist_id"))))

@router.post("/save/{artwork_id}")
async def save_artwork(artwork_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    user_id = current_user.id
    # Check if already saved to prevent duplicates
    existing_save = db.query(UserSave).filter(
        UserSave.user_id == user_id, 
        UserSave.artwork_id == artwork_id
    ).first()

    if existing_save:
        db.delete(existing_save)
        db.commit()
        return {"status": "unsaved", "message": "Removed from collection"}

    new_save = UserSave(user_id=str(current_user.id), artwork_id=artwork_id)
    db.add(new_save)
    db.commit()
    return {"status": "saved", "message": "Added to collection"}


@router.get("/user/saved", response_model=List[ArtworkCard])
async def get_my_saved_artworks(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Get saved artworks IDs
    saved_records = db.query(UserSave).filter(UserSave.user_id == str(current_user.id)).all()
    
    if not saved_records:
        return []

    artwork_ids = [str(record.artwork_id) for record in saved_records]
      
    rows = await _supabase_get(
        "artwork",
        params={
            "id": "in.(" + ",".join(artwork_ids) + ")",
            "select": "id,title,medium,price,image_url,height_in,width_in,artist_id"
        }
    )
    
    artist_map = await _fetch_artist_names(rows)
    return [_map_row(r, artist_name=artist_map.get(str(r.get("artist_id")))) for r in rows]