import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.modules.ArtistOnboarding.model import Artist
from app.modules.ArtUpload.model import ArtWork

# Association table for many-to-many relationship between Collections and Artworks
collection_artwork = Table(
    "collection_artwork",
    Base.metadata,
    Column("collection_id", UUID(as_uuid=True), ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True),
    Column("artwork_id", UUID(as_uuid=True), ForeignKey("artwork.id", ondelete="CASCADE"), primary_key=True),
)

class Collection(Base):
    __tablename__ = "collections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    artist = relationship("Artist")
    artworks = relationship("ArtWork", secondary=collection_artwork, backref="collections")
