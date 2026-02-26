import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadArtPage from './pages/ArtUpload'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
    <Routes>
      <Route path="/home"></Route>
      <Route path='/user/dashboard/upload' element={<UploadArtPage />}></Route>
    </Routes>
    
    </>
  )
}

export default App
