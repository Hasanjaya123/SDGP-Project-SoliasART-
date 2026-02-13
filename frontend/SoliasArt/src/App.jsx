
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Test from './pages/test.jsx';

import SaveArtPage from './pages/saveWork.jsx'




function App() {
  
  return (

    <Router>
      <Routes>

        {/* Route to Signup page */}
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Route to Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Test route for ArtDisplayCard */}
        <Route path="/test" element={<Test />} />

        <Route path ="/aaveArt" element={<SaveArtPage />} />
        
        {/* Default route - redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
    
    
    
    
  

    
    
    
    
  
}

export default App;
