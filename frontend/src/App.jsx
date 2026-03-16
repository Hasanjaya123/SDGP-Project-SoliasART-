import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import { ArtistSearch } from "./components/ArtistSearch";
import { ArtistProfilePage } from "./pages/ArtistProfile";

import { artworks } from "./data/mockData";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("collections");
  const navigate = useNavigate();

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const [savedItemIds, setSavedItemIds] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);


  /* ---------------- DARK MODE ---------------- */

  useEffect(() => {

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

  }, [isDarkMode]);


  /* ---------------- PAGE NAVIGATION ---------------- */

  const handleSetPage = (page, id = null) => {

    setCurrentPage(page);

    if (page === "collectionDetail") {
      setSelectedCollectionId(id);
    }

    if (page === "artistProfile") {
      setSelectedArtistId(id);
    }

    // Redirect to home if they use the sidebar to navigate away from /artist-search
    if (window.location.pathname === '/artist-search') {
      navigate('/');
    }

  };


  /* ---------------- SAVE ARTWORK ---------------- */

  const handleToggleSave = (id) => {

    setSavedItemIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );

  };


  /* ---------------- CART ACTION ---------------- */

  const handleAddToCartBatch = (items) => {
    alert(`Added ${items.length} items to cart!`);
  };


  return (

    <div
      className={`min-h-screen font-sans flex ${isDarkMode
        ? "dark bg-gray-900 text-white"
        : "bg-gray-50 text-gray-900"
        }`}
    >

      {/* SIDEBAR */}

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />


      {/* MAIN CONTENT */}

      <div className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto w-full">

        <div className="max-w-7xl mx-auto">


          {/* DEBUG MESSAGE */}

          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Rendering: {window.location.pathname === '/artist-search' ? 'artistSearch (Router)' : currentPage}
          </div>

          <Routes>
            <Route path="/artist-search" element={<ArtistSearch setCurrentPage={handleSetPage} artworks={artworks} />} />

            <Route path="*" element={
              <>
                {/* COLLECTIONS PAGE */}

                {currentPage === "collections" && (

                  <CollectionsPage
                    setCurrentPage={handleSetPage}
                    artworks={artworks}
                  />

                )}


                {/* COLLECTION DETAIL */}

                {currentPage === "collectionDetail" && (

                  <CollectionDetailPage
                    collectionId={selectedCollectionId}
                    artworks={artworks}
                    setCurrentPage={handleSetPage}
                    onToggleSave={handleToggleSave}
                    savedItemIds={savedItemIds}
                    onAddToCartBatch={handleAddToCartBatch}
                  />

                )}


                {/* ARTIST SEARCH (Fallback for sidebar navigation) */}

                {currentPage === "artistSearch" && (

                  <ArtistSearch
                    setCurrentPage={handleSetPage}
                  />

                )}


                {/* ARTIST PROFILE */}

                {currentPage === "artistProfile" && (

                  <ArtistProfilePage
                    artistId={selectedArtistId}
                    setCurrentPage={handleSetPage}
                  />

                )}


                {/* OTHER PAGES PLACEHOLDER */}

                {![
                  "collections",
                  "collectionDetail",
                  "artistSearch",
                  "artistProfile"
                ].includes(currentPage) && (

                    <div className="flex flex-col items-center justify-center h-96">

                      <span className="text-4xl mb-4">🚧</span>

                      <h2 className="text-2xl text-gray-500 capitalize">
                        {currentPage} Section
                      </h2>

                      <p className="text-gray-400 mt-2">
                        This feature is coming soon.
                      </p>

                    </div>

                  )}
              </>
            } />
          </Routes>

        </div>

      </div>

    </div>

  );

}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;