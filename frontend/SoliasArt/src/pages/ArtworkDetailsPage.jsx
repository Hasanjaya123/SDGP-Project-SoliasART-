import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArtworkGallery from '../components/ArtworkDetailsComponents/ArtworkGallery';
import ArtworkDetailsCard from '../components/ArtworkDetailsComponents/ArtworkDetailsCard';

const ArtworkDetailsPage = () => {
  const { id } = useParams();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isArModalOpen, setArModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArtwork = async () => {
      try {
        setLoading(true);
        // fetch artwork details from backend API using the 'id' from URL params
        const response = await fetch(`http://localhost:8000/api/artworks/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artwork details');
        }

        const data = await response.json();
        setArtwork(data); // Save the fetched data to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  // Page states: loading, error, or display artwork details
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 pt-12 md:pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 pt-12 text-red-500 font-bold">
        Error: {error || "Artwork not found"}
      </div>
    );
  }

  // Generate the AR preview URL and corresponding QR code URL
  const arUrl = `${window.location.origin}/ar-preview/${artwork.id}`;
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(arUrl)}`;

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Leftside Gallery Component */}
          <div className="lg:col-span-7">
            <div className= "top-24">
              <ArtworkGallery 
                images={artwork.imageUrls} 
                title={artwork.title} 
                artworkId={artwork.id}           
                initialLikes={artwork.likes}         
                ccurrentUserId={"temp-user-id"}
              />
            </div>
          </div>

          {/* Rightside details component */}
          <div className="lg:col-span-5">
            <ArtworkDetailsCard 
              artwork={artwork} 
              artist={artwork.artist} 
              onArClick={() => setArModalOpen(true)} 
            />
          </div>

        </div>
      </div>

      {/* AR model */}
      {isArModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 relative shadow-2xl transform transition-all">
            <button 
              onClick={() => setArModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="text-center mt-4">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-gray-900 dark:text-white">View in Your Space</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Scan the QR code with your smartphone's camera to place this artwork on your wall.</p>
              
              <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-gray-100 inline-block">
                  <img src={qrCodeUrl} alt="AR QR Code" className="w-56 h-56" />
              </div>
              
              <p className="mt-6 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                  Ensure your phone is connected to the same Wi-Fi network as this computer to view the 3D model.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetailsPage;