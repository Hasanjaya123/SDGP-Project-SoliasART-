from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.AR.router import router as ar_router
from app.core.database import Base, engine
from PIL import Image
import io
import app.modules.AR.mesh_utils as mesh_utils  # <--- Import your new file here

# Initialise the API application
app = FastAPI(title=settings.PROJECT_NAME)

Base.metadata.create_all(bind=engine)

origins = ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,                     
    allow_origins=origins,              # Only allow the sites listed above       
    allow_credentials=True,             # Allow cookies/tokens
    allow_methods=["*"],                # Allow all types: GET, POST, PUT, DELETE
    allow_headers=["*"],                # Allow all headers (Content-Type, Authorization, etc.)
)

@app.post("/")
def read_root():
    return {"status": "SoliasArt Backend is Active"}

# add rout under Authentication tag
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

app.include_router(ar_router, prefix="/ar", tags=["Augmented Reality"])

