import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Nav-bar'; 
import Footer from './Footer'; 

const Layout = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  // 3. The Switcher: Adds or removes the "dark" class on the very top <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 4. The Function to flip the switch
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // The main container that takes up the entire screen
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Left Sidebar*/}
      <aside className="w-64 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-800 hidden md:block">
        {/* 5. Pass the state and function DOWN to your sidebar */}
        <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </aside>

      {/* Main Scrollable Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        
        {/* The current page is injected into this <Outlet /> */}
        <div className="flex-1">
          <Outlet /> 
        </div>

        {/* Footer*/}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
          <Footer />
        </div>

      </main>
      
    </div>
  );
};

export default Layout;