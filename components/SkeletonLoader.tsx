'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-dark-elevated';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function BeastCardSkeleton() {
  return (
    <div className="card-elevated space-y-4" aria-busy="true" aria-label="Loading Beast challenge">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="w-full h-48" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
    </div>
  );
}

export function PollCardSkeleton() {
  return (
    <div className="card space-y-3" aria-busy="true" aria-label="Loading poll">
      <Skeleton variant="text" className="w-4/5 h-5" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="w-full h-12" />
        ))}
      </div>
    </div>
  );
}

export function MomentCardSkeleton() {
  return (
    <div className="card space-y-3" aria-busy="true" aria-label="Loading moment">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" className="w-1/3 h-4" />
          <Skeleton variant="text" className="w-1/4 h-3" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="w-full aspect-square" />
      <Skeleton variant="text" className="w-full" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-8">
      <BeastCardSkeleton />
      <PollCardSkeleton />
      <MomentCardSkeleton />
      <MomentCardSkeleton />
      <PollCardSkeleton />
    </div>
  );
}

export default Skeleton;
