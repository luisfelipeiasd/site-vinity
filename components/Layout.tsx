import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gem, Menu, X, Facebook, Instagram, Twitter, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { useSettings } from '../context/SettingsContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      const element = document.getElementById(id);

      if (location.pathname === '/') {
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If not on home, go home first with the anchor
        window.location.href = '/' + href;
      }
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Serviços', href: '#servicos' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Depoimentos', href: '#depoimentos' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-gray-200 py-3 shadow-sm'
          : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center">
          {/* Logo Container */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              {settings.header_logo && !logoError ? (
                <img
                  src={settings.header_logo}
                  alt="Vinity Logo"
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <>
                  <div className="text-primary transition-transform duration-500 group-hover:rotate-12">
                    <Gem size={32} strokeWidth={1.5} />
                  </div>
                  <h2 className={`font-serif text-2xl font-bold tracking-tight transition-colors ${isScrolled || location.pathname === '/portfolio' ? 'text-background-dark' : 'text-background-dark md:text-white'}`}>
                    <span className={location.pathname === '/portfolio' || isScrolled ? 'text-background-dark' : 'text-white mix-blend-difference'}>Vinity</span>
                  </h2>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Nav (Centered) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium transition-colors hover:text-primary ${(isScrolled || location.pathname !== '/') ? 'text-background-dark/80' : 'text-white/90 hover:text-white'
                  }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions Container */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <Button variant="primary" className="hidden sm:flex py-2 px-6 text-sm">
              Agendar Consultoria
            </Button>
            <button
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-32 px-6 md:hidden animate-fade-in overflow-y-auto">
          <div className="flex flex-col gap-8 items-center pb-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-serif text-background-dark"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full mt-4" aria-label="Agendar Consultoria através do menu">Agendar Consultoria</Button>
          </div>
        </div>
      )}

      {children}

      {/* Footer */}
      <footer className="bg-background-dark text-white/60 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-white">
              {settings.header_logo && !logoError ? (
                <img
                  src={settings.footer_logo || settings.header_logo}
                  alt="Vinity Logo Footer"
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <>
                  <Gem className="text-primary" />
                  <span className="font-serif font-bold text-2xl">Vinity</span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed">
              Produção audiovisual e branding para o mercado de saúde de alto padrão.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 font-serif">Navegação</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#servicos" onClick={(e) => handleNavClick(e, '#servicos')} className="hover:text-primary transition-colors">Serviços</a></li>
              <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')} className="hover:text-primary transition-colors">Portfólio</a></li>
              <li><a href="#depoimentos" onClick={(e) => handleNavClick(e, '#depoimentos')} className="hover:text-primary transition-colors">Depoimentos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 font-serif">Contato</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>contato@vinity.com.br</li>
              <li>(11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 font-serif">Social</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Seguir no Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Seguir no Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Seguir no Twitter" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-6">
          <span>© 2026 Vinity. Todos os direitos reservados.</span>
          <Link to="/admin" title="Acessar Área Administrativa" className="text-white/20 hover:text-primary transition-colors flex items-center gap-1 group">
            <Settings size={12} className="group-hover:rotate-45 transition-transform" />
            Painel Admin
          </Link>
        </div>
      </footer>
    </div>
  );
};
