import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';

import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import UploadArtPage from './pages/ArtUpload';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';

import ARViewer from './pages/ARViewer.jsx';
import MobilePreview from './pages/MobilePreview.jsx';

import Layout from './components/Layout';
import CartPage from './pages/CartPage';
import ArtSearch from './pages/ArtSearch.jsx';
import React, { useState, useEffect } from 'react';
import ArtistDashboard from './pages/Dashboard.jsx';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import { ArtistProfilePage } from "./pages/ArtistProfile.jsx";

import { artworks } from './data/mockData';
import { authService } from './services/uploadApi';
import ArtMapPage from './pages/ArtMapPage.jsx';

import './App.css'
import './index.css'


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

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState([]);

  const handleSetPage = (page, id = null) => {
    if (id) setSelectedCollectionId(id);
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
    <Routes>

      {/* Public routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

<<<<<<< HEAD
  {/* Artist upload */ }
  <Route
    path="/dashboard/upload"
    element={
      <ArtistGuard>
        <UploadArtPage />
      </ArtistGuard>
    }
  />
=======
        {/* Test route for ArtDisplayCard */}
        <Route path="/test" element={<Test />} />

        <Route path="/search/:userId" element={<ArtSearch />} />

        {/* AR Viewer - Desktop AR generation and QR code */}
        <Route path="/ar" element={<ARViewer />} />

        {/* Mobile AR preview - shows 3D model and AR button when accessed via QR code */}
        <Route path="/preview" element={<MobilePreview />} />

        {/* Default route - redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
>>>>>>> b90de241eed2b9fb98da667c73ccbafc2e4f0adb

  {/* Artist onboarding */ }
  <Route
    path="/convert"
    element={
      <NotArtistGuard>
        <ArtistOnboardingPage />
      </NotArtistGuard>
    }
  />

<<<<<<< HEAD
  {/* Main layout pages */ }
  <Route element={<Layout />}>
=======
        <Route path="/dashboard" element={<ArtistGuard><ArtistDashboard /></ArtistGuard>} />

    {/* Pages within the main layout (pages which have sidebar and footer) */}
    <Route element={<Layout />}>
      {/* Artwork details page */}
      <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
      <Route path="/search" element={<ArtSearch />} />
      <Route path="/artist/profile" element={<ArtistProfilePage />} />
      <Route path="/artist/profile/:artistId" element={<ArtistProfilePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/map" element={<ArtMapPage />} />

    </Route>
>>>>>>> b90de241eed2b9fb98da667c73ccbafc2e4f0adb

    <Route
      path="/collections"
      element={
        <CollectionsPage
          setCurrentPage={handleSetPage}
          artworks={artworks}
        />
      }
    />

<<<<<<< HEAD
        <Route
          path="/collection/:id"
          element={
            <CollectionDetailPage
              artworks={artworks}
              setCurrentPage={handleSetPage}
              onToggleSave={handleToggleSave}
              savedItemIds={savedItemIds}
              onAddToCartBatch={handleAddToCartBatch}
            />
          }
        />
=======
     
    </>
>>>>>>> b90de241eed2b9fb98da667c73ccbafc2e4f0adb

        <Route path="/feed" element={<ArtSearch />} />
        <Route path="/search" element={<ArtSearch />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />

        <Route path="/artist/profile" element={<ArtistProfilePage />} />
        <Route path="/artist/profile/:artistId" element={<ArtistProfilePage />} />

      </Route >

    {/* Default page */ }
    < Route path = "/" element = {< Navigate to = "/collections" replace />} />

    </Routes >
  );
}

export default App;