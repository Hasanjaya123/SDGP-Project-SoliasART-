import React, {useState, useEffect} from 'react';
import { BiSearch, BiCompass, BiCollection, BiUser, BiMap, BiX, BiMoon, BiSun, BiLogOut, BiMenu } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';
import logoImage from '../assets/soliasartlogo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/uploadApi';

const Sidebar = ({ isDarkMode, toggleTheme }) => {

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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

          // Get artist details if the user is an artist
          if (data.role === 'artist') {
            try {
        
              const artistRes = await fetch(`${API_BASE}/artists/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (artistRes.ok) {
                const artistData = await artistRes.json();
                
                // Override the empty user picture with the real Artist picture
                if (artistData.artist?.profileImageUrl) {
                  data.profile_image = artistData.artist.profileImageUrl;
                }
                
                if (artistData.artist?.id) {
                  data.artist_id = artistData.artist.id; 
                }
              }
            } catch (artistErr) {
              console.error("Failed to fetch artist image for sidebar:", artistErr);
            }
          }

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

    return `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      isActive 
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
    
    <>
      {/* Mobile Hamburger menu  */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 flex items-center justify-between px-4 shadow-sm">

        <img src={logoImage} alt="SoliasArt" className="h-8 object-contain" />

        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:!outline-none focus:!ring-0 focus:!border-gray-200 dark:focus:!border-gray-700"
        >
          <BiMenu size={24} />
        </button>

      </div>

      {/* Darkens background when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-8 transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        
        {/* Mobile Close Button (Inside sidebar) */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-4 p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
        >
          <BiX size={26} />
        </button>

        {/* LOGO AREA */}
        <div className="mb-10 mt-2 md:mt-0 flex items-center gap-2">
          <img 
            src={logoImage} 
            alt="SoliasArt Logo" 
            className="h-10 w-auto object-contain" 
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {mainLinks.map((item, index) => (
            <Link key={index} to={item.path} className={getLinkClass(item.path)} onClick={() => handleLinkClick()}>
              <span className="group-hover:text-[#C58940]">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
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

        {/* User Profile  */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col gap-2">
          
          {/* Profile Link  */}
          {userData ? (
            <Link to={profileLink} onClick={() => handleLinkClick()} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
            className="flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 hover:!border-transparent  dark:hover:text-red-400 transition-colors w-full focus:outline-none group"
          >
            <BiLogOut size={22} className="ml-1" />
            <span className="font-bold">Log out</span>
          </button>

        </div>

      </div>
    </>
  );
};

export default Sidebar;