'use client';

import { Poll } from '@/types';
import { useState } from 'react';

interface PollCardProps {
  poll: Poll;
  hasVoted?: boolean;
  userVote?: string;
  onVote?: (optionId: string) => void;
}

export default function PollCard({ poll, hasVoted = false, userVote, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(userVote || null);
  const [showResults, setShowResults] = useState(hasVoted);

  const handleVote = (optionId: string) => {
    if (showResults) return;

    setSelectedOption(optionId);
    setShowResults(true);
    onVote?.(optionId);
  };

  const getOptionPercentage = (optionId: string) => {
    const option = poll.options.find(opt => opt.id === optionId);
    return option?.percentage || 0;
  };

  return (
    <div className="w-full px-4">
      <div className="card space-y-4">
        {/* Poll Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              {poll.beastLinkage && (
                <span className="text-xs font-semibold text-digital-grape bg-digital-grape/15 px-2.5 py-0.5 rounded-full border border-digital-grape/30">
                  Beast Poll
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-ash leading-snug">
              {poll.question}
            </h3>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = showResults ? getOptionPercentage(option.id) : 0;
            const isSelected = selectedOption === option.id;
            const isWinning = showResults && percentage === Math.max(...poll.options.map(o => o.percentage));

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={showResults}
                className={`
                  w-full relative overflow-hidden rounded-xl p-3
                  transition-all duration-200
                  border
                  ${showResults
                    ? 'cursor-default'
                    : 'cursor-pointer active:scale-[0.98] hover:bg-carbon/80 hover:border-steel/30'
                  }
                  ${isSelected && !showResults ? 'bg-carbon/80 border-digital-grape' : 'border-steel/20'}
                  ${!showResults ? 'bg-carbon/50' : 'bg-carbon/30'}
                `}
              >
                {/* Progress Bar (solid color, no gradients) */}
                {showResults && (
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500
                      ${isWinning ? 'bg-future-dusk/30' : 'bg-digital-grape/15'}
                    `}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showResults && isSelected && (
                      <span className="text-future-dusk">✓</span>
                    )}
                    <span className={`
                      text-sm font-medium
                      ${showResults && isWinning ? 'text-ash font-semibold' : 'text-steel'}
                    `}>
                      {option.text}
                    </span>
                  </div>

                  {showResults && (
                    <span className={`
                      text-sm font-bold
                      ${isWinning ? 'text-future-dusk' : 'text-steel'}
                    `}>
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-steel pt-2">
          <span>{poll.totalVotes.toLocaleString()} votes</span>
          {poll.beastLinkage && (
            <span className="text-digital-grape font-medium">
              Affects: {poll.beastLinkage.replace('_', ' ')}
            </span>
          )}
        </div>

        {showResults && (
          <div className="text-xs text-steel text-center bg-signal-lime/10 py-2 rounded-xl border border-signal-lime/30">
            ✅ You voted! Earn +5 Vault Points
          </div>
        )}
      </div>
    </div>
  );
}
