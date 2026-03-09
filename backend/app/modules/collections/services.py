from fastapi import HTTPException
from app.core.database import supabase
from app.modules.collections.schemas import CollectionCreate, CollectionResponse, CollectionDetailResponse, ArtworkInCollection
from uuid import UUID

def get_db():
    if not supabase:
        raise HTTPException(
            status_code=500,
            detail="Database not configured. Supabase credentials missing."
        )
    return supabase

def get_all_collections():
    try:
        db = get_db()
        # Initial implementation with basic select
        response = db.table('collections').select('*').execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch collections: {str(e)}")
