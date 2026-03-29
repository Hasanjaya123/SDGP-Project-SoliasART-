import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtDisplayCard from '../components/Art-card';
import UserProfile from '../comp/UserProfile';

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// ─── Icons ────────────────────────────────────────────────────

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

const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
  </svg>
);

const HeartTabIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
  </svg>
);

// ─── Card wrapper ─────────────────────────────────────────────

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

// ─── Loading skeleton ─────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="w-[220px] animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-[320px] mb-3" />
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-3 w-2/3 mx-auto mb-2" />
      <div className="bg-gray-200 dark:bg-gray-800 rounded h-3 w-1/2 mx-auto" />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center mt-16 gap-3 text-gray-400 dark:text-gray-500">
      {tab === 'collection' ? (
        <>
          <BookmarkIcon filled={false} />
          <p className="text-sm">No artworks saved to your collection yet.</p>
        </>
      ) : (
        <>
          <HeartTabIcon filled={false} />
          <p className="text-sm">You haven't liked any artworks yet.</p>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

const SaveWork = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState('collection'); // 'collection' | 'liked'
  const [saved, setSaved]               = useState([]);
  const [liked, setLiked]               = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [likedFetched, setLikedFetched] = useState(false); // fetch liked lazily on first tab switch
  const [error, setError]               = useState(null);
  const [userData, setUserData]         = useState(null);

  // ── Fetch saved artworks + user profile on mount ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login to view your profile");
      setLoadingSaved(false);
      return;
    }

    const fetchInitial = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [userRes, artRes] = await Promise.all([
          fetch(`${API_BASE}/auth/me`, { headers }),
          fetch(`${API_BASE}/savework/user/saved`, { headers }),
        ]);

        if (userRes.ok) setUserData(await userRes.json());

        if (!artRes.ok) throw new Error(`Saved fetch failed: ${artRes.status}`);
        setSaved(await artRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchInitial();
  }, []);

  // ── Fetch liked artworks lazily when tab is first opened ──
  useEffect(() => {
    if (activeTab !== 'liked' || likedFetched) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchLiked = async () => {
      setLoadingLiked(true);
      try {
        const res = await fetch(`${API_BASE}/savework/user/liked`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Liked fetch failed: ${res.status}`);
        setLiked(await res.json());
        setLikedFetched(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingLiked(false);
      }
    };

    fetchLiked();
  }, [activeTab, likedFetched]);

  const artworks      = activeTab === 'collection' ? saved : liked;
  const isLoading     = activeTab === 'collection' ? loadingSaved : loadingLiked;
  const collectionCount = activeTab === 'collection' ? saved.length : liked.length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto w-full">

        {/* User Profile */}
        <UserProfile
          name={userData
            ? (userData.full_name || `${userData.first_name || 'User'} ${userData.last_name || ''}`)
            : "Loading..."}
          role={userData?.role || "Art Enthusiast"}
          avatar={userData?.profile_image || "https://ik.imagekit.io/sjunnxn6x/Profile-Pictures/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.avif?updatedAt=1773944392522"}
          collectionCount={collectionCount}
          activeTab="collection"
          onTabChange={() => {}}
        />

        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            My Art Collection
          </h2>

          <button
            onClick={() => navigate('/convert')}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-full
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

        {/* ── Tab toggle ── */}
        <div className="flex gap-1 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('collection')}
            className={`
              inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeTab === 'collection'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
            `}
          >
            <BookmarkIcon filled={activeTab === 'collection'} />
            Saved
            {saved.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-400 text-gray-900 rounded-full px-1.5 py-0.5 leading-none">
                {saved.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`
              inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeTab === 'liked'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
            `}
          >
            <HeartTabIcon filled={activeTab === 'liked'} />
            Liked
            {likedFetched && liked.length > 0 && (
              <span className="text-[10px] font-bold bg-rose-400 text-white rounded-full px-1.5 py-0.5 leading-none">
                {liked.length}
              </span>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center text-red-400 text-sm mb-6">{error}</div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex flex-wrap gap-6 items-start justify-center">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Artwork grid */}
        {!isLoading && !error && (
          <div className="flex flex-wrap gap-6 items-start justify-center">
            {artworks.length === 0
              ? <EmptyState tab={activeTab} />
              : artworks.map(artwork => (
                  <CardWithRealInfo key={artwork.id} artwork={artwork} />
                ))
            }
          </div>
        )}

      </div>
    </div>
  );
};

export default SaveWork;
