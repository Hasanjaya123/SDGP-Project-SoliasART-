from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user, get_current_artist
from app.modules.auth.models import User
from app.modules.Commission.model import Commission
from app.modules.Commission.schemas import CommissionCreate, CommissionResponse
from app.modules.Commission import utils as email_utils
from app.core.supabase import supabase


router = APIRouter()


# ──────────────────────────────────────────────
# POST /commissions/ — Buyer submits a request
# ──────────────────────────────────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_commission(
    payload: CommissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """A buyer creates a new commission request for an artist."""
    new_commission = Commission(
        artist_id=str(payload.artist_id),
        buyer_id=str(current_user.id),
        title=payload.title,
        description=payload.description,
        reference_image_url=payload.reference_image_url,
        medium=payload.medium,
        size_inches=payload.size_inches,
        proposed_budget=payload.proposed_budget,
        deadline=payload.deadline,
        status="pending",
    )

    db.add(new_commission)
    db.commit()
    db.refresh(new_commission)

    return {
        "message": "Commission request submitted successfully",
        "commission_id": str(new_commission.id),
    }


# ──────────────────────────────────────────────
# GET /commissions/artist — Artist views requests
# ──────────────────────────────────────────────
@router.get("/artist")
def get_artist_commissions(
    current_user: User = Depends(get_current_artist),
):
    """Fetch all pending commission requests for the logged-in artist."""
    try:
        user_id = str(current_user.id)

        # Look up the artist row for this user
        artist_res = supabase.table("artists").select("id, display_name").eq("user_id", user_id).execute()

        if not artist_res.data:
            raise HTTPException(status_code=404, detail="Artist profile not found")

        artist_id = str(artist_res.data[0]["id"])

        # Fetch commissions for this artist, join with users table for buyer info
        commissions_res = (
            supabase.table("commissions")
            .select("*, users(full_name, email)")
            .eq("artist_id", artist_id)
            .eq("status", "pending")
            .order("created_at", desc=True)
            .execute()
        )

        # Format the response
        results = []
        for row in commissions_res.data:
            buyer_info = row.pop("users", {}) or {}
            results.append({
                **row,
                "buyer_name": buyer_info.get("full_name", "Unknown"),
                "buyer_email": buyer_info.get("email", ""),
            })

        return {"commissions": results}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching commissions: {e}")
        raise HTTPException(status_code=500, detail="Could not load commission requests")


# ──────────────────────────────────────────────
# PATCH /commissions/{id}/accept — Artist accepts
# ──────────────────────────────────────────────
@router.patch("/{commission_id}/accept")
async def accept_commission(
    commission_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_artist),
    db: Session = Depends(get_db),
):
    """Artist accepts a commission — updates status and emails the buyer."""
    user_id = str(current_user.id)

    # Verify artist ownership
    artist_res = supabase.table("artists").select("id, display_name").eq("user_id", user_id).execute()
    if not artist_res.data:
        raise HTTPException(status_code=404, detail="Artist profile not found")

    artist_id = str(artist_res.data[0]["id"])
    artist_name = artist_res.data[0].get("display_name", "The Artist")

    # Fetch the commission
    commission = db.query(Commission).filter(
        Commission.id == commission_id,
        Commission.artist_id == artist_id,
    ).first()

    if not commission:
        raise HTTPException(status_code=404, detail="Commission not found")

    if commission.status != "pending":
        raise HTTPException(status_code=400, detail="Commission has already been processed")

    # Update status
    commission.status = "accepted"
    db.commit()

    # Get buyer info
    buyer = db.query(User).filter(User.id == commission.buyer_id).first()
    buyer_name = buyer.full_name or buyer.first_name if buyer else "Customer"
    buyer_email = buyer.email if buyer else None

    # Send notification email in background
    if buyer_email:
        commission_data = {
            "title": commission.title,
            "description": commission.description,
            "medium": commission.medium,
            "size_inches": commission.size_inches,
            "proposed_budget": commission.proposed_budget,
            "deadline": str(commission.deadline),
        }
        background_tasks.add_task(
            email_utils.send_commission_accepted_email,
            buyer_email, buyer_name, artist_name, commission_data,
        )

    return {"message": "Commission accepted. Buyer has been notified."}


# ──────────────────────────────────────────────
# PATCH /commissions/{id}/reject — Artist rejects
# ──────────────────────────────────────────────
@router.patch("/{commission_id}/reject")
async def reject_commission(
    commission_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_artist),
    db: Session = Depends(get_db),
):
    """Artist rejects a commission — emails the buyer and deletes the row."""
    user_id = str(current_user.id)

    # Verify artist ownership
    artist_res = supabase.table("artists").select("id, display_name").eq("user_id", user_id).execute()
    if not artist_res.data:
        raise HTTPException(status_code=404, detail="Artist profile not found")

    artist_id = str(artist_res.data[0]["id"])
    artist_name = artist_res.data[0].get("display_name", "The Artist")

    # Fetch the commission
    commission = db.query(Commission).filter(
        Commission.id == commission_id,
        Commission.artist_id == artist_id,
    ).first()

    if not commission:
        raise HTTPException(status_code=404, detail="Commission not found")

    if commission.status != "pending":
        raise HTTPException(status_code=400, detail="Commission has already been processed")

    # Capture data before deletion for the email
    buyer_id = commission.buyer_id
    commission_data = {
        "title": commission.title,
        "description": commission.description,
        "medium": commission.medium,
        "size_inches": commission.size_inches,
        "proposed_budget": commission.proposed_budget,
        "deadline": str(commission.deadline),
    }

    # Delete the commission row
    db.delete(commission)
    db.commit()

    # Get buyer info
    buyer = db.query(User).filter(User.id == buyer_id).first()
    buyer_name = buyer.full_name or buyer.first_name if buyer else "Customer"
    buyer_email = buyer.email if buyer else None

    # Send notification email in background
    if buyer_email:
        background_tasks.add_task(
            email_utils.send_commission_rejected_email,
            buyer_email, buyer_name, artist_name, commission_data,
        )

    return {"message": "Commission rejected. Buyer has been notified."}
