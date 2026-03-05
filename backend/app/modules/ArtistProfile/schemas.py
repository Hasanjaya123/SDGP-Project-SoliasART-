from fastapi import Form
from dataclasses import dataclass
from typing import List


@dataclass
class ArtistUploadRequest:
    verified_artist: bool = Form(False)
    display_name: str = Form(...)
    artist_bio: str = Form(...)
    other_social_media_username: str = Form("")
    other_social_nedia_link: str = Form("")
    primary_medium: str = Form(...)
    artistic_styles: List[str] = Form(...)
    years_experience: str = Form(...)
    legal_name: str = Form(...)
    bank_name: str = Form(...)
    branch_name: str = Form(...)
    account_number: str = Form(...)
    dispatch_address: str = Form(...)
    phone: str = Form(...)
    agreed_to_terms: bool = Form(False)
    