import { useState, useEffect } from 'react';
import Sidebar from '../components/Nav-bar'           
import ArtDisplayCard from '../components/Art-card';   
import Footer from '../components/Footer';
import UserProfile from '../comp/UserProfile';

const API_BASE = "http://localhost:8000";


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
  };

  return (
    <div className="relative">
      <ArtDisplayCard image={image} formData={formData} />
      {/* Overlay real artist name + stats over ArtDisplayCard's hardcoded placeholders */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: '68px' }}
      >
        <p className="text-[11px] font-medium text-gray-400 bg-gray-950 w-full text-center py-0.5">
          {artwork.artist_name || 'Unknown Artist'}
        </p>
        <div className="flex items-center justify-center gap-3 text-gray-400 text-[11px] font-medium bg-gray-950 w-full py-0.5">
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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/savework/artworks?limit=20`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setArtworks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // For demo: split the fetched artworks into two tabs
  const half = Math.ceil(artworks.length / 2);
  const collectionArtworks = artworks.slice(0, Math.max(half, 5));
  const likedArtworks      = artworks.slice(Math.max(half - 3, 0));
  const displayedArtworks  = activeTab === 'collection' ? collectionArtworks : likedArtworks;

  return (
    <div className="dark min-h-screen bg-gray-950 flex flex-col">

      <style>{`
        .sidebar-override > div:first-child {
          background-color: #0a0a0f !important;
          border-right-color: #1f2937 !important;
        }
        .sidebar-override > div:first-child .text-gray-900 { color: #f9fafb !important; }
        .sidebar-override > div:first-child .text-gray-500 { color: #9ca3af !important; }
        .sidebar-override > div:first-child .text-\\[\\#0F2C59\\] { color: #f9fafb !important; }
        .sidebar-override > div:first-child .border-gray-200 { border-color: #1f2937 !important; }
        .sidebar-override > div:first-child .border-gray-300 { border-color: #374151 !important; }
        .sidebar-override > div:first-child .hover\\:bg-yellow-50:hover { background-color: #1f2937 !important; }
        .sidebar-override > div:first-child .hover\\:text-\\[\\#C58940\\]:hover { color: #f59e0b !important; }
        .sidebar-override > div:first-child .text-\\[\\#C58940\\] { color: #f59e0b !important; }
      `}</style>

      <div className="flex flex-1 sidebar-override">
        <Sidebar />

        <div className="flex-1 pl-4 pr-8 py-8">

          <UserProfile
            name="Alex Rider"
            role="Art Enthusiast"
            avatar="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200"
            collectionCount={collectionArtworks.length}
            likedCount={likedArtworks.length}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <h2 className="text-xl font-bold text-white text-center mb-8">
            {activeTab === 'collection' ? 'My Art Collection' : 'Liked Artworks'}
          </h2>

          {/* Error state */}
          {error && (
            <div className="text-center text-red-400 text-sm mb-6">
              Could not load artworks: {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="flex flex-wrap gap-6 items-start justify-center">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Artwork grid */}
          {!loading && !error && (
            <div className="flex flex-wrap gap-6 items-start justify-center">
              {displayedArtworks.length === 0 ? (
                <p className="text-gray-500 text-sm">No artworks found.</p>
              ) : (
                displayedArtworks.map(artwork => (
                  <CardWithRealInfo key={artwork.id} artwork={artwork} />
                ))
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SaveWork;
