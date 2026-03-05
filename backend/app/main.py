from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.core.config import settings
from app.modules.collections.routes import router as collections_router
from app.modules.artworks.routes import router as artworks_router

app = FastAPI(title=settings.PROJECT_NAME)

origins = ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(collections_router, prefix=settings.API_V1_STR)
app.include_router(artworks_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"status": "SoliasArt Backend is Active"}

# Serve Frontend
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="static")

    @app.get("/{rest_of_path:path}")
    async def serve_frontend(rest_of_path: str):
        return FileResponse(os.path.join(frontend_path, "index.html"))
