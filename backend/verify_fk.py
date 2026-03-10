import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
import psycopg2
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

print("Verifying relationship: collection_artworks -> artwork")
cur.execute("""
    SELECT
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'collection_artworks';
""")

rows = cur.fetchall()
if not rows:
    print("No foreign keys found on collection_artworks.")
else:
    for row in rows:
        print(f"Constraint: {row[0]}")
        print(f"  {row[1]}.{row[2]} -> {row[3]}.{row[4]}")

cur.close()
conn.close()
