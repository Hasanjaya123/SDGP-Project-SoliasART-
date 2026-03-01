import { useState } from "react";

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for masterpieces, artists, or styles..."
        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 pl-4 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
      />
      <div className="absolute right-3">
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchBar;