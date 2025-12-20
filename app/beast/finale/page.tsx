'use client';

import { useState, useEffect } from 'react';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import EnhancedVideoPlayer from '@/components/EnhancedVideoPlayer';

export default function BeastFinalePage() {
  const {
    currentWeek,
    currentPhase,
    topThree,
    winner,
    leaderboard,
  } = useBeastWeekCycle();

  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Only accessible during FINALE_DAY phase
  if (currentPhase !== 'FINALE_DAY') {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">⏰</div>
          <h1 className="text-2xl font-black text-ash">Finale Not Started</h1>
          <p className="text-steel">
            The live finale happens Saturday at 6 PM!
          </p>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl bg-digital-grape text-ash font-bold hover:scale-105 transition-transform">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // No winner yet
  if (!winner || topThree.length === 0) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">📊</div>
          <h1 className="text-2xl font-black text-ash">Calculating Results...</h1>
          <p className="text-steel">
            No submissions to show yet. Check back soon!
          </p>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl bg-digital-grape text-ash font-bold hover:scale-105 transition-transform">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleReveal = () => {
    setRevealed(true);
    setShowConfetti(true);

    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#B4F461', '#FF6B9D', '#9B59B6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#B4F461', '#FF6B9D', '#9B59B6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

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
          <h1 className="text-xl font-black text-ash">🏆 Beast Finale</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Week Info Banner */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-3xl font-black text-ash">{currentWeek?.title}</h2>
          <p className="text-steel text-lg">{currentWeek?.theme}</p>
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-signal-lime to-electric-coral text-nightfall font-bold text-lg mt-4">
            {currentWeek?.prize.displayString}
          </div>
        </div>

        {/* Reveal Button */}
        {!revealed && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={handleReveal}
              className="px-12 py-6 rounded-2xl bg-gradient-to-r from-electric-coral via-digital-grape to-signal-lime text-nightfall font-black text-2xl hover:scale-105 active:scale-95 transition-transform shadow-2xl"
            >
              🎉 Reveal Winner
            </button>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Winner Spotlight */}
              <div className="mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="relative bg-gradient-to-br from-signal-lime/30 to-electric-coral/30 border-4 border-signal-lime rounded-3xl p-8 shadow-2xl"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="px-6 py-2 rounded-full bg-signal-lime text-nightfall font-black text-lg shadow-lg">
                      👑 BEAST OF THE WEEK
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                    {/* Winner Video - Enhanced Player */}
                    <div className="flex-shrink-0 w-full md:w-64 aspect-[9/16] rounded-2xl overflow-hidden shadow-xl">
                      <EnhancedVideoPlayer
                        videoUrl={winner.videoUrl}
                        caption={winner.caption}
                        votesCount={winner.votesCount}
                        canVote={false}
                        hasVoted={true}
                        autoPlay={true}
                        muted={false}
                      />
                    </div>

                    {/* Winner Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <h3 className="text-3xl font-black text-ash">{winner.caption}</h3>

                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-4xl">🔥</span>
                        <span className="text-ash font-black text-4xl">{winner.votesCount}</span>
                        <span className="text-steel text-xl">votes</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <span className="text-2xl">💰</span>
                          <span className="text-signal-lime font-black text-2xl">
                            {currentWeek?.prize.displayString}
                          </span>
                        </div>
                        <p className="text-steel text-sm">
                          Congratulations! You are the Beast of Week {currentWeek?.weekNumber}!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Podium - 2nd and 3rd Place */}
              {topThree.length >= 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border-2 border-digital-grape/40 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">🥈</span>
                        <span className="text-xl font-black text-ash">2nd Place</span>
                      </div>

                      <div className="aspect-[9/16] w-full rounded-xl overflow-hidden mb-4">
                        <EnhancedVideoPlayer
                          videoUrl={topThree[1].videoUrl}
                          caption={topThree[1].caption}
                          votesCount={topThree[1].votesCount}
                          canVote={false}
                          hasVoted={true}
                          autoPlay={false}
                          muted={true}
                        />
                      </div>

                      <p className="text-ash font-semibold mb-2">{topThree[1].caption}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <span className="text-ash font-bold text-xl">{topThree[1].votesCount}</span>
                        <span className="text-steel text-sm">votes</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      className="bg-gradient-to-br from-electric-coral/20 to-digital-grape/20 border-2 border-electric-coral/40 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">🥉</span>
                        <span className="text-xl font-black text-ash">3rd Place</span>
                      </div>

                      <div className="aspect-[9/16] w-full rounded-xl overflow-hidden mb-4">
                        <EnhancedVideoPlayer
                          videoUrl={topThree[2].videoUrl}
                          caption={topThree[2].caption}
                          votesCount={topThree[2].votesCount}
                          canVote={false}
                          hasVoted={true}
                          autoPlay={false}
                          muted={true}
                        />
                      </div>

                      <p className="text-ash font-semibold mb-2">{topThree[2].caption}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <span className="text-ash font-bold text-xl">{topThree[2].votesCount}</span>
                        <span className="text-steel text-sm">votes</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Full Leaderboard */}
              {leaderboard.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-black text-ash mb-4 text-center">
                    📊 Full Rankings
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.slice(3).map((clip, index) => (
                      <div
                        key={clip.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-carbon border border-steel/20"
                      >
                        <span className="text-steel font-bold text-lg w-8">
                          #{index + 4}
                        </span>
                        <div className="flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-nightfall">
                          <video
                            src={clip.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        </div>
                        <p className="flex-1 text-ash font-medium truncate">{clip.caption}</p>
                        <div className="flex items-center gap-2">
                          <span>🔥</span>
                          <span className="text-ash font-bold">{clip.votesCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Steps */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center space-y-4 pt-8"
          >
            <p className="text-steel">
              The Beast Reel will be available tomorrow (Sunday)!
            </p>
            <Link href="/">
              <button className="px-8 py-4 rounded-xl bg-digital-grape text-ash font-bold text-lg hover:scale-105 transition-transform">
                Back to Feed
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
