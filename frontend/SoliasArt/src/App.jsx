
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage.jsx';
import './index.css';
import Test from './pages/test.jsx';

import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import Layout from './components/Layout';

import { ArtistProfilePage } from "./pages/ArtistProfile.jsx"
import ArtMapPage from './pages/ArtMapPage.jsx';




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
        <Route path='/user/dashboard/upload' element={<UploadArtPage />}></Route>

        <Route path='/user/dashboard/upload/:artistId' element={<UploadArtPage />}></Route>

        {/* Artist on boarding page */}
        <Route path="/settings/convert/:userId" element={<ArtistOnboardingPage />} />

        <Route path="/user/artist/profile/:artistId" element={<ArtistProfilePage />} />

        {/* Pages within the main layout (pages which have sidebar and footer) */}
        <Route element={<Layout />}>
          {/* Artwork details page */}
          <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />

          {/* Art Map page route */}
          <Route path="/art-map" element={<ArtMapPage />} />



        </Route>

      </Routes>

    </>

  );

}

export default App;
