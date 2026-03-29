import { useState } from "react";

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// previewImage — object URL string passed down from ArtSearch
// onClearImage — clears the preview from ArtSearch state
const SearchBar = ({ onSearch, onSearchSubmit, previewImage, onClearImage }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
      if (onSearchSubmit) onSearchSubmit(query);
    }
  };

  

  return (
    <div className="relative flex items-center w-full max-w-xl">

      {/* Image preview chip inside the left side of the bar */}
      {previewImage && (
        <div className="absolute left-2 z-10 group w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-amber-400 shadow-[0_0_10px_2px_rgba(245,158,11,0.6)]">
          <img
            src={previewImage}
            alt="upload preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={onClearImage}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            title="Remove image"
          >
            <XIcon />
          </button>
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for masterpieces, artists, or styles..."
        className={`w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${
          previewImage ? "pl-20" : "pl-4"
        }`}
      />

      {/* Search icon only — camera icon removed */}
      <button
        onClick={() => { onSearch(query); if (onSearchSubmit) onSearchSubmit(query); }}
        className="absolute right-3 text-gray-400 hover:text-amber-500 transition-colors"
        title="Search"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
