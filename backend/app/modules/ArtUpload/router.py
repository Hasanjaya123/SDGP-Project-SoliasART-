from main import app
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends
from ArtUpload.schemas import ArtWorkResponse, ArtUploadRequest
from ArtUpload.image_kit import imagekit, IMAGEKIT_URL_ENDPOINT
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from fastapi.concurrency import run_in_threadpool
from model import ArtWork

@app.post("/user/dashboard/upload", response_model=ArtWorkResponse)
async def upload(
    form_data: ArtUploadRequest = Depends(ArtUploadRequest), 
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    try:
        
        first_image_content = await images[0].read()
        
        upload_result = await run_in_threadpool(

            imagekit.files.upload,      
            file=first_image_content,
            file_name=images[0].filename,
            folder="/ArtWorks",
            tags=["python-app"],
            is_private_file=False
        )
        
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
            
            image_url=upload_result.url,
            embedding="Test",
            artist_id="00000000-0000-0000-0000-000000000000"
        )

        db.add(new_artwork)
        await db.commit()
        await db.refresh(new_artwork)

        return new_artwork
        

        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    


