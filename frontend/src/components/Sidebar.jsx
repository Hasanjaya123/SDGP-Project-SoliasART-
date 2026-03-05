import React from 'react';
// Importing icons to match your image
import { BiSearch, BiCompass, BiCollection, BiTimeFive, BiMap, BiSave, BiMoon } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { FaPaintBrush } from 'react-icons/fa'; // For the logo icon

const Sidebar = ({ currentPage, setCurrentPage, toggleTheme }) => {

  // --- DATA: Group 1 (Main Navigation) ---
  const mainLinks = [
    { icon: <BiSearch size={24} />, label: "Search", page: 'search' },
    { icon: <BiCompass size={24} />, label: "Explore", page: 'explore' },
    { icon: <HiOutlineNewspaper size={24} />, label: "Feed", page: 'feed' },
    { icon: <BiCollection size={24} />, label: "Collections", page: 'collections' },
    { icon: <BiTimeFive size={24} />, label: "Auctions", page: 'auctions' },
    { icon: <BiMap size={24} />, label: "ArtMaps", page: 'artmaps' },
  ];

  // --- DATA: Group 2 (Bottom Actions) ---
  const bottomLinks = [
    { icon: <BiSave size={24} />, label: "Saved", page: 'saved' },
    { icon: <BsGrid size={24} />, label: "Dashboard", page: 'dashboard' },
  ];

  // --- STYLES ---
  const getLinkClass = (page) => `flex items-center gap-4 px-4 py-3 ${currentPage === page ? 'text-[#C58940] bg-yellow-50 dark:bg-amber-900/20' : 'text-gray-500 dark:text-gray-400'} hover:text-[#C58940] hover:bg-yellow-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors cursor-pointer group`;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-8 fixed left-0 top-0">

      {/* 2. LOGO AREA */}
      <div className="mb-10 flex items-center gap-2">
        <div className="text-3xl text-[#C58940]">
          <FaPaintBrush />
        </div>
        <div className="text-2xl font-bold text-[#0F2C59] dark:text-white">
          Solias<span className="text-[#C58940]">ART</span>
        </div>
      </div>

      {/* 3. MIDDLE: Navigation Links */}
      <nav className="flex flex-col gap-1 overflow-y-auto">

        {/* Loop through Main Links */}
        {mainLinks.map((item, index) => (
          <div
            key={index}
            className={getLinkClass(item.page)}
            onClick={() => setCurrentPage(item.page)}
          >
            <span className="group-hover:text-[#C58940]">{item.icon}</span>
            <span className="text-lg font-medium">{item.label}</span>
          </div>
        ))}

        {/* The Divider Line */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-800"></div>

        {/* Loop through Bottom Links */}
        {bottomLinks.map((item, index) => (
          <div
            key={index}
            className={getLinkClass(item.page)}
            onClick={() => setCurrentPage(item.page)}
          >
            <span className="group-hover:text-[#C58940]">{item.icon}</span>
            <span className="text-lg font-medium">{item.label}</span>
          </div>
        ))}

        {/* Theme Toggle */}
        <div
          className="flex items-center gap-4 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-[#C58940] hover:bg-yellow-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors cursor-pointer group"
          onClick={toggleTheme}
        >
          <span className="group-hover:text-[#C58940]"><BiMoon size={24} /></span>
          <span className="text-lg font-medium">Toggle Theme</span>
        </div>

      </nav>

      {/* 4. FOOTER: User Profile */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-6">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
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