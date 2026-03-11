from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.modules.ArtUpload.model import ArtWork
from app.core.database import get_db
from app.modules.Purchase.schemas import CartItemAdd
from app.modules.Purchase.models import CartItem

# Setup router
router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/add")
def add_to_cart(cart_request: CartItemAdd, db: Session = Depends(get_db)):
    # Check if the artwork exists and is available
    artwork = db.query(ArtWork).filter(ArtWork.id == cart_request.artwork_id).first()
    
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found.")
    
    if str(artwork.status).lower() == "sold":
        raise HTTPException(status_code=400, detail="Sorry, this artwork has already been sold.")

    # Create the new cart item
    new_cart_item =CartItem(
        user_id=cart_request.user_id,
        artwork_id=cart_request.artwork_id
    )
    
    try:
        db.add(new_cart_item)
        db.commit()
        db.refresh(new_cart_item)
        return {"message": "Artwork added to cart successfully!"}
    
    except IntegrityError:
        # if already added
        db.rollback() 
        raise HTTPException(status_code=400, detail="This item is already in your cart.")

@router.get("/{user_id}")
def get_user_cart(user_id: str, db: Session = Depends(get_db)):
    # Fetch all cart items for this user
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    response_data = []
    for item in cart_items:
        thumbnail = item.artwork.image_url[0] if item.artwork.image_url else ""
        
        response_data.append({
            "id": str(item.id),           
            "user_id": str(item.user_id),
            "artwork_id": str(item.artwork_id),
            "title": item.artwork.title,
            "artist": item.artwork.artist.display_name if item.artwork.artist else "Unknown Artist",  
            "price": float(item.artwork.price),
            "imageUrl": thumbnail,
            "status": item.artwork.status
        })
        
    return response_data

@router.delete("/remove/{cart_item_id}")
def remove_from_cart(cart_item_id: str, db: Session = Depends(get_db)):
    # Find the specific cart item
    cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart.")
        
    # Delete it and save
    db.delete(cart_item)
    db.commit()
    
    return {"message": "Item successfully removed from cart."}