from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth import models, schemas, utils
from app.modules.auth import dependencies

router = APIRouter()

# Endpoint to create a new user (Sign Up)
@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
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

    return new_user

# Endpoint to login user
@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):

    #query to find the suer by email
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    #check if user exists and verify password
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    #create token
    if not utils.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
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
