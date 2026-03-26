import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
});

export const getFeed = (page = 1, userId =null) => {
    const params = {page, page_size: 10}
    if (userId) {
        params.user_id = userId
    }
    return api.get("/feed/", { params });
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

    // Follow an artist
    export const toggleFollow = (artistId, token) => {
        return api.post(`/feed/${artistId}/follow`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    // Unfollow an artist
    export const unfollowArtist = (artistId, token) => {
        return api.delete(`/feed/${artistId}/follow`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    // Check if following an artist
    export const checkFollowStatus = (artistId, token) => {
        return api.get(`/feed/${artistId}/is-following`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }