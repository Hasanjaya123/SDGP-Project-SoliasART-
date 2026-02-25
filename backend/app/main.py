from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.collections.routes import router as collections_router

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

@app.get("/")
def read_root():
    return {"status": "SoliasArt Backend is Active"}