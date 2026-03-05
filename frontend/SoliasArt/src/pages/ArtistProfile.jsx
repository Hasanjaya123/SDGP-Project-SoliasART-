import React, { useState } from 'react';
import { ICONS } from '../constants';

export const ArtistProfilePage = ({ 
  artist = {
    id: '1',
    name: 'Unknown Artist',
    bio: '',
    profileImageUrl: 'https://via.placeholder.com/150',
    isVerified: false,
    specialty: '',
    location: 'Unknown',
    yearsExperience: '',
    styles: [],
    followers: 0,
    recognition: [],
  }, 
  artworks = [], 
  posts = [], 
  savedArtworks = [], 
  setCurrentPage = () => {}, 
  currentUser = { followingIds: [] }, 
  onToggleFollow = () => {} 

} ) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  const isFollowing = currentUser?.followingIds?.includes(artist.id) ?? false;

  // Mock "Sold" count based on arbitrary logic for display purposes
  const soldCount = Math.floor((artist.followers || 0) / 15); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const coverImageUrl = artist.id === '1' 
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL9_rRiYBuwt-uSrscE9TYSxWgzPKxxYLBcFQfJPLq6uIeCWyJ5_LE_xYgoMiAXYKcdpn1SvFALZYTbH0C_Y1q68WCuSUE8gMOfag4o4BJwETUiOCgzO0OtDR5lCEKbKl2daLGMLcwfWMt9xw4Q0xWaK7dFHZR9Eoi-js1HmxihvXJsgj8JqBJ4I-nZUeQu9lcJlc5scp2MBGmt7NGrjV52OAwquyQrLWuncrCDl1sbFPVWCeEu3AF_Ni4dEsJO9uYuG-kw51SjTc'
    : `https://picsum.photos/seed/${artist.id}-cover/1200/600`;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans pb-20 transition-colors duration-300">
      
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative bg-slate-200 dark:bg-zinc-800">
        <img 
          alt={`${artist.name} Cover`} 
          className="w-full h-full object-cover transition-all duration-500" 
          src={coverImageUrl} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Avatar and Actions Row */}
        <div className="px-4 md:px-8 pb-8 -mt-20 relative">
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
                onClick={() => onToggleFollow(artist.id)}
                className={`font-bold text-sm px-6 py-2 rounded-full shadow-sm transition-colors ${
                  isFollowing 
                  ? 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-white'
                  : 'bg-[#FFC247] text-slate-900 hover:bg-yellow-400'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                onClick={() => setIsChatModalOpen(true)}
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
            {artist.styles && artist.styles.length > 0 && (
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
                {artist.followers >= 1000 ? (artist.followers / 1000).toFixed(1) + 'k' : artist.followers}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Followers</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{artworks.length}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Artworks</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{soldCount}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sold</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-slate-200 dark:border-zinc-800">
            <nav className="flex gap-8">
              <button 
                onClick={() => handleTabChange('portfolio')}
                className={`pb-3 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'portfolio' 
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => handleTabChange('uploads')}
                className={`pb-3 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'uploads' 
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Uploads
              </button>
              <button 
                onClick={() => handleTabChange('about')}
                className={`pb-3 border-b-2 text-sm font-bold transition-colors ${
                  activeTab === 'about' 
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Content Section */}
          <div className="mt-8 min-h-[400px]">
            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {artworks.map((artwork, idx) => (
                    <div key={artwork.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      {/* ArtworkCard component - replace with your actual component */}
                      <div 
                        onClick={() => setCurrentPage('artworkDetail', artwork.id)}
                        className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <img src={artwork.imageUrl} alt={artwork.title} className="w-full aspect-square object-cover" />
                        <div className="p-3">
                          <h3 className="font-bold text-slate-900 dark:text-white">{artwork.title}</h3>
                          {artwork.price && <p className="text-sm text-slate-500 dark:text-slate-400">${artwork.price}</p>}
                        </div>
                      </div>
                    </div>
                ))}
                {artworks.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400">
                        <p>No artworks in portfolio yet.</p>
                    </div>
                )}
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div key={post.id} className="relative aspect-square bg-slate-100 dark:bg-zinc-800 group cursor-pointer overflow-hidden">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : post.videoUrl ? (
                      <video src={post.videoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-700 text-slate-500 p-4 text-center text-sm">
                        {post.text.slice(0, 50)}...
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                      <div className="flex items-center gap-1">
                        {React.cloneElement(ICONS.heartSolid, { className: 'w-5 h-5'})}
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        {React.cloneElement(ICONS.chat, { className: 'w-5 h-5'})}
                        {post.comments?.length || 0}
                      </div>
                    </div>
                    {post.videoUrl && (
                      <div className="absolute top-2 right-2 text-white drop-shadow-md">
                        {React.cloneElement(ICONS.video, { className: 'w-6 h-6'})}
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
            )}

            {activeTab === 'about' && (
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
                  {artist.recognition && (
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
            )}
          </div>
        </div>
      </div>

      {isChatModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chat with {artist.name}</h2>
              <button onClick={() => setIsChatModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Commission request chat coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};