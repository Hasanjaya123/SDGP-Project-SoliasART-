import React, { useState, useEffect } from 'react';
import { BiSearch, BiCompass, BiCollection, BiUser, BiMap, BiX, BiMoon, BiSun, BiLogOut, BiMenu } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { FaPaintBrush } from 'react-icons/fa'; // For the logo icon

const Sidebar = () => {

  // --- DATA: Group 1 (Main Navigation) ---
  const mainLinks = [
    { icon: <BiCompass size={24} />, label: "Explore", path: "/search" },
    { icon: <HiOutlineNewspaper size={24} />, label: "Feed", path: "/feed" },
    { icon: <BiCollection size={24} />, label: "Collections", path: "/collections" },
    { icon: <BiMap size={24} />, label: "ArtMaps", path: "/map" },
    { icon: <BiUser size={24} />, label: "Artists", path: "/artist-search" }
  ];

  const bottomLinks = [
    // Show dashboard only for artists
    ...(userData?.role === 'artist' ? [
      { icon: <BsGrid size={24} />, label: "Dashboard", path: "/dashboard" }
    ] : []),

    {
      icon: isDarkMode ? <BiSun size={24} /> : <BiMoon size={24} />,
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      action: toggleTheme
    },
  ];

  // Active tab state
  const getLinkClass = (path) => {
    // Check if the current URL matches the link's path
    const isActive = location.pathname === path;

    return `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive
        ? '!text-[#1D4A73] dark:!text-[#3A8AD9] font-bold'
        : 'text-gray-500 hover:text-[#C58940] hover:bg-yellow-50 dark:hover:bg-gray-800 font-medium'
      }`;
  };

  // extract user details or fallback to default values
  const defaultAvatar = "https://ik.imagekit.io/sjunnxn6x/Profile-Pictures/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.avif";
  const profileImage = userData?.profile_image || defaultAvatar;
  const userName = userData ? (userData.full_name || `${userData.first_name || 'Guest'} ${userData.last_name || ''}`) : "Guest";
  const userRole = userData?.role || "User";

  // Route them to the correct profile page based on their role
  const profileLink = userData?.role === 'artist'
    ? `/artist/profile`
    : `/buyer/profile`;

  // close sidebar on link click in mobile view  
  const handleLinkClick = (action) => {
    setIsOpen(false);
    if (action) action();
  };

  return (
    // 1. CONTAINER: Fixed height, fixed width, border on right
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-6 py-8">

      {/* 2. LOGO AREA */}
      <div className="mb-10 flex items-center gap-2">
        {/* I'm using an icon here, but you can replace this <FaPaintBrush> with your <img src="..." /> */}
        <div className="text-3xl text-[#C58940]">
          <FaPaintBrush />
        </div>
        <div className="text-2xl font-bold text-[#0F2C59]">
          Solias<span className="text-[#0F2C59]">ART</span>
        </div>
      </div>

      {/* 3. MIDDLE: Navigation Links */}
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

        <div className="my-4 border-t border-gray-300 dark:border-gray-800"></div>

        {/* Loop through Bottom Links */}
        {bottomLinks.map((item, index) => {
          if (item.action) {
            return (
              <div key={index} className={getLinkClass(item.path)} onClick={() => handleLinkClick(item.action)}>
                <span className="group-hover:text-[#C58940]">{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </div>
            );
          }
          return (
            <Link key={index} to={item.path} className={getLinkClass(item.path)} onClick={() => handleLinkClick()}>
              <span className="group-hover:text-[#C58940]">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. FOOTER: User Profile */}
      {/* 'mt-auto' is the MAGIC CLASS. It pushes this box to the very bottom. */}
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
    </>
  );
};

export default Sidebar;