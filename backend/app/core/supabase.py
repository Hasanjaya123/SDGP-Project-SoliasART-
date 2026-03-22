import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Debug (VERY IMPORTANT)
print("SUPABASE_URL:", SUPABASE_URL)
print("SUPABASE_KEY:", "FOUND" if SUPABASE_KEY else "MISSING")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("❌ Supabase credentials missing. Check .env file")

# Create client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)