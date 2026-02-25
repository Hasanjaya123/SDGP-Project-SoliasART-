from supabase import create_client, Client
from app.core.config import settings

url: str = "https://cyishjpdiwdxnceaiahp.supabase.co"
key: str = "sb_publishable_9uuxIMAFrGeEAQtfMqAE2Q_PBlduT2G"

supabase: Client = create_client(url, key)
