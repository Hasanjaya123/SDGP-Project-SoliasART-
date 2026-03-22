
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
import { authService, api, artworkService } from './services/uploadApi';
import ArtMapPage from './pages/ArtMapPage.jsx';
import { useState, useEffect } from 'react';

import CollectionDetailPage from './pages/CollectionDetailPage';
import CreateCollection from './pages/CreateCollection';
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
  const [savedArtworks, setSavedArtworks] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchSavedArtworks();
  }, []);

  const fetchSavedArtworks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/savework/user/saved');
      setSavedArtworks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching saved artworks:", err);
    }
  };

  const handleToggleSave = async (artworkId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to save artworks!");
      return;
    }
    try {
      await api.post(`/savework/save/${artworkId}`);
      fetchSavedArtworks();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleAddToCartBatch = async (artworks) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to add items to cart!");
      return;
    }
    try {
      const ids = artworks.map(a => a.id);
      await artworkService.addBatchToCart(ids);
      alert(`${ids.length} items added to cart!`);
    } catch (err) {
      console.error("Batch cart error:", err);
      alert("Failed to add items to cart.");
    }
  };


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


        <Route path="/dashboard/collections/new" element={<ArtistGuard><CreateCollection /></ArtistGuard>} />

        {/* Pages within the main layout (pages which have sidebar and footer) */}
        <Route element={<Layout />}>
          {/* Artwork details page */}
          <Route path="/artwork/:id" element={<ArtworkDetailsPage onToggleSave={handleToggleSave} savedItemIds={savedArtworks.map(a => a.id)} />} />
          <Route path="/search" element={<ArtSearch />} />
          <Route path="/artist-search" element={<ArtistSearch />} />
          <Route path="/artist/profile" element={<ArtistProfilePage onToggleSave={handleToggleSave} savedItemIds={savedArtworks.map(a => a.id)} />} />
          <Route path="/artist/profile/:artistId" element={<ArtistProfilePage onToggleSave={handleToggleSave} savedItemIds={savedArtworks.map(a => a.id)} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/map" element={<ArtMapPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage onAddToCartBatch={handleAddToCartBatch} onToggleSave={handleToggleSave} savedItemIds={savedArtworks.map(a => a.id)} />} />
          <Route path="/buyer/profile" element={<SaveWork />} />
          <Route path="/saved" element={<SaveWork />} />
          <Route path="/feed" element={<ArtSearch />} />

          <Route path="/dashboard" element={<ArtistGuard><ArtistDashboard /></ArtistGuard>} />
          <Route path="/dashboard/commissions" element={<ArtistGuard><CommissionRequestsPage /></ArtistGuard>} />

        </Route>

      </Routes>


    </>

  );

}

export default App;