import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

<<<<<<< HEAD
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
=======
API_URL = os.getenv("SUPABASE_URL")
API_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(API_URL, API_KEY)
>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
