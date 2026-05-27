export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-secondary-200 dark:border-secondary-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-luxury-gold rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-luxury-cream dark:bg-secondary-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-secondary-200 dark:border-secondary-700 rounded-full animate-spin mx-auto mb-4">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-luxury-gold rounded-full" />
        </div>
        <p className="text-secondary-600 dark:text-secondary-400">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] bg-secondary-200 dark:bg-secondary-800 animate-pulse" />
      <div className="p-5">
        <div className="h-5 bg-secondary-200 dark:bg-secondary-800 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded w-1/2 mb-3 animate-pulse" />
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded w-16 animate-pulse" />
          <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded w-16 animate-pulse" />
          <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded w-20 animate-pulse" />
        </div>
        <div className="pt-4 border-t border-secondary-100 dark:border-secondary-800">
          <div className="h-6 bg-secondary-200 dark:bg-secondary-800 rounded w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ className = '' }: { className?: string }) {
  return <div className={`bg-secondary-200 dark:bg-secondary-800 rounded animate-pulse ${className}`} />;
}
