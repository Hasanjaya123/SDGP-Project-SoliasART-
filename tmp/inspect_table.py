import sys
import os
from sqlalchemy import inspect

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/Nadeesha/Downloads/SDGP-Project/backend"))

from app.core.database import engine

def inspect_table():
    inspector = inspect(engine)
    columns = inspector.get_columns("collections")
    print("Columns in collections table:")
    for column in columns:
        print(f" - {column['name']} ({column['type']})")

if __name__ == "__main__":
    inspect_table()
