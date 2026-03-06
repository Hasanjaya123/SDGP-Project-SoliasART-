import React from 'react';

export const ArtistOnboardingSuccessPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f6] dark:bg-black font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="absolute top-0 w-full flex items-center justify-between px-8 py-6 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#FFC247] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[20px]">palette</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ArtVerify</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
          <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
          <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Support</a>
          <button 
            onClick={() => setCurrentPage('home')}
            className="px-6 py-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            Login
          </button>
        </nav>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-2xl px-6 z-10">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-12 md:p-16 flex flex-col items-center text-center relative overflow-hidden transition-colors duration-300">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-[#FFC247] to-amber-500"></div>
          
          {/* Icon */}
          <div className="size-32 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-10 relative">
            <div className="absolute inset-0 rounded-full bg-amber-100/50 dark:bg-amber-900/10 animate-ping" style={{ animationDuration: '3s' }}></div>
            <span className="material-symbols-outlined text-[#FFC247] text-[64px] relative z-10">light_mode</span>
          </div>

          {/* Text Content */}
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 font-serif leading-tight">
            Your account has been<br />successfully created
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mb-12 leading-relaxed font-medium">
            Your Identity Verification is currently under review. Expected completion is within 24-48 hours. In the meantime, you can explore the marketplace or preview your studio.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setCurrentPage('home')}
              className="px-8 py-4 rounded-xl bg-[#FFC247] text-slate-900 font-bold text-base hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5"
            >
              Explore Marketplace
            </button>
            <button 
              onClick={() => setCurrentPage('artistDashboard')}
              className="px-8 py-4 rounded-xl bg-white dark:bg-zinc-800 border-2 border-[#FFC247] text-slate-900 dark:text-white font-bold text-base hover:bg-amber-50 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
            >
              Visit Studio (Preview)
            </button>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-amber-50/50 dark:bg-amber-900/10 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-50/50 dark:bg-amber-900/10 blur-3xl"></div>
      </div>
    </div>
  );
};