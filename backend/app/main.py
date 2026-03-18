from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.ArtUpload.router import router as art_upload_router
from app.modules.auth.router import router as auth_router

from app.modules.AR.router import router as ar_router
from app.core.database import Base, engine
from PIL import Image
import io

from app.modules.ArtistProfile.router import router as artist_profile_router
from app.modules.ArtistOnboarding.router import router as artist_router
from app.modules.Artwork.router import router as artworks_router
from app.modules.Purchase.router import router as cart_router
from app.modules.ArtSearch.router import router as art_search_router
from app.core.database import Base, engine
from app.modules.PostUpload.router import router as post_upload_router
from app.modules.ArtistDashbooard.router import router as dashboard_router             



# Initialise the API application
app = FastAPI(title=settings.PROJECT_NAME)

Base.metadata.create_all(bind=engine)

origins = ["http://localhost:5173", "http://localhost:3000", "http://10.121.78.134:5173","http://10.121.78.134:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Only allow the sites listed above
    allow_credentials=True,             # Allow cookies/tokens
    allow_methods=["*"],                # Allow all types: GET, POST, PUT, DELETE
    allow_headers=["*"],                # Allow all headers (Content-Type, Authorization, etc.)
    expose_headers=["Content-Disposition", "X-Cache"]  # Expose this header to the frontend for file downloads
)

@app.post("/")
def read_root():
    return {"status": "SoliasArt Backend is Active"}

# add routers for each module
app.include_router(art_upload_router)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])


app.include_router(ar_router, prefix="/ar", tags=["Augmented Reality"])

app.include_router(artist_router)
app.include_router(post_upload_router)
app.include_router(artist_profile_router)
app.include_router(artworks_router, prefix="/api/artworks", tags=["Artworks Gallery"])
app.include_router(cart_router, prefix="/api", tags=["Cart"])
app.include_router(art_search_router)
app.include_router(dashboard_router)




