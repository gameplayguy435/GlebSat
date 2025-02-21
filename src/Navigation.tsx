import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, FileText, Users, Mail, Newspaper, Image, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when navigating
  useEffect(() => {
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
    <nav className="backdrop-blur-md fixed w-full z-50 p-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold">GlebSat</div>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover="hover"
                  whileTap="tap"
                  variants={linkVariants}
                >
                  <Link to={link.path} className="flex items-center space-x-1 px-3 py-2 rounded-md">
                    <link.icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />

            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden mx-4 p-2 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <motion.div
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          className="lg:hidden overflow-hidden"
        >
          <div className="pb-4 space-y-2">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ x: 5 }}
                className="ps-2 pe-4"
              >
                <Link to={link.path} className="flex items-center space-x-3 p-3 rounded-lg transition-colors">
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