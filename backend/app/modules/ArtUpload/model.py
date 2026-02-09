from collections.abc import AsyncGenerator
import uuid
from sqlalchemy import Column, String, Text, DateTime, Integer, Numeric, TIMESTAMP, text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime,timezone
from pgvector.sqlalchemy import Vector
from app.core.database import Base


class ArtWork(Base):
    
     __tablename__ = "artwork"
     
     id = Column(UUID(as_uuid=True),primary_key=True, server_default=text("gen_random_uuid()"))
     create_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
     
     title = Column(String, nullable=True)
     description = Column(Text, nullable=False)
     year_created = Column(Integer, nullable=False)
     medium = Column(String, nullable=False)
     
     price = Column(Numeric(10,2), nullable=False)
     weight_kg = Column(Numeric(5,2), nullable=False)
     
     width_in = Column(Numeric(5,2), nullable=False)
     height_in = Column(Numeric(5,2), nullable=False)
     depth_in = Column(Numeric(5,2), nullable=False)
     is_framed = Column(Boolean, server_default=text("false"), default=False)
     
     image_url = Column(Text, nullable=False)
     embedding = Column(Vector(512))
     artist_id = Column(UUID(as_uuid=True), ForeignKey("auth.users.id"))