'use client';

import { BeastWeek, BeastPhase } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getTimelineSteps, getPhaseCountdown } from '@/lib/beastPhases';
import { PHASE_CONFIG } from '@/lib/beastPhaseConfig';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';

interface BeastCardProps {
  beastWeek: BeastWeek;
  onAction?: () => void;
}

const phaseConfig: Record<BeastPhase, {
  emoji: string;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}> = {
  BEAST_REVEAL: {
    emoji: '📺',
    title: 'This Week\'s Beast',
    subtitle: 'Submissions open Tue–Wed',
    cta: 'View Full Challenge',
    bgColor: 'bg-digital-grape',
    borderColor: 'border-digital-grape/30',
    accentColor: 'bg-digital-grape/20',
  },
  SUBMISSIONS_OPEN: {
    emoji: '🎬',
    title: 'Submissions Open',
    subtitle: 'Submit by Wed 11:59 PM',
    cta: '📹 Submit Video Now',
    bgColor: 'bg-gradient-to-br from-digital-grape to-electric-coral',
    borderColor: 'border-digital-grape/30',
    accentColor: 'bg-digital-grape/20',
  },
  VOTING_OPEN: {
    emoji: '🔥',
    title: 'Finalists Locked',
    subtitle: 'Your vote decides the champion',
    cta: '🗳️ Vote for Champion',
    bgColor: 'bg-signal-lime',
    borderColor: 'border-signal-lime/30',
    accentColor: 'bg-signal-lime/20',
  },
  FINALE_DAY: {
    emoji: '🎪',
    title: 'Beast Finale Today',
    subtitle: 'Live watch party at 6 PM',
    cta: '🏆 Watch Live Finale',
    bgColor: 'bg-future-dusk',
    borderColor: 'border-future-dusk/30',
    accentColor: 'bg-future-dusk/20',
  },
  COOLDOWN_REEL: {
    emoji: '🎬',
    title: 'Beast Reel is Live',
    subtitle: 'Relive the best clips',
    cta: '🎞️ Watch Highlights',
    bgColor: 'bg-ice-cyan',
    borderColor: 'border-ice-cyan/30',
    accentColor: 'bg-ice-cyan/20',
  },
};

