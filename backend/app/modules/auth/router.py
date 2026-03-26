from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth import models, schemas, utils
from app.modules.auth import dependencies
from jose import JWTError, jwt
from app.core.config import settings
from . import utils as email_utils  
from fastapi.responses import HTMLResponse
import os

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
    background_tasks.add_task(
    email_utils.send_verification_email, 
    new_user.email, 
    new_user.first_name, 
    verification_token
)

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
@router.get("/verify/{token}", response_class=HTMLResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
 
    def create_page(icon, title, message, color="#1F4E79"):

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{title}</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f4; margin: 0; }}
                .card {{ background: white; padding: 50px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; }}
                .icon {{ font-size: 60px; margin-bottom: 20px; }}
                h1 {{ color: {color}; margin-bottom: 10px; font-size: 28px; }}
                p {{ color: #555; margin-bottom: 30px; line-height: 1.6; }}
                .btn {{ display: inline-block; padding: 14px 30px; background-color: {color}; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; transition: background 0.3s; }}
                .btn:hover {{ opacity: 0.9; }}
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">{icon}</div>
                <h1>{title}</h1>
                <p>{message}</p>
                <a href="{frontend_url}/login" class="btn">Go to Login</a>
            </div>
        </body>
        </html>
        """

    #  Decode Token
    try:
        from app.core.config import settings 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return HTMLResponse(content=create_page("❌", "Invalid Token", "This verification link is invalid.", "#D32F2F"))
    except JWTError:
        return HTMLResponse(content=create_page("⚠️", "Link Expired", "This verification link has expired or is invalid.", "#D32F2F"))

    #  Find User
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return HTMLResponse(content=create_page("❓", "User Not Found", "We could not find a user associated with this link.", "#D32F2F"))

    #  Already Verified?
    if user.is_verified:
       
        return HTMLResponse(content=create_page(
            icon="✅", 
            title="Already Verified", 
            message="Your account is already active. You can log in anytime!",
            color="#1F4E79" 
        ))

    #  Mark as Verified
    user.is_verified = True
    db.commit()

    return HTMLResponse(content=create_page(
        icon="🎉", 
        title="Email Verified!", 
        message="Welcome to SoliasArt! Your account has been successfully activated.",
        color="#1F4E79" 
    ))
    
@router.get("/verify-role")
def verify_role(current_user: models.User = Depends(dependencies.get_current_user)):
    return {"role": current_user.role}