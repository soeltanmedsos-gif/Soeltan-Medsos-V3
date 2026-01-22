export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-700/70 rounded"
          style={{ width: `${100 - (i * 10)}%` }}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Input skeleton */}
      <div>
        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-12 bg-slate-700/50 rounded-xl w-full"></div>
      </div>
      
      {/* Button skeleton */}
      <div className="h-12 bg-slate-700 rounded-xl w-full"></div>
    </div>
  );
}

export function SkeletonImage({ className = "" }) {
  return (
    <div className={`bg-slate-700 animate-pulse ${className}`}>
      <svg className="w-12 h-12 text-slate-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  );
}
