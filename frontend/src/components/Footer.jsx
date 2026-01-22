import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MapPin, Mail, Phone, Download } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800 pb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/LOGO-.png" 
                alt="Soeltan Medsos Logo" 
                className="h-14 w-auto group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none tracking-tight">Soeltan</span>
                <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">Medsos</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Platform Social Media Marketing terpercaya untuk meningkatkan kredibilitas dan jangkauan akun bisnis maupun personal Anda secara instan dan aman.
            </p>
            <div className="pt-4">
              <a 
                href="/Soeltan_Medsos.apk" 
                download
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 border border-white/5 hover:border-indigo-500/50 group/btn"
              >
                <Download size={20} className="group-hover/btn:translate-y-0.5 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Download App</div>
                  <div className="font-semibold text-sm">Android APK</div>
                </div>
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg">Pintasan</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Layanan</Link></li>
              <li><Link to="/cek-pesanan" className="hover:text-white transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Login Staff</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg">Bantuan</h4>
            <ul className="space-y-4">
              <li><Link to="/cara-beli" className="hover:text-white transition-colors">Cara Beli</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><a href="https://wa.me/6282352835382" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-white font-bold text-lg">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <MapPin className="shrink-0 text-blue-500" size={20} />
                <span>Jl. Soeltan Medsos No. 88, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="shrink-0 text-blue-500" size={20} />
                <span>+62 823-5283-5382</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="shrink-0 text-blue-500" size={20} />
                <span>support@soeltanmedsos.com</span>
              </li>
            </ul>
            
            <div className="flex gap-4 pt-4">
              <SocialLink href="https://instagram.com/soeltanmedsos" icon={<Instagram size={20} />} label="Instagram" />
              <SocialLink href="https://facebook.com/soeltanmedsos" icon={<Facebook size={20} />} label="Facebook" />
              <SocialLink href="https://youtube.com/@soeltanmedsos" icon={<Youtube size={20} />} label="YouTube" />
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© {year} Soeltan Medsos. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/syarat-ketentuan" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link>
            <Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
            <Link to="/cara-beli" className="hover:text-indigo-400 transition-colors">Cara Beli</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 hover:scale-110"
    >
      {icon}
    </a>
  );
}
