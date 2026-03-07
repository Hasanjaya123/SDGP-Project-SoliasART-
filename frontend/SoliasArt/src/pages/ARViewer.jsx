// src/pages/ARViewer.jsx
//
// DESKTOP flow:
//   1. User types artwork ID → clicks Generate
//   2. Fetch GLB from backend (just to trigger server cache)
//   3. Show ONLY the QR code → no 3D viewer on desktop
//
// MOBILE flow (handled by MobilePreview.jsx):
//   1. Phone scans QR code
//   2. Opens /preview?glb=<backend-url>
//   3. Shows 3D model + AR button

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ARViewer() {
  const [artworkid, setArtworkid] = useState("");
  return (
    <div>
      <h1>AR Generator</h1>
      <p>Enter the artwork ID to generate a QR code for AR viewing.</p>
      <input
        type="text"
        placeholder="Enter Artwork ID"
        value={artworkid}
        onChange={(e) => setArtworkid(e.target.value)}
      />
      <button disabled={artworkid.trim() === ""}>Generate QR Code</button>
      
      <p>You typed: {artworkid}</p>

    </div>
  )
}