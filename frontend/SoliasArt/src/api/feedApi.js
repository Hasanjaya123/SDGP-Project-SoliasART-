import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getFeed = (page = 1, userId =null) => {
    const params = {page, page_size: 10}
    if (userId) {
        params.user_id = userId
    }
    return api.get("/feed", { params });
    }

    // Add like to a post or artwork
    export const toggleLike = (tragetType, targetId, userId) => {
        return api.post(`/feed/${tragetType}/${targetId}/like`, null, {
            params: { user_id: userId }
        });
    }

    // Add save to a post or artwork
    export const toggleSave = (tragetType, targetId, userId) => {
        return api.post(`/feed/${tragetType}/${targetId}/save`, null, {
            params: { user_id: userId }
        });
    }

    // Get all comments for a post or artwork
    export const getComments = (tragetType, targetId) => {
        return api.get(`/feed/${tragetType}/${targetId}/comments`)
    }

    // Add new comment to a post or artwork
    export const addComment = (tragetType, targetId, userId, content) => {
        return api.post(`/feed/${tragetType}/${targetId}/comments`, {
            user_id: userId,
            content: content
        })
    }

    // Record that user saw a post or artwork (for ML ranking)
    export const trackView = (tragetType, targetId, userId) => {
        return api.post(`/feed/${tragetType}/${targetId}/view`, null, {
            params: { user_id: userId }
        });
    }

    // create a new post
    export const createPost = (artistId, description, imageFile, title = '') => {
        const formData = new FormData();
        formData.append('artist_id', artistId);
        formData.append('description', description);
        formData.append('image', imageFile);
        if (title) formData.append('title', title)

        return api.post('/posts/', formData)
        }