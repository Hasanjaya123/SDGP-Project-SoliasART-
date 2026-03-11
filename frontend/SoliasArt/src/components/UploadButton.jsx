import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const UploadButton = ({ onImageUpload }) => {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState([]); // [{ name, url }]
  const fileRef = useRef();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const newFiles = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    setUploaded((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0 && onImageUpload) onImageUpload(newFiles[0].url, files[0]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    const newFiles = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    setUploaded((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0 && onImageUpload) onImageUpload(newFiles[0].url, files[0]);
  };

  const handleClose = () => {
    uploaded.forEach((f) => URL.revokeObjectURL(f.url));
    setOpen(false);
    setUploaded([]);
  };

  const modal = open ? (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" }}
        onClick={handleClose}
      />

      {/* Modal panel — centred by flexbox on the overlay */}
      <div
        style={{ position: "relative", zIndex: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
      >
        {/* Palette emoji */}
        <div className="flex justify-center mb-4">
          <span className="text-4xl">🎨</span>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl px-8 py-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-amber-400 bg-amber-900/20"
              : "border-gray-600 hover:border-amber-400 hover:bg-amber-900/10"
          }`}
        >
          <p className="font-bold text-white text-sm mb-1">Drag & drop your artwork here</p>
          <p className="text-xs text-gray-400">or click to browse — PNG, JPG, WEBP</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Image previews */}
        {uploaded.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              {uploaded.length} file{uploaded.length > 1 ? "s" : ""} queued
            </p>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {uploaded.map((file, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                    <span className="text-[9px] text-white font-medium truncate w-full">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close / Submit */}
        <button
          onClick={handleClose}
          className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-sm py-2.5 rounded-full transition-all"
        >
          {uploaded.length > 0 ? `Submit ${uploaded.length} File${uploaded.length > 1 ? "s" : ""}` : "Close"}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md transition-all duration-200 hover:shadow-amber-300/40 hover:shadow-lg"
      >
        <UploadIcon />
        Upload 🖼
      </button>

      {/* Portal renders the modal directly into document.body — escapes ALL parent stacking contexts */}
      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
};

export default UploadButton;
