from pydantic import BaseModel, EmailStr
from uuid import UUID

# INPUT: What the user types to sign up
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    # NO role field here! They cannot choose.

# OUTPUT: What we send back after signup
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str  # We show them their role, but they didn't pick it.

    class Config:
        from_attributes = True