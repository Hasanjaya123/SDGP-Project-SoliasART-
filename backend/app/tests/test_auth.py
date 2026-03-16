import pytest
from jose import jwt
from fastapi import HTTPException
from app.modules.auth.dependencies import get_current_user
from app.core.config import settings
from app.modules.auth import utils
from unittest.mock import MagicMock

# Test token encoding and decoding logic
def test_decode_valid_token():
    payload = {"sub": "test-user", "role": "buyer"}
    
    # Token Encoding
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    # Decoding the token
    decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    
    # Assertions
    assert decoded_payload.get("sub") == "test-user"
    assert decoded_payload.get("role") == "buyer"

# Test decoding an expired token
def test_decode_expired_token():
    # Create an expired payload
    payload = {"sub": "test-user-123", "exp": 1000000000} 
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    with pytest.raises(Exception): # JWTError or HTTPException
        jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

# Test get_current_user function
def test_get_current_user():
    user_data = {"sub": "test-user", "role": "buyer"}
    
    # Encode with create_access_token function
    token = utils.create_access_token(data=user_data)

    # Create a fake user
    mock_user = MagicMock()
    mock_user.id = "test-user"
    mock_user.role = "buyer"
    
    # Create a mock DB session that returns the fake user when queried
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user

    result = get_current_user(token=token, db=mock_db)
    
    # Assertions
    assert result.id == "test-user"
    assert result.role == "buyer"

# Test get_current_user with a token that has a user not in the database
def test_get_current_user_not_in_db():
    payload = {"sub": "ghost-user", "role": "buyer"}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as excinfo:
        get_current_user(token=token, db=mock_db)
    
    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Could not validate credentials"    
