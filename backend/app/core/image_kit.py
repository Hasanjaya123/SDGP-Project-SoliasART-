<<<<<<< HEAD
import os
from dotenv import load_dotenv
from imagekitio import ImageKit
=======
from dotenv import load_dotenv
from imagekitio import ImageKit
import os
>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY")
)

<<<<<<< HEAD
IMAGEKIT_URL_ENDPOINT = os.getenv("IMAGEKIT_URL")
IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY")
=======

>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
