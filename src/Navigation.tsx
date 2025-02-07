import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, FileText, Users, Mail, Newspaper, Image } from 'lucide-react';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold">GlebSat</div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/documentation" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <FileText size={18} />
                <span>Documentation</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Users size={18} />
                <span>About Us</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Mail size={18} />
                <span>Contact</span>
              </Link>
              <Link to="/news" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Newspaper size={18} />
                <span>News</span>
              </Link>
              <Link to="/gallery" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Image size={18} />
                <span>Gallery</span>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-slate-700" title='menu'>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <FileText size={18} />
                <span>Documentation</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Users size={18} />
                <span>About Us</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Mail size={18} />
                <span>Contact</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Newspaper size={18} />
                <span>News</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700">
                <Image size={18} />
                <span>Gallery</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;