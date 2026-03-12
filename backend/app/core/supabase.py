import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

API_URL = os.getenv("SUPABASE_URL")
API_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(API_URL, API_KEY)
