from dotenv import load_dotenv
import os
import sys

load_dotenv()

# Force virtual environment site-packages to be prioritized
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
venv_site_packages = os.path.join(base_dir, ".venv", "Lib", "site-packages")
if os.path.exists(venv_site_packages):
    if venv_site_packages not in sys.path:
        sys.path.insert(0, venv_site_packages)
    
    # Force-reload imagekitio from .venv
    if "imagekitio" in sys.modules:
        del sys.modules["imagekitio"]

public_key = os.getenv("IMAGEKIT_PUBLIC_KEY")
private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
url_endpoint = os.getenv("IMAGEKIT_URL_ENDPOINT")

imagekit = None

if public_key and private_key and url_endpoint:
    try:
        from imagekitio import ImageKit
        try:
            imagekit = ImageKit(
                public_key=public_key,
                private_key=private_key,
                url_endpoint=url_endpoint
            )
        except (TypeError, ValueError):
            # Version 5.x
            imagekit = ImageKit(
                private_key=private_key,
                password=public_key
            )
        print("ImageKit (ArtUpload) initialized successfully.")
    except Exception as e:
        print(f"Warning: ImageKit (ArtUpload) could not be initialized: {e}")
        imagekit = None
else:
    print("ImageKit (ArtUpload) credentials missing.")

IMAGEKIT_URL_ENDPOINT = url_endpoint
IMAGEKIT_PUBLIC_KEY = public_key
