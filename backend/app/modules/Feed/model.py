from sqlalchemy import Column, String, Text, TIMESTAMP, text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

#To track user likes
class FeedLike(Base):
    __tablename__ = "feed_likes"

    id          = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at  = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    user_id     = Column(UUID(as_uuid=True), nullable=False)
    target_id   = Column(UUID(as_uuid=True), nullable=False)
    target_type = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "target_id", "target_type", name="unique_user_feed_like"),
    )

# To track user comments
class FeedComment(Base):
    __tablename__ = "feed_comments"

    id          = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at  = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    user_id     = Column(UUID(as_uuid=True), nullable=False)
    target_id   = Column(UUID(as_uuid=True), nullable=False)
    target_type = Column(String, nullable=False)
    content     = Column(Text, nullable=False)

# To save a feed item
class FeedSave(Base):
    __tablename__ = "feed_saves"

    id          = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at  = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    user_id     = Column(UUID(as_uuid=True), nullable=False)
    target_id   = Column(UUID(as_uuid=True), nullable=False)
    target_type = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "target_id", "target_type", name="unique_user_feed_save"),
    )

# To track user views
class FeedInteraction(Base):
    __tablename__ = "feed_interactions"

    id          = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at  = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    user_id     = Column(UUID(as_uuid=True), nullable=False)
    target_id   = Column(UUID(as_uuid=True), nullable=False)
    target_type = Column(String, nullable=False)
    event_type  = Column(String, nullable=False)