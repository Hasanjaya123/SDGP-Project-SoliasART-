import React, { useMemo } from 'react';

// Simple icon components
const ImageIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ArScanIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
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

import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

export const ArtworkCard = ({ artwork, onView, onToggleSave, isSaved }) => {
    const previewStyle = useMemo(() => {
        // Since original artwork data might not have dimensions, we use a default aspect ratio
        // If it did have them, we would use them like in Art-card.jsx
        return {
            height: '340px',
            width: '100%',
            aspectRatio: '3/4'
        };
    }, []);

    return (
        <div className="bg-transparent rounded-sm overflow-hidden p-2.5 flex flex-col items-center transform transition-transform duration-500 hover:scale-[1.01] w-full">
            <div
                className="relative border-[7px] border-black dark:border-gray-800 p-1.5 bg-transparent mb-3 transition-all duration-500 ease-in-out flex items-center justify-center cursor-pointer overflow-hidden shadow-md"
                style={previewStyle}
                onClick={() => onView(artwork.id)}
            >
                <div className="w-full h-full bg-transparent overflow-hidden relative group flex items-center justify-center">
                    {artwork.image_url && artwork.image_url.length > 0 ? (
                        <img
                            alt={artwork.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={artwork.image_url[0]}
                        />
                    ) : (
                        <div className="text-gray-300 dark:text-gray-600 flex flex-col items-center">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-xs uppercase font-bold">No Image</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>

                    {/* AR badge */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 backdrop-blur-sm">
                        <ArScanIcon className="w-3 h-3" />
                        AR Ready
                    </div>

                    {/* Save button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave && onToggleSave(artwork.id);
                        }}
                        className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border border-gray-100 dark:border-gray-800"
                    >
                        {isSaved ? <FaBookmark className="w-3.5 h-3.5 text-amber-500" /> : <FiBookmark className="w-3.5 h-3.5 text-gray-900 dark:text-white" />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center text-center w-full px-2 pb-2">
                <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[9px] font-bold uppercase tracking-wider mb-1.5 rounded-sm">
                    {artwork.isNewRelease ? 'New Release' : (artwork.category || 'Artwork')}
                </span>
                <p className="text-[11px] font-medium text-gray-800 dark:text-gray-400 mb-0.5">{artwork.artist?.display_name || artwork.artist || 'Unknown Artist'}</p>
                <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-tight mb-1.5 line-clamp-1">
                    {artwork.title || 'UNTITLED ARTWORK'}
                </h4>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-[11px] font-medium mb-2">
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-3.5 h-3.5" />
                        <span>{artwork.view_count?.toLocaleString() || artwork.views?.toLocaleString() || '--'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <HeartIcon className="w-3.5 h-3.5" />
                        <span>{artwork.likes?.toLocaleString() || '--'}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-0.5 mb-2.5 opacity-80">
                    <span className="text-[9px] text-gray-400 font-medium">Current Price</span>
                    <span className="text-base font-extrabold text-black dark:text-white">
                        {artwork.price ? `LKR ${parseInt(artwork.price).toLocaleString()}` : '--'}
                    </span>
                </div>

                <button
                    onClick={() => onView(artwork.id)}
                    className="text-[11px] font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ArtworkCard;
