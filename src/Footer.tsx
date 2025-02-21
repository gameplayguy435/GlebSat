import { Link } from 'react-router-dom';
import { Satellite, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Satellite className="text-blue-400" />
              <span className="text-xl font-bold">GlebSat</span>
            </div>
            <p className="text-sm">
              A lata que desafia limites
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
          </div>
        </div>
      </div>
        <div className="mx-4 p-4 border-t flex justify-center">
          <p className="text-sm">© 2025 GlebSat. All rights reserved</p>
        </div>
    </footer>
  );
};

export default Footer;