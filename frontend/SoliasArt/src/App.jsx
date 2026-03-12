<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import { artworks } from './data/mockData';
=======

import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';
import Layout from './components/Layout';
import CartPage from './pages/CartPage';
import ArtSearch from './pages/ArtSearch.jsx';
import React, { useState, useEffect } from 'react';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"
import { jwtDecode } from "jwt-decode";
import { authService } from './services/uploadApi';

>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72

// Verifies role against backend, not just the JWT
function NotArtistGuard({ children }) {
  const [verified, setVerified] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setVerified(false);
      return;
    }

    authService.verifyRole()
      .then((data) => setVerified(data.role === 'artist'))
      .catch(() => setVerified(false));
  }, []);

  if (verified === null) return null; 
  if (verified) return <Navigate to="/search" replace />;

  return children;
}

function ArtistGuard({ children }) {
  const [verified, setVerified] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setVerified(false);
      return;
    }

    authService.verifyRole()
      .then((data) => setVerified(data.role === 'buyer'))
      .catch(() => setVerified(false));
  }, []);

  if (verified === null) return null; 
  if (verified) return <Navigate to="/search" replace />;

  return children;
}

function App() {
  const [currentPage, setCurrentPage] = useState('collections');
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode class on HTML body
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
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleAddToCartBatch = (items) => {
    alert(`Added ${items.length} items to cart!`);
  };

  return (
<<<<<<< HEAD
    <div className={`min-h-screen font-sans flex ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          {/* Debug Message */}
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">Rendering: {currentPage}</div>
          {currentPage === 'collections' && (
            <CollectionsPage
              setCurrentPage={handleSetPage}
              artworks={artworks}
            />
          )}
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
          {/* Placeholder for other pages */}
          {!['collections', 'collectionDetail'].includes(currentPage) && (
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
=======
    <>
      <Routes>
        <Route path="/home"></Route>
        {/* Route to Signup page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route to Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Test route for ArtDisplayCard */}
        <Route path="/test" element={<Test />} />
        
        {/* Default route - redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* Route for Art Upload page (for artists) - can be accessed after login */}
        <Route path='/dashboard/upload' element={<ArtistGuard><UploadArtPage /></ArtistGuard>}></Route>
  
        {/* Artist on boarding page */}
        <Route path="/convert" element={<NotArtistGuard><ArtistOnboardingPage /></NotArtistGuard>} />

        {/* Pages within the main layout (pages which have sidebar and footer) */}
        <Route element={<Layout />}>
          {/* Artwork details page */}
          <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
          <Route path="/search" element={<ArtSearch />} />
          <Route path="/artist/profile" element={<ArtistProfilePage />} />
          <Route path="/artist/profile/:artistId" element={<ArtistProfilePage />} />
          
        </Route>

      </Routes>

    </>

  );

>>>>>>> 4fcd7786d647fa3918f0162d55f387f73fddef72
}

export default App;
