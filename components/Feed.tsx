'use client';

import { BeastWeek, Poll, Moment } from '@/types';
import BeastCard from './cards/BeastCard';
import PollCard from './cards/PollCard';
import MomentCard from './cards/MomentCard';
import { useState } from 'react';
import Link from 'next/link';

interface FeedProps {
  beastWeek: BeastWeek;
  polls: Poll[];
  moments: Moment[];
}

export default function Feed({ beastWeek, polls, moments }: FeedProps) {
  const [pollVotes, setPollVotes] = useState<Record<string, string>>({});

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Vertical Feed - TikTok/IG Style */}
      <div className="flex flex-col space-y-6 pb-8">
        {/* Top Pinned: Beast Card */}
        <div className="sticky top-[72px] z-40 bg-dark-bg/95 backdrop-blur-lg pb-2">
          <BeastCard beastWeek={beastWeek} onAction={handleBeastAction} />
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
          <div className="w-12 h-12 rounded-full bg-dark-elevated flex items-center justify-center">
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-sm text-text-tertiary text-center">
            You're all caught up!
          </p>
          <p className="text-xs text-text-tertiary text-center max-w-xs">
            Check back later for more Beast content, Polls, and Moments from your campus.
          </p>
        </div>
      </div>
    </div>
  );
}
