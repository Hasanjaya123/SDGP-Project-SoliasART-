from fastapi import HTTPException, APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from fastapi.concurrency import run_in_threadpool
from app.modules.ArtistOnboarding.schemas import ArtistUploadRequest
from app.modules.ArtistOnboarding.model import Artist
from app.core.image_kit import imagekit
from app.core.supabase import supabase


router = APIRouter(prefix="/user/settings", tags=["ConvertToArtist"])


@router.post("/convert/{user_id}")
async def convert_to_artist_profile(
    user_id: str,
    form_data: ArtistUploadRequest = Depends(ArtistUploadRequest),
    profile_image: UploadFile = File(...),
    identy_card: UploadFile = File(...),
    db: Session = Depends(get_db)
    ):

    try:

        profile_response = supabase.table('users').select('*').eq('id', user_id).execute()

        if (len(profile_response.data) == 0):
            raise HTTPException(status_code=404, detail="User not found")

        profile_image_content = await profile_image.read()

        profile_image_result = await run_in_threadpool(
            imagekit.files.upload,
            file=profile_image_content,
            file_name=profile_image.filename,
            folder="/Profile-Pictures",
            tags=["python-app"],
            is_private_file=False
        )

        identy_card_content = await identy_card.read()

        identy_card_result = await run_in_threadpool(
            imagekit.files.upload,
            file=identy_card_content,
            file_name=identy_card.filename,
            folder="/Identity-Documents",
            tags=["python-app"],
            is_private_file=False
        )

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
            profile_image_url=profile_image_result.url,
            identy_card_image_url=identy_card_result.url
        )

        db.add(new_artist_profile)
        db.commit()
        db.refresh(new_artist_profile)

        return new_artist_profile

    except Exception as e:
        db.rollback()
        print(f"Roll back: {e}")
        raise HTTPException(status_code=500, detail=str(e))