import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ArtDisplayCard from "../components/Art-card";
import Sidebar from "../components/Nav-bar";
import Footer from "../components/Footer";
import { artworkService } from "../services/uploadApi";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const PlusCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TrendUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const BrushIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ShoppingBagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

// This helper handles both so neither breaks.
const getImageSrc = (image_url) => {
  if (!image_url) return null;
  if (Array.isArray(image_url)) return image_url[0] ?? null;
  return image_url; // plain string fallback
};

const toCardProps = (art) => {
  const src = getImageSrc(art.image_url);
  return {
    image: src,
    formData: {
      title:    art.title     ?? "",
      price:    art.price     ?? "",
      category: art.medium    ?? "",
      height:   art.height_in ?? "",
      width:    art.width_in  ?? "",
      // ArtDisplayCard checks for the placeholder logic
      images:   src ? [src] : [],
    },
  };
};

const deriveMetrics = (artworks) => {
  const total        = artworks.length;
  const sold         = artworks.filter((a) => a.status?.toLowerCase() === "sold").length;
  const totalRevenue = artworks
    .filter((a) => a.status?.toLowerCase() === "sold")
    .reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
  const views = artworks.reduce((sum, a) => sum + (parseInt(a.views)  || 0), 0);
  const likes = artworks.reduce((sum, a) => sum + (parseInt(a.likes)  || 0), 0);
  return { total, sold, totalRevenue, views, likes };
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
    <div className="bg-slate-200 rounded aspect-[3/4] mb-4" />
    <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-3" />
    <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto" />
  </div>
);

