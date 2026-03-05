# backend/main.py
from fastapi import HTTPException, APIRouter
from app.core.supabase import supabase

router = APIRouter(prefix="/artists", tags=["ArtistProfile"])

@router.get("/profile/{artist_id}")
async def get_full_artist_profile(artist_id: str):
    """
    Fetches everything needed for the ArtistProfilePage in one single request.
    """
    try:
        # 1. GET ARTIST PROFILE
        # We fetch the specific user by their ID.
        profile_res = supabase.table("artists").select("*").eq("id", artist_id).execute()
        
        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")
            
        raw_artist = profile_res.data[0]

        artworks_res = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium").eq("artist_id", artist_id).execute()
        
        #posts_res = supabase.table("posts").select("*").eq("artist_id", artist_id).order("created_at", desc=True).execute()

        # We map the database columns (snake_case) to match your React props (camelCase)
        return {
            "artist": {
                "id": raw_artist.get("id"),
                "name": raw_artist.get("display_name", "Unknown Artist"),
                "bio": raw_artist.get("artist_bio", ""),
                "profileImageUrl": raw_artist.get("profile_image_url", "https://via.placeholder.com/150"),
                "isVerified": raw_artist.get("verified_artist", False),
                "specialty": raw_artist.get("primary_medium", ""),
                "location": raw_artist.get("dispatch_address", "Sri Lanka"),
                "yearsExperience": raw_artist.get("years_experience", ""),
                "styles": raw_artist.get("artistic_styles", []), 
                "followers": raw_artist.get("followers", 0),
                "recognition": [],
            },
            "artworks": artworks_res.data,
            "posts": []
        }

    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")