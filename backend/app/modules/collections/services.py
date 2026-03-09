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

        # Fetch the artworks associated with this collection
        # Junction table: collection_artworks (collection_id, artwork_id)
        # artwork table (id, title, artist_id, price, image_url, medium, year_created, description)
        # artists table (id, display_name, profile_image, ...)
        artworks_res = db.table('collection_artworks')\
            .select('artwork(id, title, artist_id, price, image_url, medium, year_created, description)')\
            .eq('collection_id', str(collection_id))\
            .execute()
        
        artworks = []
        for row in artworks_res.data:
            artwork_data = row.get('artwork')
            if artwork_data:
                # Resolve artist name from artists table
                if artwork_data.get('artist_id'):
                    try:
                        artist_res = db.table('artists').select('display_name').eq('id', str(artwork_data['artist_id'])).single().execute()
                        if artist_res.data:
                            artwork_data['artist_name'] = artist_res.data['display_name']
                    except:
                        artwork_data['artist_name'] = 'Unknown Artist'
                else:
                    artwork_data['artist_name'] = 'Unknown Artist'
                artworks.append(artwork_data)
        
        collection_data['artworks'] = artworks
        return collection_data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch collection details: {str(e)}")
