import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gem, Menu, X, Facebook, Instagram, Twitter, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { useSettings } from '../context/SettingsContext';
import { WhatsAppWidget } from './WhatsAppWidget';



export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 50 : false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5562984077910?text=${encodeURIComponent("Olá! Gostaria de agendar uma consultoria.")}`, '_blank');
    setMobileMenuOpen(false);
  };

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
    <div className="relative flex min-h-screen w-full flex-col font-display overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,shadow] duration-500 border-b ${(isScrolled || mobileMenuOpen)
          ? 'bg-white/85 backdrop-blur-xl border-gray-200 shadow-sm'
          : 'bg-transparent border-transparent'
          } py-2`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center">
          {/* Logo Container */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
              {settings.header_logo && !logoError && (
                <img
                  src={settings.header_logo}
                  alt="Vinity Logo"
                  className="h-[110px] w-auto max-w-[400px] object-contain"
                  style={(isScrolled || mobileMenuOpen) ? { filter: 'brightness(0) saturate(100%) invert(70%) sepia(59%) saturate(452%) hue-rotate(357deg) brightness(97%) contrast(93%)' } : {}}
                  onError={() => setLogoError(true)}
                />
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
                className={`text-sm font-medium transition-colors hover:text-primary ${((isScrolled || mobileMenuOpen) || location.pathname !== '/') ? 'text-background-dark/80' : 'text-white/90 hover:text-white'
                  }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions Container */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <Button variant="primary" className="hidden sm:flex py-2 px-6 text-sm" onClick={handleWhatsAppClick}>
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
            <Button className="w-full mt-4" aria-label="Agendar Consultoria através do menu" onClick={handleWhatsAppClick}>Agendar Consultoria</Button>
          </div>
        </div>
      )}

      {children}
      <WhatsAppWidget />

      {/* Footer */}
      <footer className="bg-background-dark text-white/60 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Column - Wider */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link to="/" className="inline-block">
              {settings.header_logo && !logoError && (
                <img
                  src={settings.footer_logo || settings.header_logo}
                  alt="Vinity Logo Footer"
                  className="h-[80px] w-auto max-w-[280px] object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-sm">
              Produção audiovisual e branding para o mercado de saúde de alto padrão.
              Transformamos sua autoridade em um legado visual inconfundível.
            </p>
          </div>

          {/* Navigation - Compact */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-white font-bold mb-6 font-serif">Navegação</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#servicos" onClick={(e) => handleNavClick(e, '#servicos')} className="hover:text-primary transition-colors block py-0.5">Serviços</a></li>
              <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')} className="hover:text-primary transition-colors block py-0.5">Portfólio</a></li>
              <li><a href="#depoimentos" onClick={(e) => handleNavClick(e, '#depoimentos')} className="hover:text-primary transition-colors block py-0.5">Depoimentos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold mb-6 font-serif">Contato</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li className="hover:text-white transition-colors cursor-default">contato@vinity.com.br</li>
              <li className="hover:text-white transition-colors cursor-default">(11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>

          {/* Social - Right Aligned on Desktop */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold mb-6 font-serif">Social</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Seguir no Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all group">
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Seguir no Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all group">
                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Seguir no Twitter" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all group">
                <Twitter size={18} className="group-hover:scale-110 transition-transform" />
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
