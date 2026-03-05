import os
import uuid
from fastapi import UploadFile, HTTPException
from app.core.database import supabase
from app.modules.artworks.schemas import ArtworkCreate

def upload_artwork_image(file: UploadFile):
    """
    Uploads an image to Supabase Storage bucket 'artworks'.
    Returns the public URL of the uploaded image.
    """
    try:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        
        # Read file content
        file_content = file.file.read()
        
        # Upload to Supabase Storage (Assumes bucket 'artworks' exists)
        # Note: In a real app, you'd want to handle bucket creation or check existence
        supabase.storage.from_('artworks').upload(
            path=file_name,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        response = supabase.storage.from_('artworks').get_public_url(file_name)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

def create_artwork(data: ArtworkCreate, image_url: str):
    """
    Saves artwork metadata to the 'artworks' table.
    """
    try:
        artwork_dict = data.model_dump()
        artwork_dict['image_url'] = image_url
        artwork_dict['artist_id'] = str(artwork_dict['artist_id'])
        
        res = supabase.table('artworks').insert(artwork_dict).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save artwork: {str(e)}")

def get_artworks_by_artist(artist_id: str):
    """
    Fetches all artworks for a specific artist.
    """
    try:
        res = supabase.table('artworks').select('*').eq('artist_id', artist_id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch artworks: {str(e)}")
