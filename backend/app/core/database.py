from supabase import create_client, Client
from app.core.config import settings

supabase: Client | None = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY and "example" not in settings.SUPABASE_URL:
    try:
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        print("✅ Supabase client initialized successfully.")
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {str(e)}")
else:
    print("⚠️  Supabase credentials (URL/KEY) not found in .env. Supabase client (Storage/Auth) will not be available.")
    print("👉 Direct database access via DATABASE_URL is still active.")
