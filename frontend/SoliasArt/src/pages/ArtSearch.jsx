import { useState, useEffect, useCallback } from "react";
import ArtDisplayCard from "../components/Art-card";
import SearchBar from "../components/SearchBar";
import UploadButton from "../components/UploadButton";
import CartButton from "../components/CartButton";

import soliasartlogo from "../assets/soliasartlogo.png"
import {artworkService} from "../services/uploadApi";
import { useParams, useNavigate } from 'react-router-dom'


const ArtSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // const { userId } = useParams()

  const [ARTWORKS, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    artworkService
      .getArtWorks()
      .then((data) => setArtworks(data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load artworks."))
      .finally(() => setLoading(false));

  }, [navigate]);

  const handleSearch = async (searchQuery, file) => {
    const searchFile = file || imageFile;
    if (!searchQuery && !searchFile) return;
    setLoading(true);
    setError(null);
    try {
      const results = await artworkService.SearchArtWork(
        searchQuery || null,
        searchFile || null
      );
      setArtworks(results || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Apply / remove the "dark" class on <html> so ALL dark: variants work ──
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleArtworkClick = useCallback(
    (id) => {
      navigate(`/artwork/${id}`);
    },
    [navigate]
  );

  return (
    
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-300">

        {/* ── Main content ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Sticky top bar */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="px-6 py-3 flex items-center gap-3">


              <div className="flex-1 flex justify-center">
                <SearchBar
                  onSearch={setQuery}
                  onSearchSubmit={handleSearch}
                  previewImage={previewImage}
                  onClearImage={() => {
                    if (previewImage) URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                    setImageFile(null);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">

                <UploadButton onImageUpload={(url, file) => {
                  if (previewImage) URL.revokeObjectURL(previewImage);
                  const ownUrl = URL.createObjectURL(file);
                  setPreviewImage(ownUrl);
                  setImageFile(file);
                  handleSearch(null, file);
                }} />

                <div 
                  onClick={() => navigate('/cart')} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <CartButton count={0} />
                </div>

              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 px-6 py-8 bg-white dark:bg-gray-950 transition-colors duration-300">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC247]"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            ) : (
              <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {query ? `Results for "${query}"` : "All Masterpieces"}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {ARTWORKS.length} artwork{ARTWORKS.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {ARTWORKS.length > 0 ? (
              <div className="flex flex-wrap gap-4 items-start justify-center">
                {ARTWORKS.map((art) => {
                  const imgUrl = Array.isArray(art.image_url) ? art.image_url[0] : art.image_url;
                  return (
                  <div
                    key={art.id}
                    onClick={() => handleArtworkClick(art.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ArtDisplayCard image={imgUrl} formData={{
                      title: art.title,
                      price: art.price,
                      category: art.medium || '',
                      height: art.height_in || '',
                      width: art.width_in || '',
                      images: imgUrl ? [imgUrl] : [],
                    }} />
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight mb-1">
                  No results found
                </h3>
                <p className="text-sm text-gray-400">
                  Try "genshin", "zzz", "raiden", "venti", or "ellen"
                </p>
              </div>
            )}
              </>
            )}
          </main>

        </div>

    </div>
  );
};

export default ArtSearch;