import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import ArtistSearch from "./pages/ArtistSearch";
import { artworks } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('collections');
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSetPage = (page, id = null) => {
    setCurrentPage(page);
    if (id) {
      setSelectedCollectionId(id);
    }
  };

  const handleToggleSave = (id) => {
    setSavedItemIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleAddToCartBatch = (items) => {
    alert(`Added ${items.length} items to cart!`);
  };

  return (
    <div className={`min-h-screen font-sans flex ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">

          {/* Debug message */}
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Rendering: {currentPage}
          </div>

          {/* Collections Page */}
          {currentPage === 'collections' && (
            <CollectionsPage
              setCurrentPage={handleSetPage}
              artworks={artworks}
            />
          )}

          {/* Collection Detail */}
          {currentPage === 'collectionDetail' && (
            <CollectionDetailPage
              collectionId={selectedCollectionId}
              artworks={artworks}
              setCurrentPage={handleSetPage}
              onToggleSave={handleToggleSave}
              savedItemIds={savedItemIds}
              onAddToCartBatch={handleAddToCartBatch}
            />
          )}

          {/* Artist Search Page */}
          {currentPage === 'artistSearch' && (
            <ArtistSearch
              setCurrentPage={handleSetPage}
              artworks={artworks}
              artists={[]}
            />
          )}

          {/* Placeholder for other pages */}
          {!['collections', 'collectionDetail', 'artistSearch'].includes(currentPage) && (
            <div className="flex flex-col items-center justify-center h-96">
              <span className="text-4xl mb-4">🚧</span>
              <h2 className="text-2xl text-gray-500 capitalize">{currentPage} Section</h2>
              <p className="text-gray-400 mt-2">This feature is coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;