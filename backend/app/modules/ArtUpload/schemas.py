from pydantic import BaseModel, Field, validator
from decimal import Decimal
from typing import Optional
from uuid import UUID
from app.modules.ArtUpload.form import as_form

# --- INPUT SCHEMA (Request) ---
@as_form
class ArtUploadRequest(BaseModel):
    title: str
    description: str
    medium: str
    year: str      # Frontend sends "2024", "2023", "older"
    framing: str   # Frontend sends "framed", "unframed"
    
    # Dimensions & Price come as strings from FormData
    price: str
    weight: str
    height: str
    width: str
    depth: str
    
    origin: str = "Colombo, Sri Lanka"
    shippingRate: str = "standard"

    # -------- VALIDATORS (Pydantic v1 style) --------

    @validator('year')
    def parse_year(cls, v):
        if v.lower() == 'older':
            return 2020
        if v.isdigit():
            return int(v)
        raise ValueError("Year must be a number or 'older'")

    @validator('framing')
    def parse_framing(cls, v):
        # DB expects Boolean (is_framed)
        return v.lower() == 'framed'

    @validator('price', 'weight', 'height', 'width', 'depth')
    def parse_numbers(cls, v):
        try:
            clean_v = v.replace(',', '').replace('LKR', '').strip()
            return float(clean_v) if clean_v else 0.0
        except Exception:
            return 0.0


# --- OUTPUT SCHEMA (Response) ---
class ArtWorkResponse(BaseModel):
    id: UUID
    title: str
    description: str
    image_url: list[str]
    price: float
    is_framed: bool
    
    class Config:
        orm_mode = True   # ✅ Pydantic v1 uses this (NOT from_attributes)