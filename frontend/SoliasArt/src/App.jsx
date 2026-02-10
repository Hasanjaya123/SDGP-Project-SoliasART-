import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <Router>
      <Routes>

        {/* Route to Signup page */}
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Route to Login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Default route - redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
