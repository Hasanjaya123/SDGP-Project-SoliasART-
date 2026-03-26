from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import settings


# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    # Create JWT Token
    to_encode = data.copy()

    # Token expiry
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

# Function to send verification email

# Load environment variables from .env file
load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_verification_email(email: EmailStr, first_name: str, token: str):
    base_url = os.getenv("VITE_BACKEND_URL", "http://localhost:8000")
    url = f"{base_url}/auth/verify/{token}"

    logo_url = "https://ik.imagekit.io/sjunnxn6x/Public/soliasartlogo.png"

    # email template
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
            
            .header {{ 
                background: linear-gradient(135deg, #1F4E79 0%, #E5B648 100%); 
                padding: 40px 20px; 
                text-align: center; 
            }}
            
            .logo-container {{
                background-color: white;
                padding: 15px 25px;       
                border-radius: 10px;     
                display: inline-block;   
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            }}
            
            .logo-container img {{
                height: 50px;             
                width: auto;             
                display: block;
            }}

            .content {{ padding: 40px 30px; color: #333333; line-height: 1.6; text-align: center; }}
            
            h2 {{ color: #1F4E79; margin-top: 0; }} 
            
            .btn {{ 
                display: inline-block; 
                padding: 14px 30px; 
                background-color: #1F4E79; 
                color: #ffffff !important; 
                text-decoration: none; 
                border-radius: 50px; 
                font-weight: bold; 
                font-size: 16px;
                margin-top: 20px; 
                box-shadow: 0 4px 6px rgba(31, 78, 121, 0.3);
                transition: background-color 0.3s;
            }}
            
            .btn:hover {{ background-color: #163a5c; }} /* Slightly darker on hover */
            
            .footer {{ background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888888; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="{logo_url}" alt="SoliasArt Logo">
                </div>
            </div>
            <div class="content">
                <h2>Welcome, {first_name}! 🎨</h2>
                <p>Thank you for joining SoliasArt. We are thrilled to have you as part of our creative community.</p>
                <p>To start sharing your art, please verify your email address.</p>
                
                <a href="{url}" class="btn">Verify Account</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 SoliasArt Team. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Verify your SoliasArt Account",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    return encoded_jwt


# ✅ TEMP: Disable email sending (to avoid dependency errors)
async def send_verification_email(email: str, first_name: str, token: str):
    print("Email sending disabled (TEMP)")
    print(f"User: {first_name}, Email: {email}, Token: {token}")