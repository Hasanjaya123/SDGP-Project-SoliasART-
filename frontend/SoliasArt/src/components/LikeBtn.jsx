import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi'; 
import { FaHeart } from 'react-icons/fa';
import { api } from '../services/uploadApi';
const LikeButton = ({ artworkId, initialLikes, initialIsLiked = false, currentUserId, isLiked: isLikedProp, onClick }) => {

  const [localLikes, setLocalLikes] = useState(initialLikes || 0);
  const [localIsLiked, setLocalIsLiked] = useState(initialIsLiked);
  const isControlled = isLikedProp !== undefined && onClick !== undefined;
  const currentIsLiked = isControlled ? isLikedProp : localIsLiked;

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevents triggering other clicks if this is inside a feed card

    if (isControlled) {
      onClick(e);
      return;
    }

    // IF BUTTON IS INDEPENDENT: Use the local state and JWT token
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to like artworks!");
      return;
    }

    setLocalLikes(localIsLiked ? localLikes - 1 : localLikes + 1);
    setLocalIsLiked(!localIsLiked);

    try {
      await api.post(`/api/artworks/${artworkId}/like`);
    } catch (error) {
      setLocalLikes(localIsLiked ? localLikes + 1 : localLikes - 1);
      setLocalIsLiked(localIsLiked);
      console.error("Failed to update like status");
    }
  };

  return (
    <button 
      onClick={handleLikeClick}
      className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors !outline-none focus:!outline-none hover:!outline-none !border-transparent focus:!ring-0"
    >
      {/* Swap between the filled heart and outlined heart based on state */}
      {currentIsLiked ? (
        <FaHeart className="w-8 h-8 text-red-500 transition-transform scale-110 drop-shadow-md" />
      ) : (
        <FiHeart 
          className="w-8 h-8 text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform" 
          strokeWidth="1.5" 
        />
      )}
      
    </button>
  );
};

export default LikeButton;