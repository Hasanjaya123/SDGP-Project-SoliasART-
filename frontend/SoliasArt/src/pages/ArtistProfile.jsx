import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { artistProfileService } from '../services/uploadApi';
import ArtDisplayCard from '../components/Art-card';
import CommissionModal from '../components/CommissionModal';


// --- Upload Post Modal ---

const CreatePostModal = ({ artist, artistId, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!title.trim() && !description.trim() && !selectedImage) {
      setError('Please add a title, description, or image.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const newPost = await artistProfileService.uploadPost(artistId, {
        title: title.trim(),
        description: description.trim(),
        imageFile: selectedImage,
      });
      onPostCreated(newPost);
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-700 shrink-0">
              <img src={artist?.profileImageUrl} alt={artist?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{artist?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Post to Anyone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-lg font-bold"
          >
            âœ•
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <input
            type="text"
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base font-semibold outline-none border-b border-slate-100 dark:border-zinc-800 pb-2 focus:border-[#FFC247] transition-colors"
            maxLength={120}
          />
          <textarea
            placeholder="What do you want to talk about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm leading-relaxed outline-none resize-none"
            maxLength={1000}
          />
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800 group">
              <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                âœ•
              </button>
            </div>
          )}
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              id="post-image-input"
            />
            <label
              htmlFor="post-image-input"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedImage
                  ? 'bg-[#FFC247]/20 text-[#b8860b] dark:text-[#FFC247]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">image</span>
              <span>{selectedImage ? 'Image added' : 'Add image'}</span>
            </label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!title.trim() && !description.trim() && !selectedImage)}
            className="px-6 py-2 bg-[#FFC247] text-slate-900 font-bold text-sm rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for tab content ---

