import sys
import os
from sqlalchemy import create_engine, text

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from app.core.database import engine

def check_data():
    with engine.connect() as conn:
        res = conn.execute(text('SELECT * FROM collections LIMIT 5'))
        rows = [dict(row._mapping) for row in res]
        print(f"Sample data from collections: {rows}")

if __name__ == "__main__":
    check_data()
