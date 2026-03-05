from pydantic import BaseModel

class ArtistUploadRequest(BaseModel):
    
    verified_artist:bool = False
    display_name: str
    artist_bio: str
    other_social_media_username: str
    other_social_nedia_link: str
    primary_medium: str
    artistic_styles: list[str]
    years_experience: str
    legal_name: str
    bank_name: str
    branch_name: str
    account_number: str
    dispatch_address: str
    phone: str
    agreed_to_terms: bool = False
    