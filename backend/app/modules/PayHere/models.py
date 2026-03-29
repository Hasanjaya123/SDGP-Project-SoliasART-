import uuid
from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class SoldArtwork(Base):
    __tablename__ = "sold_artworks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    order_id = Column(String, nullable=False, index=True)
    artwork_id = Column(UUID(as_uuid=True), ForeignKey("artwork.id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id", ondelete="SET NULL"), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    payment_id = Column(String, nullable=True)
    sold_at = Column(DateTime(timezone=True), server_default=func.now())

    artwork = relationship("ArtWork")
    buyer = relationship("User")
