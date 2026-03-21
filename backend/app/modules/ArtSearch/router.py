
from fastapi import HTTPException, APIRouter, Form, UploadFile, File, Depends
from app.modules.auth.dependencies import get_current_user
from app.modules.ArtUpload.embeddings import generate_image_embedding, generate_text_embedding
from app.core.supabase import supabase
from typing import Optional


router = APIRouter(prefix="/explore", tags=["ArtSearch"])


async def check_user(user_id: str):
    artist_res = supabase.table("artists").select("user_id").eq("user_id", user_id).execute()
    
    user_res = supabase.table("users").select("id").eq("id", user_id).execute()
    
    if not artist_res.data and not user_res.data:
        return False
    
    return True

@router.post("/search")
async def search_artworks(
    current_user: str = Depends(get_current_user),
    query_text: Optional[str] = Form(None),
    query_image: Optional[UploadFile] = File(None)
):
    try:
        vector = None

        if query_text:
            vector = generate_text_embedding(query_text)
        elif query_image:
            file_bytes = await query_image.read()
            vector = generate_image_embedding(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Must provide text or an image to search.")

        res = supabase.rpc("match_artworks", {
            "query_embedding": vector,
            "match_threshold": 0.20,
            "match_count": 12
        }).execute()

        return {
            "status": "success",
            "results": res.data
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Search Error: {e}")
        raise HTTPException(status_code=500, detail="Search failed.")

@router.get("/")
async def get_art_work(current_user: str = Depends(get_current_user)):
    
   
    get_artwork = supabase.table("artwork").select("id, title, price, image_url, width_in, height_in, medium, view_count, likes, artists(display_name)").execute()
    
    if not get_artwork.data:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    return get_artwork.data
    

    
    
    
    
    


    