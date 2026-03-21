import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  verifyRole: async () => {
    const response = await api.get("/auth/verify-role");
    return response.data;
  },
};

export const artistProfileService = {
  getProfile: async () => {
    const response = await api.get("/artists/profile");
    return response.data;
  },

  getProfileById: async (artistId) => {
    const response = await api.get(`/artists/profile/${artistId}`);
    return response.data;
  },

  checkIsFollowing: async (artistId) => {
    const response = await api.get(`/artists/profile/${artistId}/is-following`);
    return response.data;
  },

  followArtist: async (artistId) => {
    const response = await api.post(`/artists/profile/${artistId}/follow`);
    return response.data;
  },

  unfollowArtist: async (artistId) => {
    const response = await api.post(`/artists/profile/${artistId}/unfollow`);
    return response.data;
  },

  getdashboardData: async () => {
    // Calling the dashboard without an ID because the backend uses the token
    const response = await api.get(`/dashboard`);
    return response.data;
  },

  uploadPost: async (artistId, postData) => {
    const formData = new FormData();

    if (postData.title?.trim()) formData.append('title', postData.title.trim());
    if (postData.description?.trim()) formData.append('description', postData.description.trim());
    if (postData.imageFile) formData.append('images', postData.imageFile);

    const response = await api.post(`/artists/posts/${artistId}`, formData);
    return response.data;
  },
};

export const artworkService = {
  uploadArtwork: async (formDataState) => {
    const formData = new FormData();

    const textFields = [
      'title', 'description', 'year', 'medium', 'category',
      'height', 'width', 'depth', 'framing', 'price',
      'origin', 'weight', 'shippingRate'
    ];

    textFields.forEach(field => {
      formData.append(field, formDataState[field] || '');
    });

    if (formDataState.images && formDataState.images.length > 0) {
      formDataState.images.forEach((imgObj) => {
        formData.append('images', imgObj.file);
      });
    }

    try {
      const response = await api.post(`/user/dashboard/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error.response?.data?.detail || error.message);
      throw error;
    }
  },

  getArtWorks: async () => {
    try {
      const response = await api.get("/explore")
      return response.data
    } catch (error) {
      console.log("failed to load artworks", error.response?.data?.detail || error.message)
      throw error
    }
  },

  SearchArtWork: async (textInput, imageFile) => {
    const formData = new FormData();

    if (textInput) {
      formData.append("query_text", textInput);
    } else if (imageFile) {
      formData.append("query_image", imageFile);
    }

    try {
      const response = await api.post(`/explore/search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.results
    } catch (error) {
      console.log("failed to load artworks", error.response?.data?.detail || error.message)
      throw error
    }
  },

  getArtworksByArtist: async (artistId) => {
    try {
      const response = await api.get(`/api/artworks?artist_id=${artistId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to load artist artworks:", error.response?.data?.detail || error.message);
      throw error;
    }
  },

  uploadArtist: async (formDataState) => {
    const formData = new FormData();

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

    Object.entries(fieldMapping).forEach(([frontendKey, backendKey]) => {
      formData.append(backendKey, formDataState[frontendKey] || '');
    });

    formData.append('agreed_to_terms', formDataState.agreedToTerms ?? false);
    formData.append('verified_artist', false);

    if (formDataState.artisticStyles && formDataState.artisticStyles.length > 0) {
      formDataState.artisticStyles.forEach(style => {
        formData.append('artistic_styles', style);
      });
    }

    if (formDataState.profileImageFile) {
      formData.append('profile_image', formDataState.profileImageFile);
    }

    if (formDataState.identityDocument) {
      formData.append('identy_card', formDataState.identityDocument);
    }

    try {
      const response = await api.post(`/user/settings/convert`, formData, {
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

export const collectionService = {
  createCollection: async (collectionData) => {
    const response = await api.post("/api/collections/", collectionData);
    return response.data;
  },

  getAllCollections: async () => {
    const response = await api.get("/api/collections/");
    return response.data;
  },

  getCollectionsByArtist: async (artistId) => {
    const response = await api.get(`/api/collections/artist/${artistId}`);
    return response.data;
  },

  getCollectionById: async (collectionId) => {
    const response = await api.get(`/api/collections/${collectionId}`);
    return response.data;
  },

  deleteCollection: async (collectionId) => {
    const response = await api.delete(`/api/collections/${collectionId}`);
    return response.data;
  },
};

export const paymentService = {
  initiatePayment: async (artworkIds) => {
    try {
      const response = await api.post('/payhere/initiate', {
        artwork_ids: artworkIds,
      });
      return response.data;
    } catch (error) {
      console.error("Payment initiation failed:", error.response?.data?.detail || error.message);
      throw error;
    }
  },

  confirmPayment: async (orderId) => {
    try {
      const response = await api.post('/payhere/confirm', {
        order_id: orderId,
      });
      return response.data;
    } catch (error) {
      console.error("Payment confirmation failed:", error.response?.data?.detail || error.message);
      throw error;
    }
  },
};


export const commissionService = {
  /**
   * 
   * @param {FormData} formData 
   */
  submitCommission: async (formData) => {
    try {
      const response = await api.post('/commissions/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Commission submission failed:", error.response?.data?.detail || error.message);
      throw error;
    }
  },


  getArtistCommissions: async () => {
    const response = await api.get('/commissions/artist');
    return response.data;
  },


  acceptCommission: async (commissionId) => {
    const response = await api.patch(`/commissions/${commissionId}/accept`);
    return response.data;
  },


  rejectCommission: async (commissionId) => {
    const response = await api.patch(`/commissions/${commissionId}/reject`);
    return response.data;
  },
};

export { api };
