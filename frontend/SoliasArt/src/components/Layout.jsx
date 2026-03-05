import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Nav-bar'; // Adjust path if needed
import Footer from './Footer'; // Adjust path if needed

const Layout = () => {
  return (
    // The main container that takes up the entire screen
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden font-sans text-gray-900 dark:text-gray-100">
      
      {/* 1. Left Sidebar (Fixed Width) */}
      <aside className="w-64 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 hidden md:block">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area (Scrollable) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        
        {/* The current page (e.g., ArtworkDetailsPage) is injected into this <Outlet /> */}
        <div className="flex-1">
          <Outlet /> 
        </div>

        {/* 3. Footer (Pushed to the very bottom) */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
          <Footer />
        </div>

      </main>
      
    </div>
  );
};

export default Layout;