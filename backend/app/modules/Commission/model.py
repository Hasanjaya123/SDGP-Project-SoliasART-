from app.core.database import Base
from sqlalchemy import Column, String, Text, Float, Date, DateTime, UUID, text, ForeignKey
from sqlalchemy.sql import func


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    reference_image_url = Column(String, nullable=True)
    medium = Column(String, nullable=False)
    size_inches = Column(String, nullable=False)
    proposed_budget = Column(Float, nullable=False)
    deadline = Column(Date, nullable=False)

    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
