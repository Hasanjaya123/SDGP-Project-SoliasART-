import { useState, useRef } from "react";

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UploadButton = () => {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploaded((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploaded((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md transition-all duration-200 hover:shadow-amber-300/40 hover:shadow-lg"
      >
        <UploadIcon />
        Upload 🖼
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <CloseIcon />
            </button>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">Upload Artwork</h2>
            <p className="text-xs text-gray-400 mb-5">Share your masterpiece with the gallery</p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                dragging
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
              }`}
            >
              <div className="text-4xl mb-3">🎨</div>
              <p className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-1">Drag & drop your artwork here</p>
              <p className="text-xs text-gray-400">or click to browse — PNG, JPG, WEBP</p>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {uploaded.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Queued Files</p>
                <ul className="space-y-1 max-h-28 overflow-y-auto">
                  {uploaded.map((name, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-1.5 font-medium truncate">
                      ✓ {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => { setOpen(false); setUploaded([]); }}
              className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-sm py-2.5 rounded-full transition-all"
            >
              {uploaded.length > 0 ? `Submit ${uploaded.length} File${uploaded.length > 1 ? "s" : ""}` : "Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadButton;
