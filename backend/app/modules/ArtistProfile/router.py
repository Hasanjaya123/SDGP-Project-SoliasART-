# backend/main.py
from fastapi import HTTPException, APIRouter, Depends
from app.core.supabase import supabase
from app.modules.auth.dependencies import get_current_user, get_current_artist


router = APIRouter(prefix="/artists", tags=["ArtistProfile"])

@router.get("/profile")
async def get_full_artist_profile(
    current_user: str = Depends(get_current_artist)
    ):
    """
    Fetches everything needed for the ArtistProfilePage in one single request.
    """
    try:
        
        user_id = str(current_user.id)
       
        # We fetch the artist by the user_id foreign key
        profile_res = supabase.table("artists").select("*").eq("user_id", user_id).execute()
        
        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")
            
        raw_artist = profile_res.data[0]
        artist_id = str(raw_artist["id"])

        artworks_res = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium").eq("artist_id", artist_id).execute()
        
        posts_res = supabase.table("post").select("*").eq("artist_id", artist_id).order("created_at", desc=True).execute()

        # We map the database columns (snake_case) to match your React props (camelCase)
        return {
            "artist": {
                "id": raw_artist.get("id"),
                'owner' : True,
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
            "posts": posts_res.data
        }

    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")
    
    
@router.get("/profile/{artist_id}")
async def get_full_artist_profile(
    current_user: str = Depends(get_current_user),
    artist_id: str = None
    ):
    """
    Fetches everything needed for the ArtistProfilePage in one single request.
    """
    try:
       
        # We fetch the artist by the user_id foreign key
        profile_res = supabase.table("artists").select("*").eq("id", artist_id).execute()
        
        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")
            
        raw_artist = profile_res.data[0]
        artist_id = str(raw_artist["id"])

        artworks_res = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium").eq("artist_id", artist_id).execute()
        
        posts_res = supabase.table("post").select("*").eq("artist_id", artist_id).order("created_at", desc=True).execute()

        # We map the database columns (snake_case) to match your React props (camelCase)
        return {
            "artist": {
                "id": raw_artist.get("id"),
                'owner' : False,
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
            "posts": posts_res.data
        }

    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")
