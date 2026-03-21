from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from uuid import UUID


class CommissionCreate(BaseModel):
    """Schema for submitting a new commission request."""
    artist_id: UUID
    title: str
    description: str
    reference_image_url: Optional[str] = None
    medium: str
    size_inches: str
    proposed_budget: float
    deadline: date


class CommissionResponse(BaseModel):
    """Schema for returning commission data."""
    id: UUID
    artist_id: UUID
    buyer_id: UUID
    title: str
    description: str
    reference_image_url: Optional[str] = None
    medium: str
    size_inches: str
    proposed_budget: float
    deadline: date
    status: str
    created_at: datetime
    # Joined fields
    buyer_name: Optional[str] = None
    buyer_email: Optional[str] = None

    class Config:
        from_attributes = True
