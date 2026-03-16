
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { artworkService } from '../services/uploadApi'

const INITIAL_DATA = {
  displayName: 'Samantha Perera',
  bio: "I am a contemporary abstract artist based in Colombo. My work explores the intersection of chaos and order, using texture and color to convey emotion. I've been painting for over 10 years and draw inspiration from the bustling city life and the serene coastal landscapes of Sri Lanka.",
  ig: '',
  website: '',
  primaryMedium: 'Oil Painting',
  artisticStyles: ['Abstract', 'Contemporary'],
  yearsExperience: '10+ Years',
  keywords: '',
  legalName: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  dispatchAddress: '',
  phone: '',
  agreedToTerms: false,
  identityDocument: null,
  profileImageFile: null,
  profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7-ZJJFCCvTZsCGJ_0taTKw6GTcQsOkKTWcsceeHvkwjDLUIMTNjsfTlGWTLvFKOGxEiG7FVuXC9RcEL9lt7TdsBeaEpmeKTM-GdPcavgTnQyIllRETJKCwWl1zwG3cuJI2M9jXc4_BM_T8QEtX6r14jxOYnT5tDTKzR_e_O4BFqSgwcpWjdHnVqh1c0pQC6XukgqsWksuV7vnqDK5e-Tf88mT3P27QhLUpnPwMJoM70xuatixWeVY3N962m2OJATTVgM9OOCuVZk'
};

