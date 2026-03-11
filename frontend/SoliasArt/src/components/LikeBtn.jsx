import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi'; 
import { FaHeart } from 'react-icons/fa';

const LikeButton = ({ artworkId, initialLikes, initialIsLiked = false, currentUserId }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevents triggering other clicks if this is inside a feed card

    // Instantly change the button state
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);

    // Send to backend
    try {
      await fetch(`http://localhost:8000/api/artworks/${artworkId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId })
      });
    } catch (error) {
      // If the backend fails, revert the button back to its original state
      setLikes(isLiked ? likes + 1 : likes - 1);
      setIsLiked(isLiked);
      console.error("Failed to update like status");
    }
  };

  return (
    <button 
      onClick={handleLikeClick}
      className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors !outline-none focus:!outline-none hover:!outline-none !border-transparent focus:!ring-0"
    >
      {/* Swap between the filled heart and outlined heart based on state */}
      {isLiked ? (
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