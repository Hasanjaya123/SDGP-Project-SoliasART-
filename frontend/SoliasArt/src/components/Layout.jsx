
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Nav-bar';
import Footer from './Footer';

const Layout = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // flip the switch
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // The main container that takes up the entire screen

    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">

      {/* Left Sidebar*/}
      <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Scrollable Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative pt-16 md:pt-0">

        {/* The current page is injected into this <Outlet /> */}
        <div className="flex-1 flex flex-col [&>*]:flex-1">
          <Outlet />
        </div>

        {/* Footer*/}
        <div className="mt-auto  shrink-0">
          <Footer />
        </div>

      </main>

    </div>
  );
};

export default Layout;