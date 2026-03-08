import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class UserLike(Base):
    __tablename__ = "user_likes"
    
    id = Column(String, primary_key=True,default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False) 
    artwork_id = Column(UUID(as_uuid=True), ForeignKey("artwork.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())