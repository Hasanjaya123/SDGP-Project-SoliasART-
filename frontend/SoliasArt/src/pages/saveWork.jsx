import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtDisplayCard from '../components/Art-card';
import UserProfile from '../comp/UserProfile';

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Icons
const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="7" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M12 22c0-2 2-3 2-5a2 2 0 0 0-4 0c0 2 2 3 2 5z" fill="currentColor" stroke="none"/>
  </svg>
);

// Card wrapper — passes real data including view_count, likes, and artist_name
function CardWithRealInfo({ artwork }) {
  const image = artwork.image_url?.[0] || '';

  const formData = {
    title:       artwork.title       || 'UNTITLED ARTWORK',
    category:    artwork.medium      || 'New Release',
    price:       artwork.price       || 0,
    height:      artwork.height_in   ? artwork.height_in * 25.4 : 400,
    width:       artwork.width_in    ? artwork.width_in  * 25.4 : 300,
    images:      artwork.image_url   || [],
    artist_name: artwork.artist_name || 'Unknown Artist',
    views:       artwork.view_count  ?? 0,
    likes:       artwork.likes       ?? 0,
  };

  return <ArtDisplayCard image={image} formData={formData} />;
}

// Loading skeleton
function SkeletonCard() {
  return (
    <div className="w-[220px] animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-[320px] mb-3" />
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-3 w-2/3 mx-auto mb-2" />
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-3 w-1/2 mx-auto" />
    </div>
  );
}

// Page
const SaveWork = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login to view your profile");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchProfileData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const userRes = await fetch(`${API_BASE}/auth/me`, { headers });
        if (userRes.ok) setUserData(await userRes.json());

        const artRes = await fetch(`${API_BASE}/savework/user/saved`, { headers });
        if (!artRes.ok) throw new Error(`Status: ${artRes.status}`);

        const data = await artRes.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleBecomeArtist = () => {
    navigate('/convert');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto w-full">

        {/* User Profile */}
        <UserProfile
          name={userData ? (userData.full_name || `${userData.first_name || 'User'} ${userData.last_name || ''}`) : "Loading..."}
          role={userData?.role || "Art Enthusiast"}
          avatar={userData?.profile_image || "https://ik.imagekit.io/sjunnxn6x/Profile-Pictures/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.avif?updatedAt=1773944392522"}
          collectionCount={artworks.length}
          activeTab="collection"
          onTabChange={() => {}}
        />

        {/* Header row: title + Switch to Artist CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            My Art Collection
          </h2>

          <button
            onClick={handleBecomeArtist}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5
              rounded-full
              bg-[#FFC247] hover:bg-yellow-400 active:scale-95
              text-gray-900 font-bold text-sm
              shadow-md shadow-yellow-500/25
              transition-all duration-200
            "
          >
            <PaletteIcon />
            Switch to Artist
          </button>
        </div>

        {error && (
          <div className="text-center text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-wrap gap-6 items-start justify-center">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-wrap gap-6 items-start justify-center">
            {artworks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-10">
                No artworks found in your collection.
              </p>
            ) : (
              artworks.map(artwork => (
                <CardWithRealInfo key={artwork.id} artwork={artwork} />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SaveWork;
