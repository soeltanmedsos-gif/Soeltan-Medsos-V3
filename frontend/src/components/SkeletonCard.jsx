export default function SkeletonCard() {
  return (
    <div className="h-full relative">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 h-full flex flex-col animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-700"></div>
          <div className="w-16 h-5 rounded-full bg-slate-700/50"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-slate-700 rounded-lg w-3/4"></div>
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-700/50 rounded w-full"></div>
            <div className="h-3 bg-slate-700/50 rounded w-5/6"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-3 w-12 bg-slate-700/50 rounded"></div>
            <div className="h-7 w-24 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="w-20 h-10 bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
