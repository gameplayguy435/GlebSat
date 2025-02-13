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

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/documentation', name: 'Documentation', icon: FileText },
    { path: '/about', name: 'About Us', icon: Users },
    { path: '/contact', name: 'Contact', icon: Mail },
    { path: '/news', name: 'News', icon: Newspaper },
    { path: '/gallery', name: 'Gallery', icon: Image },
  ];

  const linkVariants = {
    hover: { scale: 1.05, originX: 0 },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    open: { 
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700 fixed w-full z-50 text-slate-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-slate-100">GlebSat</div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover="hover"
                  whileTap="tap"
                  variants={linkVariants}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                      location.pathname === link.path 
                        ? 'bg-slate-700 text-slate-100' 
                        : 'hover:bg-slate-800'
                    }`}
                  >
                    <link.icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
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

        <motion.div
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ x: 5 }}
                className="px-4"
              >
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 py-3 rounded-lg ${
                    location.pathname === link.path 
                      ? 'bg-slate-700 text-slate-100' 
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;