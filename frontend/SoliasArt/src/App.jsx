import React, { useState, useEffect } from "react";


import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { ArtistSearch } from './components/ArtistSearch.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';

import ArtistDashboard from './pages/Dashboard.jsx';
import CommissionRequestsPage from './pages/CommissionRequestsPage.jsx';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"
import { jwtDecode } from "jwt-decode";
import { authService } from './services/uploadApi';
import ArtMapPage from './pages/ArtMapPage.jsx';
import SaveWork from './pages/saveWork.jsx';


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

  return (
    <>
      <Routes>
        <Route path="/home"></Route>
        {/* Route to Signup page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route to Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Test route for ArtDisplayCard */}
        <Route path="/test" element={<Test />} />



        <Route path="/search/:userId" element={<ArtSearch />} />

        {/* AR Viewer - Desktop AR generation and QR code */}
        <Route path="/ar" element={<ARViewer />} />

        {/* Mobile AR preview - shows 3D model and AR button when accessed via QR code */}
        <Route path="/preview" element={<MobilePreview />} />

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
          <Route path="/artist-search" element={<ArtistSearch />} />
          <Route path="/artist/profile" element={<ArtistProfilePage />} />
          <Route path="/artist/profile/:artistId" element={<ArtistProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/map" element={<ArtMapPage />} />
          <Route path="/buyer/profile" element={<SaveWork />} />
          <Route path="/collections" element={<CollectionsPage />} />

          <Route path="/dashboard" element={<ArtistGuard><ArtistDashboard /></ArtistGuard>} />
          <Route path="/dashboard/commissions" element={<ArtistGuard><CommissionRequestsPage /></ArtistGuard>} />

        </Route>

      </Routes>


    </>

  );
}

export default App;