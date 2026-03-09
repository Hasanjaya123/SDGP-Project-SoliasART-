from fastapi import APIRouter
from typing import List
from uuid import UUID

from app.modules.collections import schemas, services

router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)

@router.get("/", response_model=List[schemas.CollectionResponse])
def get_collections():
    """
    Get all curated collections to display on the main collections page.
    """
    return services.get_all_collections()

@router.get("/{collection_id}", response_model=schemas.CollectionDetailResponse)
def get_collection(collection_id: UUID):
    """
    Get detailed information about a specific collection, including all its artworks.
    """
    return services.get_collection_by_id(collection_id)

@router.post("/", response_model=schemas.CollectionResponse)
def create_collection(collection_in: schemas.CollectionCreate):
    """
    Create a new curated collection.
    """
    return services.create_collection(collection_in)

@router.post("/{collection_id}/buy")
def buy_collection(collection_id: UUID, user_id: UUID): 
    """
    Process the purchase of an entire collection. 
    Accepts user_id manually for now pending auth integration.
    """
    return services.process_collection_purchase(collection_id, user_id)
