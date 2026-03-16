import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.modules.Purchase.router import add_to_cart, get_user_cart, remove_from_cart
from app.modules.Purchase.schemas import CartItemAdd
from sqlalchemy.exc import IntegrityError

# Test adding items to cart 
def test_add_to_cart_logic():
    # Create mock database session and artwork
    mock_db = MagicMock()
    mock_artwork = MagicMock()
    
    mock_artwork.status = "available"
    mock_db.query.return_value.filter.return_value.first.return_value = mock_artwork
    
    # Mock Request Data
    cart_request = CartItemAdd(user_id="user-123", artwork_id="art-456")
    
    # Execute function
    response = add_to_cart(cart_request=cart_request, db=mock_db)
    
    assert response["message"] == "Artwork added to cart successfully!"
    assert mock_db.add.called
    assert mock_db.commit.called

# Test removing items from cart
def test_remove_from_cart_logic():
    """Section 2.5: Unit Test - Remove Item Logic"""
    mock_db = MagicMock()
    
    # Mock finding the item
    mock_cart_item = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    
    response = remove_from_cart(cart_item_id="cart-uuid-001", db=mock_db)
    
    assert response["message"] == "Item successfully removed from cart."
    assert mock_db.delete.called
    assert mock_db.commit.called    

# Test adding a sold artwork 
def test_add_sold_artwork_fails():
    mock_db = MagicMock()
    
    # Set mock artwork as sold
    mock_artwork = MagicMock()
    mock_artwork.status = "sold"
    mock_db.query.return_value.filter.return_value.first.return_value = mock_artwork
    
    cart_request = CartItemAdd(user_id="user-123", artwork_id="art-456")
    
    with pytest.raises(HTTPException) as excinfo:
        add_to_cart(cart_request=cart_request, db=mock_db)
    
    assert excinfo.value.status_code == 400
    assert "already been sold" in excinfo.value.detail


# Test adding the same item twice
def test_add_duplicate_item_fails():
    mock_db = MagicMock()
    
    # Mock artwork as available
    mock_artwork = MagicMock()
    mock_artwork.status = "available"
    mock_db.query.return_value.filter.return_value.first.return_value = mock_artwork
    
    # Force the db.add to raise an IntegrityError to simulate duplicate entry
    mock_db.add.side_effect = IntegrityError("duplicate", params={}, orig=None)
    
    cart_request = CartItemAdd(user_id="user-123", artwork_id="art-456")
    
    with pytest.raises(HTTPException) as excinfo:
        add_to_cart(cart_request=cart_request, db=mock_db)
    
    assert excinfo.value.status_code == 400
    assert "already in your cart" in excinfo.value.detail   