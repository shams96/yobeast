'use client';

import { Poll } from '@/types';
import { useState, useEffect } from 'react';

interface PollOverlayProps {
  poll: Poll;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (optionId: string) => void;
}

export default function PollOverlay({ poll, isOpen, onClose, onVote }: PollOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Reset state when poll changes
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setShowResults(false);
    }
  }, [poll.id, isOpen]);

  if (!isOpen) return null;

  const handleVote = (optionId: string) => {
    if (showResults) return;

    setSelectedOption(optionId);
    setShowResults(true);
    onVote?.(optionId);

    // Auto-close after showing results
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const getOptionPercentage = (optionId: string) => {
    const option = poll.options.find(opt => opt.id === optionId);
    return option?.percentage || 0;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          className="w-full max-w-md bg-dark-surface rounded-3xl shadow-elevated pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  {poll.beastLinkage && (
                    <span className="text-xs font-semibold text-brand-mocha bg-brand-mocha/10 px-2 py-0.5 rounded-full">
                      Beast Poll
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-text-primary leading-tight">
                  {poll.question}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-elevated flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-dark-border transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
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
                    w-full relative overflow-hidden rounded-2xl p-4
                    transition-all duration-200
                    ${showResults
                      ? 'cursor-default'
                      : 'cursor-pointer active:scale-[0.98] hover:bg-dark-elevated'
                    }
                    ${isSelected && !showResults ? 'bg-dark-elevated ring-2 ring-brand-mocha' : ''}
                    ${!showResults ? 'bg-dark-elevated' : ''}
                  `}
                >
                  {/* Progress Bar (shown after voting) */}
                  {showResults && (
                    <div
                      className={`
                        absolute inset-0 transition-all duration-700
                        ${isWinning
                          ? 'bg-gradient-to-r from-accent-fire/30 to-accent-fire/10'
                          : 'bg-gradient-to-r from-brand-mocha/20 to-brand-mocha/5'
                        }
                      `}
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {showResults && isSelected && (
                        <span className="text-accent-fire text-xl">✓</span>
                      )}
                      <span className={`
                        text-base font-medium text-left
                        ${showResults && isWinning ? 'text-text-primary font-semibold' : 'text-text-secondary'}
                      `}>
                        {option.text}
                      </span>
                    </div>

                    {showResults && (
                      <span className={`
                        text-base font-bold
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
          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-tertiary">
                {poll.totalVotes.toLocaleString()} votes
              </span>
              {poll.beastLinkage && (
                <span className="text-brand-mocha font-medium">
                  Affects: {poll.beastLinkage.replace('_', ' ')}
                </span>
              )}
            </div>

            {showResults && (
              <div className="glass-elevated p-4 rounded-xl text-center space-y-1">
                <p className="text-sm font-semibold text-accent-fire">
                  ✅ Vote recorded!
                </p>
                <p className="text-xs text-text-tertiary">
                  +5 Vault Points earned
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
