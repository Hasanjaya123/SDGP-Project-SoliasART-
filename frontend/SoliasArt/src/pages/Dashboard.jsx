import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ArtDisplayCard from '../components/Art-card';
import Sidebar from '../components/Nav-bar';
import Footer from '../components/Footer';
import { artworkService } from "../services/uploadApi";

// SVG Icons
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


const toCardProps = (art) => ({
  image: art.image_url?.[0] ?? null,
  formData: {
    title:    art.title     ?? "",
    price:    art.price     ?? "",
    category: art.medium    ?? "",
    height:   art.height_in ?? "",
    width:    art.width_in  ?? "",
    // ArtDisplayCard uses `formData.images.length > 0` to decide whether
    // to show the image or the "No Image" placeholder — mirror ArtSearch.jsx exactly
    images:   art.image_url ? [art.image_url] : [],
  },
});

// ─── Derive live metric values from raw artwork array 
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

// ─── Loading skeleton for artwork cards
const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
    <div className="bg-slate-200 rounded aspect-[3/4] mb-4" />
    <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-3" />
    <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto" />
  </div>
);

// ─── Dashboard Page
useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    artworkService
      .getArtWorks(userId)
      .then((data) => setArtworks(Array.isArray(data) ? data : []))
      .catch((err) =>
        setError(err.response?.data?.detail ?? "Failed to load artworks.")
      )
      .finally(() => setLoading(false));
  }, [userId]);

  // ── Recent Sales: sold artworks sorted newest-first, max 5 
  const recentSales = useMemo(
    () =>
      [...artworks]
        .filter((a) => a.status?.toLowerCase() === "sold")
        .sort((a, b) => new Date(b.sold_at ?? 0) - new Date(a.sold_at ?? 0))
        .slice(0, 5),
    [artworks]
  );