// ─── Single metric card ───────────────────────────────────────────────────────
const MetricCard = ({ label, value, badge, badgeClass, iconClass, Icon, loading, span2 }) => (
  <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow${span2 ? " col-span-2" : ""}`}>
    <div className="flex items-center justify-between mb-3">
      <span className={`p-2 rounded-lg ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </span>
      {loading ? (
        <div className="h-6 w-14 bg-slate-200 rounded animate-pulse" />
      ) : (
        <span className={`text-xs font-bold px-2.5 py-1 rounded ${badgeClass}`}>{badge}</span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    {loading ? (
      <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-1" />
    ) : (
      <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
    )}
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const ArtistDashboard = () => {
  const { userId } = useParams();

  const [artworks, setArtworks] = useState([]);
  const [artist, setArtist] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");

  // ── Fetch artworks ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    artworkService
      .getdashboardData()
      .then((data) => {
        setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
        setArtist(data.artist || null);
        setStatistics(data.Statistics || null);
      })
      .catch((err) =>
        setError(err?.response?.data?.detail ?? err?.message ?? "Failed to load artworks.")
      )
      .finally(() => setLoading(false));

  }, []);

  // ── Recent Sales ──────────────────────────────────────────────────────────
  const recentSales = useMemo(
    () =>
      [...artworks]
        .filter((a) => a.status?.toLowerCase() === "sold")
        .sort((a, b) => new Date(b.sold_at ?? 0) - new Date(a.sold_at ?? 0))
        .slice(0, 5),
    [artworks]
  );

  // ── Search filter ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return artworks;
    return artworks.filter(
      (a) =>
        a.title?.toLowerCase().includes(q)  ||
        a.medium?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q)
    );
  }, [search, artworks]);

  // statistics 
  const total = statistics?.listed_art_works ?? artworks.length;
  const sold = statistics?.sold_artworks ?? deriveMetrics(artworks).sold;
  const totalRevenue = statistics?.total_revenue ?? deriveMetrics(artworks).totalRevenue;
  const views = statistics?.total_views ?? deriveMetrics(artworks).views;
  const likes = statistics?.total_likes ?? deriveMetrics(artworks).likes;

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 font-sans">

      {/* ── Sidebar — unmodified ── */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 gap-6">
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-900">
              {artist ? `Good Morning, ${artist.name}!` : "Good Morning!"}
            </h2>
            <p className="text-sm text-slate-500">Welcome back to your command center.</p>
          </div>
          {artist && (
            <img
              src={artist.profileImageUrl}
              alt={artist.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
          )}

          <div className="flex items-center gap-4 ml-auto">
            {/* Search bar with placeholder text */}
            <div className="relative hidden lg:block">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your inventory..."
                className="pl-9 pr-8 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-amber-400 w-72 text-sm outline-none transition-all placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Upload button */}
            <a
              href="/user/dashboard/upload/3dff7d1a-467b-431f-b4f0-9541e7d6c318"
              className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm text-sm whitespace-nowrap"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Upload New Artwork
            </a>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                label="Total Revenue"
                value={`LKR ${totalRevenue.toLocaleString()}`}
                badge={`+12.5%`}
                badgeClass="text-emerald-600 bg-emerald-50"
                iconClass="bg-emerald-50 text-emerald-600"
                Icon={TrendUpIcon}
                loading={loading}
              />
              <MetricCard
                label="Listed Artworks"
                value={total.toString()}
                badge={`+${total}`}
                badgeClass="text-blue-600 bg-blue-50"
                iconClass="bg-blue-50 text-blue-600"
                Icon={BrushIcon}
                loading={loading}
              />
              <MetricCard
                label="Sold Artworks"
                value={sold.toString()}
                badge={sold > 0 ? `${sold} New` : "—"}
                badgeClass="text-amber-600 bg-amber-50"
                iconClass="bg-amber-50 text-amber-600"
                Icon={ShoppingBagIcon}
                loading={loading}
              />
              <MetricCard
                label="Store Views"
                value={views > 0 ? views.toLocaleString() : "—"}
                badge={views > 999 ? `${(views / 1000).toFixed(1)}k` : `${views}`}
                badgeClass="text-purple-600 bg-purple-50"
                iconClass="bg-purple-50 text-purple-600"
                Icon={EyeIcon}
                loading={loading}
              />
              {/* Profile Likes spans only one column, sits on the left — matches reference */}
              <MetricCard
                label="Profile Likes"
                value={likes > 0 ? likes.toLocaleString() : "—"}
                badge={`+${likes}`}
                badgeClass="text-rose-600 bg-rose-50"
                iconClass="bg-rose-50 text-rose-600"
                Icon={HeartIcon}
                loading={loading}
              />
            </div>

            {/* ── Active Artworks + Recent Sales ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Active Artworks */}
              <div className="xl:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Active Artworks
                  {!loading && search && (
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      — {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
                    </span>
                  )}
                </h3>

                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                  </div>
                )}

                {!loading && error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex items-center gap-4">
                    <AlertIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 font-semibold">Failed to load artworks</p>
                      <p className="text-red-500 text-sm mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {!loading && !error && filtered.length === 0 && search && (
                  <div className="bg-white border border-slate-200 rounded-xl p-14 flex flex-col items-center text-center">
                    <SearchIcon className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-600 font-semibold">No artworks match &ldquo;{search}&rdquo;</p>
                    <p className="text-slate-400 text-sm mt-1">Try searching by title, medium, or status</p>
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 text-amber-500 text-sm font-bold hover:text-amber-600 transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                )}

                {!loading && !error && artworks.length === 0 && !search && (
                  <div className="bg-white border border-dashed border-slate-300 rounded-xl p-14 flex flex-col items-center text-center">
                    <BrushIcon className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-600 font-semibold">No artworks yet</p>
                    <p className="text-slate-400 text-sm mt-1">Upload your first artwork to get started</p>
                    <a
                      href="/user/dashboard/upload/3dff7d1a-467b-431f-b4f0-9541e7d6c318"
                      className="mt-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Upload Artwork
                    </a>
                  </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((art) => {
                      const { image, formData } = toCardProps(art);
                      return (
                        <div
                          key={art.id}
                          className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden"
                        >
                          <ArtDisplayCard image={image} formData={formData} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Sales feed */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Recent Sales</h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">

                  {loading && [1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-14" />
                        <div className="h-2 bg-slate-200 rounded w-10 ml-auto" />
                      </div>
                    </div>
                  ))}

                  {!loading && recentSales.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-slate-400 text-sm">No sales yet</p>
                    </div>
                  )}

                  {!loading && recentSales.map((art) => {
                    const imgSrc = getImageSrc(art.image_url);
                    return (
                      <div key={art.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                        <img
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          src={imgSrc}
                          alt={art.title}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-slate-900">{art.title}</p>
                          <p className="text-xs text-slate-500">
                            {art.buyer_name ? `${art.buyer_name} • ` : ""}
                            {art.sold_at ? new Date(art.sold_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            LKR {parseInt(art.price ?? 0).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                            Processed
                          </p>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

            </div>

            {/* ── Footer — unmodified ── */}
            <Footer />

          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;
