from dotenv import load_dotenv
from image_kit import ImageKit
import os

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
)

IMAGEKIT_URL_ENDPOINT = os.getenv("IMAGEKIT_URL")
IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY")