from pydantic import BaseModel, EmailStr
from uuid import UUID

# INPUT: What the user types to sign up
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

# OUTPUT: What we send back after signup
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str 

# INPUT: What the user types to login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

#Token
class Token(BaseModel):
    access_token: str
    token_type: str

# Allow read data from a class object
    class Config:
        from_attributes = True