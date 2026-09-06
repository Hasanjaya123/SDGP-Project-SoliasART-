import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { setupNetworkInterceptors } from './services/networkInterceptor';

// Initialize global 503 & backend unreachable interception
setupNetworkInterceptors();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
