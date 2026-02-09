from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth import models, schemas, utils
from app.modules.auth import dependencies
from jose import JWTError, jwt
from app.core.config import settings
from . import utils as email_utils  
from app.core.config import settings

router = APIRouter()

# Endpoint to create a new user (Sign Up)
@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    
    # Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash Password
    hashed_pwd = utils.hash_password(user.password)
    
    # Create User
    new_user = models.User(
        email=user.email,
        password_hash=hashed_pwd,
        first_name=user.first_name,
        last_name=user.last_name,
        full_name=f"{user.first_name} {user.last_name}"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate a token for email verification
    verification_token = utils.create_access_token(data={"sub": str(new_user.id), "type": "email_verification"})
    # Send verification email in the background
    background_tasks.add_task(utils.send_verification_email, email=new_user.email, token=verification_token)

    return new_user

# Endpoint to login user
@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):

    #query to find the suer by email
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    #check if user exists and verify password
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    if not utils.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    #check if email is verified
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please check your email.")
    
    #create token
    access_token = utils.create_access_token(
        data={"sub": str(user.id),
              "role": user.role
              }
    )

    return {
        "access_token": access_token,
          "token_type": "bearer"
    }

#Get current user profile
@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(dependencies.get_current_user)):
    return current_user

#endpoint to verify email
@router.get("/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Find the user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "Account already verified"}

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully! You can now login."}
