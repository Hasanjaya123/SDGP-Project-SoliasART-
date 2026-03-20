import React, {useState, useEffect} from 'react';
import { BiSearch, BiCompass, BiCollection, BiTimeFive, BiMap, BiSave, BiMoon, BiSun, BiLogOut } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import logoImage from '../assets/soliasartlogo.png';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isDarkMode, toggleTheme }) => {

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return; 
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
        else {
          handleLogout();
        }

      } catch (error) {
        console.error("Failed to fetch user data in sidebar:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the session
    navigate('/login'); // Send back to login page
  };  
 
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

  // Safely extract user details or fallback to default values
  const defaultAvatar = "https://ik.imagekit.io/sjunnxn6x/Profile-Pictures/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.avif";
  const profileImage = userData?.profile_image || defaultAvatar;
  const userName = userData ? (userData.full_name || `${userData.first_name || 'Guest'} ${userData.last_name || ''}`) : "Guest";
  const userRole = userData?.role || "User";
  
  // Route them to the correct profile page based on their role
  const profileLink = userData?.role === 'artist' 
    ? `/artist/profile/${userData.id}` 
    : `/buyer/profile`;

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

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">

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

      {/* User Profile  */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col gap-2">
        
        {/* Profile Link  */}
        {userData ? (
          <Link to={profileLink} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <img
              src={profileImage}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col overflow-hidden">
              <h4 className="font-bold text-gray-900 dark:text-white truncate">{userName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full focus:outline-none"
        >
          <BiLogOut size={22} className="ml-1" />
          <span className="font-bold">Log out</span>
        </button>

      </div>

    </div>
  );
};

export default Sidebar;