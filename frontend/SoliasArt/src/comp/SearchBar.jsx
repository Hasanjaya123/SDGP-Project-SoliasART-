// src/comp/SearchBar.jsx
import React from 'react';

function SearchBar({ placeholder }) {
  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder} />
    </div>
  );
}

export default SearchBar;