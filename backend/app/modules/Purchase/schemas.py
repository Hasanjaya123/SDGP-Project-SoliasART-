from pydantic import BaseModel
from typing import List

# for adding items to cart
class CartItemAdd(BaseModel):
    artwork_id: str

class CartBatchAdd(BaseModel):
    artwork_ids: List[str]

class CartItemResponse(BaseModel):
    id: str
    user_id: str
    artwork_id: str
    title: str 
    artist: str
    price: float
    image_url: str
    status: str