from fastapi import APIRouter, HTTPException

from app.core.supabase import supabase

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


async def check_user(artist_id: str):
    artist_res = supabase.table("artists").select("artist_id").eq("artist_id", artist_id).execute()
    
    if not artist_res.data:
        return False
    
    return True

@router.get("/{artist_id}")
async def get_full_artist_profile(artist_id: str):
    """
    Fetches everything needed for the ArtistProfilePage in one single request.
    """
    try:
       
        veryfy_user = await check_user(artist_id)
        
        if not veryfy_user:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist = supabase.table("artists").select("id", "display_name", "profile_image_url").eq("id", artist_id).execute()
       
        art_work_count = supabase.table("artwork").select("id", count="exact").eq("artist_id", artist_id).execute()     
       
        views = supabase.table("artwork").select("id", "view_count").eq("artist_id", artist_id).execute() 
        
        revenue = supabase.table("artwork").select("id", "price").eq("artist_id", artist_id).execute()
        
        sold_artworks = supabase.table("artwork").select("id", "price", "status", "image_url", count="exact").eq("artist_id", artist_id).eq("status", "sold").execute()
        
        total_likes = supabase.table("artwork").select("id", "likes_count").eq("artist_id", artist_id).execute()
        
        get_listed_artwork = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium, artists(display_name)").eq("artist_id", artist_id).execute()
       
        tot_views = 0
        for view in views.data:
            tot_views += view.get("view_count", 0)
        tot_revenue = 0
        for rev in revenue.data:
            tot_revenue+= rev.get("price", 0)   
        
        return {
            
            "artist": {
                "id": artist.data[0].get("id"),
                "name": artist.data[0].get("display_name", "Unknown Artist"),
                "profileImageUrl": artist.data[0].get("profile_image_url", "https://via.placeholder.com/150")  
            },
            "Statistics" :{
                "listed_art_works": art_work_count.count,
                "total_views": tot_views,
                "total_revenue": tot_revenue,
                "sold_artworks": sold_artworks.count,  
                "total_likes": "0"
            },
            "artworks": get_listed_artwork.data,
        }

    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")
