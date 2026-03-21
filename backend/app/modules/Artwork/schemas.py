from pydantic import BaseModel

class LikeRequest(BaseModel):
    user_id: str
