
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import CommissionRequestsPage from './pages/CommissionRequestsPage.jsx';
import FeedPage from './pages/FeedPage.jsx';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"
import { jwtDecode } from "jwt-decode";
import { authService } from './services/uploadApi';
import ArtMapPage from './pages/ArtMapPage.jsx';
import SaveWork from './pages/saveWork.jsx';
import { ArtistSearch } from './components/ArtistSearch';
import CollectionsPage from './pages/CollectionsPage';
import CreateCollection from './pages/CreateCollection.jsx';
import EditCollection from './pages/EditCollection.jsx';
import CollectionDetailPage from './pages/CollectionDetailPage.jsx';

const LANDING_URL = 'https://landing.soliasart.com';

// Checks if the user has a valid token
function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem('token');
    return false;
  }
}

// Redirects unauthenticated users to the landing page 
function AuthRedirectGuard({ children }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = LANDING_URL;
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;
  return children;
}

//authenticated request wil ridrect to /search
function LandingRedirect() {
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = LANDING_URL;
    }
  }, []);

  if (isAuthenticated()) {
    return <Navigate to="/search" replace />;
  }

  return null;
}

// Verifieing the role of the user
function NotArtistGuard({ children }) {
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = LANDING_URL;
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
    if (!isAuthenticated()) {
      window.location.href = LANDING_URL;
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
        {/* Default route - unauthenticated → landing page, authenticated → /search */}
        <Route path="/" element={<LandingRedirect />} />

        <Route path="/home"></Route>

        {/* Public routes — accessible without login */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ar" element={<ARViewer />} />
        <Route path="/preview" element={<MobilePreview />} />

        {/* Protected routes — require authentication */}
        <Route path="/test" element={<AuthRedirectGuard><Test /></AuthRedirectGuard>} />
        <Route path="/search/:userId" element={<AuthRedirectGuard><ArtSearch /></AuthRedirectGuard>} />

        {/* Route for Art Upload page (for artists) - can be accessed after login */}
        <Route path='/dashboard/upload' element={<ArtistGuard><UploadArtPage /></ArtistGuard>}></Route>

        {/* Artist on boarding page */}
        <Route path="/convert" element={<NotArtistGuard><ArtistOnboardingPage /></NotArtistGuard>} />


        {/* Pages within the main layout (pages which have sidebar and footer) */}
        <Route element={<AuthRedirectGuard><Layout /></AuthRedirectGuard>}>
          {/* Artwork details page */}
          <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/search" element={<ArtSearch />} />
          <Route path="/artist-search" element={<ArtistSearch />} />
          <Route path="/artist/profile" element={<ArtistProfilePage />} />
          <Route path="/artist/profile/:artistId" element={<ArtistProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/map" element={<ArtMapPage />} />
          <Route path="/buyer/profile" element={<SaveWork />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/create-collection" element={<NotArtistGuard><Navigate to="/search" replace /></NotArtistGuard>} /> { /* Fallback for accessibility */}
          <Route path="/dashboard/collections/create" element={<ArtistGuard><CreateCollection /></ArtistGuard>} />
          <Route path="/dashboard/collections/edit/:id" element={<ArtistGuard><EditCollection /></ArtistGuard>} />

          <Route path="/dashboard" element={<ArtistGuard><ArtistDashboard /></ArtistGuard>} />
          <Route path="/dashboard/commissions" element={<ArtistGuard><CommissionRequestsPage /></ArtistGuard>} />

        </Route>

      </Routes>


    </>
  );
}

export default App;