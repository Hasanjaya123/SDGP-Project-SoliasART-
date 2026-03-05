import { useState } from 'react'
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Test from './pages/test.jsx';
import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import Layout from './components/Layout';

function App() {
  return (
    <>
    <Routes>
        <Route path="/home"></Route>
        # Route to Signup page 
        <Route path="/signup" element={<SignupPage />} />
        
        # Route to Login page
        <Route path="/login" element={<LoginPage />} />

        # Test route for ArtDisplayCard 
        <Route path="/test" element={<Test />} />
        
        # Default route - redirect to signup
        <Route path="/" element={<Navigate to="/signup" replace />} />

        # Route for Art Upload page (for artists) - can be accessed after login
        <Route path='/user/dashboard/upload' element={<UploadArtPage />}></Route>

        # Pages within the main layout (pages which have sidebar and footer)
        <Route element={<Layout />}>
          
          <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
          
        </Route>

    </Routes>
    
    </>
  )

}

export default App;
