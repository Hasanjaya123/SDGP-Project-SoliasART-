from app.core.database import Base
from sqlalchemy import Column, String, Text, UUID, text, ARRAY, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.modules.auth.models import User

# NOTE: The Artist model has been moved to app.modules.ArtistProfile.model
# to avoid SQLAlchemy MetaData conflicts (duplicate table 'artists' is not allowed).
# Import it from there in all other modules.