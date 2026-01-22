import { useState } from 'react';

export default function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      
      {visible && content && (
        <div 
          className={`absolute ${positions[position]} z-50 whitespace-nowrap px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg border border-slate-700 animate-in fade-in duration-200`}
        >
          {content}
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-slate-800 border-slate-700 rotate-45 ${
            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b' :
            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t' :
            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r' :
            'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
          }`}></div>
        </div>
      )}
    </div>
  );
}
