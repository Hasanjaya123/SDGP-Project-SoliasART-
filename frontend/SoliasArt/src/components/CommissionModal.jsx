import { useState, useRef, useCallback } from 'react';
import { commissionService } from '../services/uploadApi';

/**
 * CommissionModal — "Request a Custom Commission" overlay form.
 *
 * Props:
 *   isOpen    (bool)     – whether the modal is visible
 *   onClose   (fn)       – called when backdrop / X is clicked
 *   artistId  (string)   – the target artist's UUID
 */
export default function CommissionModal({ isOpen, onClose, artistId }) {
  // ── Form state ──────────────────────────────────
  const [form, setForm] = useState({
    title: '',
    description: '',
    medium: 'Oil on Canvas',
    size_inches: '',
    proposed_budget: '',
    deadline: '',
  });

  const [referenceFile, setReferenceFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // ── Medium options ──────────────────────────────
  const mediumOptions = [
    'Oil on Canvas',
    'Watercolor',
    'Acrylic',
    'Digital Art',
    'Charcoal',
    'Pencil Sketch',
    'Mixed Media',
    "Artist's Choice",
  ];

  // ── Handlers ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Process a dropped or selected file */
  const processFile = useCallback((file) => {
    if (!file) return;
    // Validate: image only, ≤10 MB
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10 MB');
      return;
    }
    setReferenceFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileSelect = (e) => {
    processFile(e.target.files?.[0]);
  };

  const removeFile = () => {
    setReferenceFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build the FormData payload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('medium', form.medium);
      formData.append('size_inches', form.size_inches);
      formData.append('proposed_budget', form.proposed_budget);
      formData.append('deadline', form.deadline);
      formData.append('artist_id', artistId);

      if (referenceFile) {
        formData.append('reference_image', referenceFile);
      }

      await commissionService.submitCommission(formData);
      setSuccess(true);

      // Auto‑close after a brief pause
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit commission request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      medium: 'Oil on Canvas',
      size_inches: '',
      proposed_budget: '',
      deadline: '',
    });
    removeFile();
  };

  // ── Don't render if closed ──────────────────────
  if (!isOpen) return null;

  // ── UI ──────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl mx-4"
        style={{ backgroundColor: '#FAF8F4' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────── */}
        <div className="relative px-8 pt-8 pb-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full
                       text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition border-none"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Request a Custom Commission
          </h2>

          {/* Accent underline matching the image */}
          <div className="mt-2 h-1.5 w-80 rounded-full bg-gradient-to-r from-amber-200 via-orange-200 to-transparent" />
        </div>

        {/* ── Success overlay ─────────────────── */}
        {success && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">Request Submitted!</p>
            <p className="text-slate-500 mt-2 font-medium">You will get notified after this.</p>
          </div>
        )}

        {/* ── Form ────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">

            {/* ═══════ LEFT COLUMN: THE VISION ═══════ */}
            <div>
              <h3
                className="text-xs font-bold tracking-[0.2em] mb-5"
                style={{ color: '#9C6E1B' }}
              >
                THE VISION
              </h3>

              {/* Project Title */}
              <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Ethereal Landscape in Ochre"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
                           text-sm text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                           transition"
              />

              {/* Description */}
              <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mt-5 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the mood, color palette, and core subjects of your piece..."
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
                           text-sm text-gray-800 placeholder-gray-400 resize-none
                           focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                           transition"
              />

              {/* Reference Image Drop Zone */}
              <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mt-5 mb-1.5">
                Reference Image
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed
                  cursor-pointer transition
                  ${isDragging
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-300 bg-white hover:border-amber-300 hover:bg-amber-50/30'}
                `}
              >
                {previewUrl ? (
                  <div className="flex items-center gap-3 px-4">
                    <img
                      src={previewUrl}
                      alt="Reference preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <div className="text-sm text-gray-600 truncate max-w-[180px]">
                      {referenceFile?.name}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="ml-auto text-red-400 hover:text-red-600 text-lg border-none"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Upload icon */}
                    <svg className="w-7 h-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <p className="text-sm text-gray-500">Drop files or click to upload reference</p>
                    <p className="text-xs text-amber-500 mt-0.5">Maximum size: 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            {/* ═══════ RIGHT COLUMN: SPECS & TERMS ═══════ */}
            <div>
              <h3
                className="text-xs font-bold tracking-[0.2em] mb-5"
                style={{ color: '#9C6E1B' }}
              >
                SPECS &amp; TERMS
              </h3>

              {/* Medium + Dimensions row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mb-1.5">
                    Medium
                  </label>
                  <div className="relative">
                    <select
                      name="medium"
                      value={form.medium}
                      onChange={handleChange}
                      className="w-full appearance-none px-4 py-3 rounded-lg border border-gray-200 bg-white
                                 text-sm text-gray-800
                                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                                 transition pr-8"
                    >
                      {mediumOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mb-1.5">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="size_inches"
                    value={form.size_inches}
                    onChange={handleChange}
                    placeholder="e.g., 24 × 36 inches"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
                               text-sm text-gray-800 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                               transition"
                  />
                </div>
              </div>

              {/* Budget + Deadline row */}
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mb-1.5">
                    Budget Range
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      LKR
                    </span>
                    <input
                      type="number"
                      name="proposed_budget"
                      value={form.proposed_budget}
                      onChange={handleChange}
                      placeholder="2,500"
                      min="0"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white
                                 text-sm text-gray-800 placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                                 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 tracking-widest uppercase mb-1.5">
                    Desired Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white
                               text-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                               transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit button (bottom right) ─── */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg
                         text-sm font-bold uppercase tracking-wider
                         text-gray-900 transition shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:brightness-105 active:scale-[0.98]
                         border-none cursor-pointer"
              style={{ backgroundColor: '#F5C542' }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Submit Request
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
