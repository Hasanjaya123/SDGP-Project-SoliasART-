import { useState, useMemo, useEffect } from "react";
import ArtDisplayCard from "../components/Art-card";
import SearchBar from "../components/SearchBar";
import UploadButton from "../components/UploadButton";
import CartButton from "../components/CartButton";
import Sidebar from "../components/Nav-bar";
import Footer from "../components/Footer";
import soliasartlogo from "../assets/soliasartlogo.png"

// artwork data using picsum as placeholder images
const ARTWORKS = [
  {
    id: 1,
    title: "Lumine's Odyssey",
    category: "Genshin Impact",
    price: "125000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/lumine/400/530"],
    tags: ["genshin", "lumine", "traveler", "fantasy"],
  },
  {
    id: 2,
    title: "Raiden Shogun",
    category: "Genshin Impact",
    price: "185000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/raiden/400/530"],
    tags: ["genshin", "raiden", "electro", "shogun"],
  },
  {
    id: 3,
    title: "Hollow City Neon",
    category: "Zenless Zone Zero",
    price: "95000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/zzzneon/400/530"],
    tags: ["zzz", "zenless", "neon", "city"],
  },
  {
    id: 4,
    title: "Belle & Wise",
    category: "Zenless Zone Zero",
    price: "110000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/belle/400/530"],
    tags: ["zzz", "belle", "wise", "proxy"],
  },
  {
    id: 5,
    title: "Zhongli's Era",
    category: "Genshin Impact",
    price: "200000",
    height: "5",
    width: "4",
    images: ["https://picsum.photos/seed/zhongli/400/500"],
    tags: ["genshin", "zhongli", "geo", "archon"],
  },
  {
    id: 6,
    title: "Mondstadt Winds",
    category: "Genshin Impact",
    price: "75000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/mondstadt/400/530"],
    tags: ["genshin", "mondstadt", "venti", "wind"],
  },
  {
    id: 7,
    title: "Ellen Joe Drift",
    category: "Zenless Zone Zero",
    price: "145000",
    height: "4",
    width: "3",
    images: ["https://picsum.photos/seed/ellen/400/530"],
    tags: ["zzz", "ellen", "ice", "shark"],
  },
  {
    id: 8,
    title: "Teyvat Dusk",
    category: "Genshin Impact",
    price: "165000",
    height: "3",
    width: "4",
    images: ["https://picsum.photos/seed/teyvat/530/400"],
    tags: ["genshin", "teyvat", "landscape", "sunset"],
  },
];

const ArtSearch = () => {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [previewImage, setPreviewImage] = useState(null); // object URL from UploadButton

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
        art.title.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.tags.some((t) => t.includes(q))
    );
  }, [query]);

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
        <div className="flex flex-col flex-1 min-w-0">

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
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {query ? `Results for "${query}"` : "All Masterpieces"}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {filtered.length} artwork{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="flex flex-wrap" style={{ margin: "-4px" }}>
                {filtered.map((art) => (
                  <div
                    key={art.id}
                    className="w-1/2 sm:w-1/3 lg:w-1/4"
                    style={{ padding: "4px" }}
                  >
                    <ArtDisplayCard image={art.images[0]} formData={art} />
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