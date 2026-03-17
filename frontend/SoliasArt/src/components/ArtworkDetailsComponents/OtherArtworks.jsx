import React, { useEffect, useState, useRef } from 'react';
import ArtDisplayCard from '../Art-card'; 
import { useNavigate } from 'react-router-dom';

const ArtistOtherArtworks = ({ artistId, currentArtworkId }) => {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);

  // Monitor scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const isAtStart = scrollRef.current.scrollLeft < 10;
      setShowLeftBlur(!isAtStart);
    }
  };

  // Fetch artworks by the same artist when artistId changes
  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/artworks?artist_id=${artistId}`);
        const data = await res.json();

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
  <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 border-t pt-10 relative">
    <h3 className="text-xl font-bold mb-8 dark:text-white uppercase tracking-tight">
      More from this Artist
    </h3>
    
    <div className="relative group">
      {/* Left side blur effect */}
      {showLeftBlur && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white/60 dark:from-gray-900/60 to-transparent md:hidden transition-opacity duration-300" />
      )}

        {/* Left Arrow  */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-zinc-800/90 p-2 rounded-full shadow-lg hover:bg-white transition-all border border-gray-200 dark:border-zinc-700"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {artworks.map((art) => (
          <div 
            key={art.id} 
            className="flex-none w-[80%] md:w-[calc(33.333%-16px)] snap-center cursor-pointer"
            onClick={() => {
              navigate(`/artwork/${art.id}`);
              window.scrollTo(0, 0);
            }}
          >
            <ArtDisplayCard 
              image={Array.isArray(art.imageUrls) ? art.imageUrls[0] : (art.image_url || art.imageUrls)} 
              formData={{
                title: art.title,
                price: art.price,
                category: art.medium || art.category,
                height: art.height_in || art.height,
                width: art.width_in || art.width,
                images: [art.image_url]
              }}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-zinc-800/90 p-2 rounded-full shadow-lg hover:bg-white transition-all border border-gray-200 dark:border-zinc-700"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Right side blur */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white/60 dark:from-gray-900/60 to-transparent md:hidden" />
    </div>
  </div>
);
};

export default ArtistOtherArtworks;