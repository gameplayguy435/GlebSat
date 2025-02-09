import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, FileText, Users, Mail, Newspaper, Image, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Close menu when navigating
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700 fixed w-full z-50 text-slate-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-slate-100">GlebSat</div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/documentation" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <FileText size={18} />
                <span>Documentation</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <Users size={18} />
                <span>About Us</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <Mail size={18} />
                <span>Contact</span>
              </Link>
              <Link to="/news" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <Newspaper size={18} />
                <span>News</span>
              </Link>
              <Link to="/gallery" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 hover:text-slate-100">
                <Image size={18} />
                <span>Gallery</span>
              </Link>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {[
              { path: '/', name: 'Home', icon: Home },
              { path: '/documentation', name: 'Documentation', icon: FileText },
              { path: '/about', name: 'About Us', icon: Users },
              { path: '/contact', name: 'Contact', icon: Mail },
              { path: '/news', name: 'News', icon: Newspaper },
              { path: '/gallery', name: 'Gallery', icon: Image },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-slate-100"
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;