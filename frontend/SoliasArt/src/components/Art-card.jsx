import { useMemo } from "react";

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

const ArtDisplayCard = ({ image, formData }) => {


    const previewStyle = useMemo(() => {

        const h = parseFloat(formData.height);
        const w = parseFloat(formData.width);
        const hasDimensions = !isNaN(h) && !isNaN(w) && h > 0 && w > 0;

        if (!hasDimensions) {
            return {
                height: '340px',
                width: 'auto',
                aspectRatio: '3/4'
            };
        }

        const ratio = w / h;
        if (ratio >= 1) {
            return {
                width: '100%',
                height: 'auto',
                aspectRatio: `${w}/${h}`
            };
        } else {
            return {
                height: '380px',
                width: 'auto',
                aspectRatio: `${w}/${h}`
            };
        }
    }, [formData.height, formData.width]);

    return (

        <div className="bg-transparent rounded-sm overflow-hidden p-2.5 flex flex-col items-center transform transition-transform duration-500 hover:scale-[1.01]">
            <div
                className="relative border-[7px] border-black dark:border-gray-800 p-1.5 bg-transparent mb-3 transition-all duration-500 ease-in-out flex items-center justify-center"
                style={previewStyle}
            >
                <div className="w-full h-full bg-transparent overflow-hidden relative group flex items-center justify-center">
                    {formData.images.length > 0 ? (
                        <img
                            alt="Artwork Preview"
                            className="w-full h-full object-cover"
                            src={image}
                        />
                    ) : (
                        <div className="text-gray-300 dark:text-gray-600 flex flex-col items-center">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-xs uppercase font-bold">No Image</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    {formData.height && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 backdrop-blur-sm">
                            <ArScanIcon className="w-3 h-3" />
                            AR Ready
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center text-center w-full px-2 pb-2">

                <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[9px] font-bold uppercase tracking-wider mb-1.5 rounded-sm">
                    {formData.category || 'New Release'}
                </span>
                <p className="text-[11px] font-medium text-gray-800 dark:text-gray-400 mb-0.5">No name</p>
                <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-tight mb-1.5">
                    {formData.title || 'UNTITLED ARTWORK'}
                </h4>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-[11px] font-medium mb-2">
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-3.5 h-3.5" />
                        <span>--</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <HeartIcon className="w-3.5 h-3.5" />
                        <span>--</span>
                    </div>

                </div>

                <div className="flex flex-col items-center gap-0.5 mb-2.5 opacity-80">
                    <span className="text-[9px] text-gray-400 font-medium">Current Price</span>
                    <span className="text-base font-extrabold text-black dark:text-white">
                        {formData.price ? `LKR ${parseInt(formData.price).toLocaleString()}` : '--'}
                    </span>
                </div>

                <a className="text-[11px] font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1">
                    View Details
                </a>

            </div>
        </div>
    )

}

export default ArtDisplayCard;
