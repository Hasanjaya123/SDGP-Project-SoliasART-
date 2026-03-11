from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.ArtUpload.router import router as art_upload_router
from app.modules.auth.router import router as auth_router
from app.modules.ArtistProfile.router import router as artist_profile_router
from app.modules.ArtistOnboarding.router import router as artist_router
from app.modules.ArtSearch.router import router as art_search_router
from app.modules.Artwork.router import router as artworks_router
from app.core.database import Base, engine
from app.modules.PostUpload.router import router as post_upload_router


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

@app.get("/")
def read_root():
    return {"status": "SoliasArt Backend is Active"}

# add routers for each module
app.include_router(art_upload_router)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(artist_router)
app.include_router(post_upload_router)
app.include_router(artist_profile_router)
app.include_router(art_search_router)
app.include_router(artworks_router, prefix="/api/artworks", tags=["Artworks Gallery"])



