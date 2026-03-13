from sqlalchemy import Column, ForeignKey, String, Text, TIMESTAMP, Integer, text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.core.database import Base

class Post(Base):
    __tablename__ = "post"

    id          = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at  = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    title       = Column(String, nullable=True)         
    description = Column(Text, nullable=False)
    image_url   = Column(ARRAY(String), nullable=False)  
    likes       = Column(Integer, server_default=text("0"), default=0)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)