export default function BeastCard({ beastWeek, onAction }: BeastCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { currentPhase, submissions, leaderboard } = useBeastWeekCycle(); // Get live stats from context
  const config = phaseConfig[currentPhase];
  const phaseInfo = PHASE_CONFIG[currentPhase]; // Dynamic phase content
  const timelineSteps = getTimelineSteps(beastWeek);
  const countdown = getPhaseCountdown(beastWeek);

  // Real-time stats
  const submissionCount = submissions.length;
  const totalVotes = leaderboard.reduce((sum, clip) => sum + clip.votesCount, 0);
  const topVotes = leaderboard[0]?.votesCount || 0;

  return (
    <motion.div
      className="w-full px-4 pt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className={`
          relative overflow-hidden rounded-3xl
          ${config.bgColor}
          border-2 ${config.borderColor}
          shadow-elevated
          transition-all duration-200
          ${isPressed ? 'scale-[0.98]' : 'scale-100'}
        `}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <motion.div
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-2xl">{config.emoji}</span>
                <span className="text-xs font-bold text-ash/90 uppercase tracking-wider">
                  {config.title}
                </span>
              </motion.div>
              <motion.h2
                className="text-2xl font-black text-ash leading-tight tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {beastWeek.title}
              </motion.h2>
            </div>

            {/* Week Badge - Clean pill */}
            <motion.div
              className="px-3 py-1.5 rounded-full bg-nightfall/40 border border-ash/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-bold text-ash">
                W{beastWeek.weekNumber}
              </span>
            </motion.div>
          </div>

          {/* Weekly Timeline */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Timeline Steps */}
            <div className="flex items-center justify-between gap-1">
              {timelineSteps.map((step, index) => (
                <div key={step.phase} className="flex items-center gap-1 flex-1">
                  {/* Step Indicator */}
                  <motion.div
                    className={`
                      relative flex flex-col items-center justify-center
                      h-12 rounded-xl flex-1
                      border-2 transition-all duration-300
                      ${step.isActive
                        ? 'bg-signal-lime/20 border-signal-lime'
                        : step.isComplete
                        ? 'bg-digital-grape/20 border-digital-grape/40'
                        : 'bg-nightfall/20 border-ash/20'
                      }
                    `}
                    animate={step.isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {/* Day Label */}
                    <span className={`
                      text-[10px] font-bold uppercase tracking-tight
                      ${step.isActive ? 'text-nightfall' : step.isComplete ? 'text-digital-grape' : 'text-steel'}
                    `}>
                      {step.day}
                    </span>
                    {/* Phase Label */}
                    <span className={`
                      text-[9px] font-semibold
                      ${step.isActive ? 'text-nightfall' : step.isComplete ? 'text-ash/70' : 'text-steel/70'}
                    `}>
                      {step.label}
                    </span>

                    {/* Active Indicator Dot */}
                    {step.isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-signal-lime"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}

                    {/* Complete Checkmark */}
                    {step.isComplete && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-digital-grape flex items-center justify-center">
                        <span className="text-[8px] text-white">✓</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Connector Line */}
                  {index < timelineSteps.length - 1 && (
                    <div className={`
                      h-0.5 w-1 flex-shrink-0
                      ${step.isComplete ? 'bg-digital-grape/40' : 'bg-ash/20'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            {/* Live Action Banner */}
            {(currentPhase === 'SUBMISSIONS_OPEN' || currentPhase === 'VOTING_OPEN') && (
              <motion.div
                className={`
                  flex items-center justify-between gap-3
                  px-3 py-2 rounded-xl
                  border-2
                  ${currentPhase === 'SUBMISSIONS_OPEN'
                    ? 'bg-electric-coral/20 border-electric-coral/40'
                    : 'bg-signal-lime/20 border-signal-lime/40'
                  }
                `}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`
                      w-1.5 h-1.5 rounded-full
                      ${currentPhase === 'SUBMISSIONS_OPEN' ? 'bg-electric-coral' : 'bg-signal-lime'}
                    `}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold text-nightfall uppercase tracking-wide">
                    {currentPhase === 'SUBMISSIONS_OPEN' ? '🎬 LIVE: Submit Clips' : '🔥 LIVE: Vote Now'}
                  </span>
                </div>
                {countdown && (
                  <span className="text-xs font-semibold text-nightfall/80">
                    Closes in {countdown}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-sm text-ash/95 leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {phaseInfo.description}
          </motion.p>

          {/* Phase-Specific Content - ALL INFO VISIBLE */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {/* MONDAY REVEAL - Show everything immediately */}
            {currentPhase === 'BEAST_REVEAL' && (
              <>
                {/* Prize */}
                <div className="px-4 py-3 rounded-xl bg-nightfall/40 border border-signal-lime/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💰</span>
                    <span className="text-xs font-semibold text-ash/80 uppercase tracking-wide">
                      Grand Prize
                    </span>
                  </div>
                  <div className="text-2xl font-black text-signal-lime">
                    ${beastWeek.prize.cashAmount} Cash Prize
                  </div>
                  {beastWeek.prize.sponsors && beastWeek.prize.sponsors.length > 0 && (
                    <div className="text-xs text-ash/70 mt-1">
                      + {beastWeek.prize.sponsors[0].prizeDescription}
                    </div>
                  )}
                </div>

                {/* Quick Rules */}
                <div className="px-4 py-3 rounded-xl bg-nightfall/40 border border-ash/20">
                  <div className="text-xs font-bold text-ash/80 uppercase tracking-wide mb-2">
                    📋 Quick Rules
                  </div>
                  <div className="space-y-1 text-xs text-ash/90">
                    <div>• {beastWeek.maxDuration}s max video length</div>
                    <div>• Original content only</div>
                    <div>• One submission per student</div>
                  </div>
                </div>

                {/* Next Action */}
                <div className="px-3 py-2 rounded-xl bg-electric-coral/20 border border-electric-coral/40">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span className="text-xs font-semibold text-nightfall">
                      Submissions open Tuesday at midnight ({countdown})
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* TUESDAY-WEDNESDAY SUBMIT - Direct action focus */}
            {currentPhase === 'SUBMISSIONS_OPEN' && (
              <>
                {/* Deadline Countdown */}
                <div className="px-4 py-3 rounded-xl bg-electric-coral/20 border border-electric-coral/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="text-xs font-semibold text-nightfall/80 uppercase">Deadline</div>
                        <div className="text-sm font-black text-nightfall">Closes in {countdown}</div>
                      </div>
                    </div>
                    <motion.div
                      className="px-3 py-1.5 rounded-full bg-signal-lime text-nightfall text-xs font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      OPEN NOW
                    </motion.div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">{submissionCount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Submitted</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-electric-coral">{beastWeek.maxDuration}s</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Max Length</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">${beastWeek.prize.cashAmount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Prize</div>
                  </div>
                </div>

                {/* Quick Reminder */}
                <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20">
                  <div className="text-xs text-ash/80">
                    💡 <span className="font-semibold">One submission per student</span> • Original content only
                  </div>
                </div>
              </>
            )}

            {/* THURSDAY-FRIDAY VOTE - Voting focus */}
            {currentPhase === 'VOTING_OPEN' && (
              <>
                {/* Deadline */}
                <div className="px-4 py-3 rounded-xl bg-signal-lime/20 border border-signal-lime/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="text-xs font-semibold text-nightfall/80 uppercase">Voting Ends</div>
                        <div className="text-sm font-black text-nightfall">In {countdown}</div>
                      </div>
                    </div>
                    <motion.div
                      className="px-3 py-1.5 rounded-full bg-electric-coral text-nightfall text-xs font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      VOTE NOW
                    </motion.div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">{submissionCount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Submissions</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-electric-coral">{totalVotes}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Votes Cast</div>
                  </div>
                </div>

                {/* Status */}
                <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20">
                  <div className="text-xs text-ash/80">
                    🗳️ <span className="font-semibold">One vote per student</span> • Help crown the champion
                  </div>
                </div>
              </>
            )}

            {/* SATURDAY FINALE - Winner focus */}
            {currentPhase === 'FINALE_DAY' && (
              <>
                {/* Live Banner */}
                <div className="px-4 py-3 rounded-xl bg-electric-coral/20 border border-electric-coral/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-electric-coral"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-sm font-black text-nightfall uppercase tracking-wide">
                        🏆 Finale Live at 6:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">{submissionCount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Finalists</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-electric-coral">{totalVotes}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Total Votes</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">${beastWeek.prize.cashAmount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Prize</div>
                  </div>
                </div>

                {/* Countdown to Finale */}
                {countdown && (
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20">
                    <div className="text-xs text-ash/80">
                      ⏰ Finale starts in <span className="font-bold">{countdown}</span> • Don't miss it!
                    </div>
                  </div>
                )}
              </>
            )}

            {/* SUNDAY REEL - Highlights focus */}
            {currentPhase === 'COOLDOWN_REEL' && (
              <>
                {/* Champion Showcase */}
                <div className="px-4 py-3 rounded-xl bg-signal-lime/20 border border-signal-lime/40">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👑</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-nightfall/80 uppercase">This Week's Champion</div>
                      <div className="text-sm font-black text-nightfall">Watch the winning video</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-signal-lime">Top 5</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">In Reel</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/20 text-center">
                    <div className="text-lg font-black text-electric-coral">${beastWeek.prize.cashAmount}</div>
                    <div className="text-[9px] text-ash/70 font-semibold uppercase">Awarded</div>
                  </div>
                </div>

                {/* Next Challenge */}
                <div className="px-3 py-2 rounded-xl bg-electric-coral/20 border border-electric-coral/40">
                  <div className="text-xs text-nightfall font-semibold">
                    🎬 Next challenge reveals Monday ({countdown})
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* CTA Button - Solid with clean design */}
          <Link
            href={
              currentPhase === 'BEAST_REVEAL'
                ? '/beast'
                : currentPhase === 'SUBMISSIONS_OPEN'
                ? '/beast/submit'
                : currentPhase === 'VOTING_OPEN'
                ? '/beast/vote'
                : currentPhase === 'FINALE_DAY'
                ? '/beast/finale'
                : '/beast/reel'
            }
            className="block w-full"
          >
            <motion.button
              className="
                w-full
                bg-nightfall text-ash font-bold text-base
                px-6 py-3.5 rounded-2xl
                border-2 border-ash/30 hover:border-ash/50
                shadow-button hover:shadow-elevated
                transition-all duration-200
              "
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {config.cta}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
