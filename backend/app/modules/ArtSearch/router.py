
from fastapi import HTTPException, APIRouter
from app.core.supabase import supabase


router = APIRouter(prefix="/explore", tags=["ArtSearch"])


async def check_user(user_id: str):
    artist_res = supabase.table("artists").select("user_id").eq("user_id", user_id).execute()
    
    user_res = supabase.table("users").select("id").eq("id", user_id).execute()
    
    if not artist_res.data and not user_res.data:
        return False
    
    return True

@router.get("/{user_id}")
async def get_art_work(user_id: str):
    
    veryfying_user = await check_user(user_id)
    if not veryfying_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    get_artwork = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium, artists(display_name)").execute()
    
    if not get_artwork.data:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    return get_artwork.data
    
    
    