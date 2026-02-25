from fastapi import HTTPException
from app.core.database import supabase
from app.modules.collections.schemas import CollectionCreate, CollectionResponse, CollectionDetailResponse, ArtworkInCollection
from uuid import UUID

def get_all_collections():
    # Fetch collections with their basic info. 
    # To get total artworks and value efficiently, a database view or trigger is best.
    # For now, we assume collections table stores cached total_artworks and total_value,
    # or we calculate it. Let's assume it has total_artworks, total_value, preview_images fields
    # to make the "Curated Collections" page load fast.
    try:
        response = supabase.table('collections').select('*').execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch collections: {str(e)}")

def get_collection_by_id(collection_id: UUID):
    try:
        # Fetch the main collection data
        collection_res = supabase.table('collections').select('*').eq('id', str(collection_id)).single().execute()
        collection_data = collection_res.data
        if not collection_data:
            raise HTTPException(status_code=404, detail="Collection not found")

        # Fetch the artworks associated with this collection
        # Assuming a junction table: collection_artworks (collection_id, artwork_id)
        # and an artworks table (id, title, artist_name, price, image_url, likes, views)
        # Using Supabase foreign table syntax:
        artworks_res = supabase.table('collection_artworks')\
            .select('artworks(id, title, artist_name, price, image_url, likes, views)')\
            .eq('collection_id', str(collection_id))\
            .execute()
        
        artworks = []
        for row in artworks_res.data:
            artwork_data = row.get('artworks')
            if artwork_data:
                # Add it to our list
                artworks.append(artwork_data)
        
        collection_data['artworks'] = artworks
        return collection_data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch collection details: {str(e)}")

def create_collection(data: CollectionCreate):
    try:
        # First, calculate total_value and total_artworks based on provided artwork_ids
        total_value = 0.0
        preview_images = []
        
        if data.artwork_ids:
            artworks_res = supabase.table('artworks').select('price, image_url').in_('id', [str(id) for id in data.artwork_ids]).execute()
            for art in artworks_res.data:
                total_value += art.get('price', 0.0)
                if len(preview_images) < 4:
                    preview_images.append(art.get('image_url'))

        # Insert collection
        new_collection = {
            "title": data.title,
            "description": data.description,
            "curator_name": data.curator_name,
            "curator_id": str(data.curator_id),
            "total_artworks": len(data.artwork_ids),
            "total_value": total_value,
            "preview_images": preview_images
        }
        
        insert_res = supabase.table('collections').insert(new_collection).execute()
        collection = insert_res.data[0]
        
        # Insert artwork relationships
        if data.artwork_ids:
            collection_artworks = []
            for item_id in data.artwork_ids:
                collection_artworks.append({
                    "collection_id": collection['id'],
                    "artwork_id": str(item_id)
                })
            supabase.table('collection_artworks').insert(collection_artworks).execute()
        
        return collection
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create collection: {str(e)}")

def process_collection_purchase(collection_id: UUID, user_id: UUID):
    try:
        # In a real app, integrate with Stripe or similar
        # For this prototype, we just mark a transaction or create a purchase record
        purchase_data = {
            "collection_id": str(collection_id),
            "buyer_id": str(user_id),
            "status": "completed"
        }
        res = supabase.table('collection_purchases').insert(purchase_data).execute()
        return {"status": "success", "message": "Collection purchased successfully", "purchase_id": res.data[0]['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process purchase: {str(e)}")
