import axios from 'axios';

// Configure your backend URL
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const artistProfileService = {
  getProfile: async (artistId) => {
    const response = await api.get(`/artists/profile/${artistId}`);
    return response.data;
  },

  uploadPost: async (artistId, postData) => {
    const formData = new FormData();

    // Optional text fields
    if (postData.title?.trim())       formData.append('title', postData.title.trim());
    if (postData.description?.trim()) formData.append('description', postData.description.trim());

    // Optional image – the backend accepts a list named 'images'
    if (postData.imageFile) formData.append('images', postData.imageFile);

    const response = await api.post(`/artists/posts/${artistId}`, formData);

    return response.data;
  },
};

export const artworkService = {
  /**
   * @param {Object} formDataState - The state object from UploadArtPage (formData)
   */
  uploadArtwork: async (formDataState, artistId) => {
    
    const formData = new FormData();

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
        
        formData.append('images', imgObj.file);
      });
    }

    try {
      const response = await api.post(`/user/dashboard/upload/${artistId}`, formData, {
        headers: {
          // axios automatically sets boundary for multipart/form-data 
          // when data is an instance of FormData
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

    } catch (error) {

      console.error("Upload failed:", error.response?.data?.detail || error.message);
      throw error;
    }
  },

  uploadArtist: async (formDataState, userId) => {

    const formData = new FormData();

    // Map frontend field names to backend field names
    const fieldMapping = {
      displayName: 'display_name',
      bio: 'artist_bio',
      ig: 'other_social_media_username',
      website: 'other_social_nedia_link',
      primaryMedium: 'primary_medium',
      yearsExperience: 'years_experience',
      legalName: 'legal_name',
      bankName: 'bank_name',
      branchName: 'branch_name',
      accountNumber: 'account_number',
      dispatchAddress: 'dispatch_address',
      phone: 'phone',
    };

    // Append simple text fields with backend-compatible names
    Object.entries(fieldMapping).forEach(([frontendKey, backendKey]) => {
      formData.append(backendKey, formDataState[frontendKey] || '');
    });

    // Append boolean field
    formData.append('agreed_to_terms', formDataState.agreedToTerms ?? false);
    formData.append('verified_artist', false);

    // Append artistic_styles as individual items so backend receives a list
    if (formDataState.artisticStyles && formDataState.artisticStyles.length > 0) {
      formDataState.artisticStyles.forEach(style => {
        formData.append('artistic_styles', style);
      });
    }

    // Append profile image (single File object)
    if (formDataState.profileImageFile) {
      formData.append('profile_image', formDataState.profileImageFile);
    }

    // Append identity document (single File object)
    if (formDataState.identityDocument) {
      formData.append('identy_card', formDataState.identityDocument);
    }

    try {
      const response = await api.post(`/user/settings/convert/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

    } catch (error) {
      console.error("Upload failed:", error.response?.data?.detail || error.message);
      throw error;
    }

  }
};