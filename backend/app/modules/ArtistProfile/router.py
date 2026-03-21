from fastapi import HTTPException, APIRouter, Depends
from app.core.supabase import supabase
from app.modules.auth.dependencies import get_current_user, get_current_artist

router = APIRouter(prefix="/artists", tags=["ArtistProfile"])


# 🔥 GET ALL ARTISTS (THIS IS YOUR ERROR FIX)
@router.get("")
async def get_all_artists():
    try:
        response = supabase.table("artists").select("*").execute()

        return response.data  # return list directly

    except Exception as e:
        print("🔥 FULL ERROR:", str(e))   # VERY IMPORTANT
        raise HTTPException(status_code=500, detail=str(e))


# 🔐 GET CURRENT ARTIST PROFILE
@router.get("/profile")
async def get_my_profile(
    current_user: str = Depends(get_current_artist)
):
    try:
        user_id = str(current_user.id)

        profile_res = supabase.table("artists").select("*").eq("user_id", user_id).execute()

        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")

        return profile_res.data[0]

    except Exception as e:
        print("🔥 ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# 🌍 GET ANY ARTIST PROFILE BY ID
@router.get("/profile/{artist_id}")
async def get_artist_by_id(
    artist_id: str,
    current_user: str = Depends(get_current_user)
):
    try:
        profile_res = supabase.table("artists").select("*").eq("id", artist_id).execute()

        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")

        return profile_res.data[0]

    except Exception as e:
        print("🔥 ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))