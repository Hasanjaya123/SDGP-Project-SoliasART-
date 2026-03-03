import { useState } from 'react'
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { ArtistOnboardingPage } from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';


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

        <Route path='/user/dashboard/upload' element={<UploadArtPage />}></Route>

        {/* Artist on boarding page */}
        <Route path="/settings/convert/artist" element={<ArtistOnboardingPage />} />
    </Routes>    
    </>
         
  );

}

export default App;
