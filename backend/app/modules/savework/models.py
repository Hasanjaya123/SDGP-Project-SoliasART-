import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

# Model for user saved artworks
class UserSave(Base):
    __tablename__ = "user_saves"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True) 
    artwork_id = Column(UUID(as_uuid=True), ForeignKey("artwork.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())