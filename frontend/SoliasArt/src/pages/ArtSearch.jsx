import { useState, useMemo } from "react";
import ArtDisplayCard from "../components/Art-card";
import SearchBar from "../components/SearchBar";
import UploadButton from "../components/UploadButton";
import CartButton from "../components/CartButton";
import Sidebar from "../components/Nav-bar";
import Footer from "../components/Footer";

// Genshin Impact / ZZZ themed artwork data using picsum as placeholder images
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
    <div className="flex min-h-screen bg-gray-950 font-sans">

      {/* ── Left Sidebar (Nav-bar.jsx — unmodified) ── */}
      <Sidebar />

      {/* ── Right column: top bar + content + footer ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
          <div className="px-6 py-3 flex items-center gap-3">
            <div className="flex-shrink-0 mr-2 hidden lg:block">
              <span className="text-lg font-black text-amber-500 tracking-tight uppercase">ArtVault</span>
            </div>

            <div className="flex-1 flex justify-center">
              <SearchBar onSearch={setQuery} />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <UploadButton />
              <CartButton count={0} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {query ? `Results for "${query}"` : "All Masterpieces"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} artwork{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((art) => (
                <div
                  key={art.id}
                  className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden hover:shadow-md hover:border-gray-700 transition-all"
                >
                  <ArtDisplayCard image={art.images[0]} formData={art} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-black text-gray-300 uppercase tracking-tight mb-1">No results found</h3>
              <p className="text-sm text-gray-400">Try "genshin", "zzz", "raiden", "venti", or "ellen"</p>
            </div>
          )}
        </main>

        {/* ── Footer (Footer.jsx — unmodified) ── */}
        <Footer />

      </div>
    </div>
  );
};

export default ArtSearch;