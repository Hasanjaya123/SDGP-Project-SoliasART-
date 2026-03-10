import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
import psycopg2
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
conn.autocommit = True
cur = conn.cursor()

# Step 1: Drop any old FK referencing the dropped 'artworks' table (if lingering)
print("Dropping old FK constraints on collection_artworks.artwork_id (if any)...")
cur.execute("""
    SELECT constraint_name 
    FROM information_schema.table_constraints 
    WHERE table_name = 'collection_artworks' 
      AND constraint_type = 'FOREIGN KEY'
""")
for row in cur.fetchall():
    print(f"  Dropping constraint: {row[0]}")
    cur.execute(f"ALTER TABLE collection_artworks DROP CONSTRAINT IF EXISTS {row[0]};")

# Step 2: Add new FK from collection_artworks.artwork_id -> artwork.id
print("Adding FK: collection_artworks.artwork_id -> artwork.id ...")
cur.execute("""
    ALTER TABLE collection_artworks 
    ADD CONSTRAINT fk_collection_artworks_artwork 
    FOREIGN KEY (artwork_id) REFERENCES artwork(id) ON DELETE CASCADE;
""")
print("  Done!")

# Step 3: Verify
cur.execute("""
    SELECT constraint_name, table_name
    FROM information_schema.table_constraints 
    WHERE table_name = 'collection_artworks' 
      AND constraint_type = 'FOREIGN KEY'
""")
print("\nCurrent FK constraints on collection_artworks:")
for row in cur.fetchall():
    print(f"  {row[0]}")

cur.close()
conn.close()
print("\nMigration complete!")
