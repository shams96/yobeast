'use client';

import { useState, useEffect } from 'react';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import EnhancedVideoPlayer from '@/components/EnhancedVideoPlayer';

export default function BeastVotePage() {
  const {
    currentWeek,
    currentPhase,
    submissions,
    leaderboard,
    hasVoted,
    voteForClip,
    canVote,
  } = useBeastWeekCycle();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [votedClipId, setVotedClipId] = useState<string | null>(null);

  const currentClip = submissions[currentIndex];

  // Phase validation - only accessible during VOTING_OPEN or FINALE_DAY
  if (!['VOTING_OPEN', 'FINALE_DAY'].includes(currentPhase)) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-black text-ash">Voting Not Open</h1>
          <p className="text-steel">
            {currentPhase === 'SUBMISSIONS_OPEN'
              ? 'Voting opens Thursday!'
              : 'Check back during voting phase (Thursday-Saturday).'}
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

  // No submissions yet
  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">📹</div>
          <h1 className="text-2xl font-black text-ash">No Submissions Yet</h1>
          <p className="text-steel">Check back later for videos to vote on!</p>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl bg-digital-grape text-ash font-bold hover:scale-105 transition-transform">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleVote = (clipId: string) => {
    if (!canVote) {
      alert('You have already voted this week!');
      return;
    }
    voteForClip(clipId);
    setVotedClipId(clipId);
  };

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
          <h1 className="text-lg font-black text-ash">Vote for Beast</h1>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-3 py-1.5 rounded-lg bg-digital-grape/30 text-ash text-sm font-bold hover:bg-digital-grape/50 transition-colors"
          >
            {showLeaderboard ? 'Videos' : 'Leaderboard'}
          </button>
        </div>
      </div>

      {/* Main Content - Video Player or Leaderboard */}
      <AnimatePresence mode="wait">
        {!showLeaderboard ? (
          <motion.div
            key="video-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            {/* Video Container */}
            <div className="relative h-full w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentClip.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (offset.y > 100 || velocity.y > 500) {
                      handleSwipe('down');
                    } else if (offset.y < -100 || velocity.y < -500) {
                      handleSwipe('up');
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Enhanced Video Player with double-tap to vote */}
                  <div className="relative w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden">
                    <EnhancedVideoPlayer
                      videoUrl={currentClip.videoUrl}
                      caption={`${currentClip.caption} • ${currentIndex + 1}/${submissions.length}`}
                      votesCount={currentClip.votesCount}
                      onVote={() => handleVote(currentClip.id)}
                      canVote={canVote && !hasVoted && votedClipId !== currentClip.id}
                      hasVoted={hasVoted || votedClipId === currentClip.id}
                      autoPlay={true}
                      muted={false}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Vote Button - Right Side */}
              <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote(currentClip.id)}
                  disabled={hasVoted || votedClipId === currentClip.id}
                  className={`relative flex flex-col items-center gap-2 ${
                    hasVoted || votedClipId === currentClip.id
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                      votedClipId === currentClip.id
                        ? 'bg-signal-lime text-nightfall'
                        : 'bg-gradient-to-br from-electric-coral to-signal-lime text-nightfall'
                    }`}
                  >
                    {votedClipId === currentClip.id ? '✓' : '👍'}
                  </div>
                  <span className="text-xs font-bold text-ash">
                    {votedClipId === currentClip.id ? 'Voted!' : 'Vote'}
                  </span>
                </motion.button>

                {/* Swipe Indicators */}
                <div className="flex flex-col gap-3 opacity-50">
                  {currentIndex > 0 && (
                    <button
                      onClick={() => handleSwipe('down')}
                      className="text-ash"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>
                  )}
                  {currentIndex < submissions.length - 1 && (
                    <button
                      onClick={() => handleSwipe('up')}
                      className="text-ash"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full overflow-y-auto pt-20 pb-10 px-4"
          >
            {/* Leaderboard */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-ash mb-2">🏆 Leaderboard</h2>
                <p className="text-steel text-sm">
                  {currentWeek?.title || 'Current Week Rankings'}
                </p>
              </div>

              {leaderboard.map((clip, index) => (
                <motion.div
                  key={clip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${
                    index === 0
                      ? 'bg-gradient-to-r from-signal-lime/20 to-electric-coral/20 border-2 border-signal-lime/40'
                      : index === 1
                      ? 'bg-gradient-to-r from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40'
                      : index === 2
                      ? 'bg-gradient-to-r from-electric-coral/20 to-digital-grape/20 border border-electric-coral/40'
                      : 'bg-carbon border border-steel/20'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-nightfall flex items-center justify-center">
                    {index === 0 ? (
                      <span className="text-2xl">🥇</span>
                    ) : index === 1 ? (
                      <span className="text-2xl">🥈</span>
                    ) : index === 2 ? (
                      <span className="text-2xl">🥉</span>
                    ) : (
                      <span className="text-lg font-black text-steel">#{index + 1}</span>
                    )}
                  </div>

                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-nightfall">
                    <video
                      src={clip.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-ash font-semibold truncate">{clip.caption}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">🔥</span>
                      <span className="text-ash font-bold">{clip.votesCount}</span>
                      <span className="text-steel text-sm">votes</span>
                    </div>
                  </div>

                  {/* Vote Button */}
                  {!hasVoted && votedClipId !== clip.id && (
                    <button
                      onClick={() => handleVote(clip.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-sm hover:scale-105 transition-transform"
                    >
                      Vote
                    </button>
                  )}
                  {votedClipId === clip.id && (
                    <div className="px-4 py-2 rounded-xl bg-signal-lime/20 border border-signal-lime text-signal-lime font-bold text-sm">
                      ✓ Voted
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voting Status Badge */}
      {hasVoted && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-full bg-signal-lime text-nightfall font-bold text-sm shadow-lg"
          >
            ✅ You&apos;ve voted this week!
          </motion.div>
        </div>
      )}
    </div>
  );
}
