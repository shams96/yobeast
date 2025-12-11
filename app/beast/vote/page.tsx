'use client';

import { useState } from 'react';
import { MOCK_FINALISTS } from '@/lib/mockBeastClips';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BeastVotePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedClipId, setVotedClipId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const router = useRouter();
  const finalists = MOCK_FINALISTS;
  const currentClip = finalists[currentIndex];
  const hasVoted = votedClipId !== null;

  const handleVote = (clipId: string) => {
    if (hasVoted) return;

    setVotedClipId(clipId);

    // In production, submit vote to backend
    console.log('Vote submitted for clip:', clipId);

    // Show success message
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const goToNext = () => {
    if (currentIndex < finalists.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 safe-top">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full glass-elevated flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          {/* Progress Indicator */}
          <div className="glass-elevated px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-white">
              Finalist {currentIndex + 1} / {finalists.length}
            </span>
          </div>

          <div className="w-10" />
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 px-4 pb-2">
          {finalists.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : index < currentIndex
                  ? 'w-4 bg-white/60'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Video Carousel */}
      <div
        className="flex-1 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Thumbnail */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30"
          style={{ backgroundImage: `url(${currentClip.thumbnailUrl})` }}
        />

        {/* Video Content */}
        <div className="relative h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden shadow-elevated">
            {/* For MVP: Show thumbnail, in production would be video */}
            <img
              src={currentClip.thumbnailUrl}
              alt={currentClip.caption}
              className="w-full h-full object-cover"
            />

            {/* Clip Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-white font-semibold">
                  {currentClip.user?.name.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {currentClip.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-white/70">
                    {currentClip.user?.year || 'Student'}
                  </p>
                </div>
                {currentClip.isBoosted && (
                  <div className="ml-auto bg-accent-gold/20 px-2 py-1 rounded-full">
                    <span className="text-xs font-semibold text-accent-gold">
                      ⚡ Boosted
                    </span>
                  </div>
                )}
              </div>

              {/* Caption */}
              <p className="text-white text-sm leading-relaxed mb-4">
                {currentClip.caption}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-white/70 mb-4">
                <span>🔥 {currentClip.reactionsCount}</span>
                <span>•</span>
                <span>{currentClip.duration}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-elevated flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {currentIndex < finalists.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-elevated flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Vote Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 safe-bottom">
        <div className="max-w-md mx-auto">
          {hasVoted ? (
            <div className="space-y-4">
              {votedClipId === currentClip.id ? (
                <div className="bg-accent-fire/20 backdrop-blur-lg border border-accent-fire/30 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-white font-semibold mb-1">
                    You voted for this Beast!
                  </p>
                  <p className="text-white/70 text-sm">
                    Returning to feed...
                  </p>
                </div>
              ) : (
                <div className="glass-elevated rounded-2xl p-4 text-center">
                  <p className="text-white/80 text-sm">
                    ✓ You've already voted this week
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleVote(currentClip.id)}
              className="
                w-full bg-gradient-to-r from-accent-fire to-brand-pink
                text-white font-bold text-lg
                px-8 py-4 rounded-2xl
                shadow-glow
                active:scale-95 transition-transform duration-150
                hover:shadow-elevated
              "
            >
              🔥 Vote for this Beast
            </button>
          )}

          <p className="text-center text-white/60 text-xs mt-4">
            {hasVoted
              ? 'One vote per week. Choose wisely!'
              : 'You can only vote once per week'}
          </p>
        </div>
      </div>
    </div>
  );
}
