import { useState, useMemo, useEffect } from "react";
import ArtDisplayCard from "../components/Art-card";
import SearchBar from "../components/SearchBar";
import UploadButton from "../components/UploadButton";
import CartButton from "../components/CartButton";
import Sidebar from "../components/Nav-bar";
import Footer from "../components/Footer";
import soliasartlogo from "../assets/soliasartlogo.png"
import {artworkService} from "../services/uploadApi";
import { useParams } from 'react-router-dom'


const ArtSearch = () => {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [previewImage, setPreviewImage] = useState(null); 
  const { userId } = useParams()

  const [ARTWORKS, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    artworkService
      .getArtWorks(userId)
      .then((data) => setArtworks(data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load artworks."))
      .finally(() => setLoading(false));

  }, [userId]);

  // ── Apply / remove the "dark" class on <html> so ALL dark: variants work ──
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const filtered = useMemo(() => {
    if (!query.trim()) return ARTWORKS;
    const q = query.toLowerCase();
    return ARTWORKS.filter(
      (art) =>
        art.title?.toLowerCase().includes(q) ||
        art.medium?.toLowerCase().includes(q)
    );
  }, [query, ARTWORKS]);

  return (
    /*
      Root wrapper:
      - `dark` class is toggled on <html> via useEffect above, so dark: variants
        fire globally — including inside Nav-bar.jsx without editing it.
      - We use a flex-col wrapper so the footer can span full width at the bottom.
    */
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-300">

      {/* ── Top section: sidebar + main side by side ── */}
      <div className="flex flex-1 min-h-0">

        <div
          className="
            fixed top-0 left-0 h-screen z-50
            flex-shrink-0
            [&>div]:dark:bg-gray-900
            [&>div]:dark:border-gray-800
            [&_nav_div]:dark:text-gray-400
            [&_nav_div:hover]:dark:text-amber-500
            [&_nav_div:hover]:dark:bg-gray-800
            [&_.border-t]:dark:border-gray-700
            [&_h4]:dark:text-white
            [&_p]:dark:text-gray-400
            [&_.text-\[\#0F2C59\]]:dark:text-white
          "
        >
          <Sidebar />
        </div>

        {/* ── Right column: header + main content ── */}
        <div className="flex flex-col flex-1 min-w-0 ml-64">

          {/* Sticky top bar */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="px-6 py-3 flex items-center gap-3">

              {/* Logo PNG — replaces the old "ArtVault" text */}
               <div className="flex-shrink-0 mr-2">
                <img
                  src={soliasartlogo}
                  alt="SoliasART"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="flex-1 flex justify-center">
                <SearchBar
                  onSearch={setQuery}
                  previewImage={previewImage}
                  onClearImage={() => {
                    if (previewImage) URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <UploadButton onImageUpload={(url) => setPreviewImage(url)} />
                <CartButton count={0} />
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
                {filtered.length} artwork{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="flex flex-wrap gap-4 items-start justify-center">
                {filtered.map((art) => (
                  <div
                    key={art.id}
                  >
                    <ArtDisplayCard image={art.image_url?.[0]} formData={{
                      title: art.title,
                      price: art.price,
                      category: art.medium || '',
                      height: art.height_in || '',
                      width: art.width_in || '',
                      images: art.image_url ? [art.image_url] : [],
                    }} />
                  </div>
                ))}
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

      {/*
        Footer is OUTSIDE the flex row — sits below both sidebar and main content.
        This guarantees it stretches the full page width (sidebar + content combined).
      */}
      <Footer />

    </div>
  );
};

export default ArtSearch;