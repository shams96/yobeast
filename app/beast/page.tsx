'use client';

import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import BeastPhaseIndicator from '@/components/BeastPhaseIndicator';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BeastPage() {
  const {
    currentWeek,
    currentPhase,
    submissions,
    leaderboard,
    winner,
    canSubmit,
    canVote,
  } = useBeastWeekCycle();

  if (!currentWeek) {
    return (
      <div className="min-h-screen bg-nightfall flex items-center justify-center">
        <p className="text-steel">Loading Beast Week...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nightfall pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-nightfall/95 backdrop-blur-lg border-b border-steel/20">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-steel hover:text-ash transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-black text-ash">Beast Week</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Phase Indicator */}
        <BeastPhaseIndicator />

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-digital-grape/30 to-brand-mocha/30 border-2 border-digital-grape/40 rounded-3xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-9xl opacity-10">🎬</div>
          <div className="relative p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-signal-lime text-nightfall font-bold text-sm">
                Week {currentWeek.weekNumber}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-electric-coral text-nightfall font-bold text-sm">
                {currentWeek.theme}
              </div>
            </div>

            <h2 className="text-4xl font-black text-ash">{currentWeek.title}</h2>
            <p className="text-lg text-steel">{currentWeek.description}</p>

            {/* Prize */}
            <div className="flex items-center gap-3 pt-4">
              <span className="text-4xl">💰</span>
              <div>
                <p className="text-xs text-steel font-semibold">GRAND PRIZE</p>
                <p className="text-2xl font-black text-signal-lime">
                  {currentWeek.prize.displayString}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-carbon border border-steel/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-black text-ash mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Contest Rules</span>
          </h3>
          <ul className="space-y-2">
            {currentWeek.rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-3 text-steel">
                <span className="text-signal-lime font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-carbon border border-steel/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-signal-lime">{submissions.length}</p>
            <p className="text-xs text-steel font-semibold mt-1">Submissions</p>
          </div>
          <div className="bg-carbon border border-steel/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-electric-coral">
              {leaderboard[0]?.votesCount || 0}
            </p>
            <p className="text-xs text-steel font-semibold mt-1">Top Votes</p>
          </div>
          <div className="bg-carbon border border-steel/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-digital-grape">{currentWeek.maxDuration}s</p>
            <p className="text-xs text-steel font-semibold mt-1">Max Length</p>
          </div>
          <div className="bg-carbon border border-steel/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-brand-mocha">
              ${currentWeek.prize.cashAmount}
            </p>
            <p className="text-xs text-steel font-semibold mt-1">Cash Prize</p>
          </div>
        </motion.div>

        {/* Current Leaderboard (if voting/finale phase) */}
        {['VOTING_OPEN', 'FINALE_DAY', 'COOLDOWN_REEL'].includes(currentPhase) &&
          leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-carbon border border-steel/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-black text-ash mb-4 flex items-center gap-2">
                <span>🏆</span>
                <span>Current Rankings</span>
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((clip, index) => (
                  <div
                    key={clip.id}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      index === 0
                        ? 'bg-signal-lime/10 border border-signal-lime/30'
                        : 'bg-nightfall'
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-carbon flex items-center justify-center">
                      {index === 0 ? (
                        <span className="text-2xl">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-2xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="text-steel font-bold">#{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-nightfall">
                      <video src={clip.videoUrl} className="w-full h-full object-cover" muted />
                    </div>
                    <p className="flex-1 text-ash font-medium truncate">{clip.caption}</p>
                    <div className="flex items-center gap-2">
                      <span>🔥</span>
                      <span className="text-ash font-bold">{clip.votesCount}</span>
                    </div>
                  </div>
                ))}
              </div>

              {leaderboard.length > 5 && (
                <p className="text-center text-steel text-sm mt-4">
                  +{leaderboard.length - 5} more submissions
                </p>
              )}
            </motion.div>
          )}

        {/* Winner Showcase (if cooldown phase) */}
        {currentPhase === 'COOLDOWN_REEL' && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-signal-lime/20 to-electric-coral/20 border-2 border-signal-lime/40 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">👑</span>
              <div>
                <p className="text-xs text-steel font-semibold">BEAST OF THE WEEK</p>
                <p className="text-xl font-black text-ash">{winner.caption}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-32 aspect-[9/16] rounded-xl overflow-hidden bg-carbon">
                <video src={winner.videoUrl} className="w-full h-full object-cover" controls />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-ash font-bold text-2xl">{winner.votesCount}</span>
                  <span className="text-steel">votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="text-signal-lime font-bold text-lg">
                    {currentWeek.prize.displayString}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {canSubmit && (
            <Link href="/beast/submit">
              <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg hover:scale-105 active:scale-95 transition-transform">
                📹 Submit Your Video
              </button>
            </Link>
          )}

          {canVote && (
            <Link href="/beast/vote">
              <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-signal-lime to-electric-coral text-nightfall font-bold text-lg hover:scale-105 active:scale-95 transition-transform">
                🗳️ Vote Now
              </button>
            </Link>
          )}

          {currentPhase === 'FINALE_DAY' && (
            <Link href="/beast/finale">
              <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-mocha to-digital-grape text-ash font-bold text-lg hover:scale-105 active:scale-95 transition-transform">
                🏆 Watch Finale
              </button>
            </Link>
          )}

          {currentPhase === 'COOLDOWN_REEL' && (
            <Link href="/beast/reel">
              <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-digital-grape to-brand-mocha text-ash font-bold text-lg hover:scale-105 active:scale-95 transition-transform">
                🎞️ Watch Beast Reel
              </button>
            </Link>
          )}

          {submissions.length > 0 && (
            <Link href="/beast/vote">
              <button className="w-full px-6 py-4 rounded-xl bg-carbon border-2 border-steel/20 text-ash font-bold text-lg hover:border-ash transition-colors">
                👁️ View Submissions
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
