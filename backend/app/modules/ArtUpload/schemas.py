from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
from typing import Optional
from uuid import UUID
from form import as_form

# --- INPUT SCHEMA (Request) ---
@as_form  # <--- Apply the helper here
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

    # --- VALIDATORS (Clean the data automatically) ---

    @field_validator('year')
    @classmethod
    def parse_year(cls, v: str) -> int:
        if v.lower() == 'older':
            return 2020
        if v.isdigit():
            return int(v)
        raise ValueError("Year must be a number or 'older'")

    @field_validator('framing')
    @classmethod
    def parse_framing(cls, v: str) -> bool:
        # DB expects Boolean (is_framed)
        return v.lower() == 'framed'

    @field_validator('price', 'weight', 'height', 'width', 'depth')
    @classmethod
    def parse_numbers(cls, v: str) -> float:
        try:
            # Remove currency symbols or commas if present
            clean_v = v.replace(',', '').replace('LKR', '').strip()
            return float(clean_v) if clean_v else 0.0
        except ValueError:
            return 0.0

# --- OUTPUT SCHEMA (Response) ---
class ArtWorkResponse(BaseModel):
    id: UUID
    title: str
    description: str
    image_url: str
    price: float
    is_framed: bool
    
    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy objects