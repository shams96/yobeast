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
                <span className="text-xs font-semibold text-brand-mocha bg-brand-mocha/10 px-2 py-0.5 rounded-full">
                  Beast Poll
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-text-primary leading-snug">
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
                  ${showResults
                    ? 'cursor-default'
                    : 'cursor-pointer active:scale-[0.98] hover:bg-dark-elevated'
                  }
                  ${isSelected && !showResults ? 'bg-dark-elevated ring-2 ring-brand-mocha' : ''}
                  ${!showResults ? 'bg-dark-surface' : ''}
                `}
              >
                {/* Progress Bar (shown after voting) */}
                {showResults && (
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500
                      ${isWinning
                        ? 'bg-gradient-to-r from-accent-fire/20 to-accent-fire/5'
                        : 'bg-gradient-to-r from-brand-mocha/10 to-brand-mocha/5'
                      }
                    `}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showResults && isSelected && (
                      <span className="text-accent-fire">✓</span>
                    )}
                    <span className={`
                      text-sm font-medium
                      ${showResults && isWinning ? 'text-text-primary font-semibold' : 'text-text-secondary'}
                    `}>
                      {option.text}
                    </span>
                  </div>

                  {showResults && (
                    <span className={`
                      text-sm font-bold
                      ${isWinning ? 'text-accent-fire' : 'text-text-tertiary'}
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
        <div className="flex items-center justify-between text-xs text-text-tertiary pt-2">
          <span>{poll.totalVotes.toLocaleString()} votes</span>
          {poll.beastLinkage && (
            <span className="text-brand-mocha font-medium">
              Affects: {poll.beastLinkage.replace('_', ' ')}
            </span>
          )}
        </div>

        {showResults && (
          <div className="text-xs text-text-secondary text-center">
            ✅ You voted! Earn +5 Vault Points
          </div>
        )}
      </div>
    </div>
  );
}
