import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collectionService } from '../services/uploadApi';
import React, { useState } from 'react';
import { collections } from '../data/mockData';
import { ArtworkCard } from '../components/ArtworkCard';
import { Heart, Eye, ShoppingCart, ArrowLeft } from 'lucide-react';

export const CollectionDetailPage = ({
  onToggleSave = () => { },
  savedItemIds = [],
  onAddToCartBatch = () => { }
}) => {
  const { id: collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await collectionService.getCollectionById(collectionId);
        setCollection(data);
      } catch (error) {
        console.error("Failed to fetch collection details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  if (loading) {
    return <div className="text-center py-20">Loading collection details...</div>;
  }
  collectionId,
    artworks: allArtworks,
      setCurrentPage,
      onToggleSave,
      savedItemIds,
      onAddToCartBatch
}) => {
  const [likes, setLikes] = useState({});

  // Find the specific collection based on the passed ID
  const collection = collections.find(c => c.id === collectionId);

  if (!collection) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-xl">Collection not found</p>
        <button
          onClick={() => navigate('/collections')}
          className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  const artworks = collection.artworks || [];
  const totalValue = artworks.reduce((sum, art) => sum + art.price, 0);

  const toggleLike = (artworkId) => {
    setLikes(prev => ({
      ...prev,
      [artworkId]: !prev[artworkId]
    }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/collections')}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-2 group transition-all"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </button>
      </div>

      {/* Hero Header Section */}
      <div className="relative h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-12">
        <img
          src={collection.coverImageUrl || (artworks[0]?.imageUrls[0])}
          alt={collection.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay with Collection Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-8 md:p-12 text-white w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded mb-4">
                  Curated Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{collection.name}</h1>
                <p className="text-amber-400 font-semibold text-lg flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-amber-400"></span>
                  Curated by {collection.curator}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => onAddToCartBatch(artworks)}
                  className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <ShoppingCart size={20} />
                  Buy Entire Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column - About Section & Artworks */}
        <div className="lg:col-span-2 space-y-12">
          {/* About the Collection */}
          <section className="bg-white dark:bg-gray-900/50 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              About the Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {collection.description}
            </p>
          </section>

          {/* Artworks Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Artworks</h2>
              <span className="text-gray-500 dark:text-gray-400 font-medium">{artworks.length} Pieces</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onView={(id) => navigate(`/artwork/${id}`)}
                  onToggleSave={onToggleSave}
                  isSaved={savedItemIds.includes(artwork.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Collection Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-8 md:p-10 rounded-3xl sticky top-8 shadow-2xl border border-gray-800">
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-800">Collection Insight</h3>

            {/* Summary Stats */}
            <div className="space-y-8 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total Pieces</span>
                <span className="font-bold text-xl">{artworks.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Estimated Value</span>
                <span className="font-bold text-xl text-amber-500">
                  LKR {totalValue.toLocaleString()}
                </span>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  This collection has been verified for authenticity and condition by our senior curators.
                </p>
                <div className="flex items-center gap-3 text-amber-500 text-sm font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  Certified Original
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => onAddToCartBatch(artworks)}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-amber-900/40 active:scale-[0.98]"
              >
                Acquire Full Collection
              </button>
              <button className="w-full py-4 bg-transparent border-2 border-gray-700 hover:border-gray-500 text-white font-bold rounded-2xl transition-all">
                Download Catalog (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
