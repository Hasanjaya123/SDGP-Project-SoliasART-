import axios from 'axios';

// Configure your backend URL
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const artworkService = {
  /**
   * Uploads artwork data including multiple images to the backend.
   * @param {Object} formDataState - The state object from UploadArtPage (formData)
   */
  uploadArtwork: async (formDataState) => {
    const formData = new FormData();

    // 1. Append Text Fields
    // We iterate over keys to handle the simple strings
    const textFields = [
      'title', 'description', 'year', 'medium', 'category',
      'height', 'width', 'depth', 'framing', 'price', 
      'origin', 'weight', 'shippingRate'
    ];

    textFields.forEach(field => {
      // Ensure we don't send null/undefined, send empty string instead if missing
      formData.append(field, formDataState[field] || '');
    });

    // 2. Append Images
    // Note: React state has [{ file, preview }, ...], we need just the .file property
    if (formDataState.images && formDataState.images.length > 0) {
      formDataState.images.forEach((imgObj) => {
        // 'images' here matches the `images: List[UploadFile]` in FastAPI
        formData.append('images', imgObj.file);
      });
    }

    try {
      const response = await api.post('/user/dashboard/upload', formData, {
        headers: {
          // axios automatically sets boundary for multipart/form-data 
          // when data is an instance of FormData
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

    } catch (error) {

      console.error("Upload failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};