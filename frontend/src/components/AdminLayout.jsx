import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Tag, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { path: '/admin/products', label: 'Produk', icon: <Tag size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-slate-950/50 backdrop-blur-xl border-r border-slate-800 z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
             {/* LOGO REPLACEMENT */}
             <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
               <img src="/LOGO-.png" alt="Logo" className="w-full h-full object-contain" />
             </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Soeltan<span className="text-indigo-400">Admin</span></span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Management Portal</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-2">Menu</div>
          {navItems.map((item) => {
             const active = isActive(item.path);
             return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`transition-colors ${active ? 'text-white' : 'group-hover:text-indigo-400'}`}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-slate-950/30">
          <div className="flex items-center gap-3 mb-4 px-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
             <div className="min-w-[32px] w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold ring-2 ring-slate-700">
               <User size={14} className="text-slate-400" />
             </div>
             <div className="overflow-hidden">
               <div className="font-medium text-white text-sm truncate">{admin?.name || 'Administrator'}</div>
               <div className="text-[10px] text-slate-500 truncate">{admin?.email}</div>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-sm font-medium transition-all border border-slate-700"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md text-white z-40 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/LOGO-.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold">SoeltanAdmin</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-[57px] left-0 right-0 bg-slate-900 border-b border-slate-800 z-30 shadow-2xl"
          >
             <nav className="p-4 space-y-2">
               {navItems.map((item) => (
                 <Link
                   key={item.path}
                   to={item.path}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                     isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                   }`}
                 >
                   {item.icon}
                   {item.label}
                 </Link>
               ))}
               <div className="h-px bg-slate-800 my-2"></div>
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/10"
               >
                 <LogOut size={20} />
                 Sign Out
               </button>
             </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen pb-24 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
