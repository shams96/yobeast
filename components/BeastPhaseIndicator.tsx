'use client';

import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PHASE_CONFIG, getUserStatusMessage, getNextPhaseInfo } from '@/lib/beastPhaseConfig';
import { BeastPhase } from '@/types';

// Timeline phase order for progress indicator
const TIMELINE_PHASES: BeastPhase[] = [
  'BEAST_REVEAL',
  'SUBMISSIONS_OPEN',
  'VOTING_OPEN',
  'FINALE_DAY',
  'COOLDOWN_REEL'
];

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

  const isPastPhase = (phase: BeastPhase) => {
    const currentIndex = TIMELINE_PHASES.indexOf(currentPhase);
    const phaseIndex = TIMELINE_PHASES.indexOf(phase);
    return phaseIndex < currentIndex;
  };

  const nextPhaseInfo = getNextPhaseInfo(currentPhase);
  const userStatus = getUserStatusMessage(currentPhase, hasSubmitted, hasVoted);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.colors.bg} text-nightfall text-xs font-bold`}>
        <span>{config.emoji}</span>
        <span>{config.timelineLabel}</span>
        <span className="opacity-70">• {formatTimeRemaining(phaseTimeRemaining)}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl`}
    >
      {/* Timeline Progress Bar */}
      <div className="bg-nightfall px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-steel uppercase tracking-wide">
            This Week's Beast
          </span>
          {currentWeek && (
            <span className="text-xs font-bold text-ash px-2 py-0.5 rounded-full bg-digital-grape/30">
              W{currentWeek.weekNumber}
            </span>
          )}
        </div>

        {/* Phase Timeline */}
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-steel/20">
            <div
              className="h-full bg-gradient-to-r from-signal-lime to-electric-coral transition-all duration-500"
              style={{
                width: `${((TIMELINE_PHASES.indexOf(currentPhase) + 1) / TIMELINE_PHASES.length) * 100}%`
              }}
            />
          </div>

          {/* Phase Dots */}
          {TIMELINE_PHASES.map((phase, index) => {
            const phaseConfig = PHASE_CONFIG[phase];
            const isActive = phase === currentPhase;
            const isPast = isPastPhase(phase);

            return (
              <div
                key={phase}
                className="relative flex flex-col items-center z-10 group"
                title={phaseConfig.tooltip}
              >
                {/* Phase Dot */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-br from-electric-coral to-signal-lime ring-4 ring-signal-lime/30'
                      : isPast
                      ? 'bg-steel/40'
                      : 'bg-carbon border-2 border-steel/30'
                    }
                  `}
                >
                  {isPast ? (
                    <span className="text-signal-lime font-bold">✓</span>
                  ) : (
                    <span className={isActive ? 'animate-pulse' : ''}>{phaseConfig.emoji}</span>
                  )}
                </motion.div>

                {/* Phase Label */}
                <span className={`
                  mt-2 text-xs font-semibold
                  ${isActive ? 'text-signal-lime' : isPast ? 'text-steel' : 'text-ash'}
                `}>
                  {phaseConfig.timelineLabel}
                </span>

                {/* Tooltip on Hover */}
                <div className="
                  absolute top-full mt-8 left-1/2 -translate-x-1/2
                  w-48 px-3 py-2 bg-carbon border border-steel/20 rounded-lg
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-200 z-20
                  shadow-lg
                ">
                  <p className="text-xs text-ash leading-relaxed">{phaseConfig.tooltip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Phase Details */}
      <div className={`bg-gradient-to-r ${config.colors.bg} px-6 py-5`}>
        <div className="flex items-start justify-between gap-4">
          {/* Left: Phase Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-5xl">{config.emoji}</div>
              <div>
                <h3 className={`text-xl font-black ${config.colors.text}`}>
                  {config.title}
                </h3>
                <p className={`text-sm ${config.colors.text} opacity-80 mt-0.5`}>
                  {config.subtext}
                </p>
              </div>
            </div>

            <p className={`text-sm ${config.colors.text} leading-relaxed mt-3`}>
              {config.description}
            </p>

            {/* User Status Message */}
            <div className={`
              mt-3 px-3 py-2 rounded-lg
              ${userStatus.startsWith('✅')
                ? 'bg-signal-lime/20 border border-signal-lime/30'
                : 'bg-electric-coral/20 border border-electric-coral/30'
              }
            `}>
              <p className={`text-xs font-semibold ${config.colors.text}`}>
                {userStatus}
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className={`text-xs font-semibold ${config.colors.text} opacity-70`}>
                  Next: {nextPhaseInfo.day}
                </p>
                <p className={`text-lg font-black ${config.colors.text}`}>
                  {formatTimeRemaining(phaseTimeRemaining)}
                </p>
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Link href={config.ctaLink}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-4 rounded-xl font-bold text-sm shadow-lg
                ${config.colors.buttonBg} ${config.colors.buttonText}
                hover:shadow-xl transition-shadow
              `}
            >
              {config.cta}
            </motion.button>
          </Link>
        </div>

        {/* Week Prize Info */}
        {currentWeek && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold ${config.colors.text} opacity-70 uppercase tracking-wide`}>
                  This Week's Theme
                </p>
                <p className={`text-sm font-black ${config.colors.text} mt-0.5`}>
                  {currentWeek.theme}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${config.colors.text} opacity-70 uppercase tracking-wide`}>
                  Prize
                </p>
                <p className={`text-sm font-black ${config.colors.text} mt-0.5`}>
                  {currentWeek.prize.displayString}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
