import { Link } from 'react-router-dom';
import { Satellite, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Satellite className="text-blue-400" />
              <span className="text-xl font-bold">GlebSat</span>
            </div>
            <p className="text-sm">
              Pioneering atmospheric research through microsatellite technology
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold mb-2">Navigation</h4>
            <Link to="/" className="block hover:text-blue-400 transition-colors">
              Home
            </Link>
            {['Documentation', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="block hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold mb-2">Resources</h4>
            {['News', 'Gallery', 'Technical Papers', 'API Docs'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="block hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2">Connect</h4>
            <div className="flex space-x-4">
              <Github className="hover:text-blue-400 cursor-pointer" />
              <Twitter className="hover:text-blue-400 cursor-pointer" />
              <Mail className="hover:text-blue-400 cursor-pointer" />
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm">© 2025 GlebSat. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;