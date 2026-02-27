from fastapi import HTTPException, APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from fastapi.concurrency import run_in_threadpool


router = APIRouter(prefix="/user/dashboard", tags=["ArtUpload"])


@router.post("/user/settings/convert")
async def convert_to_artist_profile(
    form_data,
    image,
    db: Session = Depends(get_db)
    
    ):
    
    try:
        pass
        
    
    except Exception as e:
        
        db.rollback()
        print(f"Roll back: {e}")
        raise HTTPException(status_code=500, detail=str(e))