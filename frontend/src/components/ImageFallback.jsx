import { useState } from 'react';

/**
 * ImageFallback Component
 * Handles broken image URLs with fallback + lazy loading
 */
export default function ImageFallback({ src, alt, fallback, className, ...props }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const defaultFallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23334155" width="200" height="200"/%3E%3Ctext fill="%2364748b" font-family="sans-serif" font-size="48" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E📦%3C/text%3E%3C/svg%3E';

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 text-slate-600">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      <img
        src={error ? (fallback || defaultFallback) : src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
