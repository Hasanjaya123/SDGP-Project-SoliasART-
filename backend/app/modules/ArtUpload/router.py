from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from app.modules.ArtUpload.schemas import ArtWorkResponse, ArtUploadRequest
from app.core.image_kit import imagekit
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from fastapi.concurrency import run_in_threadpool
from app.modules.ArtUpload.model import ArtWork
from app.core.supabase import supabase
from app.modules.ArtUpload.embeddings import generate_image_embedding
from app.modules.auth.dependencies import get_current_artist

router = APIRouter(prefix="/user/dashboard", tags=["ArtUpload"])

@router.post("/upload", response_model=ArtWorkResponse)
async def upload(
    current_user: str = Depends(get_current_artist),
    form_data: ArtUploadRequest = Depends(ArtUploadRequest), 
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    
    image_links = []
    
    try:
        
        user_id = str(current_user.id)
        
        profile_response = supabase.table('artists').select('*').eq('user_id', user_id).execute()
        
        
        if (len(profile_response.data) == 0):
            raise HTTPException(statis_code=404, details="Artist not found")
        
        artist_data = profile_response.data[0]
        
        #Taking the first image to convert into Embeddings
        first_image_bytes = await images[0].read()
        await images[0].seek(0)
        
        vector_embedding = await run_in_threadpool(generate_image_embedding, first_image_bytes)
        
        
        for image in images:
            image_content = await image.read()
        
        
            upload_result = await run_in_threadpool(

                imagekit.files.upload,      
                file=image_content,
                file_name=image.filename,
                folder="/ArtWorks",
                tags=["python-app"],
                is_private_file=False
            )
            
            image_links.append(upload_result.url) 
        
        new_artwork = ArtWork(
            
            title=form_data.title,
            description=form_data.description,
            year_created=form_data.year,    
            medium=form_data.medium,
            
            price=form_data.price,         
            weight_kg=form_data.weight,
            width_in=form_data.width,
            height_in=form_data.height,
            depth_in=form_data.depth,
            
            is_framed=form_data.framing,    
            
            image_url=image_links,
            embedding=vector_embedding,
            artist_id= artist_data.get('id')
        )

        db.add(new_artwork)
        db.commit()
        db.refresh(new_artwork)

        return new_artwork
        
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


