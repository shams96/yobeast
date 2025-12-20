'use client';

import { useState } from 'react';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import EnhancedVideoPlayer from '@/components/EnhancedVideoPlayer';

export default function BeastReelPage() {
  const {
    currentWeek,
    currentPhase,
    beastReel,
    winner,
  } = useBeastWeekCycle();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Only accessible during COOLDOWN_REEL phase
  if (currentPhase !== 'COOLDOWN_REEL') {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">🎞️</div>
          <h1 className="text-2xl font-black text-ash">Beast Reel Not Ready</h1>
          <p className="text-steel">
            The Beast Reel will be available on Sunday after the finale!
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

  // No reel content yet
  if (beastReel.length === 0) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">📹</div>
          <h1 className="text-2xl font-black text-ash">No Reel Available</h1>
          <p className="text-steel">
            No submissions were made this week. Check back next week!
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

  const currentClip = beastReel[currentIndex];

  const handleNext = () => {
    if (currentIndex < beastReel.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(beastReel.length - 1); // Loop to end
    }
  };

  return (
    <div className="relative h-screen w-full bg-nightfall overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-nightfall/90 to-transparent px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-ash hover:text-steel transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-black text-ash">🎞️ Beast Reel</h1>
            <p className="text-xs text-steel">Week {currentWeek?.weekNumber} Highlights</p>
          </div>
          <div className="w-6" />
        </div>
      </div>

      {/* Winner Badge */}
      {winner && currentClip.id === winner.id && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-4 py-2 rounded-full bg-signal-lime text-nightfall font-black text-sm shadow-lg flex items-center gap-2"
          >
            <span>👑</span>
            <span>BEAST OF THE WEEK</span>
          </motion.div>
        </div>
      )}

      {/* Video Player */}
      <div className="relative h-full w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentClip.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Enhanced Video Player */}
            <div className="relative w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
              <EnhancedVideoPlayer
                videoUrl={currentClip.videoUrl}
                caption={`${
                  currentIndex === 0 ? '🥇 ' :
                  currentIndex === 1 ? '🥈 ' :
                  currentIndex === 2 ? '🥉 ' :
                  `#${currentIndex + 1} `
                }${currentClip.caption} • ${currentIndex + 1}/${beastReel.length}`}
                votesCount={currentClip.votesCount}
                canVote={false}
                hasVoted={true}
                autoPlay={isPlaying}
                muted={false}
                className="h-full"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="pointer-events-auto w-12 h-12 rounded-full bg-nightfall/80 backdrop-blur-sm border border-steel/20 flex items-center justify-center text-ash hover:bg-nightfall transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="pointer-events-auto w-12 h-12 rounded-full bg-nightfall/80 backdrop-blur-sm border border-steel/20 flex items-center justify-center text-ash hover:bg-nightfall transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </motion.button>
        </div>

        {/* Bottom Info Panel */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-nightfall/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-steel/20">
            <p className="text-steel text-xs font-semibold">
              {currentIndex + 1} / {beastReel.length}
            </p>
          </div>
        </div>
      </div>

      {/* Week Summary Card - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40 rounded-2xl p-4 backdrop-blur-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-steel font-semibold mb-1">This Week&apos;s Challenge</p>
              <p className="text-ash font-bold">{currentWeek?.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-steel font-semibold mb-1">Prize Pool</p>
              <p className="text-signal-lime font-bold">{currentWeek?.prize.displayString}</p>
            </div>
          </div>

          {winner && (
            <div className="mt-3 pt-3 border-t border-steel/20">
              <p className="text-xs text-steel mb-1">👑 Beast of the Week</p>
              <p className="text-ash font-semibold text-sm truncate">{winner.caption}</p>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Link href="/beast" className="flex-1">
              <button className="w-full px-4 py-2 rounded-xl bg-carbon border border-steel/20 text-ash font-semibold text-sm hover:border-ash transition-colors">
                View Challenge
              </button>
            </Link>
            <Link href="/" className="flex-1">
              <button className="w-full px-4 py-2 rounded-xl bg-digital-grape text-ash font-semibold text-sm hover:scale-105 transition-transform">
                Back to Feed
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
