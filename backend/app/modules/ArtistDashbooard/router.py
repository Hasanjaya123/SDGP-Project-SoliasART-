from fastapi import APIRouter, HTTPException, Depends
from app.core.supabase import supabase
from app.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
async def get_full_artist_profile(current_user: str = Depends(get_current_user)):
    try:
        
        user_id = str(getattr(current_user, 'id', current_user))
        
        profile_response = supabase.table('artists').select('*').eq('user_id', user_id).execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="Artist profile not found. Please complete onboarding.")
        
        artist_data = profile_response.data[0]
        artist_id = artist_data.get("id") or artist_data.get("artist_id") 
        
        art_work_count = supabase.table("artwork").select("id", count="exact").eq("artist_id", artist_id).execute()     

        views = supabase.table("artwork").select("id", "view_count", "likes").eq("artist_id", artist_id).execute() 

        revenue = supabase.table("artwork").select("id", "price","status").eq("artist_id", artist_id).ilike("status", "sold").execute()
        
        sold_artworks = supabase.table("artwork").select("id", count="exact").eq("artist_id", artist_id).ilike("status", "sold").execute()
        
       
        get_listed_artwork = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium, status, view_count, likes, artists(display_name)").eq("artist_id", artist_id).eq("status","available").execute()
       
        tot_views = 0
        tot_likes = 0
        for item in views.data:
            tot_views += int(item.get("view_count") or 0)
            tot_likes += int(item.get("likes") or 0)
            
        tot_revenue = 0
        for rev in revenue.data:
            if rev.get("price") == 0 or rev.get("price") is None:
                continue
            tot_revenue += float(rev.get("price")) * 0.85
        
       
        recent_sales_res = supabase.table("sold_artworks").select("id, price, sold_at, artwork:artwork(title, image_url), buyer:users(full_name)").eq("artist_id", artist_id).order("sold_at", desc=True).limit(5).execute()

        recent_sales_mapped = []
        for s in (recent_sales_res.data or []):
            artwork_info = s.get("artwork") or {}
            buyer_info = s.get("buyer") or {}
            recent_sales_mapped.append({
                "id": str(s["id"]),
                "title": artwork_info.get("title", "Untitled Artwork"),
                "image_url": artwork_info.get("image_url"),
                "buyer_name": buyer_info.get("full_name", "Anonymous Buyer"),
                "sold_at": s["sold_at"],
                "price": s["price"],
                "status": "sold"
            })
        
        return {
            "artist": {
                "id": artist_data.get("id"),
                "name": artist_data.get("display_name", "Unknown Artist"),
                "profileImageUrl": artist_data.get("profile_image_url", "https://via.placeholder.com/150")  
            },
            "Statistics": {
                "listed_art_works": art_work_count.count or 0,
                "total_views": tot_views,
                "total_revenue": tot_revenue,
                "sold_artworks": sold_artworks.count or 0,  
                "total_likes": tot_likes 
            },
            "artworks": get_listed_artwork.data or [],
            "recent_sales": recent_sales_mapped
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching dashboard profile: {e}")
        raise HTTPException(status_code=500, detail="Could not load profile data")