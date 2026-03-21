import sys
import os
from sqlalchemy import inspect

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from app.core.database import engine

def list_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tables in database:")
    for table in tables:
        print(f" - {table}")

if __name__ == "__main__":
    list_tables()
