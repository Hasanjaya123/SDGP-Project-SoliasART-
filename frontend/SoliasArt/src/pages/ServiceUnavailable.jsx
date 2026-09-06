import React from 'react';
import { RotateCcw, AlertTriangle, Mail, Activity } from 'lucide-react';
import soliasartlogo from '../assets/soliasartlogo.png';

export default function ServiceUnavailable() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm sm:shadow-md border border-slate-100 dark:border-slate-800/80 p-6 sm:p-10 space-y-6">

        {/* Brand Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <img
            src={soliasartlogo}
            alt="SoliasArt logo"
            className="h-12 sm:h-14 w-auto object-contain select-none"
            onError={(e) => {
              // Fallback to favicon in public folder if asset path fails
              e.currentTarget.src = '/favicon.png';
              e.currentTarget.className = 'h-12 sm:h-14 w-12 sm:w-14 object-contain select-none';
            }}
          />

          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium"
            role="status"
            aria-label="Service Status: Error 503 Service Temporarily Unavailable"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-700"></span>
            </span>
            <span>Error 503 - Service Temporarily Unavailable</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight pt-1">
            We'll be right back
          </h1>
        </header>

        {/* Informative Body Content */}
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base border-t border-b border-slate-100 dark:border-slate-800/80 py-6">
          <p className="font-medium text-slate-800 dark:text-slate-100 text-base sm:text-lg">
            SoliasArt's backend is temporarily offline.
          </p>

          <p>
            <strong className="font-semibold text-slate-900 dark:text-slate-100">What happened:</strong>{' '}
            SoliasArt started as a university project, and our AI-powered backend was hosted on DigitalOcean through the GitHub Student Developer Pack. DigitalOcean recently ended its participation in that program, and as a result our backend was taken down starting <strong className="font-semibold text-slate-900 dark:text-slate-100">September 5, 2026</strong>.
          </p>

          <p>
            Because our backend runs AI models with heavy RAM requirements, it can't run on a free hosting tier, so we're not able to simply spin it back up on the same plan.
          </p>

          <p>
            <strong className="font-semibold text-slate-900 dark:text-slate-100">What we're doing:</strong>{' '}
            We're actively migrating the backend to a new hosting platform. This may take a little while to complete.
          </p>

          <p>
            Thank you for your interest in SoliasArt, and for your patience while we get things back online.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            aria-label="Retry loading SoliasArt"
          >
            <RotateCcw className="w-4 h-4 transition-transform hover:-rotate-45" aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>

        {/* Footer & Support Links */}
        <footer className="space-y-4 pt-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p className="leading-normal">
            This page updates automatically once our backend is back, check back soon, or refresh this page.
          </p>

          {/* Placeholders for contact and status page */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <a
              href="mailto:{{CONTACT_EMAIL}}"
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              title="Contact Support"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <span>Contact us: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">soliasartsrilanka@gmail.com</span></span>
            </a>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

            <a
              href="{{STATUS_PAGE_URL}}"
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              title="System Status Page"
            >
              <Activity className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <span>Landing page: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">https://landing.soliasart.com</span></span>
            </a>
          </div>
        </footer>

      </div>
    </main>
  );
}
