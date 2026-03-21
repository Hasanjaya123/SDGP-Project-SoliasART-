import uuid
from fastapi import APIRouter, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.payhere import generate_payhere_hash, verify_payhere_notification
from app.modules.ArtUpload.model import ArtWork
from app.modules.Purchase.models import CartItem
from app.modules.PayHere.models import SoldArtwork
from app.modules.PayHere.schemas import PaymentInitiateRequest, PaymentInitiateResponse
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import User

router = APIRouter()


@router.post("/initiate", response_model=PaymentInitiateResponse)
def initiate_payment(
    payload: PaymentInitiateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate the PayHere payment payload for the frontend to open the checkout modal.
    """
    if not payload.artwork_ids:
        raise HTTPException(status_code=400, detail="No artworks selected for purchase.")

    # Fetch artworks from DB and validate
    artworks = db.query(ArtWork).filter(ArtWork.id.in_(payload.artwork_ids)).all()

    if len(artworks) != len(payload.artwork_ids):
        raise HTTPException(status_code=404, detail="One or more artworks not found.")

    # Checking none are already sold
    for art in artworks:
        if str(art.status).lower() == "sold":
            raise HTTPException(status_code=400,detail=f"Artwork '{art.title}' has already been sold.",)

    # Calculate total from DB prices
    total = sum(float(art.price) for art in artworks)
    amount_formatted = f"{total:.2f}"

    # Generate unique order ID  (store buyer_id so we can look it up in notify)
    order_id = f"{current_user.id}__{uuid.uuid4().hex[:12]}"

    # Build item description
    item_titles = ", ".join(art.title or "Artwork" for art in artworks)
    items_desc = item_titles[:127] if len(item_titles) > 127 else item_titles

    # Generate PayHere hash
    pay_hash = generate_payhere_hash(
        order_id=order_id,
        amount=amount_formatted,
        currency="LKR",
    )

    # Build the full payment payload
    return PaymentInitiateResponse(
        merchant_id=settings.PAYHERE_MERCHANT_ID,
        return_url="http://localhost:5173/cart?payment=success",
        cancel_url="http://localhost:5173/cart?payment=cancelled",
        notify_url="http://localhost:8000/payhere/notify",
        order_id=order_id,
        items=items_desc,
        currency="LKR",
        amount=amount_formatted,
        first_name=current_user.first_name or "",
        last_name=current_user.last_name or "",
        email=current_user.email or "",
        phone="",
        address="",
        city="",
        country="Sri Lanka",
        hash=pay_hash,
    )


@router.post("/notify")
async def payhere_notify(
    merchant_id: str = Form(...),
    order_id: str = Form(...),
    payment_id: str = Form(...),
    payhere_amount: str = Form(...),
    payhere_currency: str = Form(...),
    status_code: str = Form(...),
    md5sig: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    PayHere server-to-server IPN (Instant Payment Notification) callback.
    This is called by PayHere's servers, NOT by the frontend.
    """
    # Verifying the MD5 signature
    is_valid = verify_payhere_notification(
        merchant_id=merchant_id,
        order_id=order_id,
        payhere_amount=payhere_amount,
        payhere_currency=payhere_currency,
        status_code=status_code,
        md5sig=md5sig,
    )

    if not is_valid:
        raise HTTPException(status_code=403, detail="Invalid payment signature.")

    # Status code 2 = success )
    if status_code != "2":
        return {"status": "ignored", "detail": f"Payment status {status_code} is not successful."}

    # Extract buyer_id from order_id  
    try:
        buyer_id_str = order_id.split("__")[0]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order_id format.")

    # Get the buyer's cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == buyer_id_str).all()

    if not cart_items:
        return {"status": "warning", "detail": "No cart items found for this buyer."}

    # Process each cart item
    for cart_item in cart_items:
        artwork = db.query(ArtWork).filter(ArtWork.id == cart_item.artwork_id).first()

        if not artwork:
            continue

        # Update artwork status to "Sold"
        artwork.status = "Sold"

        # Create sold artwork record
        sold_record = SoldArtwork(
            order_id=order_id,
            artwork_id=artwork.id,
            buyer_id=cart_item.user_id,
            artist_id=artwork.artist_id,
            price=artwork.price,
            payment_id=payment_id,
        )
        db.add(sold_record)

        # Remove from cart
        db.delete(cart_item)

    db.commit()

    return {"status": "success", "detail": "Payment processed and artworks marked as sold."}


@router.post("/confirm")
def confirm_payment(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    order_id = payload.get("order_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="order_id is required.")

    # Prevent duplicate processing checking if this order was already recorded
    existing = db.query(SoldArtwork).filter(SoldArtwork.order_id == order_id).first()
    if existing:
        return {"status": "already_processed", "detail": "This order has already been processed."}

    # Get the buyer's cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()

    if not cart_items:
        return {"status": "warning", "detail": "No cart items found."}

    # Process each cart item
    for cart_item in cart_items:
        artwork = db.query(ArtWork).filter(ArtWork.id == cart_item.artwork_id).first()

        if not artwork:
            continue

        # Update artwork status to "Sold"
        artwork.status = "Sold"

        # Create sold artwork record
        sold_record = SoldArtwork(
            order_id=order_id,
            artwork_id=artwork.id,
            buyer_id=cart_item.user_id,
            artist_id=artwork.artist_id,
            price=artwork.price,
            payment_id=None,  
        )
        db.add(sold_record)

        # Remove from cart
        db.delete(cart_item)

    db.commit()

    return {"status": "success", "detail": "Payment confirmed and artworks marked as Sold."}
