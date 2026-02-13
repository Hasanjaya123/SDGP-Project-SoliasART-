from fastapi import APIRouter, UploadFile, File
from app.modules.AR.mesh_utils import create_poster_mesh
from app.core.database import get_db
from PIL import Image
import io

from fastapi import APIRouter
import app.modules.AR.mesh_utils as mesh_utils  # <--- Import your new file here

# Create the router instance
router = APIRouter()


@router.get("/generate-ar")
async def generate_ar(file: UploadFile = File(...)):
    #read image file
    content = await file.read()
    image = Image.open(io.BytesIO(content))

    #create 3d mesh from image
    mesh = mesh_utils.create_poster_mesh(image)

    #export mesh to glb format
    glb_data = mesh.export(file_type='glb')