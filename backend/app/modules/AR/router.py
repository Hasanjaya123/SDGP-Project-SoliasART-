from fastapi import APIRouter, Response, UploadFile, File
from app.modules.AR.mesh_utils import create_poster_mesh
from app.core.database import get_db
from PIL import Image
import io
import app.modules.AR.mesh_utils as mesh_utils  # <--- Import your new file here

# Create the router instance
router = APIRouter()


@router.post("/generate-ar")
async def generate_ar(file: UploadFile = File(...)):
    #read image file
    content = await file.read()
    image = Image.open(io.BytesIO(content))

    #create 3d mesh from image
    mesh = mesh_utils.create_poster_mesh(image)

    #export mesh to glb format
    glb_data = mesh.export(file_type='glb')

    #return the glb file as a response
    return Response(
        content=glb_data,
        media_type='model/gltf-binary',
        headers={'Content-Disposition': 'attachment; filename="poster.glb"'}
    )