import { Skeleton } from "@/components/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-outline-variant/30 rounded" />
          <div className="h-8 w-48 bg-outline-variant/30 rounded" />
        </div>
        <div className="h-10 w-32 bg-outline-variant/30 rounded hidden md:block" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-surface-container-low rounded-xl border border-outline-variant/40" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 h-[400px]">
            <div className="h-6 w-48 bg-outline-variant/20 rounded mb-2" />
            <div className="h-4 w-64 bg-outline-variant/10 rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-12 bg-outline-variant/5 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
