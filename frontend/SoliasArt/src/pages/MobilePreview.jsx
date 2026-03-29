import { useState, useEffect } from "react"
import { api } from "../services/uploadApi"

function ModelViewer({ src }) {
    const [ready, setReady] = useState(false) // tracks if script loaded

    useEffect(() => {
        if (customElements.get("model-viewer")) {
            setReady(true) // already loaded from before
            return
        }
        const script = document.createElement("script")
        script.type = "module"
        script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        script.onload = () => setReady(true) // only set ready AFTER script loads
        document.head.appendChild(script)
    }, [])

    // Don't render model-viewer until script is ready
    if (!ready) return <p style={{ color: "white", padding: "20px" }}>Loading viewer...</p>

    return (
        // eslint-disable-next-line
        <model-viewer
            src={src}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="wall"
            auto-rotate
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            style={{ width: "100%", height: "70vh" }}
        >
            <button slot="ar-button" style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#d97706',
                color: 'white',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                outline: 'none'
            }}>View in AR</button>
        </model-viewer>
    )
}

export default function MobilePreview() {

    // memory boxes
    const [localUrl, setLocalUrl] = useState(null); // blob url for 3D viewer
    const [loading, setLoading] = useState(true); // true while fetching GLB from backend
    const [error, setError] = useState(null); // stores error text if something fails
    const [modelUrl, setModelUrl] = useState(null); // original HTTP URL for model-viewer and AR

    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const rawGlbUrl = param.get("glb")

        if (!rawGlbUrl) {
            setError("No GLB URL provided in query parameters.");
            setLoading(false);
            return;
        }

        // decode the URL
        let decodedUrl;
        try {
            decodedUrl = decodeURIComponent(rawGlbUrl);
            new URL(decodedUrl); // validate URL format
        } catch (e) {
            setError("Invalid QR code link");
            setLoading(false);
            return;
        }

        // fetch the GLB file from the backend to confirm it's cached and get a blob URL for the 3D viewer
        const fetchGlb = async () => {
            try {
                const res = await api.get(decodedUrl, {
                    responseType: 'blob'
                });

                const blob = res.data;
                setLocalUrl(URL.createObjectURL(blob));

                // Use the original HTTP URL for model-viewer so AR viewers can access it
                setModelUrl(decodedUrl);

            } catch (e) {
                setError(e.response?.data?.detail || e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchGlb();
    }, [])


    if (loading) {
        return (
            <div style={{ textAlign: "center", paddingTop: "40%" }}>
                <p>Loading 3D model...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h2>Oops</h2>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        )
    }

    return (
        <div>
            <section className="mx-auto max-w-3xl bg-white/95 p-5 shadow-2xl md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">AR Preview</p>
                <h1 className="mt-2 font-bold text-[#0F2C59] md:text-4xl">3D Artwork Preview</h1>
                <p className="mt-2 text-sm text-slate-600">Drag to rotate the model. Tap View in AR to place it on your wall.</p>
                <div className="mt-5">
                    {modelUrl && <ModelViewer src={modelUrl} />}
                </div>
            </section>
        </div>
    )
}