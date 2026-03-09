import { useState, useEffect, useRef } from 'react';
import { artEvents, artGalleries } from '../data/mockData';

const MAP_URL =
  'https://www.google.com/maps/d/embed?mid=1xQO6M7BnRd-s9GC_7Pih11fibV2Izcg&ehbc=2E312F&noprof=1';

// Per-type dot colour and badge classes
const EVENT_TYPES = {
  All: { dot: '#d4a853', badge: 'bg-stone-700/60 text-stone-300 border-stone-600' },
  Exhibition: { dot: '#d4a853', badge: 'bg-amber-900/40 text-amber-300 border-amber-700/50' },
  Festival: { dot: '#c0715a', badge: 'bg-rose-900/40 text-rose-300 border-rose-700/50' },
  Opening: { dot: '#7c8fa8', badge: 'bg-slate-700/40 text-slate-300 border-slate-600/50' },
  'Art Walk': { dot: '#7aaa8a', badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' },
};

// Decorative corners rendered over the map iframe
const MAP_CORNERS = [
  ['top-4 left-4', 'border-t border-l rounded-tl'],
  ['top-4 right-4', 'border-t border-r rounded-tr'],
  ['bottom-4 left-4', 'border-b border-l rounded-bl'],
  ['bottom-4 right-4', 'border-b border-r rounded-br'],
];

function PulseDot({ color = '#d4a853' }) {
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
      data-id={event.id}
      onClick={() => onSelect(selected ? null : event)}
      className="w-full text-left rounded-xl border transition-all duration-200 focus:outline-none group overflow-hidden"
      style={{
        backgroundColor: selected ? 'rgba(212,168,83,0.08)' : 'rgba(20,19,16,0.8)',
        borderColor: selected ? 'rgba(212,168,83,0.35)' : 'rgba(255,255,255,0.06)',
        boxShadow: selected ? '0 0 0 1px rgba(212,168,83,0.1), 0 8px 24px -4px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Coloured top bar visible when selected */}
      <div
        className="h-0.5 w-full transition-all duration-300"
        style={{ backgroundColor: selected ? t.dot : 'transparent' }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-[17px] text-stone-100 leading-tight group-hover:text-amber-100 transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {event.name}
          </span>
          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border tracking-wide ${t.badge}`}>
            {event.type}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </span>
          <span className="text-stone-700">·</span>
          <span className="flex items-center gap-1 text-amber-500/70">
            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: selected ? '160px' : '0px', opacity: selected ? 1 : 0 }}
        >
          <div className="mt-3 pt-3 border-t border-stone-800/80">
            <p className="text-stone-400 text-xs leading-relaxed font-light">{event.description}</p>
            {event.artist && (
              <div className="flex items-center gap-2 mt-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="text-xs text-amber-300/80 font-light">{event.artist}</span>
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (!selected) return;
    sidebarRef.current
      ?.querySelector(`[data-id="${selected.id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selected]);

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-stone-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-10 py-12">

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
            <span
              className="text-[10px] uppercase text-stone-500 font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.3em' }}
            >
              Sri Lanka · Art Events
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1
                className="text-5xl md:text-6xl font-light leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Art on the
                <em className="block italic text-amber-400/90 font-light">Map</em>
              </h1>
              <p className="mt-3 text-stone-400 text-sm font-light max-w-md leading-relaxed">
                Exhibitions, festivals, and cultural gatherings across the island.
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-stone-900/70 border border-stone-800 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
              <PulseDot />
              <span className="text-xs text-stone-400 font-light">
                <span className="text-amber-300 font-medium">{artEvents.length}</span> upcoming events
              </span>
            </div>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap mb-6">
          {Object.keys(EVENT_TYPES).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${filter === type
                ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                : 'bg-stone-900/60 border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
                }`}
            >
              {type !== 'All' && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 -translate-y-px"
                  style={{ backgroundColor: EVENT_TYPES[type].dot }}
                />
              )}
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px -12px rgba(0,0,0,0.7)' }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 z-10 bg-[#1a1a17] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border border-amber-400/20 animate-ping absolute inset-0" />
                  <div className="w-12 h-12 rounded-full border-2 border-t-amber-400 border-stone-700 animate-spin" />
                </div>
                <p className="text-stone-500 text-xs tracking-widest uppercase">Loading map…</p>
              </div>
            )}

            {MAP_CORNERS.map(([pos, borders]) => (
              <div key={pos} className={`absolute ${pos} z-20 pointer-events-none`}>
                <div className={`w-6 h-6 ${borders} border-amber-400/30`} />
              </div>
            ))}

            <iframe
              src={MAP_URL}
              title="Art Events Map"
              className="w-full block"
              style={{ height: 'clamp(400px, 62vh, 680px)', border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0e0d0b] to-transparent pointer-events-none z-10" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <h2
                className="text-xl font-light text-stone-300 tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {filter === 'All' ? 'All Events' : filter}
              </h2>
              <span className="text-xs text-stone-600">
                {visible.length} {visible.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            <div
              ref={sidebarRef}
              className="flex flex-col gap-2.5 overflow-y-auto"
              style={{
                maxHeight: 'clamp(400px, 62vh, 680px)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#3f3a30 transparent',
              }}
            >
              {visible.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <span className="text-4xl mb-3 opacity-40">🗓</span>
                  <p className="text-stone-500 text-sm">No events for this filter.</p>
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

              <div className="mt-4 pt-4 border-t border-stone-800/60">
                <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-3 font-light">
                  Partner Galleries
                </p>
                {artGalleries.map(g => (
                  <div key={g.id} className="flex items-center gap-3 py-2.5 border-b border-stone-900/80 last:border-0 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400/70 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-300 group-hover:text-stone-100 transition-colors">{g.name}</p>
                      <p className="text-[11px] text-stone-600">{g.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 flex flex-wrap items-center gap-6 text-[11px] text-stone-600 font-light">
          {Object.entries(EVENT_TYPES)
            .filter(([k]) => k !== 'All')
            .map(([type, cfg]) => (
              <span key={type} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                {type}
              </span>
            ))}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400/70" />
            Gallery
          </span>
        </footer>

      </div>
    </div>
  );
}

export default ArtMapPage;
