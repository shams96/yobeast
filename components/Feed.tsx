'use client';

import { BeastWeek, Poll, Moment, CampusStats } from '@/types';
import BeastCard from './cards/BeastCard';
import PollCard from './cards/PollCard';
import MomentCard from './cards/MomentCard';
import RivalryDashboard from './cards/RivalryDashboard';
import { MentalHealthBanner, FirstTimeEncouragement } from './inclusion/InclusionFeatures';
import RealsCountdown from './RealsCountdown';
import { useReals } from '@/context/RealsContext';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FeedProps {
  beastWeek: BeastWeek;
  polls: Poll[];
  moments: Moment[];
  campusStats?: Record<string, CampusStats>;
  userCampusId?: string;
  isFirstTimeSubmitter?: boolean;
  userName?: string;
}

export default function Feed({
  beastWeek,
  polls,
  moments,
  campusStats,
  userCampusId,
  isFirstTimeSubmitter = false,
  userName
}: FeedProps) {
  const [pollVotes, setPollVotes] = useState<Record<string, string>>({});
  const { canSeeFeed, realsTime } = useReals();
  const router = useRouter();

  const handleBeastAction = () => {
    console.log('Beast action clicked:', beastWeek.phase);
    // Navigation will be implemented in Phase 2
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    setPollVotes(prev => ({ ...prev, [pollId]: optionId }));
    console.log('Poll vote:', { pollId, optionId });
  };

  const handleMomentReact = (momentId: string, emoji: string) => {
    console.log('Moment reaction:', { momentId, emoji });
  };

  // 4Real Discovery Lock - Can't see feed until you post
  if (!canSeeFeed && !realsTime.hasPostedToday) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col space-y-6 pb-8">
          {/* Still show Beast Card */}
          <div className="sticky top-[72px] z-40 bg-nightfall/95 backdrop-blur-lg pb-2">
            <BeastCard beastWeek={beastWeek} onAction={handleBeastAction} />
          </div>

          {/* Show 4Real countdown */}
          <RealsCountdown />

          {/* DISCOVERY LOCK SCREEN - THE MOST VIRAL MECHANIC */}
          <div className="px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-sm w-full space-y-6 text-center">
              {/* Lock Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-electric-coral/20 to-signal-lime/20 border-2 border-electric-coral/40 flex items-center justify-center">
                  <span className="text-5xl">🔒</span>
                </div>
              </div>

              {/* FOMO Messaging */}
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-ash">
                  Post 4Real to Unlock
                </h2>
                <p className="text-steel text-base leading-relaxed">
                  See what your campus is up to after you post your 4Real moment
                </p>
              </div>

              {/* Stats to create FOMO */}
              <div className="bg-carbon/50 backdrop-blur-sm rounded-2xl p-4 border border-steel/20">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-signal-lime font-bold">{moments.length}</span>
                  <span className="text-steel">people already posted today</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push('/moment/new')}
                className="w-full bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-elevated"
              >
                Post 4Real Now
              </button>

              {/* Secondary messaging */}
              <p className="text-xs text-steel/70 pt-2">
                Everyone posts. Everyone sees. That's the deal. 🔥
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Vertical Feed - TikTok/IG Style */}
      <div className="flex flex-col space-y-6 pb-8">
        {/* Top Pinned: Beast Card */}
        <div className="sticky top-[72px] z-40 bg-nightfall/95 backdrop-blur-lg pb-2">
          <BeastCard beastWeek={beastWeek} onAction={handleBeastAction} />
        </div>

        {/* 4Real Daily Time Window - Core Engagement Mechanic */}
        <RealsCountdown />

        {/* Campus Rivalry Dashboard */}
        {campusStats && userCampusId && (
          <RivalryDashboard campusStats={campusStats} userCampusId={userCampusId} />
        )}

        {/* Inclusion Features */}
        <div className="space-y-4 px-4">
          {/* First-Time Encouragement - show during submission phase */}
          {isFirstTimeSubmitter && beastWeek.phase === 'SUBMISSIONS_OPEN' && (
            <FirstTimeEncouragement userName={userName} />
          )}

          {/* Mental Health Resources - show during high-stress phases */}
          {(beastWeek.phase === 'VOTING_OPEN' || beastWeek.phase === 'FINALE_DAY') && (
            <MentalHealthBanner />
          )}
        </div>

        {/* Interleaved Content: Polls > Beast Moments > Moments */}
        <div className="space-y-6">
          {/* Beast-Related Poll */}
          {polls.filter(p => p.beastLinkage).map(poll => (
            <div key={poll.id} className="feed-item">
              <PollCard
                poll={poll}
                hasVoted={!!pollVotes[poll.id]}
                userVote={pollVotes[poll.id]}
                onVote={(optionId) => handlePollVote(poll.id, optionId)}
              />
            </div>
          ))}

          {/* Beast Moments */}
          {moments
            .filter(m => m.isBeastMoment)
            .slice(0, 2)
            .map((moment, idx) => (
              <div
                key={moment.id}
                className="feed-item"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <MomentCard
                  moment={moment}
                  onReact={(emoji) => handleMomentReact(moment.id, emoji)}
                />
              </div>
            ))}

          {/* Regular Poll */}
          {polls.filter(p => !p.beastLinkage).slice(0, 1).map(poll => (
            <div key={poll.id} className="feed-item">
              <PollCard
                poll={poll}
                hasVoted={!!pollVotes[poll.id]}
                userVote={pollVotes[poll.id]}
                onVote={(optionId) => handlePollVote(poll.id, optionId)}
              />
            </div>
          ))}

          {/* Regular Moments */}
          {moments
            .filter(m => !m.isBeastMoment)
            .map((moment, idx) => (
              <div
                key={moment.id}
                className="feed-item"
                style={{ animationDelay: `${(idx + 3) * 0.1}s` }}
              >
                <MomentCard
                  moment={moment}
                  onReact={(emoji) => handleMomentReact(moment.id, emoji)}
                />
              </div>
            ))}
        </div>

        {/* End of Feed Indicator */}
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-carbon flex items-center justify-center">
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-sm text-steel text-center">
            You're all caught up!
          </p>
          <p className="text-xs text-steel text-center max-w-xs">
            Check back later for more Beast content, Polls, and Moments from your campus.
          </p>
        </div>
      </div>
    </div>
  );
}
