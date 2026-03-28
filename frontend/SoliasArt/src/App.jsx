
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

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"

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
