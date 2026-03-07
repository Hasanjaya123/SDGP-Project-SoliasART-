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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function ARViewer() {
  const [artworkid, setArtworkid] = useState("");
  const [isLoading, setIsLoading] = useState(false); // true while waiting for backend response
  const [errorMsg, setErrorMsg] = useState(""); // stores error text if something fails

  // this function work if the user clicks "Generate QR Code"
  const handleGenerate = async () => {

    const id = artworkid.trim();
    if(!id || isLoading) return;

    // reset error and show loading spinner on button
    setIsLoading(true);
    setErrorMsg(""); //show the loarding spinner on button

    try {
      const res = await fetch(`${BACKEND_URL}/ar/generate-ar/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true" // needed when using ngrok
        }
      });

      // if the server returns an error (404, 500, etc)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      await res.blob(); // we don't actually care about the GLB data, just want to trigger the backend processing and caching

      alert("Success! GLB file fetched and cached by server")

    } catch (e) {
      // if any error occurs (network, server, parsing), show it to the user
      setErrorMsg(e.message);

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>AR Generator</h1>
      <p>Enter the artwork ID to generate a QR code for AR viewing.</p>
      
      {/* Input box — updates artworkId every time user types */}
      <input
        type="text"
        placeholder="Enter Artwork ID"
        value={artworkid}
        onChange={(e) => setArtworkid(e.target.value)}
      />

      {/* Button — disabled if input is empty */}
      <button onClick={handleGenerate} disabled={artworkid.trim() === "" || isLoading}>

        {/* Show "Generating..." while waiting for backend, otherwise show "Generate QR Code" */}
        {isLoading ? "Generating..." : "Generate QR Code"}
      </button>

      {/* Only show error if there is one */}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

    </div>
  )
}