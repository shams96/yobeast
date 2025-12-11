'use client';

import { BeastWeek, BeastPhase } from '@/types';
import { useState } from 'react';
import Link from 'next/link';

interface BeastCardProps {
  beastWeek: BeastWeek;
  onAction?: () => void;
}

const phaseConfig: Record<BeastPhase, {
  emoji: string;
  title: string;
  subtitle: string;
  cta: string;
  theme: string;
}> = {
  BEAST_REVEAL: {
    emoji: '📺',
    title: 'This Week\'s Beast',
    subtitle: 'Submissions open Tue–Wed',
    cta: 'See How It Works',
    theme: 'from-brand-purple to-brand-mocha',
  },
  SUBMISSIONS_OPEN: {
    emoji: '🎬',
    title: 'Submissions Open',
    subtitle: 'Submit by Wed 11:59 PM',
    cta: 'Submit Your Beast Clip',
    theme: 'from-accent-fire to-brand-pink',
  },
  VOTING_OPEN: {
    emoji: '🔥',
    title: 'Finalists Locked',
    subtitle: 'Your vote decides the champion',
    cta: 'Vote in Yollr Beast',
    theme: 'from-accent-gold to-accent-fire',
  },
  FINALE_DAY: {
    emoji: '🎪',
    title: 'Beast Finale Today',
    subtitle: 'Live watch party at 6 PM',
    cta: 'Enter Beast Finale',
    theme: 'from-brand-pink to-brand-purple',
  },
  COOLDOWN_REEL: {
    emoji: '🎬',
    title: 'Beast Reel is Live',
    subtitle: 'Relive the best clips',
    cta: 'Watch Beast Reel',
    theme: 'from-brand-mocha to-brand-purple',
  },
};

export default function BeastCard({ beastWeek, onAction }: BeastCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const config = phaseConfig[beastWeek.phase];

  return (
    <div className="w-full px-4 pt-4">
      <div
        className={`
          relative overflow-hidden rounded-3xl
          transition-all duration-300
          ${isPressed ? 'scale-[0.98]' : 'scale-100'}
        `}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.theme} opacity-90`} />

        {/* Glassmorphic Overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-dark-bg/30" />

        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.emoji}</span>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {config.title}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {beastWeek.title}
              </h2>
            </div>

            {/* Week Badge */}
            <div className="glass-elevated px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-text-primary">
                Week {beastWeek.weekNumber}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/90 leading-relaxed">
            {beastWeek.description}
          </p>

          {/* Metadata Bar */}
          <div className="flex items-center gap-3 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <span>💰</span>
              <span className="font-semibold">
                ${beastWeek.prize.amount}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5">
              <span>⏱️</span>
              <span>{beastWeek.maxDuration}s max</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5">
              <span>🏆</span>
              <span>Beast of the Week</span>
            </div>
          </div>

          {/* Status Line */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-white/70">
              {config.subtitle}
            </span>
            {beastWeek.phase === 'SUBMISSIONS_OPEN' && (
              <span className="text-xs font-semibold text-accent-cyan animate-pulse">
                143 clips submitted
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={
              beastWeek.phase === 'BEAST_REVEAL'
                ? '/beast'
                : beastWeek.phase === 'SUBMISSIONS_OPEN'
                ? '/beast/submit'
                : beastWeek.phase === 'VOTING_OPEN'
                ? '/beast/vote'
                : beastWeek.phase === 'FINALE_DAY'
                ? '/beast/finale'
                : '/beast/reel'
            }
            className="block w-full"
          >
            <button
              className="
                w-full bg-white/20 hover:bg-white/30
                backdrop-blur-sm
                text-white font-semibold
                px-6 py-3.5 rounded-2xl
                active:scale-95 transition-all duration-150
                border border-white/30
                shadow-lg hover:shadow-xl
              "
            >
              {config.cta}
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
