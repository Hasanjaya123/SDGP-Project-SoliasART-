from app.core.database import Base
from sqlalchemy import Column, String, Text, UUID, text, ARRAY, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func




class Follow(Base):
    __tablename__ = "follows"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())