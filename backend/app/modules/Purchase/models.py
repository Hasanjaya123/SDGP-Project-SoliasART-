from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class CartItem(Base):
    
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)  
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  
    artwork_id = Column(UUID(as_uuid=True), ForeignKey("artwork.id", ondelete="CASCADE"), nullable=False)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint('user_id', 'artwork_id', name='uq_user_cart_artwork'),)

    artwork = relationship("ArtWork") 