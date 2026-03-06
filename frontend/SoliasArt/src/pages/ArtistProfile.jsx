import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ICONS } from '../constants';
import { artistProfileService } from '../services/uploadApi';
import ArtDisplayCard from '../components/Art-card';
import Sidebar from '../components/Nav-bar';
import Footer from '../components/Footer';

// --- Sub-components for tab content ---

const PortfolioTab = ({ artworks, onArtworkClick }) => (
  <div className="flex flex-wrap gap-6 items-start justify-start">
    {artworks.map((artwork, idx) => (
      <div
        key={artwork.id}
        className="opacity-0 animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${idx * 100}ms` }}
        onClick={() => onArtworkClick(artwork.id)}
      >
        <ArtDisplayCard
          image={artwork.image_url[0]}
          formData={{
            title: artwork.title,
            price: artwork.price,
            category: artwork.medium || '',
            height: artwork.height_in || '',
            width: artwork.width_in || '',
            images: artwork.image_url ? [artwork.image_url] : [],
          }}
        />
      </div>
    ))}
    {artworks.length === 0 && (
      <div className="w-full text-center py-20 text-slate-500 dark:text-slate-400">
        <p>No artworks in portfolio yet.</p>
      </div>
    )}
  </div>
);

const UploadsTab = ({ posts }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
    {posts.map((post) => (
      <div key={post.id} className="relative aspect-square bg-slate-100 dark:bg-zinc-800 group cursor-pointer overflow-hidden">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : post.videoUrl ? (
          <video src={post.videoUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-700 text-slate-500 p-4 text-center text-sm">
            {post.text?.slice(0, 50)}...
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
          <div className="flex items-center gap-1">
            {React.cloneElement(ICONS.heartSolid, { className: 'w-5 h-5' })}
            {post.likes}
          </div>
          <div className="flex items-center gap-1">
            {React.cloneElement(ICONS.chat, { className: 'w-5 h-5' })}
            {post.comments?.length || 0}
          </div>
        </div>
        {post.videoUrl && (
          <div className="absolute top-2 right-2 text-white drop-shadow-md">
            {React.cloneElement(ICONS.video, { className: 'w-6 h-6' })}
          </div>
        )}
      </div>
    ))}
    {posts.length === 0 && (
      <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400">
        No posts uploaded yet.
      </div>
    )}
  </div>
);

const AboutTab = ({ artist }) => (
  <div className="max-w-2xl">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Artist</h3>
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-8">
      {artist.bio}
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Specialty</h4>
        <p className="text-slate-600 dark:text-slate-400">{artist.specialty}</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Based In</h4>
        <p className="text-slate-600 dark:text-slate-400">{artist.location}</p>
      </div>
      {artist.recognition?.length > 0 && (
        <div className="sm:col-span-2">
          <h4 className="font-bold text-slate-900 dark:text-white mb-2">Recognition</h4>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
            {artist.recognition.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const CommissionModal = ({ artistName, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chat with {artistName}</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          âœ•
        </button>
      </div>
      <p className="text-slate-600 dark:text-slate-400">Commission request chat coming soon.</p>
    </div>
  </div>
);

const TABS = ['portfolio', 'uploads', 'about'];

const formatFollowerCount = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;

// --- Main Page Component ---

export const ArtistProfilePage = ({
  setCurrentPage = () => {},
  currentUser = { followingIds: [] },
  onToggleFollow = () => {},
}) => {
  const { artistId } = useParams();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs whenever artistId changes (e.g. navigating to a different artist).
  // This is the main data-fetching hook â€” it calls the backend once and
  // populates all three pieces of state (artist, artworks, posts).
  useEffect(() => {
    if (!artistId) {
      setError('No artist ID provided.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    artistProfileService
      .getProfile(artistId)
      .then((data) => {
        if (cancelled) return;
        setArtist(data.artist);
        setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.detail || 'Failed to load artist profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [artistId]);

  const isFollowing = currentUser?.followingIds?.includes(artistId) ?? false;

  const handleFollowClick = useCallback(() => {

    onToggleFollow(artistId);
  }, [artistId, onToggleFollow]);

  const handleArtworkClick = useCallback(
    (id) => setCurrentPage('artworkDetail', id),
    [setCurrentPage]
  );

  const openModal = useCallback(() => setIsChatModalOpen(true), []);
  const closeModal = useCallback(() => setIsChatModalOpen(false), []);

  // --- Loading & Error states ---
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 h-screen z-50">
          <Sidebar />
        </div>
        <div className="ml-64 flex-1 flex items-center justify-center bg-white dark:bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC247]"></div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 h-screen z-50">
          <Sidebar />
        </div>
        <div className="ml-64 flex-1 flex flex-col items-center justify-center bg-white dark:bg-black gap-4">
          <p className="text-slate-600 dark:text-slate-400 text-lg">{error || 'Artist not found.'}</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-[#FFC247] font-bold hover:underline"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-50">
        <Sidebar />
      </div>

      {/* Main Content â€” offset by sidebar width (w-64 = 16rem) */}
      <div className="ml-64 flex-1">
        <div className="min-h-screen bg-white dark:bg-black font-sans transition-colors duration-300">

      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative bg-slate-200 dark:bg-zinc-800">
        <img
          alt={`${artist.name} Cover`}
          className="w-full h-full object-cover transition-all duration-500"
          src={artist.coverImageUrl || `https://picsum.photos/seed/${artistId}-cover/1200/600`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="px-4 md:px-8 pb-8 -mt-20 relative">
          {/* Avatar and Actions Row */}
          <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
            <div className="relative">
              <div className="size-32 md:size-36 rounded-full border-4 border-white dark:border-zinc-900 shadow-md bg-white dark:bg-zinc-800 overflow-hidden">
                <img
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  src={artist.profileImageUrl}
                />
              </div>
              {artist.isVerified && (
                <span className="absolute bottom-2 right-2 bg-white dark:bg-zinc-900 text-[#FFC247] rounded-full p-0.5 border border-slate-100 dark:border-zinc-700 shadow-sm">
                  <span className="material-symbols-outlined filled text-[20px]">verified</span>
                </span>
              )}
            </div>
            <div className="flex gap-3 mb-4 md:mb-8">
              <button
                onClick={handleFollowClick}
                className={`font-bold text-sm px-6 py-2 rounded-full shadow-sm transition-colors ${
                  isFollowing
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-white'
                    : 'bg-[#FFC247] text-slate-900 hover:bg-yellow-400'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={openModal}
                className="bg-white dark:bg-zinc-800 border border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Request Commission
              </button>
            </div>
          </div>

          {/* Artist Info */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{artist.name}</h1>
              {artist.specialty && (
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-[#FFC247]">palette</span>
                  {artist.specialty}
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">{artist.bio}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>{artist.location}</span>
              </div>
              {artist.yearsExperience && (
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>{artist.yearsExperience}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {artist.styles?.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {artist.styles.map((style, i) => (
                  <span key={i} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-800">
                    {style}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mt-8 border-t border-slate-100 dark:border-zinc-800 pt-6 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {formatFollowerCount(artist.followers)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Followers</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{artworks.length}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Artworks</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-slate-200 dark:border-zinc-800">
            <nav className="flex gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 text-sm font-bold transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8 min-h-[400px]">
            {activeTab === 'portfolio' && (
              <PortfolioTab artworks={artworks} onArtworkClick={handleArtworkClick} />
            )}
            {activeTab === 'uploads' && <UploadsTab posts={posts} />}
            {activeTab === 'about' && <AboutTab artist={artist} />}
          </div>
        </div>
      </div>

      {isChatModalOpen && (
        <CommissionModal artistName={artist.name} onClose={closeModal} />
      )}
        </div>

        <Footer />
      </div>
    </div>
  );
};
