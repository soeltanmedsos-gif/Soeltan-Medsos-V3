import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home */}
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors group"
          >
            <Home size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-slate-600" />
            {item.to ? (
              <Link 
                to={item.to}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
