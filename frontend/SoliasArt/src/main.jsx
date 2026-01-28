import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UploadArtPage from './pages/ArtUpload.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UploadArtPage />
  </StrictMode>,
)
