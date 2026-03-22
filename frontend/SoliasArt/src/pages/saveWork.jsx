import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav-bar';
import ArtDisplayCard from '../components/Art-card';
import Footer from '../components/Footer';
import UserProfile from '../comp/UserProfile';

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";


// ─── Seeded random so numbers stay stable across re-renders ───
function seededRandom(seed, min, max) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const norm = (Math.abs(hash) % 1000) / 1000;
  return Math.floor(norm * (max - min + 1)) + min;
}


// ─── Icons ───
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 shrink-0">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 shrink-0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

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


// ─── Card wrapper ─────────────────────────────────────────────
function CardWithRealInfo({ artwork }) {
  const image = artwork.image_url?.[0] || '';

  const formData = {
    title:    artwork.title    || 'UNTITLED ARTWORK',
    category: artwork.medium   || 'New Release',
    price:    artwork.price    || 0,
    height:   artwork.height_in ? artwork.height_in * 25.4 : 400,
    width:    artwork.width_in  ? artwork.width_in  * 25.4 : 300,
    images:   artwork.image_url || [],
  };

  return (
    <div className="relative">
      <ArtDisplayCard image={image} formData={formData} />
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: '68px' }}
      >
        <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 w-full text-center py-0.5 transition-colors">
          {artwork.artist_name || 'Unknown Artist'}
        </p>
        <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 text-[11px] font-medium bg-white dark:bg-gray-900 w-full py-0.5 transition-colors">
          <span className="flex items-center gap-1">
            <EyeIcon />{seededRandom(artwork.id + 'v', 300, 5000).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <HeartIcon />{seededRandom(artwork.id + 'l', 80, 1200).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="w-[220px] animate-pulse">
      <div className="bg-gray-800 rounded h-[320px] mb-3" />
      <div className="bg-gray-800 rounded h-3 w-2/3 mx-auto mb-2" />
      <div className="bg-gray-800 rounded h-3 w-1/2 mx-auto" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
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
        setError(err.response?.data?.detail || err.message);
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
              <p className="text-gray-500 text-sm mt-10">No artworks found in your collection.</p>
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
