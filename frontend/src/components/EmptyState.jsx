import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ 
  title = "Data Tidak Ditemukan", 
  description = "Coba ubah filter atau kata kunci pencarian Anda.",
  icon: Icon = SearchX,
  action
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="w-24 h-24 bg-slate-800/50 rounded-full mx-auto flex items-center justify-center mb-6 text-slate-400 border border-slate-700 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Icon size={40} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
}
