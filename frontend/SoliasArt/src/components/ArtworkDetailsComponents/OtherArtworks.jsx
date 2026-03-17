import React, { useEffect, useState } from 'react';
import ArtDisplayCard from '../Art-card'; 
import { useNavigate } from 'react-router-dom';

const ArtistOtherArtworks = ({ artistId, currentArtworkId }) => {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  // Fetch artworks by the same artist when artistId changes
  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/artworks?artist_id=${artistId}`);
        const data = await res.json();
        console.log("Fetched Related Artworks:", data); 
        setArtworks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    if (artistId) fetchArt();
  }, [artistId]);

  // Filter out the current artwork and limit to 3
  const displayList = artworks.filter(a => String(a.id) !== String(currentArtworkId)).slice(0, 3);

  if (displayList.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 mt-16 border-t pt-10">
      <h3 className="text-xl font-bold mb-6 dark:text-white">More from this Artist</h3>
      <div className="flex flex-wrap gap-6">
        {displayList.map((art) => (
  <div key={art.id} onClick={() => {
      navigate(`/artwork/${art.id}`);
      window.scrollTo(0,0);
  }} className="cursor-pointer">

    {/* Add Artwork Card Component*/}
    <ArtDisplayCard 
     
      image={Array.isArray(art.imageUrls) ? art.imageUrls[0] : (art.image_url?.[0] || art.imageUrls || art.image_url)} 
      formData={{
        title: art.title,
        price: art.price,
        category: art.medium || art.category || 'Artwork',
        height: art.height_in || art.height,
        width: art.width_in || art.width,
        images: Array.isArray(art.imageUrls) ? art.imageUrls : [art.imageUrls || art.image_url]
      }}
    />
  </div>
))}
      </div>
    </div>
  );
};

export default ArtistOtherArtworks;