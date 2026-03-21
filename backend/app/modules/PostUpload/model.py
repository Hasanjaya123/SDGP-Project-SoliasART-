from sqlalchemy import Column, String, Text, TIMESTAMP, text, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from pgvector.sqlalchemy import Vector

class Post(Base):

    __tablename__ = "post"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"),
    )

    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(ARRAY(String), nullable=False, default=list)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)
    likes = Column(String, nullable=False, server_default=text("'0'"))
    embedding = Column(Vector(512))
