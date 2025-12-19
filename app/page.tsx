'use client';

import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import Feed from '@/components/Feed';
import { useCurrentBeastWeek } from '@/lib/hooks/useCurrentBeastWeek';
import { usePolls } from '@/lib/hooks/usePolls';
import { useMoments } from '@/lib/hooks/useMoments';
import { FeedSkeleton } from '@/components/SkeletonLoader';
import { MOCK_BEAST_WEEK, MOCK_CAMPUS_STATS } from '@/lib/mockData';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn, loading, user } = useCurrentUser();
  const { beastWeek: fetchedBeastWeek, loading: beastLoading, error: beastError } = useCurrentBeastWeek();
  const { polls, loading: pollsLoading } = usePolls(fetchedBeastWeek?.id);
  const { moments, loading: momentsLoading } = useMoments();

  // Use mock data if Firebase fails
  const beastWeek = beastError ? MOCK_BEAST_WEEK : fetchedBeastWeek;
  const isLoading = loading || beastLoading || pollsLoading || momentsLoading;

  // Show landing page for unauthenticated users
  // NOTE: Using min-h-[calc(100vh-4rem)] to account for global Header height (~4rem)
  // DO NOT use min-h-screen here - Header is already rendered by ClientLayout
  if (!loading && !isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-digital-grape/20 via-nightfall to-electric-coral/20" />

        <div className="relative z-10 max-w-md w-full space-y-8 text-center">
          {/* Logo & Branding */}
          <div className="space-y-4">
            <div className="text-7xl mb-4">🔥</div>
            <h1 className="text-5xl font-black text-ash">
              Yollr Beast
            </h1>
            <p className="text-xl font-semibold text-signal-lime">
              Your Campus. Your Challenge. Your Glory.
            </p>
          </div>

          {/* Value Props */}
          <div className="space-y-4 py-6">
            <div className="bg-carbon/50 backdrop-blur-sm rounded-2xl p-4 border border-steel/20">
              <p className="text-lg font-semibold text-ash mb-2">🎬 Weekly Challenges</p>
              <p className="text-sm text-steel">
                Compete in campus-wide video challenges every week
              </p>
            </div>

            <div className="bg-carbon/50 backdrop-blur-sm rounded-2xl p-4 border border-steel/20">
              <p className="text-lg font-semibold text-ash mb-2">🗳️ Vote for Champions</p>
              <p className="text-sm text-steel">
                Your vote decides who becomes the Beast of the Week
              </p>
            </div>

            <div className="bg-carbon/50 backdrop-blur-sm rounded-2xl p-4 border border-steel/20">
              <p className="text-lg font-semibold text-ash mb-2">💰 Win Real Prizes</p>
              <p className="text-sm text-steel">
                Champions earn cash prizes and campus glory
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              href="/institution-select"
              className="block w-full bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-elevated"
            >
              Get Started
            </Link>

            <p className="text-xs text-steel/70 pt-2">
              Already have an account? Use the Sign In button above
            </p>
          </div>

          {/* Social Proof */}
          <p className="text-xs text-steel/70 pt-4">
            Join students competing on campuses nationwide
          </p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-ash">
            Beast Week Coming Soon
          </h2>
          <p className="text-steel">
            The first Weekly Beast challenge hasn't started yet. Check back soon to compete with your campus!
          </p>
        </div>
      </div>
    );
  }

  // Map user campus to campus ID for rivalry stats
  const getCampusId = (campusName: string): string => {
    const campusMap: Record<string, string> = {
      'Harvard University': 'harvard',
      'Massachusetts Institute of Technology': 'mit',
      'MIT': 'mit',
      'Stanford University': 'stanford',
      'UC Berkeley': 'berkeley',
      'Yale University': 'yale',
    };
    return campusMap[campusName] || 'harvard'; // Default to harvard
  };

  const userCampusId = user?.campus ? getCampusId(user.campus) : undefined;

  return (
    <div className="min-h-screen">
      <Feed
        beastWeek={beastWeek}
        polls={polls}
        moments={moments}
        campusStats={MOCK_CAMPUS_STATS}
        userCampusId={userCampusId}
        isFirstTimeSubmitter={user?.isFirstTimeSubmitter ?? true}
        userName={user?.name}
      />
    </div>
  );
}