const PortfolioTab = ({ artworks, onArtworkClick, artistName }) => (
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
            artist_name: artistName || '',
            views: artwork.view_count || artwork.views || 0,
            likes: artwork.likes || 0
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

const UploadsTab = ({ posts, onCreatePost, isOwner }) => (
  <div>
    {isOwner && (
      <div className="flex justify-end mb-4">
        <button
          onClick={onCreatePost}
          className="flex items-center gap-2 bg-[#FFC247] text-slate-900 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Post
        </button>
      </div>
    )}

    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {posts.map((post) => {
        const thumb = post.imageUrl || post.image_url?.[0] || null;
        const text = post.description || post.title || post.text || '';

        return (
          <div key={post.id} className="relative aspect-square bg-slate-100 dark:bg-zinc-800 group cursor-pointer overflow-hidden">
            {thumb ? (
              <img src={thumb} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : post.videoUrl ? (
              <video src={post.videoUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-700 text-slate-500 p-4 text-center text-sm">
                {text.slice(0, 50)}{text.length > 50 ? '...' : ''}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1">
                {React.cloneElement(ICONS.heartSolid, { className: 'w-5 h-5' })}
                {post.likes || 0}
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
        );
      })}
      {posts.length === 0 && (
        <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400">
          No posts uploaded yet.
        </div>
      )}
    </div>
  </div>
);

const CollectionsTab = ({ collections, onCollectionClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {collections.map((col) => (
      <div
        key={col.id}
        className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
        onClick={() => onCollectionClick(col.id)}
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          <img
            src={col.cover_image_url || col.artworks?.[0]?.image_url?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={col.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              View details
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{col.name}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{col.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">
              {col.artworks?.length || 0} Pieces
            </span>
            <div className="flex -space-x-2 overflow-hidden">
               {col.artworks?.slice(0, 3).map((art, i) => (
                  <img key={i} src={art.image_url?.[0]} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover" alt="" />
               ))}
            </div>
          </div>
        </div>
      </div>
    ))}
    {collections.length === 0 && (
      <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400 font-medium">
        This artist hasn't curated any collections yet.
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

// CommissionModal is now imported from '../components/CommissionModal'
const TABS = ['portfolio', 'uploads', 'collections', 'about'];

const formatFollowerCount = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;

// --- Main Page Component ---

export const ArtistProfilePage = () => {
  const { artistId: artistIdParam } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [artistId, setArtistId] = useState(artistIdParam || null)
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs whenever artistId changes (e.g. navigating to a different artist).
  // This is the main data-fetching hook Ã¢â‚¬â€ it calls the backend once and
  // populates all three pieces of state (artist, artworks, posts).
  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchProfile = artistIdParam
      ? artistProfileService.getProfileById(artistIdParam)
      : artistProfileService.getProfile();

    fetchProfile
      .then((data) => {
        if (cancelled) return;
        setArtistId(data.artist.id)
        setArtist(data.artist);
        setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
        setPosts(Array.isArray(data.posts) ? data.posts : []);

        // Fetch collections
        collectionService.getCollectionsByArtist(data.artist.id)
          .then(res => { if (!cancelled) setCollections(Array.isArray(res) ? res : []); })
          .catch(err => console.error("Collections fetch error:", err));

        // Fetch follow status
        if (data.artist?.id) {
          artistProfileService.checkIsFollowing(data.artist.id)
            .then(res => { if (!cancelled) setIsFollowing(res.is_following); })
            .catch(err => console.error("Follow status check error:", err));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.detail || 'Failed to load artist profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [artistIdParam]);

  const handleFollowClick = async () => {
    if (!artistId || isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await artistProfileService.unfollowArtist(artistId);
        setIsFollowing(false);
        setArtist(prev => ({ ...prev, followers: Math.max(0, (parseInt(prev.followers) || 0) - 1) }));
      } else {
        await artistProfileService.followArtist(artistId);
        setIsFollowing(true);
        setArtist(prev => ({ ...prev, followers: (parseInt(prev.followers) || 0) + 1 }));
      }
    } catch (err) {
      console.error('Follow toggle failed:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // When an artwork card is clicked, navigate to that artwork's details page
  const handleArtworkClick = useCallback(
    (id) => {
      navigate(`/artwork/${id}`);
    },
    [navigate]
  );

  const openModal = useCallback(() => setIsChatModalOpen(true), []);
  const closeModal = useCallback(() => setIsChatModalOpen(false), []);
  const openCreatePost = useCallback(() => setIsCreatePostModalOpen(true), []);
  const closeCreatePost = useCallback(() => setIsCreatePostModalOpen(false), []);

  const handlePostCreated = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  // Loading & Error states
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC247]"></div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black gap-4">
        <p className="text-slate-600 dark:text-slate-400 text-lg">{error || 'Artist not found.'}</p>
        <button
          onClick={() => navigate('/search')}
          className="text-[#FFC247] font-bold hover:underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
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
          {/* Avatar Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Avatar */}
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
            {/* Follow and Commission Buttons - right aligned */}
            <div className="flex flex-row gap-3 mt-4 md:mt-0 self-start md:self-center">
              <button
                onClick={handleFollowClick}
                disabled={isFollowLoading}
                className={`font-bold text-sm px-6 py-2 rounded-full shadow-sm transition-colors disabled:opacity-50 ${isFollowing
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-white'
                    : 'bg-[#FFC247] text-slate-900 hover:bg-yellow-400'
                  }`}
              >
                {isFollowLoading ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
              </button>
              <button
                onClick={openModal}
                className="bg-white dark:bg-zinc-800 border border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Request Commission
              </button>
            </div>
          </div>
          {/* Artist Info (below avatar, full width) */}
          <div className="mt-4">
            <div className="flex items-center gap-3 flex-wrap">
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
                  className={`pb-3 border-b-2 text-sm font-bold transition-colors capitalize ${activeTab === tab
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
              <PortfolioTab artworks={artworks} onArtworkClick={handleArtworkClick} artistName={artist?.display_name || artist?.name || ''} />
            )}
            {activeTab === 'uploads' && <UploadsTab posts={posts} onCreatePost={openCreatePost} isOwner={artist?.owner} />}
            {activeTab === 'collections' && <CollectionsTab collections={collections} onCollectionClick={(id) => navigate(`/collections/${id}`)} />}
            {activeTab === 'about' && <AboutTab artist={artist} />}
          </div>
        </div>
      </div>

      <CommissionModal
        isOpen={isChatModalOpen}
        onClose={closeModal}
        artistId={artistId}
      />
      {isCreatePostModalOpen && (
        <CreatePostModal
          artist={artist}
          artistId={artistId}
          onClose={closeCreatePost}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};
