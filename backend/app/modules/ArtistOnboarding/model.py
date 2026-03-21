from app.core.database import Base
from sqlalchemy import Column, String, Text, UUID, text, ARRAY, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.modules.auth.models import User


class Artist(Base):
    
    __tablename__ = "artists"
    
    id = Column(UUID(as_uuid=True),primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_artist = Column(Boolean, nullable=False, default=False)
    display_name = Column(String, nullable=False)
    artist_bio = Column(Text, nullable=False)
    other_social_media_username = Column(String, nullable=True)
    other_social_nedia_link = Column(String, nullable=True)
    primary_medium = Column(String, nullable=False)
    artistic_styles = Column(ARRAY(String), nullable=False)
    years_experience = Column(String, nullable=True)
    legal_name = Column(String,nullable=False)
    bank_name = Column(String, nullable=False)
    branch_name = Column(String, nullable=False)
    account_number  = Column(String, nullable=False)
    dispatch_address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    agreed_to_terms = Column(Boolean, nullable=False, default=False)
    profile_image_url = Column(String, nullable=True, default="https://shorturl.at/3ywNl")
    identy_card_image_url = Column(String, nullable=False)
    followers = Column(String, nullable=True, default="0")
 