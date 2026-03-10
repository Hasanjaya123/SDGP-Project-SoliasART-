
from sentence_transformers import SentenceTransformer
from PIL import Image
import io


clip_model = SentenceTransformer('clip-ViT-B-32')

def generate_image_embedding(image_bytes: bytes) -> list[float]:
    
    try:
        # Convert the raw bytes from FastAPI into a format the AI understands
        image = Image.open(io.BytesIO(image_bytes))
        
        # Ensure the image is in RGB mode (CLIP crashes on PNGs with transparent backgrounds)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Run the AI math
        vector = clip_model.encode(image)
        
        # .tolist() converts it from a numpy array to a standard Python list 
        # so Supabase can understand it.
        return vector.tolist()
        
    except Exception as e:
        print(f"AI Embedding Error: {e}")
        raise ValueError("Failed to process image for AI search.")