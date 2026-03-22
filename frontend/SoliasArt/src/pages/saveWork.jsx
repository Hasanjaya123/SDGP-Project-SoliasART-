import { useState, useEffect } from 'react';        
import ArtDisplayCard from '../components/Art-card';  
import UserProfile from '../comp/UserProfile';
import { api } from '../services/uploadApi';


// ─── Seeded random so numbers stay stable across re-renders ───
// Uses the artwork UUID chars to produce a consistent number each time.
function seededRandom(seed, min, max) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const norm = (Math.abs(hash) % 1000) / 1000; // 0–0.999
  return Math.floor(norm * (max - min + 1)) + min;
}


// ─── Icons (defined FIRST so CardWithRealInfo can use them) ───
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



// ─── Card wrapper ─────────────────────────────────────────────
function CardWithRealInfo({ artwork }) {
  // Pick first image from the array returned by the API
  const image = artwork.image_url?.[0] || '';

  const formData = {
    title:    artwork.title    || 'UNTITLED ARTWORK',
    category: artwork.medium   || 'New Release',
    price:    artwork.price    || 0,
    height:   artwork.height_in ? artwork.height_in * 25.4 : 400, // inches → mm approx
    width:    artwork.width_in  ? artwork.width_in  * 25.4 : 300,
    images:   artwork.image_url || [],
    artist_name: artwork.artist_name || 'Unknown Artist',
    views: seededRandom(artwork.id + 'v', 300, 5000), 
    likes: seededRandom(artwork.id + 'l', 80, 1200),
  };

  return (
    <div className="relative">
      {/*saved artworks */}
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
  const [activeTab, setActiveTab]       = useState('collection');
  const [artworks, setArtworks]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check for auth token before fetching
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login to view your profile");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetching user profile and saved artworks 
    const fetchProfileData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch User Info
        try {
          const userRes = await api.get('/auth/me');
          setUserData(userRes.data);
        } catch (e) {
          // gracefully handle missing user info if needed
        }

        // Fetch saved artworks
        const artRes = await api.get('/savework/user/saved');
        setArtworks(artRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const collectionArtworks = artworks; 
  const likedArtworks = artworks.filter(art => art.isLiked === true); 
  const displayedArtworks = activeTab === 'collection' ? collectionArtworks : likedArtworks;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col p-4 md:p-8 transition-colors duration-200">

      <div className="max-w-7xl mx-auto w-full">
        
        {/* Userprofile */}
        <UserProfile
          name={userData ? (userData.full_name || `${userData.first_name || 'User'} ${userData.last_name || ''}`) : "Loading..."}
          role={userData?.role || "Art Enthusiast"}
          avatar={userData?.profile_image || "https://ik.imagekit.io/sjunnxn6x/Profile-Pictures/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.avif?updatedAt=1773944392522"}
          collectionCount={collectionArtworks.length}
          likedCount={likedArtworks.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
          {activeTab === 'collection' ? 'My Art Collection' : 'Liked Artworks'}
        </h2>

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
            {displayedArtworks.length === 0 ? (
              <p className="text-gray-500 text-sm mt-10">No artworks found in your collection.</p>
            ) : (
              displayedArtworks.map(artwork => (
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
