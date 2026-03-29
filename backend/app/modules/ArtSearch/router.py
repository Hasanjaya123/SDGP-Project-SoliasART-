
from fastapi import HTTPException, APIRouter, Form, UploadFile, File, Depends, Query
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
        if not query_text and not query_image:
            raise HTTPException(status_code=400, detail="Must provide text or an image to search.")

        # For text search - do simple keyword matching first
        if query_text:
            print(f"Text search for: {query_text}")
            search_results = supabase.table("artwork").select("*").ilike("title", f"%{query_text}%").execute()
            if search_results.data:
                return {"status": "success", "results": search_results.data}
            
            # If no results, try vector search
            try:
                vector = generate_text_embedding(query_text)
                res = supabase.rpc("match_artworks", {
                    "query_embedding": vector,
                    "match_threshold": 0.20,
                    "match_count": 12
                }).execute()
                return {"status": "success", "results": res.data if res.data else []}
            except Exception as rpc_error:
                print(f"Vector search failed: {rpc_error}")
                return {"status": "success", "results": []}
        
        elif query_image:
            try:
                file_bytes = await query_image.read()
                vector = generate_image_embedding(file_bytes)
                res = supabase.rpc("match_artworks", {
                    "query_embedding": vector,
                    "match_threshold": 0.20,
                    "match_count": 12
                }).execute()
                return {"status": "success", "results": res.data if res.data else []}
            except Exception as e:
                print(f"Image search failed: {e}")
                return {"status": "success", "results": []}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Search Error: {e}")
        raise HTTPException(status_code=500, detail="Search failed.")

@router.get("/")
async def get_art_work(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    try:
        offset = (page - 1) * limit
        get_artwork = supabase.table("artwork").select("*").range(offset, offset + limit - 1).execute()
        
        try:
            count_result = supabase.table("artwork").select("id", count="exact").execute()
            total = count_result.count if hasattr(count_result, 'count') else 0
        except:
            total = len(get_artwork.data) if get_artwork.data else 0
        
        return {
            "status": "success",
            "data": get_artwork.data if get_artwork.data else [],
            "total": total,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        print(f"Get artworks error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch artworks")
    

    
    
    
    
    


    