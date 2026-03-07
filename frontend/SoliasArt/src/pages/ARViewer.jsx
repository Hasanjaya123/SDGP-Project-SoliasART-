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
  return (
    <div>
      <h1>AR Generator</h1>
      <p>I will generate a QR code here that you can scan with your phone to view the artwork in AR.</p>
    </div>
  )
}