import logoImage from '../assets/soliasartlogo.png';
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-5">
            
            {/* Logo centered at the top of the text */}
            <img 
              src={logoImage} 
              alt="SoliasArt Logo" 
              className="h-12 w-auto object-contain" 
            />
            
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-sm">
              Empowering creators and collectors to connect through the universal language of art. We curate the exceptional for the inspired.
            </p>
            
            {/* Social Icons (Centered) */}
            <div className="flex gap-4 justify-center">
              
              {/* Instagram */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:!text-white hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                <FaInstagram size={20} />
              </a>
              
              {/* YouTube */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:!text-white hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                <FaYoutube size={20} />
              </a>
              
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/soliasart" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:!text-white hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                <FaLinkedin size={20} />
              </a>

            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-6">Shop</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:!text-gray-400 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Discover</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Auctions</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Trending</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Categories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-6">For Artists</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Sell Art</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Commissions</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Shipping</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-600 dark:!text-gray-300 hover:!text-amber-600 dark:hover:text-amber-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">Join our Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Curated art news and exclusive auction invites delivered to your inbox.
              </p>
            </div>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
              <button className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors shadow-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 SoliasArt Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;