import pytest
import os
from unittest.mock import MagicMock, patch, AsyncMock
from fastapi import HTTPException
from fastapi.responses import Response

from app.modules.AR.router import generate_ar_from_db, CACHE_DIR

@pytest.mark.asyncio
async def test_generate_ar_cache_hit():
    mock_db = MagicMock()
    artwork_id = "1234"
    
    with patch("os.path.exists") as mock_exists, \
         patch("app.modules.AR.router.os.utime") as mock_utime, \
         patch("builtins.open", spec=True) as mock_open:
        
        # Simulate cache hit
        mock_exists.return_value = True
        
        # Mock reading the cached file
        mock_file = MagicMock()
        mock_file.read.return_value = b"fake_cached_glb_data"
        mock_open.return_value.__enter__.return_value = mock_file
        
        response = await generate_ar_from_db(artwork_id, mock_db)
        
        assert isinstance(response, Response)
        assert response.body == b"fake_cached_glb_data"
        assert response.headers["X-Cache"] == "HIT"
        # Ensure DB was not queried since cache was hit
        mock_db.query.assert_not_called()

@pytest.mark.asyncio
async def test_generate_ar_artwork_not_found():
    mock_db = MagicMock()
    
    # Simulate cache miss
    with patch("os.path.exists", return_value=False):
        # Database returns no artwork
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        with pytest.raises(HTTPException) as exc:
            await generate_ar_from_db("1234", mock_db)
            
        assert exc.value.status_code == 404
        assert exc.value.detail == "Artwork not found"

@pytest.mark.asyncio
async def test_generate_ar_no_image():
    mock_db = MagicMock()
    
    with patch("os.path.exists", return_value=False):
        mock_artwork = MagicMock()
        mock_artwork.image_url = [] # Empty list of images
        mock_db.query.return_value.filter.return_value.first.return_value = mock_artwork
        
        with pytest.raises(HTTPException) as exc:
            await generate_ar_from_db("1234", mock_db)
            
        assert exc.value.status_code == 400
        assert exc.value.detail == "No images available"

@pytest.mark.asyncio
async def test_generate_ar_success():
    mock_db = MagicMock()
    artwork_id = "1234"
    
    with patch("os.path.exists", return_value=False), \
         patch("httpx.AsyncClient") as mock_async_client, \
         patch("app.modules.AR.router.ARModel") as mock_ar_model, \
         patch("app.modules.AR.router.manage_cache_size") as mock_manage_cache, \
         patch("builtins.open") as mock_open, \
         patch("os.remove") as mock_remove:
         
        # Simulate DB returning a valid artwork
        mock_artwork = MagicMock()
        mock_artwork.image_url = ["http://example.com/image.jpg"]
        mock_artwork.id = artwork_id
        mock_artwork.width_in = 10
        mock_artwork.height_in = 10
        mock_artwork.depth_in = 1
        mock_db.query.return_value.filter.return_value.first.return_value = mock_artwork
        
        # Simulate HTTP response
        mock_resp = AsyncMock()
        mock_resp.content = b"fake_image_data"
        
        mock_client_instance = AsyncMock()
        mock_client_instance.get.return_value = mock_resp
        mock_async_client.return_value.__aenter__.return_value = mock_client_instance
        
        # Mock file operations (open/write for img, open/read for glb)
        mock_file = MagicMock()
        mock_file.read.return_value = b"fake_new_glb_data"
        mock_open.return_value.__enter__.return_value = mock_file
        
        response = await generate_ar_from_db(artwork_id, mock_db)
        
        assert isinstance(response, Response)
        assert response.body == b"fake_new_glb_data"
        assert response.headers["X-Cache"] == "MISS"
        
        # Verify the image was requested
        mock_client_instance.get.assert_called_once_with("http://example.com/image.jpg")
        
        # Verify the AR engine was called with the right dimensions
        mock_ar_model_instance = mock_ar_model.return_value
        mock_ar_model_instance.create_canvas.assert_called_once_with(10.0, 10.0, 1.0)
        mock_ar_model_instance.create_uv_mapping.assert_called_once()
        mock_ar_model_instance.export_glb.assert_called_once()
