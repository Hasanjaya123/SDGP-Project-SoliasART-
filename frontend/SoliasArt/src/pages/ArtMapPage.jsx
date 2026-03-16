import { useState, useEffect, useRef } from 'react';
import { artEvents, artGalleries } from '../data/mockData';

// Google My Maps
const MAP_URL =
  'https://www.google.com/maps/d/embed?mid=1xQO6M7BnRd-s9GC_7Pih11fibV2Izcg&ehbc=2E312F&noprof=1';

// Per-type dot colour and badge classes -project's amber #FFC247
const EVENT_TYPES = {
  All: { dot: '#FFC247', badge: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
  Exhibition: { dot: '#FFC247', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  Festival: { dot: '#F43F5E', badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  Opening: { dot: '#3B82F6', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  'Art Walk': { dot: '#10B981', badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
};

// Decorative corners for map iframe
const MAP_CORNERS = [
  ['top-4 left-4', 'border-t border-l rounded-tl'],
  ['top-4 right-4', 'border-t border-r rounded-tr'],
  ['bottom-4 left-4', 'border-b border-l rounded-bl'],
  ['bottom-4 right-4', 'border-b border-r rounded-br'],
];

function PulseDot({ color = '#FFC247' }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function EventCard({ event, selected, onSelect }) {
  const t = EVENT_TYPES[event.type] ?? EVENT_TYPES.Exhibition;

  return (
    <button
      // Toggle event selection
      data-id={event.id}
      onClick={() => onSelect(selected ? null : event)}
      className="w-full text-left rounded-xl border transition-all duration-200 focus:outline-none group overflow-hidden"
      style={{
        backgroundColor: selected ? 'rgba(255,194,71,0.05)' : 'rgba(24,24,27,0.6)',
        borderColor: selected ? 'rgba(255,194,71,0.3)' : 'rgba(255,255,255,0.05)',
        boxShadow: selected ? '0 4px 20px -4px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Top bar visible when selected */}
      <div
        className="h-1 w-full transition-all duration-300"
        style={{ backgroundColor: selected ? '#FFC247' : 'transparent' }}
      />

      {/* Event details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-lg font-bold text-zinc-100 leading-tight group-hover:text-amber-400 transition-colors"
          >
            {event.name}
          </span>
          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${t.badge}`}>
            {event.type}
          </span>
        </div>

        {/* Event location and date */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {event.location}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1 text-amber-500/80">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {new Date(event.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>

        {/* Event description and artist */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: selected ? '200px' : '0px', opacity: selected ? 1 : 0 }}
        >
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm leading-relaxed font-normal">{event.description}</p>
            {/* Artist information*/}
            {event.artist && (
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">person</span>
                </div>
                <span className="text-xs text-zinc-300 font-medium">{event.artist}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function ArtMapPage({ theme = 'dark', artists = [] }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const sidebarRef = useRef(null);

  const visible = filter === 'All'
    ? artEvents
    : artEvents.filter(e => e.type === filter);

  useEffect(() => {
    if (!selected) return;
    sidebarRef.current
      ?.querySelector(`[data-id="${selected.id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selected]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Art Discovery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Art on the <span className="text-amber-500 italic">Map</span>
              </h1>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
                Explore vibrant exhibitions, cultural festivals, and art openings across Sri Lanka in one interactive view.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3 backdrop-blur-sm shadow-sm">
              <PulseDot color="#FFC247" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Active Events</span>
                <span className="text-sm text-zinc-500">{artEvents.length} happenings islandwide</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap mb-8">
          {Object.keys(EVENT_TYPES).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${filter === type
                ? 'bg-[#FFC247] border-[#FFC247] text-zinc-900 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-amber-500/50 hover:text-amber-500'
                }`}
            >
              <div className="flex items-center gap-2">
                {type !== 'All' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: EVENT_TYPES[type].dot }}
                  />
                )}
                {type}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          <div
            className="relative rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-h-[500px]"
            style={{ boxShadow: '0 20px 50px -12px rgba(0,0,0,0.25)' }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 z-10 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading Map Data</p>
              </div>
            )}

            {MAP_CORNERS.map(([pos, borders]) => (
              <div key={pos} className={`absolute ${pos} z-20 pointer-events-none opacity-40`}>
                <div className={`w-8 h-8 ${borders} border-amber-500/40`} />
              </div>
            ))}

            <iframe
              src={MAP_URL}
              title="Art Events Map"
              className="w-full h-full block min-h-[500px]"
              style={{ border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent pointer-events-none z-10" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                {filter === 'All' ? 'Upcoming Events' : filter}
              </h2>
              <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                {visible.length} Total
              </span>
            </div>

            <div
              ref={sidebarRef}
              className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar"
              style={{
                height: 'calc(100vh - 400px)',
                minHeight: '400px',
              }}
            >
              {visible.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2">calendar_today</span>
                  <p className="text-zinc-500 text-sm font-medium">No results found.</p>
                </div>
              )}


              {visible.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  selected={selected?.id === event.id}
                  onSelect={setSelected}
                />
              ))}

              <div className="mt-6 pt-6 border-t border-zinc-800/60">
                <p className="text-[10px] lowercase tracking-widest text-zinc-600 mb-3 font-bold uppercase">
                  Partner Galleries
                </p>
                {artGalleries.map(g => (
                  <div key={g.id} className="flex items-center gap-3 py-2.5 border-b border-zinc-900/80 last:border-0 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-300 group-hover:text-amber-400 transition-colors uppercase font-bold">{g.name}</p>
                      <p className="text-[11px] text-zinc-600 font-medium">{g.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex flex-wrap items-center gap-6 text-[10px] text-zinc-600 font-bold uppercase tracking-widest border-t border-zinc-800 pt-6">
          {Object.entries(EVENT_TYPES)
            .filter(([k]) => k !== 'All')
            .map(([type, cfg]) => (
              <span key={type} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                {type}
              </span>
            ))}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500/70" />
            Gallery
          </span>
        </footer>

      </div>
    </div>
  );
}

export default ArtMapPage;
