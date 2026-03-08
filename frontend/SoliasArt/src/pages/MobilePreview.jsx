import { useState, useEffect } from "react"

export default function MobilePreview() {

    // memory boxes
    const [localUrl, setLocalUrl] = useState(null); // blob url for 3D viewer
    const [loading, setLoading] = useState(true); // true while fetching GLB from backend
    const [error, setError] = useState(null); // stores error text if something fails

    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const rawGlbUrl = param.get("glb")

        if(!rawGlbUrl){
            setError("No GLB URL provided in query parameters.");
            setLoading(false);
            return;
        }

        let decoratedUrl;
        try {
            decoratedUrl = decodeURIComponent(rawGlbUrl);
            new URL(decoratedUrl); // validate URL format
        } catch (e) {
            setError("Invalid QR code link");
            setLoading(false);
            return;
        }

        const fetchGlb = async () => {
            try {
                const res = await fetch(decoratedUrl, {
                    headers: {
                        "ngrok-skip-browser-warning": "true" // needed when using ngrok
            }
    })
            if(!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || `Error ${res.status}`);
            }
            
            const blob = await res.blob();
            setLocalUrl(URL.createObjectURL(blob));
        } catch (e) {
            setError(e.message);
        }finally {
            setLoading(false);
        }
    }
        fetchGlb();
    }, [])

    if(loading) return <p>Loading 3D model...</p>
    if(error) return <p style={{color: "red"}}>Error: {error}</p>

    return (
        <div>
        <h1>3D Model loaded!</h1>
        <p>Blob URL: {localUrl}</p>
        </div>
    )
}