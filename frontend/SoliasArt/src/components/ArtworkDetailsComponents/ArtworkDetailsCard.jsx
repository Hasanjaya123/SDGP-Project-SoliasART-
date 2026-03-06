import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import icons
import { FiEye, FiHeart } from 'react-icons/fi'; 
import { FaHeart } from 'react-icons/fa'; 
import { MdOutlineViewInAr } from 'react-icons/md';

const ArtworkDetailsCard = ({ artwork, artist, onArClick }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleAddToCart = () => alert("Added to cart!");
  const handleBuyNow = () => alert("Proceeding to checkout!");

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      
      {/* Category */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
          {artwork.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="!text-2xl lg:!text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-2">
        {artwork.title}
      </h1>
      
      {/* Artist Profile */}
      <Link 
        to={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`} 
        className="flex items-center gap-4 mb-2  rounded-lg dark:border-gray-800 w-max pr-6  transition-colors group cursor-pointer"
      >
        <img 
          src={artist.profileImageUrl} 
          alt={artist.name} 
          className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
        />
        <div className="flex flex-col">
          {/* Added classic underline on hover */}
          <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:underline underline-offset-2">
            {artist.name}
          </span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
            {artist.location}
          </span>
        </div>
      </Link>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 mb-8">
        <span className="flex items-center gap-1.5"><FiEye className="w-4 h-4" /> {artwork.views.toLocaleString()} Views</span>
        <span className="flex items-center gap-1.5"><FiHeart className="w-4 h-4" /> {artwork.likes.toLocaleString()} Likes</span>
        <span className="text-amber-500 tracking-widest text-sm">★★★★★</span>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-8 bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Medium</strong> <span className="font-medium">{artwork.medium}</span></div>
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Dimensions</strong> <span className="font-medium">{artwork.dimensions}</span></div>
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Year</strong> <span className="font-medium">{artwork.year}</span></div>
      </div>

      {/* Description */}
      <div className="mb-8 flex-grow">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2">Description</h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{artwork.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 flex flex-col gap-1">
        <span className="text-xs text-gray-900 uppercase font-bold tracking-wide">Price</span>
        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          LKR {artwork.price.toLocaleString()}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 mt-auto">
        <div className="grid grid-cols-2 gap-3">
            
            {/*Add to Cart button */}
            <button onClick={handleAddToCart} className="w-full py-3.5 bg-amber-500 text-white font-bold text-sm rounded-lg shadow-sm hover:bg-amber-600 transition-all hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                Add to Cart
            </button>
            
            {/*Buy Now button */}
            <button onClick={handleBuyNow} className="w-full py-3.5 bg-[#153654] text-white font-bold text-sm rounded-lg shadow-sm hover:bg-[#0F263B] transition-all hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                Buy Now
            </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            
            {/*Save button */}
            <button onClick={() => setIsSaved(!isSaved)} className="w-full py-3.5 bg-gray-200 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-black transition-all flex items-center justify-center gap-2 hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                {isSaved ? <FaHeart className="w-4 h-4 text-red-500" /> : <FiHeart className="w-4 h-4" />} {isSaved ? 'Saved' : 'Save'}
            </button>
            
            {/* AR button */}
            <button onClick={onArClick} className="w-full py-3.5 bg-blue-200 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-lg hover:bg-blue-300 dark:hover:bg-blue-900/60 transition-all flex items-center justify-center gap-2 hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                <MdOutlineViewInAr className="w-5 h-5" /> Try in AR
            </button>
        </div>
      </div>

    </div>
  );
};

export default ArtworkDetailsCard;