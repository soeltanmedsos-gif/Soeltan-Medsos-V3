import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    outline: "bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2",
        variants[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, error, className, endContent, ...props }) => (
  <div className="w-full space-y-2">
    {label && (
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        className={cn(
          "w-full px-5 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-white placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          endContent && "pr-12",
          className
        )}
        {...props}
      />
      {endContent && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          {endContent}
        </div>
      )}
    </div>
    {error && <p className="text-xs font-semibold text-red-500 ml-1">{error}</p>}
  </div>
);

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const Select = ({ label, options, value, onChange, placeholder = 'Select option', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="w-full space-y-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
             "w-full px-5 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:bg-slate-800",
             isOpen && "border-indigo-500 ring-2 ring-indigo-500/20",
             className
          )}
          type="button"
        >
          <span className={cn("font-medium truncate", !value ? "text-slate-500" : "text-white")}>
            {selectedLabel}
          </span>
          <ChevronDown 
             size={16} 
             className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} 
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-[100] w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
            >
              <div className="p-1.5 space-y-0.5">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg text-sm font-medium text-left flex items-center justify-between transition-colors",
                      value === opt.value
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    type="button"
                  >
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
