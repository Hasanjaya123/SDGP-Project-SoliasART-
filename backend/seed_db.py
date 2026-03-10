import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
import psycopg2
import uuid

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

artworks_data = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "title": "Serene Sunset",
        "artist_name": "Aria Chen",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 45000,
        "views": 1250,
        "likes": 340,
        "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "A captivating depiction of a tranquil sunset over the ocean, blending warm hues of orange and gold."
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "title": "Urban Echoes",
        "artist_name": "Marcus Thorne",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 32000,
        "views": 890,
        "likes": 120,
        "image_url": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "An abstract exploration of city life, capturing the rhythmic energy and architectural complexity of the modern metropolis."
    },
    {
        "id": "33333333-3333-3333-3333-333333333333",
        "title": "Emerald Whisper",
        "artist_name": "Elena Rossi",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 28000,
        "views": 1100,
        "likes": 215,
        "image_url": "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "A delicate floral composition that evokes the ephemeral beauty of spring with soft greens and ethereal textures."
    },
    {
        "id": "44444444-4444-4444-4444-444444444444",
        "title": "Midnight Reverie",
        "artist_name": "Julian Vane",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 55000,
        "views": 2400,
        "likes": 560,
        "image_url": "https://images.unsplash.com/photo-1501472312651-726afe119ff1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "A deep, contemplative journey into the subconscious, using dark blues and dramatic highlights to create a sense of mystery."
    },
    {
        "id": "55555555-5555-5555-5555-555555555555",
        "title": "Golden Horizon",
        "artist_name": "Sana Khan",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 38000,
        "views": 950,
        "likes": 180,
        "image_url": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "A vibrant landscape that celebrates the warmth and light of the morning sun as it rises above a vast, golden field."
    },
    {
        "id": "66666666-6666-6666-6666-666666666666",
        "title": "Coastal Rhythms",
        "artist_name": "Oliver Grant",
        "artist_id": "00000000-0000-0000-0000-000000000000",
        "price": 42000,
        "views": 1300,
        "likes": 290,
        "image_url": "https://images.unsplash.com/photo-1515405290399-ed31c51950d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "description": "Capturing the dynamic movement of the waves crashing against the rocky shore, filled with texture and raw emotion."
    }
]

collections_data = [
    {
        "id": "aaaaaa11-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "title": "Island Hues",
        "curator_name": "Nadisha Silva",
        "curator_id": "00000000-0000-0000-0000-000000000000",
        "description": "A collection of vibrant artworks inspired by the tropical beauty and cultural richness of island life.",
        "preview_images": ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        "total_artworks": 3,
        "total_value": 45000+28000+38000
    },
    {
        "id": "bbbbbb22-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "title": "Urban Visions",
        "curator_name": "Hasanjaya",
        "curator_id": "00000000-0000-0000-0000-000000000000",
        "description": "Exploring the intersecting lines, vibrant colors, and dynamic energy of modern urban landscapes.",
        "preview_images": ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        "total_artworks": 3,
        "total_value": 32000+55000+42000
    }
]

collection_artworks_data = [
    # Island Hues
    {"collection_id": "aaaaaa11-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "artwork_id": "11111111-1111-1111-1111-111111111111"},
    {"collection_id": "aaaaaa11-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "artwork_id": "33333333-3333-3333-3333-333333333333"},
    {"collection_id": "aaaaaa11-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "artwork_id": "55555555-5555-5555-5555-555555555555"},
    # Urban Visions
    {"collection_id": "bbbbbb22-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "artwork_id": "22222222-2222-2222-2222-222222222222"},
    {"collection_id": "bbbbbb22-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "artwork_id": "44444444-4444-4444-4444-444444444444"},
    {"collection_id": "bbbbbb22-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "artwork_id": "66666666-6666-6666-6666-666666666666"},
]

def seed_db():
    print("Clearing old data...")
    supabase.table('collection_artworks').delete().neq('collection_id', '00000000-0000-0000-0000-000000000000').execute()
    supabase.table('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    supabase.table('artworks').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()

    print("Inserting artworks...")
    for a in artworks_data:
        try:
            supabase.table('artworks').insert(a).execute()
        except:
            pass # ignore duplicates if any
            
    print("Inserting collections...")
    for c in collections_data:
        try:
            supabase.table('collections').insert(c).execute()
        except:
            pass

    print("Inserting collection_artworks...")
    for ca in collection_artworks_data:
        try:
            supabase.table('collection_artworks').insert(ca).execute()
        except:
            pass

    print("Done!")

if __name__ == "__main__":
    seed_db()
