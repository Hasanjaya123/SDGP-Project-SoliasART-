from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
import httpx
import os
import uuid

from app.modules.AR.ar_model import ARModel
from app.core.database import get_db
from app.modules.ArtUpload.artwork import ArtWork 

router = APIRouter()

@router.get("/generate-ar/{artwork_id}")
async def generate_ar_from_db(artwork_id: str, db: Session = Depends(get_db)):
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
    temp_glb = f"temp_{unique_id}.glb"

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
        ar.export_glb(temp_img, temp_glb)

        with open(temp_glb, "rb") as f:
            glb_data = f.read()

        # Adding the Content-Disposition header triggers the download button in Swagger
        return Response(
            content=glb_data, 
            media_type="model/gltf-binary",
            headers={
                "Content-Disposition": f"attachment; filename=artwork_{artwork_id}.glb"
            }
        )

    except Exception as e:
        print(f"ERROR during AR generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(temp_img): os.remove(temp_img)
        if os.path.exists(temp_glb): os.remove(temp_glb)