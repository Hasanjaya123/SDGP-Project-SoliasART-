import { useState } from 'react'
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Test from './pages/test.jsx';
import ARViewer from './pages/ARViewer.jsx';
import MobilePreview from './pages/MobilePreview.jsx';

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
        
        {/* AR Viewer - Desktop AR generation and QR code */}
        <Route path="/ar" element={<ARViewer />} />

        {/* Mobile AR preview - shows 3D model and AR button when accessed via QR code */}
        <Route path="/preview" element={<MobilePreview />} />

        {/* Default route - redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        <Route path='/user/dashboard/upload' element={<UploadArtPage />}></Route>
    </Routes>
    
    </>
  )

}

export default App;
