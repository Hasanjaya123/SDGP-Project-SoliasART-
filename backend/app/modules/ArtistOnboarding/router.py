from fastapi import HTTPException, APIRouter, Depends, File, UploadFile
from app.modules.auth.models import User
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.ArtistOnboarding.schemas import ArtistUploadRequest
from app.modules.ArtistProfile.model import Artist
from app.core.image_kit import imagekit
from app.core.supabase import supabase
from app.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/user/settings", tags=["ConvertToArtist"])


@router.post("/convert")
async def convert_to_artist_profile(
    current_user: User = Depends(get_current_user),
    form_data: ArtistUploadRequest = Depends(ArtistUploadRequest),
    profile_image: UploadFile = File(...),
    identy_card: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    try:
        user_id = str(current_user.id)

        # ✅ TEMP: Skip Supabase check
        # Assume user is not already an artist

        # ✅ TEMP: Skip image uploads
        await profile_image.read()
        await identy_card.read()

        profile_image_url = "https://via.placeholder.com/300"
        identy_card_image_url = "https://via.placeholder.com/300"

        # ✅ Create artist profile
        new_artist_profile = Artist(
            user_id=user_id,
            verified_artist=form_data.verified_artist,
            display_name=form_data.display_name,
            artist_bio=form_data.artist_bio,
            other_social_media_username=form_data.other_social_media_username,
            other_social_nedia_link=form_data.other_social_nedia_link,
            primary_medium=form_data.primary_medium,
            artistic_styles=form_data.artistic_styles,
            years_experience=form_data.years_experience,
            legal_name=form_data.legal_name,
            bank_name=form_data.bank_name,
            branch_name=form_data.branch_name,
            account_number=form_data.account_number,
            dispatch_address=form_data.dispatch_address,
            phone=form_data.phone,
            agreed_to_terms=form_data.agreed_to_terms,
            profile_image_url=profile_image_url,
            identy_card_image_url=identy_card_image_url
        )

        db.add(new_artist_profile)
        db.commit()
        db.refresh(new_artist_profile)

        return new_artist_profile

    except Exception as e:
        db.rollback()
        print(f"Rollback error: {e}")
        raise HTTPException(status_code=500, detail=str(e))