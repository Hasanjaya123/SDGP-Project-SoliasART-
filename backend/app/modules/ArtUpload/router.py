from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from app.modules.ArtUpload.schemas import ArtWorkResponse, ArtUploadRequest
<<<<<<< HEAD
from app.core.image_kit import imagekit
=======
from app.modules.ArtUpload.image_kit import imagekit, IMAGEKIT_URL_ENDPOINT
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from fastapi.concurrency import run_in_threadpool
from app.modules.ArtUpload.model import ArtWork
<<<<<<< HEAD
from app.core.supabase import supabase
=======
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986

#-----------Test-------------------------
import numpy as np
np.random.seed(42)
consistent_embedding = np.random.uniform(-1, 1, 512).tolist()
#-----------Test-------------------------

router = APIRouter(prefix="/user/dashboard", tags=["ArtUpload"])

<<<<<<< HEAD
@router.post("/upload/{artist__id}", response_model=ArtWorkResponse)
async def upload(
    artist__id: str,
=======
@router.post("/upload", response_model=ArtWorkResponse)
async def upload(
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986
    form_data: ArtUploadRequest = Depends(ArtUploadRequest), 
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    
    image_links = []
    
    try:
        
<<<<<<< HEAD
        profile_response = supabase.table('artists').select('*').eq('id', artist__id).execute()
        
        
        if (len(profile_response.data) == 0):
            raise HTTPException(statis_code=404, details="Artist not found")
        
        artist_data = profile_response.data[0]
        
=======
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986
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
            embedding=consistent_embedding,
<<<<<<< HEAD
            artist_id= artist__id
=======
            #artist_id="00000000-0000-0000-0000-000000000000"
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986
        )

        db.add(new_artwork)
        db.commit()
        db.refresh(new_artwork)

        return new_artwork
        
<<<<<<< HEAD
=======

        
>>>>>>> ef4a89d282a7cb8ff227e06a3615fee5aa22e986
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


