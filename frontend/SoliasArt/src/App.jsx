
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';
import ArtSearch from './pages/ArtSearch.jsx';
import React, { useState, useEffect } from 'react';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import Layout from './components/Layout';

import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"
import { jwtDecode } from "jwt-decode";
import { authService } from './services/uploadApi';


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

}

export default App;
