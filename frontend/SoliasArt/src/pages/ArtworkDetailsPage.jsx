import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArtworkGallery from '../components/ArtworkDetailsComponents/ArtworkGallery';
import ArtworkDetailsCard from '../components/ArtworkDetailsComponents/ArtworkDetailsCard';
import ArtistOtherArtworks from '../components/ArtworkDetailsComponents/OtherArtworks';
import { api } from '../services/uploadApi';

const ArtworkDetailsPage = () => {

  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isArModalOpen, setArModalOpen] = useState(false);
  const [liveLikesCount, setLiveLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isArLoading, setIsArLoading] = useState(false);
  const [arError, setArError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const [generatedMobileUrl, setGeneratedMobileUrl] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    setIsSaved(false);
    setIsLiked(false);

    const checkSaveStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Check saved status
        const saveRes = await fetch(`${BACKEND_URL}/savework/user/saved`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (saveRes.ok) {
          const savedArtworks = await saveRes.json();

          // Check if this specific artwork ID exists in the user's saved list
          const alreadySaved = savedArtworks.some(art => String(art.id) === String(id));
          setIsSaved(alreadySaved);
        }

        // Check like status
        const likeRes = await fetch(`${BACKEND_URL}/api/artworks/${id}/check-like`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (likeRes.ok) {
          const likeData = await likeRes.json();

          // Check if already liked
          setIsLiked(likeData.is_liked); 
        }

      } catch (err) {
        console.error("Error checking save status:", err);
      }
    };

    if (id) checkSaveStatus();
  }, [id, BACKEND_URL]);

  //  Function to handle the Save/Unsave btn
  const handleToggleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to save artworks!");
      return;
    }

    const previousSaveStatus = isSaved;
    setIsSaved(!previousSaveStatus);

    try {
      const response = await api.post(`/savework/save/${id}`);
      setIsSaved(response.data.status === 'saved'); // Sync with actual backend response
    } catch (err) {
      setIsSaved(previousSaveStatus); // Revert UI if request fails
      console.error("Save error:", err);
    }
  };

  const handleOpenArModal = async () => {
    setArModalOpen(true);
    setIsArLoading(true);
    setArError("");
    setQrReady(false);

    const mobileLink = `${window.location.origin}/preview?glb=${BACKEND_URL}/ar/generate-ar/${id}`;
    setGeneratedMobileUrl(mobileLink);

    try {
      // Trigger backend to process/cache the GLB file

      await api.get(`/ar/generate-ar/${id}`, {
        headers: { "ngrok-skip-browser-warning": "true" },
        responseType: "blob"
      });

      setQrReady(true);
    } catch (err) {
      setArError(err.response?.data?.detail || err.message);
    } finally {
      setIsArLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArtwork = async () => {
      try {
        setLoading(true);
        // fetch artwork details from backend API using the 'id' from URL params
        const response = await api.get(`/api/artworks/${id}`);

        const data = response.data;
        setArtwork(data); // Save the fetched data to state

        setLiveLikesCount(data.likes || 0);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, BACKEND_URL]);

  const handleToggleLike = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to like artworks!");
      return;
    }
    const wasLiked = isLiked;
    setLiveLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    setIsLiked(!wasLiked);

    try {
      // The API Call
      const response = await fetch(`${BACKEND_URL}/api/artworks/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         } 
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }
    } catch (err) {

      // Revert if the backend fails 

      setLiveLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      setIsLiked(wasLiked);
      console.error("Backend error:", err);
    }
  };

  // Page states - loading, error, or display artwork details
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center pb-24 pt-12 md:pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center pb-24 pt-12 text-red-500 font-bold">
        Error: {error || "Artwork not found"}
      </div>
    );
  }

  // Generate the AR preview URL and corresponding QR code URL
  const arUrl = `${window.location.origin}/ar-preview/${artwork.id}`;
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(arUrl)}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-12 md:pt-16">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Leftside Gallery Component */}
          <div className="lg:col-span-7">
            <div className="top-24">
              <ArtworkGallery
                images={artwork.imageUrls}
                title={artwork.title}
                artworkId={artwork.id}
                initialLikes={artwork.likes}
                currentUserId={"temp-user-id"}
                isLiked={isLiked}
                onToggleLike={handleToggleLike}
              />
            </div>
          </div>

          {/* Rightside details component */}
          <div className="lg:col-span-5">
            <ArtworkDetailsCard 
              artwork={artwork} 
              artist={artwork.artist} 
              onArClick = {handleOpenArModal}
              // props for save
              onSaveClick={handleToggleSave} 
              isSaved={isSaved}
              // props for like
              liveLikesCount={liveLikesCount} 
              isLiked={isLiked}
              onLikeClick={handleToggleLike}
            />
          </div>

        </div>
      </div>

      {/* AR model Modal */}
      {isArModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setArModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="text-center mt-4">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-gray-900 dark:text-white">View in Your Space</h3>


              {/*Conditional Rendering for Loading, Error, and QR Ready states */}

              {isArLoading ? (
                <div className="py-12 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Preparing 3D Model...</p>
                </div>
              ) : arError ? (
                <div className="py-12 text-red-500 font-bold">{arError}</div>
              ) : qrReady ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Scan the QR code to place this artwork on your wall.</p>

                  <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-gray-100 inline-block mb-5">

                    {/* Display QR */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generatedMobileUrl)}`}

                      alt="AR QR Code"
                      className="w-56 h-56"
                    />
                  </div>
                </>
              ) : null}

            </div>
          </div>
        </div>
      )}

      {/* Related Artworks from the same artist */}
      <ArtistOtherArtworks 
        artistId={artwork.artist?.id} 
        currentArtworkId={artwork.id} 
      />
      
    </div>
  );
};

export default ArtworkDetailsPage;