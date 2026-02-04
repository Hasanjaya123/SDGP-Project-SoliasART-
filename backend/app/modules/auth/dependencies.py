from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi import Depends
from app.core.database import get_db
from fastapi import HTTPException, status
from app.core.config import settings
from jose import JWTError, jwt
from app.modules.auth import models

#points to the "auth/login" endpoint for token retrieval
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        #decode the JWT token 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        #Extract the User ID ("sub") from the payload
        user_id : str = payload.get("sub")

        if user_id is None:
            raise credentials_exception
        
    except JWTError:
        #if the token is invalid or expired
        raise credentials_exception    
    
    #Find the user in the database
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if user is None:
        raise credentials_exception
    
    return user