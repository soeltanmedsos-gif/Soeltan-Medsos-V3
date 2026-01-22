import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Home, Package, Search, HelpCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Beranda', icon: <Home size={20} /> },
    { to: '/products', label: 'Layanan', icon: <Package size={20} /> },
    { to: '/cek-pesanan', label: 'Cek Pesanan', icon: <Search size={20} /> },
  ];

  const anchorLinks = [
    { id: 'cara-beli', label: 'Cara Beli', icon: <ShoppingBag size={20} /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/98 backdrop-blur-lg shadow-xl border-b border-slate-700' 
          : 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/LOGO-.png" 
                alt="Soeltan Medsos Logo" 
                className="h-12 w-auto group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none tracking-tight">Soeltan</span>
                <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">Medsos</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-indigo-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Cart Button */}
              <button 
                onClick={toggleCart}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu & Cart Button */}
            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={toggleCart}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/LOGO-.png" alt="Logo" className="h-10 w-auto" />
                  <div>
                    <p className="text-white font-bold">Soeltan</p>
                    <p className="text-xs text-indigo-400 uppercase tracking-widest">Medsos</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2">Menu</p>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === link.to
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Anchor Links (Landing Page Sections) */}
                <div className="pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2">Quick Links</p>
                  {anchorLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navLinks.length + index) * 0.05 }}
                    >
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-left"
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-950/50 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">
                  © 2026 Soeltan Medsos
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Cart Drawer */}
      <CartDrawer />
    </>
  );
}
