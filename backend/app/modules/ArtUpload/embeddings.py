
from sentence_transformers import SentenceTransformer
from PIL import Image
import io


clip_model = SentenceTransformer('clip-ViT-B-32')

def generate_image_embedding(image_bytes: bytes) -> list[float]:
    
    try:
        
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        vector = clip_model.encode(image)
     
        return vector.tolist()
        
    except Exception as e:
        print(f"AI Embedding Error: {e}")
        raise ValueError("Failed to process image for AI search.")
    

def generate_text_embedding(text: str) -> list[float]:
    
    try:
        
        vector = clip_model.encode([text])[0]
        return vector.tolist()
    
    except Exception as e:
        print(f"Text Embedding Error: {e}")
        raise ValueError("Failed to process text search.")