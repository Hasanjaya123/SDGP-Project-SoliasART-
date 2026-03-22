from fastapi import HTTPException, APIRouter, Depends
from app.core.supabase import supabase
from app.modules.auth.dependencies import get_current_user, get_current_artist
from app.core.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.modules.ArtistProfile.model import Follow, Artist

router = APIRouter(prefix="/artists", tags=["ArtistProfile"])


@router.get("")
async def get_all_artists():
    try:
        response = supabase.table("artists").select("*").execute()
        artists = response.data
        
        # Fetch artworks basic info to count them
        artworks_res = supabase.table("artwork").select("artist_id").execute()
        
        counts = {}
        for art in artworks_res.data:
            aid = str(art.get("artist_id"))
            counts[aid] = counts.get(aid, 0) + 1
            
        for a in artists:
            a["artworks_count"] = counts.get(str(a["id"]), 0)

        return artists

    except Exception as e:
        print("🔥 FULL ERROR:", str(e))   
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/profile")
async def get_my_profile(
    current_user: str = Depends(get_current_artist)
):
    try:
        user_id = str(current_user.id)

        profile_res = supabase.table("artists").select("*").eq("user_id", user_id).execute()

        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Artist not found")

        raw_artist = profile_res.data[0]
        artist_id = str(raw_artist["id"])

        artworks_res = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium, view_count, likes, artists(display_name)").eq("artist_id", artist_id).execute()
        
        posts_res = supabase.table("post").select("*").eq("artist_id", artist_id).order("created_at", desc=True).execute()

        # Map database fields to match React props
        return {
            "artist": {
                "id": str(artist_record.id),
                'owner' : True,
                "name": artist_record.display_name or "Unknown Artist",
                "display_name": artist_record.display_name or "Unknown Artist",
                "bio": artist_record.artist_bio or "",
                "profileImageUrl": artist_record.profile_image_url or "https://via.placeholder.com/150",
                "isVerified": artist_record.verified_artist or False,
                "specialty": artist_record.primary_medium or "",
                "location": artist_record.dispatch_address or "Sri Lanka",
                "yearsExperience": artist_record.years_experience or "",
                "styles": artist_record.artistic_styles or [], 
                "followers": artist_record.followers or 0,
                "recognition": [],
            },
            "artworks": artworks_res.data,
            "posts": posts_res.data
        }

    except HTTPException:
        raise 
    except Exception as e:
        print(f"Error fetching profile by id: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")
    
    
@router.get("/profile/{artist_id}")
async def get_full_artist_profile_by_id(
    artist_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
    ):
    """
    Fetches everything needed for the ArtistProfilePage in one single request.
    """
    try:
       
        # Use SQLAlchemy to find the artist by either their record ID or their User ID
        artist_record = db.query(Artist).filter(
            or_(Artist.id == artist_id, Artist.user_id == artist_id)
        ).first()

        if not artist_record:
            raise HTTPException(status_code=404, detail="Artist not found")
            
        actual_artist_id = str(artist_record.id)

        artworks_res = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium").eq("artist_id", actual_artist_id).execute()
        
        posts_res = supabase.table("post").select("*").eq("artist_id", actual_artist_id).order("created_at", desc=True).execute()

        # Map database fields to match React props
        return {
            "artist": {
                "id": str(artist_record.id),
                'owner' : False,
                "name": artist_record.display_name or "Unknown Artist",
                "display_name": artist_record.display_name or "Unknown Artist",
                "bio": artist_record.artist_bio or "",
                "profileImageUrl": artist_record.profile_image_url or "https://via.placeholder.com/150",
                "isVerified": artist_record.verified_artist or False,
                "specialty": artist_record.primary_medium or "",
                "location": artist_record.dispatch_address or "Sri Lanka",
                "yearsExperience": artist_record.years_experience or "",
                "styles": artist_record.artistic_styles or [], 
                "followers": artist_record.followers or 0,
                "recognition": [],
            },
            "artworks": artworks_res.data,
            "posts": posts_res.data
        }

    except HTTPException:
        raise 
    except Exception as e:
        print(f"Error fetching profile by id: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")

@router.get("/profile/{artist_id}/is-following")
async def is_following_artist(
    artist_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if the current user is following the artist."""
    try:
        user_id = str(current_user.id)
        
        follow = db.query(Follow).filter(
            Follow.user_id == user_id,
            Follow.artist_id == artist_id
        ).first()
        
        return {"is_following": follow is not None}
    except Exception as e:
        print(f"Error checking follow status: {e}")
        return {"is_following": False}

@router.post("/profile/{artist_id}/follow")
async def follow_artist(
    artist_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Follow an artist."""
    try:
        user_id = str(current_user.id)
        
        existing = db.query(Follow).filter(
            Follow.user_id == user_id,
            Follow.artist_id == artist_id
        ).first()
        
        if not existing:
            new_follow = Follow(user_id=user_id, artist_id=artist_id)
            db.add(new_follow)
            
            # Increment the string follower count via supabase
            artist_res = supabase.table("artists").select("followers").eq("id", artist_id).execute()
            if artist_res.data:
                cf = artist_res.data[0].get("followers", "0")
                current_followers = int(cf) if cf and str(cf).isdigit() else 0
                supabase.table("artists").update({"followers": str(current_followers + 1)}).eq("id", artist_id).execute()
                
            db.commit()
            
        return {"message": "You are now following this artist."}
    except Exception as e:
        print(f"Error following artist: {e}")
        raise HTTPException(status_code=500, detail="Could not follow artist")

@router.post("/profile/{artist_id}/unfollow")
async def unfollow_artist(
    artist_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unfollow an artist."""
    try:
        user_id = str(current_user.id)
        
        existing = db.query(Follow).filter(
            Follow.user_id == user_id,
            Follow.artist_id == artist_id
        ).first()
        
        if existing:
            db.delete(existing)
            
            # Decrement the string follower count via supabase
            artist_res = supabase.table("artists").select("followers").eq("id", artist_id).execute()
            if artist_res.data:
                cf = artist_res.data[0].get("followers", "0")
                current_followers = int(cf) if cf and str(cf).isdigit() else 0
                supabase.table("artists").update({"followers": str(max(0, current_followers - 1))}).eq("id", artist_id).execute()
                
            db.commit()
            
        return {"message": "You have unfollowed this artist."}
    except Exception as e:
        print(f"Error unfollowing artist: {e}")
        raise HTTPException(status_code=500, detail="Could not unfollow artist")
