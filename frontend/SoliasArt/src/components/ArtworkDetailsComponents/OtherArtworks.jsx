import React, { useEffect, useState, useRef } from 'react';
import ArtDisplayCard from '../Art-card'; 
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/uploadApi';

const ArtistOtherArtworks = ({ artistId, currentArtworkId }) => {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Monitor scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Update left state
      setShowLeftBlur(scrollLeft > 10);
      
      // Update right state (isAtEnd)
      // Check if current scroll position + visible width matches total width
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  // Fetch artworks by the same artist when artistId changes
  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await api.get(`/api/artworks?artist_id=${artistId}`);
        const data = res.data;

        const unsoldArt = (Array.isArray(data) ? data : []).filter(
          art => String(art.id) !== String(currentArtworkId) && art.status !== 'sold'
        );
        
        setArtworks(unsoldArt);

      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    
    if (artistId) fetchArt();
  }, [artistId, currentArtworkId]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth / 3; 
      
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

  };

  if (artworks.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 my-10 md:my-16 py-8 md:pt-10 relative">
      
      {/* Header*/}
      <div className="flex flex-col md:flex-row items-center md:justify-between mb-8 px-4 md:px-8">
        <h3 className="text-lg md:text-xl font-bold dark:text-white uppercase tracking-tight text-center md:text-left w-full px-3">
          More from this Artist
        </h3>
        
        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">

          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            disabled={!showLeftBlur}
            className={`p-2 rounded-full border transition-all active:scale-95 focus:outline-none bg-gray-100 shadow-md border-gray-200 hover:!border-transparent hover:shadow-lg dark:bg-zinc-700 dark:border-zinc-600 dark:hover:border-transparent dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]
            ${!showLeftBlur 
              ? 'opacity-20 cursor-not-allowed' 
              : 'opacity-100 hover:bg-gray-50 dark:hover:bg-zinc-600'}`}
                    >

            <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>

          </button>

          {/* Right Arrow */}
          <button 
          onClick={() => scroll('right')}
          disabled={isAtEnd}
          className={`p-2 rounded-full border transition-all active:scale-95 focus:outline-none bg-gray-100 shadow-md border-gray-200 hover:!border-transparent hover:shadow-lg dark:bg-zinc-700 dark:border-zinc-600 dark:hover:border-transparent dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]
            ${isAtEnd 
              ? 'opacity-20 cursor-not-allowed' 
              : 'opacity-100 hover:bg-gray-50 dark:hover:bg-zinc-600'}`}
          
        >

        <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

          </button>
        </div>
      </div>

      <div className="relative group">
        {/* Left blur */}
        {showLeftBlur && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white/60 dark:from-gray-900/60 to-transparent md:hidden transition-opacity duration-300" />
        )}

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-start overflow-x-auto gap-4 md:gap-8 pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {artworks.map((art) => (
            <div 
              key={art.id} 
              className="flex-none w-[80%] min-w-[300px] sm:w-[45%] lg:w-[31%] snap-center cursor-pointer transition-transform duration-300"
              onClick={() => {
                navigate(`/artwork/${art.id}`);
                window.scrollTo(0, 0);
              }}
            >
              <ArtDisplayCard 
                image={Array.isArray(art.image_url) ? art.image_url[0] : art.image_url} 
                formData={{
                  title: art.title,
                  price: art.price,
                  category: art.medium || art.category,
                  height: art.height_in || art.height,
                  width: art.width_in || art.width,
                  images: [art.image_url],
                  artist_name: art.artists?.display_name || art.artist_name || "",
                  views: art.view_count || art.views || 0,
                  likes: art.likes || 0
                }}
              />
            </div>
          ))}
        </div>

        {/* Right blur */}
        {!isAtEnd && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white/60 dark:from-gray-900/60 to-transparent md:hidden transition-opacity duration-300" />
        )}
      </div>
    </div>
  );
};

export default ArtistOtherArtworks;