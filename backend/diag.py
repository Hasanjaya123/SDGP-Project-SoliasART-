from app.core.config import settings
import os
from dotenv import load_dotenv

print(f"settings.DATABASE_URL = {repr(settings.DATABASE_URL)}")
print(f"os.getenv('DATABASE_URL') = {repr(os.getenv('DATABASE_URL'))}")
print(f"Current CWD = {repr(os.getcwd())}")

# Try to find .env file
if os.path.exists(".env"):
    print("found .env in CWD")
else:
    print(".env NOT found in CWD")
