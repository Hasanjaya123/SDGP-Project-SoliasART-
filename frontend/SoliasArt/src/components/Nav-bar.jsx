import React from 'react';
import { BiSearch, BiCompass, BiCollection, BiTimeFive, BiMap, BiSave, BiMoon, BiSun } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import logoImage from '../assets/soliasartlogo.png';

const Sidebar = ({ isDarkMode, toggleTheme }) => {
  
  // Main Navigation
  const mainLinks = [
    { icon: <BiSearch size={24} />, label: "Search" },
    { icon: <BiCompass size={24} />, label: "Explore" },
    { icon: <HiOutlineNewspaper size={24} />, label: "Feed" },
    { icon: <BiCollection size={24} />, label: "Collections" },
    { icon: <BiTimeFive size={24} />, label: "Auctions" },
    { icon: <BiMap size={24} />, label: "ArtMaps" },
  ];

  // Bottom Actions
  const bottomLinks = [
    { icon: <BiSave size={24} />, label: "Saved" },
    { icon: <BsGrid size={24} />, label: "Dashboard" },
    { 
      // Show Sun in dark mode, Moon in light mode
      icon: isDarkMode ? <BiSun size={24} /> : <BiMoon size={24} />, 
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      action: toggleTheme 
    },
  ];

  // STYLES
  // A reusable class for the links to make them look consistent
  const linkClass = "flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-[#C58940] hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer group";

  return (
    // CONTAINER
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-8 transition-colors duration-200">
      
      {/* LOGO AREA */}
      <div className="mb-10 flex items-center gap-2">
        <img 
          src={logoImage} 
          alt="SoliasArt Logo" 
          className="h-10 w-auto object-contain" 
        />
      </div>

      {/* MIDDLE: Navigation Links */}
      <nav className="flex flex-col gap-2">
        
        {/* Loop through Main Links */}
        {mainLinks.map((item, index) => (
          <div key={index} className={linkClass}>
            {/* The Icon */}
            <span className="group-hover:text-[#C58940]">{item.icon}</span> 
            {/* The Text */}
            <span className="text-lg font-medium">{item.label}</span>
          </div>
        ))}

        {/* The Divider Line */}
        <div className="my-4 border-t border-gray-300 dark:border-gray-800"></div>

        {/* Loop through Bottom Links */}
        {bottomLinks.map((item, index) => (
          <div key={index} className={linkClass} onClick={item.action}>
            <span className="group-hover:text-[#C58940]">{item.icon}</span>
            <span className="text-lg font-medium">{item.label}</span>
          </div>
        ))}

      </nav>

      {/*  FOOTER: User Profile */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-6">
        <div className="flex items-center gap-3">
          
          {/* Avatar Image */}
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            alt="User" 
            className="h-10 w-10 rounded-full object-cover"
          />
          
          {/* Text Info */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Hasanjaya</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Artist</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;