import React from 'react';
// Importing icons to match your image
import { BiSearch, BiCompass, BiCollection, BiTimeFive, BiMap, BiSave, BiMoon } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { FaPaintBrush } from 'react-icons/fa'; // For the logo icon

const Sidebar = () => {
  
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
    { icon: <BiMoon size={24} />, label: "Toggle Theme" },
  ];

  // STYLES
  // A reusable class for the links to make them look consistent
  const linkClass = "flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-[#C58940] hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer group";

  return (
    // CONTAINER
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-6 py-8">
      
      {/*  LOGO AREA */}
      <div className="mb-10 flex items-center gap-2">
        
        <div className="text-3xl text-[#C58940]">
            <FaPaintBrush /> 
        </div>
        <div className="text-2xl font-bold text-[#0F2C59]">
          Solias<span className="text-[#0F2C59]">ART</span>
        </div>
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
        <div className="my-4 border-t border-gray-300"></div>

        {/* Loop through Bottom Links */}
        {bottomLinks.map((item, index) => (
          <div key={index} className={linkClass}>
            <span className="group-hover:text-[#C58940]">{item.icon}</span>
            <span className="text-lg font-medium">{item.label}</span>
          </div>
        ))}

      </nav>

      {/*  FOOTER: User Profile */}
      <div className="mt-auto border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3">
          
          {/* Avatar Image */}
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            alt="User" 
            className="h-10 w-10 rounded-full object-cover"
          />
          
          {/* Text Info */}
          <div>
            <h4 className="font-bold text-gray-900">Hasanjaya</h4>
            <p className="text-sm text-gray-500">Artist</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;