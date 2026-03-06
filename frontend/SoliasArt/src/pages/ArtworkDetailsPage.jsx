import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArtworkGallery from '../components/ArtworkDetailsComponents/ArtworkGallery';
import ArtworkDetailsCard from '../components/ArtworkDetailsComponents/ArtworkDetailsCard';

// --- MOCK DATA ---
const MOCK_ARTWORK = {
  id: "123",
  title: "Coastal Serenity",
  price: 156000,
  imageUrls: ["https://picsum.photos/800/1000", "https://picsum.photos/800/1001", "https://picsum.photos/800/1002"],
  category: "Landscape",
  medium: "Oil on Canvas",
  dimensions: "40 x 30 in",
  year: "2023",
  description: "The gentle morning light breaking over the calm waters near Galle Fort. This piece captures the serene atmosphere of the southern coast of Sri Lanka.",
  views: 2301,
  likes: 540
};

const MOCK_ARTIST = {
  name: "Nisha Jayawardena",
  location: "Galle, Sri Lanka",
  profileImageUrl: "https://i.pravatar.cc/150?u=nisha",
  bio: "A contemporary artist focusing on the intersection of nature and emotion. Exhibited in multiple galleries across South Asia."
};

const ArtworkDetailsPage = () => {
  const { id } = useParams();
  
  // AR Modal State
  const [isArModalOpen, setArModalOpen] = useState(false);
  const arUrl = `${window.location.origin}/ar-preview/${MOCK_ARTWORK.id}`;
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(arUrl)}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT: GALLERY COMPONENT */}
          <div className="lg:col-span-7">
            <div className= "top-24">
              <ArtworkGallery 
                images={MOCK_ARTWORK.imageUrls} 
                title={MOCK_ARTWORK.title} 
              />
            </div>
          </div>

          {/* RIGHT: DETAILS CARD COMPONENT */}
          <div className="lg:col-span-5">
            <ArtworkDetailsCard 
              artwork={MOCK_ARTWORK} 
              artist={MOCK_ARTIST} 
              onArClick={() => setArModalOpen(true)} 
            />
          </div>

        </div>
      </div>

      {/* AR MODAL */}
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