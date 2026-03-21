from pydantic import BaseModel, Field, validator
from decimal import Decimal
from typing import Optional
from uuid import UUID
from app.modules.ArtUpload.form import as_form


@as_form 
class ArtUploadRequest(BaseModel):
    title: str
    description: str
    medium: str
    year: str      
    framing: str   
    
   
    price: str
    weight: str
    height: str
    width: str
    depth: str
    
    origin: str = "Colombo, Sri Lanka"
    shippingRate: str = "standard"

    #VALIDATORS - Cleans the data automatically
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
        return v.lower() == 'framed'

    @validator('price', 'weight', 'height', 'width', 'depth')
    def parse_numbers(cls, v):
        try:
            clean_v = v.replace(',', '').replace('LKR', '').strip()
            return float(clean_v) if clean_v else 0.0
        except Exception:
            return 0.0


class ArtWorkResponse(BaseModel):
    id: UUID
    title: str
    description: str
    image_url: list[str]
    price: float
    is_framed: bool
    
    class Config:
        from_attributes = True 
