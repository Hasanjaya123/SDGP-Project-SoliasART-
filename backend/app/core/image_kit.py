import os
from dotenv import load_dotenv
from imagekitio import ImageKit

load_dotenv()

public_key = os.getenv("IMAGEKIT_PUBLIC_KEY")
private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
url_endpoint = os.getenv("IMAGEKIT_URL_ENDPOINT")

imagekit = None

if public_key and private_key and url_endpoint:
    imagekit = ImageKit(
        public_key=public_key,
        private_key=private_key,
        url_endpoint=url_endpoint
    )
else:
    print("ImageKit not configured")