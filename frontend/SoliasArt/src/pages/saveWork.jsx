import { useState } from 'react';
import Sidebar from '../components/Nav-bar'           
import ArtDisplayCard from '../components/Art-card';   
import Footer from '../components/Footer';     

// ─── Icons (defined FIRST so CardWithRealInfo can use them) ───
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 shrink-0">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 shrink-0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────
const savedArtworks = [
  {
    id: 1,
    artist: 'Nisha Jayawardena', views: 2301, likes: 540,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    formData: { title: 'Coastal Serenity',  category: 'New Release', price: 156000, height: 400, width: 300, images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'] },
  },
  {
    id: 2,
    artist: 'Nisha Jayawardena', views: 2800, likes: 680,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600',
    formData: { title: 'Golden Hour Sands', category: 'New Release', price: 180000, height: 400, width: 300, images: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600'] },
  },
  {
    id: 3,
    artist: 'Malith De Silva', views: 3100, likes: 870,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
    formData: { title: 'Ocean Waves',       category: 'Featured',    price: 210000, height: 400, width: 300, images: ['https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600'] },
  },
  {
    id: 4,
    artist: 'Dinusha Weerasinghe', views: 1200, likes: 290,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600',
    formData: { title: 'Forest Path',       category: 'Landscape',   price: 115000, height: 500, width: 350, images: ['https://images.unsplash.com/photo-1511497584788-876760111969?w=600'] },
  },
  {
    id: 5,
    artist: 'Ashan Perera', views: 980, likes: 145,
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600',
    formData: { title: 'City Lights',       category: 'Urban',       price: 72000,  height: 400, width: 300, images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600'] },
  },
  {
    id: 6,
    artist: 'Kavya Ranasinghe', views: 1540, likes: 320,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600',
    formData: { title: 'Desert Dunes',      category: 'Featured',    price: 98000,  height: 400, width: 500, images: ['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600'] },
  },
  {
    id: 7,
    artist: 'Nisha Jayawardena', views: 4200, likes: 1100,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    formData: { title: 'Mountain Silence',  category: 'Landscape',   price: 295000, height: 600, width: 400, images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'] },
  },
  {
    id: 8,
    artist: 'Malith De Silva', views: 760, likes: 88,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
    formData: { title: 'Abstract Bloom',    category: 'New Release', price: 45000,  height: 400, width: 300, images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'] },
  },
];

// ─── Card wrapper — overlays real artist/views/likes over hardcoded values ───
function CardWithRealInfo({ artwork }) {
  return (
    <div className="relative">
      <ArtDisplayCard
        image={artwork.image}
        formData={artwork.formData}
      />
      {/* Covers ArtDisplayCard's hardcoded "No name" and "--" rows */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
        style={{ bottom: '68px' }}
      >
        <p className="text-[11px] font-medium text-gray-400 bg-gray-950 w-full text-center py-0.5">
          {artwork.artist}
        </p>
        <div className="flex items-center justify-center gap-3 text-gray-400 text-[11px] font-medium bg-gray-950 w-full py-0.5">
          <span className="flex items-center gap-1"><EyeIcon />{artwork.views.toLocaleString()}</span>
          <span className="flex items-center gap-1"><HeartIcon />{artwork.likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
const SaveWork = () => {
  return (
    <div className="dark min-h-screen bg-gray-950 flex flex-col">

      {/* Override Nav-bar's white bg + border from SaveWork without touching Nav-bar.jsx */}
      <style>{`
        .sidebar-override > div:first-child {
          background-color: #0a0a0f !important;
          border-right-color: #1f2937 !important;
        }
        .sidebar-override > div:first-child .text-gray-900 { color: #f9fafb !important; }
        .sidebar-override > div:first-child .text-gray-500 { color: #9ca3af !important; }
        .sidebar-override > div:first-child .text-\\[\\#0F2C59\\] { color: #f9fafb !important; }
        .sidebar-override > div:first-child .border-gray-200 { border-color: #1f2937 !important; }
        .sidebar-override > div:first-child .border-gray-300 { border-color: #374151 !important; }
        .sidebar-override > div:first-child .hover\\:bg-yellow-50:hover { background-color: #1f2937 !important; }
        .sidebar-override > div:first-child .hover\\:text-\\[\\#C58940\\]:hover { color: #f59e0b !important; }
        .sidebar-override > div:first-child .text-\\[\\#C58940\\] { color: #f59e0b !important; }
      `}</style>

      <div className="flex flex-1 sidebar-override">

        <Sidebar />

        <div className="flex-1 pl-4 pr-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Your Saved Artworks
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400">
              A personal collection of pieces you love. Revisit your favorites and decide on your next acquisition.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-start justify-center">
            {savedArtworks.map(artwork => (
              <CardWithRealInfo key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default SaveWork;
