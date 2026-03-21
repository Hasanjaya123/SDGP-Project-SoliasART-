import { useState, useEffect, useMemo } from 'react';
import { commissionService } from '../services/uploadApi';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
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
const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
    <div className="flex gap-6">
      <div className="w-44 h-44 bg-slate-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="flex gap-8 mt-4">
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-20" />
        </div>
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-slate-200 rounded-lg w-36" />
          <div className="h-10 bg-slate-200 rounded-lg w-24" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Commission Card ───────────────────────────────────────────────────────────
const CommissionCard = ({ commission, onAccept, onReject, processing }) => {
  const {
    id, title, description, medium, size_inches,
    proposed_budget, deadline, reference_image_url,
    buyer_name, created_at,
  } = commission;

  // Format the deadline nicely
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  // How fresh is this request?
  const isNew = created_at
    ? (Date.now() - new Date(created_at).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false;

  const isAccepted = commission.status === 'accepted';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* ─── Reference Image ─────────────────── */}
        <div className="sm:w-48 sm:h-auto h-48 flex-shrink-0 bg-slate-100">
          {reference_image_url ? (
            <img
              src={reference_image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* ─── Content ─────────────────────────── */}
        <div className="flex-1 p-6">
          {/* Title + Badge Row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {buyer_name && (
                <p className="text-xs text-slate-400 mt-0.5">by {buyer_name}</p>
              )}
            </div>
            {isNew && !isAccepted && (
              <span className="flex-shrink-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                New Request
              </span>
            )}
            {isAccepted && (
              <span className="flex-shrink-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                Accepted
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          {/* Spec row */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 mb-5">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Medium</p>
              <p className="text-sm text-slate-800 font-medium">{medium}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Dimensions</p>
              <p className="text-sm text-slate-800 font-medium">{size_inches}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Budget</p>
              <p className="text-sm text-emerald-600 font-bold">
                LKR {parseFloat(proposed_budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Deadline</p>
              <p className="text-sm text-slate-800 font-medium">{formattedDeadline}</p>
            </div>
          </div>

          {/* Action buttons */}
          {!isAccepted ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAccept(id)}
                disabled={processing === id}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-lg
                           text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                {processing === id ? 'Processing…' : 'Accept Request'}
              </button>
              <button
                onClick={() => onReject(id)}
                disabled={processing === id}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold px-6 py-2.5 rounded-lg
                           text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-emerald-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Request Accepted
              </span>
              <button
                onClick={() => {
                  alert("Opening chat / workspace feature coming soon!");
                }}
                className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-bold px-6 py-2.5 rounded-lg
                           text-sm transition-all border-none cursor-pointer"
              >
                Contact Buyer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────────
const CommissionRequestsPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [processing, setProcessing] = useState(null); // ID of item being processed

  // ── Fetch commissions on mount ────────────
  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commissionService.getArtistCommissions();
      setCommissions(data.commissions || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load commissions.');
    } finally {
      setLoading(false);
    }
  };

  // ── Accept handler ────────────────────────
  const handleAccept = async (id) => {
    if (!window.confirm('Accept this commission request? The buyer will be notified via email.')) return;
    setProcessing(id);
    try {
      await commissionService.acceptCommission(id);
      // Keep in list but update status
      setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: 'accepted' } : c));
    } catch (err) {
      alert('Failed to accept: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setProcessing(null);
    }
  };

  // ── Reject handler ────────────────────────
  const handleReject = async (id) => {
    if (!window.confirm('Reject this commission request? The buyer will be notified and the request will be deleted.')) return;
    setProcessing(id);
    try {
      await commissionService.rejectCommission(id);
      // Remove from list (row deleted)
      setCommissions((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to reject: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setProcessing(null);
    }
  };

  // ── Filtered + sorted list ────────────────
  const displayed = useMemo(() => {
    let list = [...commissions];

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.buyer_name?.toLowerCase().includes(q) ||
          c.medium?.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [commissions, search, sortOrder]);

  // ── Derived stats ─────────────────────────
  const stats = useMemo(() => {
    const total = commissions.length;
    const avgBudget = total > 0
      ? commissions.reduce((sum, c) => sum + (parseFloat(c.proposed_budget) || 0), 0) / total
      : 0;
    return { total, avgBudget };
  }, [commissions]);

  return (
    <div className="flex flex-col min-h-full bg-stone-50 font-sans">
        {/* ── Header ───────────────────────── */}
        <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 gap-6 sticky top-0 z-10">
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-900">Commission Requests</h2>
            <p className="text-sm text-slate-500">Review and manage custom artwork inquiries.</p>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <div className="relative hidden lg:block">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="pl-9 pr-8 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-amber-400 w-56 text-sm outline-none transition-all placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold border-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Upload Artwork link (matches Dashboard) */}
            <a
              href="/dashboard/upload"
              className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm text-sm whitespace-nowrap"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Upload New Artwork
            </a>
          </div>
        </header>

        {/* ── Main Content ─────────────────── */}
        <div className="flex-1 p-8">
          <div className="max-w-[1100px] mx-auto space-y-6">

            {/* Section: Accepted Requests */}
            {!loading && !error && displayed.filter(c => c.status === 'accepted').length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Accepted Requests
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      ({displayed.filter(c => c.status === 'accepted').length})
                    </span>
                  </h3>
                </div>
                <div className="space-y-4">
                  {displayed.filter(c => c.status === 'accepted').map((c) => (
                    <CommissionCard
                      key={c.id}
                      commission={c}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      processing={processing}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section header with sort (for New Requests) */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                New Requests
                {!loading && (
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({displayed.filter(c => c.status !== 'accepted').length})
                  </span>
                )}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none bg-transparent font-bold text-slate-800 pr-5 cursor-pointer border-none focus:outline-none text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <ChevronDownIcon className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <p className="text-red-700 font-semibold">Failed to load commissions</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchCommissions}
                  className="mt-4 text-amber-600 text-sm font-bold hover:text-amber-700 border-none cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && commissions.length === 0 && (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-14 flex flex-col items-center text-center">
                <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-600 font-semibold text-lg">No commission requests yet</p>
                <p className="text-slate-400 text-sm mt-1">When buyers request custom artwork, they'll appear here.</p>
              </div>
            )}

            {/* No search results */}
            {!loading && !error && commissions.length > 0 && displayed.length === 0 && search && (
              <div className="bg-white border border-slate-200 rounded-xl p-14 flex flex-col items-center text-center">
                <SearchIcon className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-600 font-semibold">No requests match "{search}"</p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-3 text-amber-500 text-sm font-bold hover:text-amber-600 border-none cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Commission cards (pending only below) */}
            {!loading && !error && displayed.filter(c => c.status !== 'accepted').length > 0 && (
              <div className="space-y-4">
                {displayed.filter(c => c.status !== 'accepted').map((c) => (
                  <CommissionCard
                    key={c.id}
                    commission={c}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    processing={processing}
                  />
                ))}
              </div>
            )}

            {!loading && !error && displayed.length > 0 && displayed.filter(c => c.status !== 'accepted').length === 0 && (
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                 No new pending requests.
               </div>
            )}

            {/* ── Stats footer ────────────────── */}
            {!loading && !error && commissions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Approval</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {commissions.filter(c => c.status === 'pending').length} Request{commissions.filter(c => c.status === 'pending').length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Commission Budget</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    LKR {stats.avgBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {commissions.length > 0 ? Math.round((commissions.filter(c => c.status === 'accepted').length / commissions.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
    </div>
  );
};

export default CommissionRequestsPage;
