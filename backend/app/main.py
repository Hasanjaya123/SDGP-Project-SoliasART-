from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.router import router as auth_router
from app.modules.ArtUpload.router import router as artupload_router
from app.modules.ArtistOnboarding.router import router as artist_onboarding_router
from app.modules.ArtistProfile.router import router as artist_profile_router
from app.modules.Artwork.router import router as artwork_detail_router
from app.core.database import Base, engine

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SoliasArt API",
    description="Backend API for the SoliasArt platform",
    version="1.0.0"
)

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(artupload_router)
app.include_router(artist_onboarding_router)
app.include_router(artist_profile_router)
app.include_router(artwork_detail_router, prefix="/api/artworks", tags=["Artwork Detail"])

@app.get("/")
def root():
    return {"message": "SoliasArt API is running"}
