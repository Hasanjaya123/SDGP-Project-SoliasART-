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
        # Fetch collections and their artwork IDs for the preview cover
        response = db.table('collections').select('id, title, description, curator_name, curator_id, total_artworks, total_value, preview_images, created_at, collection_artworks(artwork_id)').execute()
        
        # Flatten the artwork_ids mapping
        collections = []
        for col in response.data:
            col['artwork_ids'] = [ca['artwork_id'] for ca in col.get('collection_artworks', [])]
            collections.append(col)
            
        return collections
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch collections: {str(e)}")

def get_collection_by_id(collection_id: UUID):
    try:
        db = get_db()
        # Fetch the main collection data
        collection_res = db.table('collections').select('*').eq('id', str(collection_id)).single().execute()
        collection_data = collection_res.data
        if not collection_data:
            raise HTTPException(status_code=404, detail="Collection not found")
            
        return collection_data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch collection details: {str(e)}")