const ArtistOnboardingPage = () => {
  
  const { userId } = useParams()
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const fileInputRef = useRef(null);
  const idFileInputRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraggingId, setIsDraggingId] = useState(false);

  // --- Handlers ---


  const handlePublish = async () => {
    try {
        
        setIsPublishing(true)
        if (isPublishing) alert("Converting...")
        await artworkService.uploadArtist(formData, userId);
        alert("You have created Artist Acount successfully!");
        navigate("/user/artist/profile")
        // Redirect or reset form
    } catch (error) {
        alert("Failed to convert to an Artist. Please try again.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateField('profileImage', imageUrl);
      updateField('profileImageFile', file);
    }
  };

  const handleIdDocumentUpload = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, JPG, or PNG file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }
    updateField('identityDocument', file);
  };

  const handleIdFileChange = (event) => {
    const file = event.target.files?.[0];
    handleIdDocumentUpload(file);
  };

  const handleIdDragOver = (e) => {
    e.preventDefault();
    setIsDraggingId(true);
  };

  const handleIdDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingId(false);
  };

  const handleIdDrop = (e) => {
    e.preventDefault();
    setIsDraggingId(false);
    const file = e.dataTransfer.files?.[0];
    handleIdDocumentUpload(file);
  };

  const removeIdDocument = () => {
    updateField('identityDocument', null);
    if (idFileInputRef.current) idFileInputRef.current.value = '';
  };

  const exit = () => {
    const result = window.confirm("Do you really want to exit? (Entered data will be deleted)");
    if (result) navigate("/home");
    else return;
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  // --- Render Helpers ---

  const renderProgressBar = () => {
    const steps = [
      { num: 1, label: 'Identity' },
      { num: 2, label: 'Art Style' },
      { num: 3, label: 'Commerce' },
      { num: 4, label: 'Verification' },
    ];
    const progress = (step / 4) * 100;

    return (
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {step === 1 ? 'Artist Identity' : step === 2 ? 'Artistic Style' : step === 3 ? 'Commerce & Logistics' : 'Trust & Verification'}
          </h1>
          <span className="text-[#FFC247] font-bold text-sm">{Math.round(progress)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FFC247] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center w-full pt-2">

          {steps.map((s, idx) => {

            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 ${isCurrent || isCompleted ? 'text-[#FFC247]' : 'text-slate-400 dark:text-slate-500'}`}>
                  {isCompleted ? (
                    <span className="flex items-center justify-center size-6 rounded-full bg-[#FFC247] text-slate-900 text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </span>
                  ) : (
                    <span className={`flex items-center justify-center size-6 rounded-full ${isCurrent ? 'bg-[#FFC247] text-slate-900 border-none' : 'border border-slate-200 dark:border-zinc-700'} text-xs font-bold`}>
                      {s.num}
                    </span>
                  )}
                  <span className={`hidden sm:inline text-sm ${isCurrent || isCompleted ? 'font-bold' : 'font-medium'}`}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-[1px] flex-1 mx-4 ${isCompleted ? 'bg-[#FFC247]' : 'bg-slate-200 dark:bg-zinc-700'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Step Components ---

  const renderStepIdentity = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight pb-1">Tell us your story</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
          This information will be displayed on your public studio profile. Buyers love to know the person behind the art.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="size-24 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-dashed border-slate-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden hover:border-[#FFC247] transition-colors">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-4xl group-hover:text-[#FFC247] transition-colors">add_a_photo</span>
            {formData.profileImage && (
              <img alt="Avatar preview" className="absolute inset-0 w-full h-full object-cover" src={formData.profileImage} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-700 rounded-full p-1.5 shadow-md border border-slate-200 dark:border-zinc-600">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-sm">edit</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <h3 className="text-slate-900 dark:text-white font-bold text-base">Profile Picture</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs">Upload a clear photo of yourself or your studio logo. JPG or PNG, max 5MB.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Studio / Display Name <span className="text-red-500">*</span></label>
          <input 
            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
            placeholder="e.g. Samantha Perera Art" 
            type="text" 
            value={formData.displayName}
            onChange={(e) => updateField('displayName', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Artist Bio / The Story <span className="text-red-500">*</span></label>
          <textarea 
            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none" 
            placeholder="Tell buyers about your inspiration, your background, and what drives your creativity..." 
            rows={4} 
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
          />
          <div className="flex justify-end text-xs text-slate-400 dark:text-slate-500">
            <span>{formData.bio.length}/1000 characters</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-zinc-800 pt-4 mt-1">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">IG</span>
              </div>
              <input 
                className="pl-10 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                placeholder="@username" 
                type="text" 
                value={formData.ig}
                onChange={(e) => updateField('ig', e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">language</span>
              </div>
              <input 
                className="pl-10 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                placeholder="https://yourportfolio.com" 
                type="text" 
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepArtStyle = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight pb-1">Define your art</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
          Select the mediums and styles that best represent your work. This helps us match you with the right collectors.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Primary Medium <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">search</span>
            </div>
            <select 
              className="pl-10 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white appearance-none"
              value={formData.primaryMedium}
              onChange={(e) => updateField('primaryMedium', e.target.value)}
            >
              <option value="Oil Painting">Oil Painting</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Sculpture">Sculpture</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">expand_more</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This will be highlighted on your profile as your main expertise.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Artistic Style <span className="text-red-500">*</span> <span className="text-slate-400 dark:text-slate-500 font-normal">(Select up to 3)</span></label>
          <div className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 flex flex-wrap gap-2 items-center focus-within:border-[#FFC247] focus-within:ring-1 focus-within:ring-[#FFC247] shadow-sm">
            {formData.artisticStyles.map(style => (
              <div key={style} className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-sm">
                {style}
                <button 
                  className="hover:text-slate-900 dark:hover:text-white"
                  onClick={() => updateField('artisticStyles', formData.artisticStyles.filter(s => s !== style))}
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
            <input 
              type="text" 
              placeholder="Type to add style..." 
              className="flex-1 min-w-[120px] border-none focus:ring-0 p-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  e.preventDefault();
                  if (formData.artisticStyles.length < 3 && !formData.artisticStyles.includes(e.currentTarget.value)) {
                    updateField('artisticStyles', [...formData.artisticStyles, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-slate-400 dark:text-slate-500">Popular:</span>
            {['Realism', 'Impressionism', 'Surrealism', 'Minimalism'].map(style => (
              <button 
                key={style}
                className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => {
                  if (formData.artisticStyles.length < 3 && !formData.artisticStyles.includes(style)) {
                    updateField('artisticStyles', [...formData.artisticStyles, style]);
                  }
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Years of Experience <span className="text-red-500">*</span></label>
          <div className="relative">
            <select 
              className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white appearance-none"
              value={formData.yearsExperience}
              onChange={(e) => updateField('yearsExperience', e.target.value)}
            >
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-3 Years">1-3 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5-10 Years">5-10 Years</option>
              <option value="10+ Years">10+ Years</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Additional Keywords</label>
          <input 
            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
            placeholder="e.g. landscape, portrait, texture, nature" 
            type="text" 
            value={formData.keywords}
            onChange={(e) => updateField('keywords', e.target.value)}
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Separate keywords with commas.</p>
        </div>
      </div>
    </div>
  );

  const renderStepCommerce = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight pb-1">Set up payments & shipping</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
          We need these details to process your earnings and ensure artworks are picked up correctly. This information is kept private.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Legal Full Name <span className="text-red-500">*</span></label>
          <input 
            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
            placeholder="As it appears on your bank account" 
            type="text" 
            value={formData.legalName}
            onChange={(e) => updateField('legalName', e.target.value)}
          />
        </div>

        <div className="border border-slate-200 dark:border-zinc-700 rounded-lg p-4 bg-slate-50/50 dark:bg-zinc-800/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Banking Details</h3>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              SECURE
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900 dark:text-white">Bank Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white appearance-none"
                  value={formData.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                >
                  <option value="">Select Bank</option>
                  <option value="Commercial Bank">Commercial Bank</option>
                  <option value="HNB">HNB</option>
                  <option value="BOC">BOC</option>
                  <option value="Sampath Bank">Sampath Bank</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900 dark:text-white">Branch Name</label>
              <input 
                className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                placeholder="e.g. Downtown Branch" 
                type="text" 
                value={formData.branchName}
                onChange={(e) => updateField('branchName', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">Account Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                placeholder="0000 0000 0000" 
                type="text" 
                value={formData.accountNumber}
                onChange={(e) => updateField('accountNumber', e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">credit_card</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Primary Dispatch Address <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">location_on</span>
            </div>
            <input 
              className="pl-10 pr-16 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              placeholder="Start typing your address..." 
              type="text" 
              value={formData.dispatchAddress}
              onChange={(e) => updateField('dispatchAddress', e.target.value)}
            />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#FFC247] font-bold text-sm hover:text-yellow-600">
              Detect
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This is where couriers will pick up sold artworks.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">Contact Phone Number <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <div className="relative w-24">
              <select className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white appearance-none">
                <option>+94</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">expand_more</span>
              </div>
            </div>
            <input 
              className="flex-1 rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FFC247] focus:ring-[#FFC247] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              placeholder="(555) 000-0000" 
              type="tel" 
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">For urgent logistics updates regarding your shipments.</p>
        </div>
      </div>
    </div>
  );

  const renderStepVerification = () => (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight pb-1">Verify your identity</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
          To maintain a trusted marketplace, we verify the identity of every artist. Please upload a government-issued ID.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Identity Document</h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">Required</span>
          </div>
          
          {formData.identityDocument ? (
            <div className="border-2 border-solid border-emerald-300 dark:border-emerald-700 rounded-xl p-5 flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-900/10">
              <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">description</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{formData.identityDocument.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{(formData.identityDocument.size / 1024).toFixed(1)} KB &middot; {formData.identityDocument.type.split('/')[1]?.toUpperCase()}</p>
              </div>
              <button
                onClick={removeIdDocument}
                className="flex items-center justify-center size-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove document"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => idFileInputRef.current?.click()}
              onDragOver={handleIdDragOver}
              onDragLeave={handleIdDragLeave}
              onDrop={handleIdDrop}
              className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDraggingId
                  ? 'border-[#FFC247] bg-yellow-50/50 dark:bg-yellow-900/10'
                  : 'border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-[#FFC247]'
              }`}
            >
              <div className="size-10 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-[#FFC247]">cloud_upload</span>
              </div>
              <p className="text-slate-900 dark:text-white font-medium text-sm mb-1"><span className="font-bold">Click to upload</span> or drag and drop</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">National ID Card (NIC), Passport, or Driving License</p>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded bg-white dark:bg-zinc-800">PDF</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded bg-white dark:bg-zinc-800">JPG</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded bg-white dark:bg-zinc-800">PNG</span>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={idFileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleIdFileChange}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex gap-2 items-start">
          <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 mt-0.5 text-[18px]">verified_user</span>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 text-xs mb-0.5">Your data is encrypted</h4>
            <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">Documents are securely stored and only used for verification purposes. They are never shared publicly.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Terms & Conditions</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" 
                className="peer appearance-none size-5 border border-slate-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 checked:bg-[#FFC247] checked:border-[#FFC247] focus:ring-2 focus:ring-[#FFC247] focus:ring-offset-1 transition-colors"
                checked={formData.agreedToTerms}
                onChange={(e) => updateField('agreedToTerms', e.target.checked)}
              />
              <span className="material-symbols-outlined absolute text-slate-900 text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I agree to the <a href="#" className="text-[#FFC247] font-bold hover:underline">Artist Terms of Service</a>. I understand that ArtSpace charges a <span className="font-bold text-slate-900 dark:text-white">15% commission</span> on all sales, which covers payment processing, platform maintenance, and marketing. I also agree to adhere to the shipping timelines outlined in the <a href="#" className="text-[#FFC247] font-bold hover:underline">Logistics Policy</a>.
            </p>
          </label>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-[#f8f8f6] dark:bg-black font-sans text-slate-900 dark:text-white z-50 overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-2 z-20 relative shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-8 flex items-center justify-center bg-[#FFC247] rounded-lg text-slate-900">
            <span className="material-symbols-outlined">brush</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">ArtSpace Studio</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>Artist Application</span>
            <span className="w-1 h-1 bg-slate-300 dark:bg-zinc-600 rounded-full"></span>
            <span className="text-slate-900 dark:text-white">Draft saved</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            
            <button 
                onClick={() => exit()}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="truncate">Exit</span>
            </button>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-gray-200 dark:border-zinc-700" data-alt="User profile avatar placeholder" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7-ZJJFCCvTZsCGJ_0taTKw6GTcQsOkKTWcsceeHvkwjDLUIMTNjsfTlGWTLvFKOGxEiG7FVuXC9RcEL9lt7TdsBeaEpmeKTM-GdPcavgTnQyIllRETJKCwWl1zwG3cuJI2M9jXc4_BM_T8QEtX6r14jxOYnT5tDTKzR_e_O4BFqSgwcpWjdHnVqh1c0pQC6XukgqsWksuV7vnqDK5e-Tf88mT3P27QhLUpnPwMJoM70xuatixWeVY3N962m2OJATTVgM9OOCuVZk")' }}></div>

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="w-full lg:w-[50%] xl:w-[50%] h-full flex flex-col relative z-10 overflow-y-auto bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="px-6 pt-4 pb-2">
              {renderProgressBar()}
            </div>

            <div className="flex-1 px-6 py-3 max-w-3xl mx-auto w-full flex flex-col gap-5">
              {step === 1 && renderStepIdentity()}
              {step === 2 && renderStepArtStyle()}
              {step === 3 && renderStepCommerce()}
              {step === 4 && renderStepVerification()}
            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-6 py-3 flex justify-between items-center z-20 transition-colors duration-300">
              <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back
              </button>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  Save Draft
                </button>
                <button 
                    onClick={step === 4 ? handlePublish : handleNext}
                    className="px-6 py-2.5 rounded-lg bg-[#FFC247] text-slate-900 font-bold text-sm hover:bg-yellow-400 shadow-md shadow-yellow-500/20 transition-all flex items-center gap-2"
                >
                    {step === 1 ? 'Next: Art Style' : step === 2 ? 'Next: Commerce' : step === 3 ? 'Next: Verification' : 'Submit Application'}
                    {step === 4 ? (
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    )}
                </button>
              </div>
            </div>
        </div>

        {/* Live Preview Side Panel */}
        <div className="hidden lg:flex lg:w-[50%] xl:w-[50%] bg-[#f8f8f6] dark:bg-black relative flex-col justify-start items-center p-0 border-l border-slate-200 dark:border-zinc-800 overflow-y-auto transition-colors duration-300">
          <div className="w-full relative flex flex-col gap-6 bg-white dark:bg-zinc-900 shadow-sm min-h-full transition-colors duration-300">
            <div className="h-48 md:h-64 w-full relative bg-slate-200 dark:bg-zinc-800">
              <img alt="Artist Cover Banner" className={`w-full h-full object-cover ${step === 3 || step === 4 ? 'opacity-30 blur-sm' : ''} transition-all duration-500`} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL9_rRiYBuwt-uSrscE9TYSxWgzPKxxYLBcFQfJPLq6uIeCWyJ5_LE_xYgoMiAXYKcdpn1SvFALZYTbH0C_Y1q68WCuSUE8gMOfag4o4BJwETUiOCgzO0OtDR5lCEKbKl2daLGMLcwfWMt9xw4Q0xWaK7dFHZR9Eoi-js1HmxihvXJsgj8JqBJ4I-nZUeQu9lcJlc5scp2MBGmt7NGrjV52OAwquyQrLWuncrCDl1sbFPVWCeEu3AF_Ni4dEsJO9uYuG-kw51SjTc" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
            <div className="px-8 pb-8 -mt-20 relative">
              <div className={`flex flex-col md:flex-row items-end md:items-center justify-between gap-4 ${step === 3 || step === 4 ? 'opacity-30 blur-sm' : ''} transition-all duration-500`}>
                <div className="relative">
                  <div className="size-32 md:size-36 rounded-full border-4 border-white dark:border-zinc-900 shadow-md bg-white dark:bg-zinc-800 overflow-hidden">
                    <img alt="Artist Avatar" className="w-full h-full object-cover" src={formData.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuA7-ZJJFCCvTZsCGJ_0taTKw6GTcQsOkKTWcsceeHvkwjDLUIMTNjsfTlGWTLvFKOGxEiG7FVuXC9RcEL9lt7TdsBeaEpmeKTM-GdPcavgTnQyIllRETJKCwWl1zwG3cuJI2M9jXc4_BM_T8QEtX6r14jxOYnT5tDTKzR_e_O4BFqSgwcpWjdHnVqh1c0pQC6XukgqsWksuV7vnqDK5e-Tf88mT3P27QhLUpnPwMJoM70xuatixWeVY3N962m2OJATTVgM9OOCuVZk"} />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-white dark:bg-zinc-900 text-[#FFC247] rounded-full p-0.5 border border-slate-100 dark:border-zinc-700 shadow-sm">
                    <span className="material-symbols-outlined filled text-[20px]">verified</span>
                  </span>
                </div>
                <div className="flex gap-3 mb-4 md:mb-8">
                  <button className="bg-[#FFC247] text-slate-900 font-bold text-sm px-6 py-2 rounded-full shadow-sm" disabled>
                    Follow
                  </button>
                  <button className="bg-white dark:bg-zinc-800 border border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-white font-bold text-sm px-4 py-2 rounded-full" disabled>
                    Request Commission
                  </button>
                </div>
              </div>
              
              <div className={`mt-4 ${step === 3 || step === 4 ? 'opacity-30 blur-sm' : ''} transition-all duration-500`}>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{formData.displayName || 'Your Name'}</h1>
                  {step >= 2 && (
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px] text-[#FFC247]">palette</span>
                      {formData.primaryMedium}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">{formData.bio || 'Your bio will appear here.'}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Colombo, Sri Lanka</span>
                  </div>
                  {step >= 2 && (
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                      <span className="material-symbols-outlined text-[18px]">history</span>
                      <span>{formData.yearsExperience} Exp.</span>
                    </div>
                  )}
                </div>
                
                {step >= 2 && formData.artisticStyles.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {formData.artisticStyles.map(style => (
                      <span key={style} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-800">
                        {style}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={`flex items-center gap-6 mt-8 border-t border-slate-100 dark:border-zinc-800 pt-6 pb-2 ${step === 3 || step === 4 ? 'opacity-30 blur-sm' : ''} transition-all duration-500`}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">12.5k</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Followers</span>
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">48</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Artworks</span>
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">142</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sold</span>
                </div>
              </div>

              <div className={`mt-8 border-b border-slate-200 dark:border-zinc-800 ${step === 3 || step === 4 ? 'opacity-30 blur-sm' : ''} transition-all duration-500`}>
                <nav className="flex gap-8">
                  <a className="pb-3 border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold text-sm" href="#" onClick={e => e.preventDefault()}>Portfolio</a>
                  <a className="pb-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm" href="#" onClick={e => e.preventDefault()}>Uploads</a>
                  <a className="pb-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm" href="#" onClick={e => e.preventDefault()}>About</a>
                </nav>
              </div>

              {(step === 3 || step === 4) && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-slate-200 dark:border-zinc-700 shadow-xl rounded-2xl p-8 max-w-sm text-center animate-fade-in-up">
                    <div className="size-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">visibility_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Internal Data Only</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {step === 3 
                        ? "The information entered in this step is private and will not be displayed on your public profile."
                        : "The verification documents and agreements in this step are strictly confidential."}
                    </p>
                  </div>
                </div>
              )}

              {step !== 3 && step !== 4 && (
                <div className="mt-8 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-100 dark:border-zinc-800 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5">info</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {step === 1 
                      ? "This is a preview of your studio page. As you update your identity details on the left, this preview will update to show you exactly what collectors will see."
                      : "Your profile now reflects your chosen art styles. Collectors often search by medium, so make sure your Primary Medium is accurate."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistOnboardingPage;
