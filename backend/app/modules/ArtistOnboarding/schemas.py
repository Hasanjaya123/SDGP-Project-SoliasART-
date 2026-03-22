from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from app.modules.ArtistOnboarding.form import as_form


@as_form
class ArtistUploadRequest(BaseModel):
    verified_artist: bool = False

    display_name: str
    artist_bio: str

    other_social_media_username: Optional[str] = None
    other_social_nedia_link: Optional[str] = None

    primary_medium: str
    artistic_styles: List[str]

    years_experience: int

    legal_name: str
    bank_name: str
    branch_name: str
    account_number: str

    dispatch_address: str
    phone: str

    agreed_to_terms: bool

    # -------- VALIDATORS -------- #

    @field_validator('years_experience')
    @classmethod
    def validate_years(cls, v):
        if v < 0:
            return 0
        return v

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        return v.strip()