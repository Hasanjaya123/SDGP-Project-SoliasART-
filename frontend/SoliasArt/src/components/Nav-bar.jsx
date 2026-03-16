import React from 'react';
import { Link } from 'react-router-dom'; // 1. Added React Router Link
import { BiSearch, BiCompass, BiCollection, BiTimeFive, BiMap, BiSave, BiMoon, BiSun } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import logoImage from '../assets/soliasartlogo.png';

const Sidebar = ({ isDarkMode, toggleTheme }) => {
  
 
  const mainLinks = [
    { icon: <BiCompass size={24} />, label: "Explore", path: "/search" }, 
    { icon: <HiOutlineNewspaper size={24} />, label: "Feed", path: "/search" }, 
    { icon: <BiCollection size={24} />, label: "Collections", path: "/collections" },  
    { icon: <BiMap size={24} />, label: "ArtMaps", path: "/map" },
  ];

  const bottomLinks = [
    { icon: <BiSave size={24} />, label: "saved", path: "/saved" }, 
    { icon: <BsGrid size={24} />, label: "Dashboard", path: "/dashboard" },
    { 
      icon: isDarkMode ? <BiSun size={24} /> : <BiMoon size={24} />, 
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      action: toggleTheme 
    },
  ];

  const linkClass = "flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-[#C58940] hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer group";

  return (
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

        {/* 3. Changed <div> to <Link> for routing */}
        {mainLinks.map((item, index) => (
          <Link key={index} to={item.path} className={linkClass}>
            <span className="group-hover:text-[#C58940]">{item.icon}</span>
            <span className="text-lg font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="my-4 border-t border-gray-300 dark:border-gray-800"></div>

        {/* Loop through Bottom Links */}
        {bottomLinks.map((item, index) => {
          // If it has an action (like Dark Mode), keep it as a clickable div
          if (item.action) {
            return (
              <div key={index} className={linkClass} onClick={item.action}>
                <span className="group-hover:text-[#C58940]">{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </div>
            );
          }
          // Otherwise, it's a page link
          return (
            <Link key={index} to={item.path} className={linkClass}>
              <span className="group-hover:text-[#C58940]">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
          );
        })}

      </nav>

      {/* FOOTER: User Profile (Now links to the Artist Profile page) */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-6">
        <Link to="/artist/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Hasanjaya</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Artist</p>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;