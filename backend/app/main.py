from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD

from app.modules.auth.router import router as auth_router
from app.modules.artworks.routes import router as artworks_router
from app.modules.collections.routes import router as collections_router
from app.modules.ArtUpload.router import router as artupload_router
from app.modules.ArtistOnboarding.router import router as artist_onboarding_router
from app.modules.ArtistProfile.router import router as artist_profile_router

app = FastAPI(
    title="SoliasArt API",
    description="Backend API for the SoliasArt platform",
    version="1.0.0"
)
=======
from app.core.config import settings
from app.modules.ArtUpload.router import router as art_upload_router
from app.modules.auth.router import router as auth_router
from app.modules.ArtistProfile.router import router as artist_profile_router
from app.modules.ArtistOnboarding.router import router as artist_router
from app.modules.Artwork.router import router as artworks_router
from app.core.database import Base, engine

# Initialise the API application
app = FastAPI(title=settings.PROJECT_NAME)

Base.metadata.create_all(bind=engine)

origins = ["http://localhost:5173", "http://localhost:3000"]
>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
=======
    allow_origins=origins,              # Only allow the sites listed above
    allow_credentials=True,             # Allow cookies/tokens
    allow_methods=["*"],                # Allow all types: GET, POST, PUT, DELETE
    allow_headers=["*"],                # Allow all headers (Content-Type, Authorization, etc.)
>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
)

# Register routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(artworks_router)
app.include_router(collections_router)
app.include_router(artupload_router)
app.include_router(artist_onboarding_router)
app.include_router(artist_profile_router)

@app.get("/")
<<<<<<< HEAD
def root():
    return {"message": "SoliasArt API is running"}
=======
def read_root():
    return {"status": "SoliasArt Backend is Active"}

# add routers for each module
app.include_router(art_upload_router)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(artist_router)
app.include_router(artist_profile_router)
app.include_router(artworks_router, prefix="/api/artworks", tags=["Artworks Gallery"])


>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
