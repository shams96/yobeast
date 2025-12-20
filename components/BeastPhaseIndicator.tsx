'use client';

import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PHASE_CONFIG = {
  BEAST_REVEAL: {
    label: 'Challenge Revealed',
    icon: '🎬',
    color: 'from-digital-grape to-brand-mocha',
    description: 'New Beast Week challenge is live!',
    cta: 'View Challenge',
    ctaLink: '/beast',
  },
  SUBMISSIONS_OPEN: {
    label: 'Submissions Open',
    icon: '📹',
    color: 'from-electric-coral to-signal-lime',
    description: 'Submit your best video now!',
    cta: 'Submit Video',
    ctaLink: '/beast/submit',
  },
  VOTING_OPEN: {
    label: 'Voting Live',
    icon: '🗳️',
    color: 'from-signal-lime to-electric-coral',
    description: 'Vote for your favorite submission!',
    cta: 'Vote Now',
    ctaLink: '/beast/vote',
  },
  FINALE_DAY: {
    label: 'Live Finale',
    icon: '🏆',
    color: 'from-brand-mocha to-digital-grape',
    description: 'Winner announcement happening now!',
    cta: 'Watch Finale',
    ctaLink: '/beast/finale',
  },
  COOLDOWN_REEL: {
    label: 'Beast Reel',
    icon: '🎞️',
    color: 'from-ash to-steel',
    description: 'Relive this week\'s best moments',
    cta: 'Watch Reel',
    ctaLink: '/beast/reel',
  },
};

export default function BeastPhaseIndicator({ compact = false }: { compact?: boolean }) {
  const {
    currentPhase,
    phaseTimeRemaining,
    currentWeek,
    canSubmit,
    canVote,
    hasSubmitted,
    hasVoted,
  } = useBeastWeekCycle();

  const config = PHASE_CONFIG[currentPhase];

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Transitioning...';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getActionStatus = () => {
    if (currentPhase === 'SUBMISSIONS_OPEN') {
      return hasSubmitted ? '✅ Submitted' : '⚠️ Not Submitted';
    }
    if (currentPhase === 'VOTING_OPEN') {
      return hasVoted ? '✅ Voted' : '⚠️ Haven\'t Voted';
    }
    return null;
  };

  const actionStatus = getActionStatus();

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r {config.color} text-nightfall text-xs font-bold">
        <span>{config.icon}</span>
        <span>{config.label}</span>
        <span className="opacity-70">• {formatTimeRemaining(phaseTimeRemaining)}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-4 py-3 bg-gradient-to-r {config.color} rounded-2xl border-2 border-white/20"
    >
      <div className="flex items-center justify-between">
        {/* Left: Phase Info */}
        <div className="flex items-center gap-3">
          <div className="text-4xl">{config.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-nightfall">{config.label}</h3>
              {actionStatus && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  actionStatus.startsWith('✅')
                    ? 'bg-nightfall/20 text-nightfall'
                    : 'bg-white/90 text-electric-coral'
                }`}>
                  {actionStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-nightfall/80 mt-0.5">{config.description}</p>

            {/* Countdown */}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-nightfall/70">
              <span>⏳</span>
              <span>Next phase in: {formatTimeRemaining(phaseTimeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Right: CTA Button */}
        <Link href={config.ctaLink}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-nightfall text-ash font-bold text-sm hover:bg-nightfall/90 transition-colors"
          >
            {config.cta}
          </motion.button>
        </Link>
      </div>

      {/* Week Info */}
      {currentWeek && (
        <div className="mt-3 pt-3 border-t border-nightfall/10 flex items-center justify-between text-xs text-nightfall/70">
          <span className="font-semibold">Week {currentWeek.weekNumber}: {currentWeek.theme}</span>
          <span className="font-bold">{currentWeek.prize.displayString}</span>
        </div>
      )}
    </motion.div>
  );
}
