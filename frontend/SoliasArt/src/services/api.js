const API_BASE_URL = "http://127.0.0.1:8000";

export const getArtworks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/artworks`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }
};