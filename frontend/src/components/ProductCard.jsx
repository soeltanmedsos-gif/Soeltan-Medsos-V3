import { motion } from 'framer-motion';
import { ShoppingCart, Instagram, Youtube, Facebook, Video, MessageCircle, MapPin, Share2, Music } from 'lucide-react';

export default function ProductCard({ product, onBuy }) {
  const platformColors = {
    'Instagram': 'from-pink-500 to-purple-600',
    'TikTok': 'from-cyan-500 to-blue-600',
    'Tiktok Paket FYP': 'from-cyan-500 to-blue-600',
    'YouTube': 'from-red-500 to-pink-600',
    'Facebook': 'from-blue-500 to-indigo-600',
    'Telegram': 'from-blue-400 to-cyan-500',
    'Whatsapp': 'from-green-500 to-emerald-600',
    'Google Maps': 'from-green-500 to-teal-600',
    'default': 'from-indigo-500 to-purple-600'
  };

  const getPlatformIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram size={32} />;
    if (p.includes('youtube')) return <Youtube size={32} />;
    if (p.includes('facebook')) return <Facebook size={32} />;
    if (p.includes('tiktok')) return <Music size={32} />;
    if (p.includes('whatsapp')) return <MessageCircle size={32} />;
    if (p.includes('telegram')) return <Share2 size={32} />;
    if (p.includes('maps')) return <MapPin size={32} />;
    return <Video size={32} />;
  };

  const gradientClass = platformColors[product.platform] || platformColors.default;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClass} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      {/* Card */}
      <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 h-full flex flex-col hover:border-slate-600 transition-colors shadow-lg">
        
        {/* Header: Icon & Platform */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg`}>
            {getPlatformIcon(product.platform)}
          </div>
          <span className={`px-2.5 py-1 rounded-full bg-slate-900/50 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400`}>
            {product.platform}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="pt-4 border-t border-slate-700/50 flex items-end justify-between gap-3 mt-auto">
          <div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Mulai dari</p>
            <p className="text-xl font-bold text-white">
              Rp {product.price?.toLocaleString('id-ID')}
            </p>
          </div>

          <button
            onClick={() => onBuy(product)}
            className={`h-10 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all flex items-center gap-2 group/btn border border-slate-600 hover:border-slate-500`}
          >
            <ShoppingCart size={16} className="text-indigo-400 group-hover/btn:text-white transition-colors" />
            <span>Beli</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
