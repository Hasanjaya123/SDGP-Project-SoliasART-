import { useState } from 'react'
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';
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

        <Route path='/user/dashboard/upload/:artistId' element={<UploadArtPage />}></Route>

        {/* Artist on boarding page */}
<<<<<<< HEAD
        <Route path="/settings/convert/:userId" element={<ArtistOnboardingPage />} />

        <Route path="/user/artist/profile/:artistId" element={<ArtistProfilePage />} />
=======
        <Route path="/settings/convert/artist" element={<ArtistOnboardingPage />} />

        <Route path="/user/artist/profile" element={<ArtistProfilePage />} />
>>>>>>> b4e12515bc13de601d2e5d6241b63e4af2cc0822

    </Routes>    
    </>
         
  );

}

export default App;
