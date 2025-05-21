import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import { SatelliteAltRounded } from '@mui/icons-material';

const Footer = () => {
  const navigationLinks = [
    { label: 'Página Principal', url: '/' },
    { label: 'Sobre Nós', url: '/about' },
    { label: 'Contactos', url: '/contact' },
  ];

  const discoveryLinks = [
    { label: 'Notícias', url: '/news' },
    { label: 'Galeria', url: '/gallery' },
    { label: 'Recursos', url: 'https://esero.ie/cansat_resources/' },
  ];

  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SatelliteAltRounded sx={{ mr: 1 }}/>
              <span className="text-xl font-bold">GlebSat</span>
            </div>
            <p className="text-sm">
              A lata que desafia limites
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold mb-2">Navegação</h4>
            {navigationLinks.map((item) => (
              <Link 
                key={item.label}
                to={`${item.url}`} 
                className="block hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold mb-2">Descoberta</h4>
            {discoveryLinks.map((item) => (
              <Link 
                key={item.label}
                to={`${item.url}`} 
                className="block hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2">Contacte-nos!</h4>
            <div className="flex space-x-4">
              <Github className="hover:text-blue-400 cursor-pointer" />
              <Twitter className="hover:text-blue-400 cursor-pointer" />
              <Mail className="hover:text-blue-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
        <div className="mx-4 p-4 border-t flex justify-center">
          <p className="text-sm">© 2025 GlebSat. Todos os direitos reservados.</p>
        </div>
    </footer>
  );
};

export default Footer;