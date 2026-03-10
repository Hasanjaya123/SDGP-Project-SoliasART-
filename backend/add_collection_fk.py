import os, sys
from dotenv import load_dotenv
import psycopg2
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
conn.autocommit = True
cur = conn.cursor()

print("Adding FK: collection_artworks.collection_id -> collections.id ...")
try:
    # First, drop if exists to avoid errors on reruns
    cur.execute("ALTER TABLE collection_artworks DROP CONSTRAINT IF EXISTS fk_collection_artworks_collection;")
    
    # Add the constraint
    cur.execute("""
        ALTER TABLE collection_artworks 
        ADD CONSTRAINT fk_collection_artworks_collection 
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;
    """)
    print("  Successfully added fk_collection_artworks_collection!")
except Exception as e:
    print(f"  Error adding foreign key: {e}")

cur.close()
conn.close()
print("\nMigration script finished!")
