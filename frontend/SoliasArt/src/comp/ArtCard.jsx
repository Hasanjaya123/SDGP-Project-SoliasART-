import { useState } from 'react';

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);


function ArtCard({ title, image, artist, tag, views, likes, price, saved: initialSaved }) {
  const [saved, setSaved] = useState(initialSaved || false);

  return (
    <div className="bg-gray-950 rounded-lg overflow-hidden cursor-pointer group hover:-translate-y-1 transition-transform duration-200">

     
      <div className="relative p-3 bg-gray-900">
        <div className="border-4 border-white/10 rounded-sm overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-56 object-cover"
          />
        </div>

        
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
          className={`absolute top-5 right-5 p-1.5 rounded-full transition-colors
            ${saved ? 'text-red-400 bg-black/60' : 'text-gray-300 bg-black/40 opacity-0 group-hover:opacity-100'}`}
        >
          <IconHeart filled={saved} />
        </button>
      </div>

      
      <div className="px-4 pb-4 pt-2">
        {tag && (
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 mb-2 tracking-wider">
            {tag}
          </span>
        )}
        {artist && <p className="text-gray-400 text-xs mb-1">{artist}</p>}
        <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-2">{title}</h3>
        {(views !== undefined || likes !== undefined) && (
          <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
            {views !== undefined && (
              <span className="flex items-center gap-1"><IconEye />{Number(views).toLocaleString()}</span>
            )}
            {likes !== undefined && (
              <span className="flex items-center gap-1"><IconHeart />{Number(likes).toLocaleString()}</span>
            )}
          </div>
        )}
        {price && <p className="text-white font-semibold text-sm">{price}</p>}
      </div>
    </div>
  );
}

export default ArtCard;