
import React, { useState, useMemo, useEffect } from 'react';
import { ICONS } from '../constants';
import { artworkService } from '../services/uploadApi'
import { useNavigate } from 'react-router-dom';

const INITIAL_DATA = {
  images: [],
  title: '',
  description: '',
  year: '2024',
  medium: '',
  category: 'Abstract',
  height: '',
  width: '',
  depth: '',
  framing: 'unframed',
  price: '',
  origin: 'Colombo, Sri Lanka',
  weight: '',
  shippingRate: 'standard',
};

const UploadArtPage = () => {
  
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false)

  // --- Handlers ---

  const handlePublish = async () => {
    try {
        // Optional: Add loading state here
        setIsPublishing(true)
        if (isPublishing) alert("Publishing...")
        await artworkService.uploadArtwork(formData);
        alert("Artwork published successfully!");
        navigate("/home")
        // Redirect or reset form
    } catch (error) {
        alert("Failed to publish artwork. Please try again.");
    }
  };

  const exit = () => {
    const result = window.confirm("Do you really want to exit (Entered data will be deleted)")
    if (result)  navigate("/home")
    else return
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {

    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)

      }));

      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const previewStyle = useMemo(() => {

    const h = parseFloat(formData.height);
    const w = parseFloat(formData.width);
    const hasDimensions = !isNaN(h) && !isNaN(w) && h > 0 && w > 0;
    
    if (!hasDimensions) {
      return { 
        height: '400px',
        width: 'auto',
        aspectRatio: '3/4' 
      };
    }
    
    const ratio = w / h;
    if (ratio >= 1) {
      return { 
        width: '100%',
        height: 'auto', 
        aspectRatio: `${w}/${h}` 
      };
    } 
    
    else {
      return { 
        height: '450px',
        width: 'auto',
        aspectRatio: `${w}/${h}` 
      };
    }
  }, [formData.height, formData.width]);

  // --- Render Helpers ---

  const renderProgressBar = () => {
    const steps = [
      { num: 1, label: 'Media' },
      { num: 2, label: 'Details' },
      { num: 3, label: 'Specs' },
      { num: 4, label: 'Logistics' },
    ];
    const progress = (step / 4) * 100;

    return (

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-end">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Upload Artwork</h1>
          <span className="text-amber-500 font-bold text-xs">{Math.round(progress)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center w-full pt-2">

          {steps.map((s, idx) => {

            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            
            return (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 ${isCurrent ? 'text-amber-500' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 shrink-0 rounded-full text-xs font-bold border ${
                    isCompleted ? 'bg-green-100 border-green-100 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 
                    isCurrent ? 'bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.num}
                  </span>
                  <span className="hidden sm:inline text-xs font-bold">{s.label}</span>
                </div>
                {idx < steps.length - 1 && <div className="h1-[1px] flex-1 bg-gray-200 dark:bg-gray-800 mx-4"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Step Components ---

  const renderStepMedia = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight pb-2">Upload Photography</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-relaxed">
          High-quality images increase sales potential. We recommend at least 3 angles. <br className="hidden sm:block"/>Accepted formats: JPG, PNG. Max file size 50MB.
        </p>
      </div>

      <div 
        className={`group relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
          isDragOver 
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-amber-500/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          type="file" 
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-3 text-center pointer-events-none p-5">
          <div className="size-12 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform duration-300">
            {React.cloneElement(ICONS.image, { className: 'text-xl' })}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-gray-900 dark:text-white">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>
      </div>

      {formData.images.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">Uploaded Files ({formData.images.length})</h3>
          {formData.images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm group hover:border-amber-500/30 transition-colors">
              <div className="w-2 relative text-gray-300 dark:text-gray-600 cursor-move group-hover:text-gray-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </div>
              <div className="h-14 w-14 shrink-0 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
                <img alt="Thumbnail" className="h-full w-full object-cover" src={img.preview} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{img.file.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{(img.file.size / 1024 / 1024).toFixed(2)} MB • 100% Uploaded</p>
              </div>
              <button 
                onClick={() => removeImage(idx)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                {React.cloneElement(ICONS.close, { className: 'w-4 h-4' })}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStepDetails = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up pb-32">
      <div>
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight pb-2">Tell the story</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-relaxed">
          Provide the core details of your artwork. A compelling title and description help collectors connect with your piece.
        </p>
      </div>
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-900 dark:text-gray-200" htmlFor="title">Artwork Title <span className="text-red-500">*</span></label>
          <input 
            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3 placeholder:text-gray-400" 
            id="title" 
            placeholder="e.g. The Persistence of Memory" 
            type="text" 
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-900 dark:text-gray-200" htmlFor="description">Description / The Story <span className="text-red-500">*</span></label>
            <span className="text-[11px] text-gray-400 font-medium">{formData.description.length} / 2000</span>
          </div>
          <textarea 
            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3 placeholder:text-gray-400 resize-none" 
            id="description" 
            placeholder="Describe the inspiration, technique, and meaning behind this piece..." 
            rows={6}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-900 dark:text-gray-200" htmlFor="year">Year Created <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                className="w-full appearance-none rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3" 
                id="year"
                value={formData.year}
                onChange={(e) => updateField('year', e.target.value)}
              >
                <option disabled value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="older">2020 or older</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                {React.cloneElement(ICONS.chevronRight, { className: 'rotate-90 w-3.5 h-3.5' })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-900 dark:text-gray-200" htmlFor="medium">Medium <span className="text-red-500">*</span></label>
            <input 
              className="w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3 placeholder:text-gray-400" 
              id="medium" 
              placeholder="e.g. Oil on Canvas, Bronze" 
              type="text" 
              value={formData.medium}
              onChange={(e) => updateField('medium', e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );

  const renderStepSpecs = () => (

    <div className="flex flex-col gap-8 animate-fade-in-up pb-32">
    <div>
      <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight pb-2">Physical Specifications</h2>
      <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
        Accurate dimensions are critical for shipping calculations and our AR viewing experience.
      </p>
    </div>
    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 text-gray-700 dark:text-gray-300">
      <div className="p-2 bg-white dark:bg-blue-900 rounded-lg shadow-sm text-blue-600 dark:text-blue-300">
        {React.cloneElement(ICONS.arScan, { className: 'w-6 h-6' })}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Powers AR Feature</h4>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          The dimensions you enter below will be used to generate the Augmented Reality view for buyers, allowing them to visualize the artwork on their wall at 100% scale.
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Dimensions</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height</label>
            <div className="relative">
              <input 
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600" 
                placeholder="0.0" 
                type="number"
                value={formData.height}
                onChange={(e) => updateField('height', e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">in</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Width</label>
            <div className="relative">
              <input 
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600" 
                placeholder="0.0" 
                type="number"
                value={formData.width}
                onChange={(e) => updateField('width', e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">in</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Depth</label>
            <div className="relative">
              <input 
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600" 
                placeholder="0.0" 
                type="number"
                value={formData.depth}
                onChange={(e) => updateField('depth', e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">in</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-100 dark:border-gray-800"/>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Framing Status</label>
          <span className="text-xs text-gray-400 font-medium">Is the artwork sold with a frame?</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
          <label className="flex-1 relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="framing" 
              type="radio" 
              value="unframed" 
              checked={formData.framing === 'unframed'}
              onChange={() => updateField('framing', 'unframed')}
            />
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">
              <span className="material-symbols-outlined text-[18px]">Unframed</span>
            </div>

          </label>
          <label className="flex-1 relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="framing" 
              type="radio" 
              value="framed"
              checked={formData.framing === 'framed'}
              onChange={() => updateField('framing', 'framed')}
            />
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">
              <span className="material-symbols-outlined text-[18px]">Framed</span>
            </div>

          </label>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800 mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex gap-2 items-center">
            {React.cloneElement(ICONS.info, { className: 'w-5 h-5 text-gray-400' })}
            {formData.framing === 'unframed' ? 'Canvas will be shipped rolled in a tube for safety.' : 'Artwork will be shipped in a reinforced crate.'}
          </p>
        </div>
      </div>
    </div>
  </div>
  );

  const renderStepLogistics = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up pb-32">
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400">{React.cloneElement(ICONS.creditCard, { className: 'w-6 h-6'})}</span>
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight">Pricing</h2>
      </div>
      <div className="grid gap-6">
        <div className="relative">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price (LKR)</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 font-bold sm:text-sm">LKR</span>
            </div>
            <input 
              className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-12 focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 font-semibold placeholder:font-normal" 
              id="price" 
              name="price" 
              placeholder="125,000" 
              type="number" 
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400 sm:text-sm">.00</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {React.cloneElement(ICONS.info, { className: 'w-4 h-4' })}
            Platform fee (10%) will be deducted from this amount.
          </p>
        </div>
      </div>
    </section>
    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 w-full"></div>
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400">{React.cloneElement(ICONS.shippingTruck, { className: 'w-6 h-6'})}</span>
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight">Logistics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Shipping Origin</label>
          <select 
            className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-amber-500 focus:ring-amber-500 py-2.5"
            value={formData.origin}
            onChange={(e) => updateField('origin', e.target.value)}
          >
            <option>Colombo, Sri Lanka</option>
            <option>Kandy, Sri Lanka</option>
            <option>Galle, Sri Lanka</option>
            <option>International</option>
            
          </select>
          <p className="mt-1 text-xs text-gray-400">The location from where the artwork will be shipped.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Weight (Kg)</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input 
              className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-amber-500 focus:ring-amber-500 py-2.5 pr-10" 
              placeholder="1.5" 
              type="number"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400 sm:text-sm font-bold">Kg</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block"></div>
        <div className="col-span-1 md:col-span-2 mt-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Shipping Rates</label>
          <div className="flex flex-col gap-3">
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all shadow-sm ring-1 ${formData.shippingRate === 'standard' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-amber-200 dark:ring-amber-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ring-transparent'}`}>
              
              <input 
                type="radio" 
                name="shipping-rate" 
                className="h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500" 
                checked={formData.shippingRate === 'standard'}
                onChange={() => updateField('shippingRate', 'standard')}
              />

              <div className="ml-3 block text-sm font-medium text-gray-900 dark:text-white w-full flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Standard Delivery</span>
                <span className="text-gray-600 dark:text-gray-400">LKR 450 <span className="text-gray-400 font-normal mx-1">•</span> 3-5 Business Days</span>
              </div>

            </label>
            
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all shadow-sm ring-1 ${formData.shippingRate === 'express' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-amber-200 dark:ring-amber-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ring-transparent'}`}>
              <input 
                type="radio" 
                name="shipping-rate" 
                className="h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500"
                checked={formData.shippingRate === 'express'}
                onChange={() => updateField('shippingRate', 'express')}
              />
              <div className="ml-3 block text-sm font-medium text-gray-900 dark:text-white w-full flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Express Delivery</span>
                <span className="text-gray-600 dark:text-gray-400">LKR 850 <span className="text-gray-400 font-normal mx-1">•</span> 1-2 Business Days</span>
              </div>
            </label>

          </div>
        </div>
      </div>
    </section>
  </div>
);
  
  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-gray-50 dark:bg-black font-sans text-[15px] text-gray-900 dark:text-gray-100 z-50 overflow-hidden">
      
      {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6 py-2.5 z-20 relative shadow-sm">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <div className="size-7 flex items-center justify-center bg-amber-500 rounded-lg text-white">
            {React.cloneElement(ICONS.create, { className: 'w-4 h-4' })}
          </div>
          <h2 className="text-base font-bold leading-tight tracking-tight">SoliasArt Studio</h2>
        </div>
        <div className="flex items-center gap-3">
            
            <button 
                onClick={() => exit()}
            className="rounded-lg h-8 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Exit
            </button>

        </div>
        </header>

      <div className="flex flex-1 overflow-hidden lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="w-full lg:w-[60%] xl:w-[55%] h-full flex flex-col relative z-10 overflow-y-auto">
            <div className="px-8 pt-8 pb-4">
              {renderProgressBar()}
            </div>

            <div className="flex-1 px-8 py-6 max-w-3xl mx-auto w-full flex flex-col gap-8">
              {step === 1 && renderStepMedia()}
              {step === 2 && renderStepDetails()}
              {step === 3 && renderStepSpecs()}
              {step === 4 && renderStepLogistics()}
            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-8 py-3 flex justify-between items-center z-20 mt-auto">
              <button 
                  onClick={handleBack}
                  disabled={step === 1}
                className="flex items-center gap-2 rounded-lg border border-transparent text-black dark:bg-white hover:border-amber-500 hover:text-amber-500 font-bold text-xs px-4 py-2 transition-colors"
              >
                {React.cloneElement(ICONS.chevronLeft, { className: 'w-3.5 h-3.5' })}
                  Back
              </button>
              <button 
                  onClick={step === 4 ? handlePublish : handleNext}
                className="px-5 py-2 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-md flex items-center gap-2"
              >
                  {step === 4 ? 'Publish Artwork' : 'Next Step'}
                {step < 4 && React.cloneElement(ICONS.chevronRight, { className: 'w-3.5 h-3.5' })}
              </button>
            </div>
        </div>

        {/* Live Preview Side Panel */}
        <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] bg-white dark:bg-gray-900 relative flex-col justify-center items-center p-10 border-l border-gray-200 dark:border-gray-800 h-full overflow-hidden">
            <div className="relative w-full max-w-400px flex flex-col gap-6 z-10">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    {React.cloneElement(ICONS.views, { className: 'text-amber-500 w-4 h-4' })}
                    Live Preview
                  </h3>
              </div>

              {/* Preview Card */}
              <div className="bg-white dark:bg-black rounded-sm overflow-hidden p-3 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 flex flex-col items-center transform transition-transform duration-500 hover:scale-[1.01]">
                  <div 
                      className="relative border-[8px] border-black dark:border-gray-800 p-2 bg-white dark:bg-gray-900 mb-4 transition-all duration-500 ease-in-out flex items-center justify-center"
                      style={previewStyle}
                  >
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative group flex items-center justify-center">
                      {formData.images.length > 0 ? (
                      <img 
                          alt="Artwork Preview" 
                          className="w-full h-full object-cover" 
                          src={formData.images[0].preview} 
                      />
                      ) : (
                      <div className="text-gray-300 dark:text-gray-600 flex flex-col items-center">
                          {React.cloneElement(ICONS.image, { className: 'w-12 h-12 mb-2' })}
                          <span className="text-xs uppercase font-bold">No Image</span>
                      </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      {formData.height && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 backdrop-blur-sm">
                          {React.cloneElement(ICONS.arScan, { className: 'w-3 h-3' })}
                          AR Ready
                      </div>
                      )}
                  </div>
                  </div>

                  <div className="flex flex-col items-center text-center w-full px-2 pb-2">

                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2 rounded-sm">
                      {formData.category || 'New Release'}
                  </span>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-400 mb-1">Samantha Perera</p>
                  <h4 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-2">
                      {formData.title || 'UNTITLED ARTWORK'}
                  </h4>

                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-xs font-medium mb-3">
                      <div className="flex items-center gap-1">
                      {React.cloneElement(ICONS.views, { className: 'w-4 h-4' })}
                      <span>--</span>
                      </div>
                      <div className="flex items-center gap-1">
                      {React.cloneElement(ICONS.heartOutline, { className: 'w-4 h-4' })}
                      <span>--</span>
                      </div>

                  </div>

                  <div className="flex flex-col items-center gap-0.5 mb-3 opacity-80">
                      <span className="text-[10px] text-gray-400 font-medium">Current Price</span>
                      <span className="text-lg font-extrabold text-black dark:text-white">
                      {formData.price ? `LKR ${parseInt(formData.price).toLocaleString()}` : '--'}
                      </span>
                  </div>

                  <a className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1">
                      View Details
                  </a>

                  </div>
              </div>
              {/* --------- */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArtPage;