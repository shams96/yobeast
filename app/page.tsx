'use client';

import Feed from '@/components/Feed';
import { useCurrentBeastWeek } from '@/lib/hooks/useCurrentBeastWeek';
import { usePolls } from '@/lib/hooks/usePolls';
import { useMoments } from '@/lib/hooks/useMoments';
import { FeedSkeleton } from '@/components/SkeletonLoader';
import { BeastWeek } from '@/types';

export default function HomePage() {
  const { beastWeek, loading: beastLoading } = useCurrentBeastWeek();
  const { polls, loading: pollsLoading } = usePolls(beastWeek?.id);
  const { moments, loading: momentsLoading } = useMoments();

  const isLoading = beastLoading || pollsLoading || momentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <FeedSkeleton />
      </div>
    );
  }

  // If no beast week exists, show welcome screen
  if (!beastWeek) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <div className="text-6xl">🔥</div>
          <h2 className="text-2xl font-bold text-text-primary">
            Beast Week Coming Soon
          </h2>
          <p className="text-text-secondary">
            The first Weekly Beast challenge hasn't started yet. Check back soon to compete with your campus!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Feed
        beastWeek={beastWeek}
        polls={polls}
        moments={moments}
      />
    </div>
  );
}
