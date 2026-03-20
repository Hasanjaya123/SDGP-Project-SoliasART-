import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

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

import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import { ArtistSearch } from "./components/ArtistSearch";
import { ArtistProfilePage } from "./pages/ArtistProfile";

import { artworks } from "./data/mockData";



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
          <Route path="/buyer/profile" element={<SaveWork />} />

        </Route>

      </Routes>


    </>

  );
}

export default App;