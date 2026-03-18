from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
import httpx
import os
import uuid

from app.modules.AR.ar_model import ARModel
from app.core.database import get_db
from app.modules.ArtUpload.model import ArtWork 

router = APIRouter()

# Simple in-memory cache management 
CACHE_DIR = "storage/models"
MAX_CACHE_SIZE_MB = 100 
os.makedirs(CACHE_DIR, exist_ok=True)

def manage_cache_size():
    # Get all files in cache directory
    files = [os.path.join(CACHE_DIR, f) for f in os.listdir(CACHE_DIR)]
    
    # Calculate total size in MB
    total_size = sum(os.path.getsize(f) for f in files) / (1024 * 1024)
    
    if total_size > MAX_CACHE_SIZE_MB:
        # Sort files by Access Time (oldest first)
        files.sort(key=os.path.getatime)
        
        while total_size > (MAX_CACHE_SIZE_MB * 0.8): # Reduce to 80% to make room
            if not files: break
            oldest_file = files.pop(0)
            file_size = os.path.getsize(oldest_file) / (1024 * 1024)
            os.remove(oldest_file)
            total_size -= file_size
            print(f"CACHE: Deleted oldest file {oldest_file} to free space.")

@router.get("/generate-ar/{artwork_id}")
async def generate_ar_from_db(artwork_id: str, db: Session = Depends(get_db)):

    cached_glb_path = os.path.join(CACHE_DIR, f"{artwork_id}.glb")
    
    # check cache first
    if os.path.exists(cached_glb_path):
        # Update access time so it's marked as "recently used"
        os.utime(cached_glb_path, None) 
        with open(cached_glb_path, "rb") as f:
            glb_data = f.read()
        
        return Response(
            content=glb_data, 
            media_type="model/gltf-binary",
            headers={
                "Content-Disposition": f"attachment; filename=artwork_{artwork_id}.glb",
                "Access-Control-Expose-Headers": "Content-Disposition",
                "X-Cache": "HIT"
            }
        )
    
    # If not in cache, generate new AR model
    # Fetch from DB
    artwork = db.query(ArtWork).filter(ArtWork.id == artwork_id).first()
    
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    # Check if image URLs are available
    if not artwork.image_url or len(artwork.image_url) == 0:
        raise HTTPException(status_code=400, detail="No images available")

    # Get the first image URL which reserved for AR model  
    primary_image_url = artwork.image_url[0]

    # Setup Temp Files
    unique_id = str(uuid.uuid4())
    temp_img = f"temp_{unique_id}.jpg"

    try:
        # Download
        async with httpx.AsyncClient(follow_redirects=True) as client:
            resp = await client.get(primary_image_url)
            resp.raise_for_status()
            with open(temp_img, "wb") as f:
                f.write(resp.content)

        # Run Engine
        ar = ARModel()
        # Ensure we convert Decimal to float for 3D math
        ar.create_canvas(
            float(artwork.width_in), 
            float(artwork.height_in), 
            float(artwork.depth_in)
        )

        ar.create_uv_mapping()

        # manage cache size before saving new file
        manage_cache_size()

        ar.export_glb(temp_img, cached_glb_path)

        with open(cached_glb_path, "rb") as f:
            glb_data = f.read()

        # Adding the Content-Disposition header triggers the download button in Swagger
        return Response(
            content=glb_data, 
            media_type="model/gltf-binary",
            headers={
                "Content-Disposition": f"attachment; filename=artwork_{artwork_id}.glb",
                "Access-Control-Expose-Headers": "Content-Disposition",
                "X-Cache": "MISS"
            }
        )

    except Exception as e:
        print(f"ERROR during AR generation: {str(e)}")
        if os.path.exists(cached_glb_path): 
            os.remove(cached_glb_path)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(temp_img): os.remove(temp_img)