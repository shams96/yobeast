'use client';

import { useState, useEffect } from 'react';
import { MOCK_FINALISTS } from '@/lib/mockBeastClips';
import { MOCK_BEAST_WEEK } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FinaleState = 'LOBBY' | 'LIVE_VOTE' | 'REVEAL';

export default function BeastFinalePage() {
  const [finaleState, setFinaleState] = useState<FinaleState>('LOBBY');
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [votedClipId, setVotedClipId] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(312);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [confettiActive, setConfettiActive] = useState(false);

  const router = useRouter();
  const beastWeek = MOCK_BEAST_WEEK;
  const finalists = MOCK_FINALISTS.slice(0, 3); // Top 3 for finale
  const currentClip = finalists[currentClipIndex];
  const winnerClip = finalists[0]; // For demo, first is winner

  // Simulate countdown
  useEffect(() => {
    if (finaleState === 'LIVE_VOTE' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setFinaleState('REVEAL');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [finaleState, timeRemaining]);

  // Simulate online count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartFinale = () => {
    setFinaleState('LIVE_VOTE');
  };

  const handleVote = (clipId: string) => {
    if (votedClipId) return;
    setVotedClipId(clipId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // LOBBY STATE
  if (finaleState === 'LOBBY') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-future-dusk">
        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          {/* Logo/Icon */}
          <div className="text-8xl mb-6 animate-scale-in">
            🎪
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3">
            Beast Finale
          </h1>
          <p className="text-lg text-white/80 mb-8">
            {beastWeek.title}
          </p>

          {/* Countdown Card */}
          <div className="bg-carbon border-2 border-future-dusk/30 shadow-elevated p-8 rounded-3xl mb-8 max-w-sm w-full">
            <p className="text-sm text-white/70 mb-2">
              Final round starts in
            </p>
            <div className="text-5xl font-bold text-white mb-4">
              03:24
            </div>
            <p className="text-xs text-white/60">
              Get ready to vote for the winner!
            </p>
          </div>

          {/* Online Count */}
          <div className="bg-carbon border-2 border-future-dusk/30 shadow-elevated px-6 py-3 rounded-full flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-signal-lime animate-pulse" />
            <span className="text-white font-semibold">
              {onlineCount} students online
            </span>
          </div>

          {/* Top 3 Finalists Preview */}
          <div className="mb-8">
            <p className="text-sm text-white/70 mb-4">
              Tonight's Finalists
            </p>
            <div className="flex gap-4 justify-center">
              {finalists.map((clip, index) => (
                <div key={clip.id} className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-white/30">
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-white/80 font-medium">
                    {clip.user?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStartFinale}
            className="btn-primary px-8 py-4 text-lg"
          >
            Enter Finale (Demo)
          </button>

          {/* Invite Friends */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Beast Finale is Live!',
                  text: 'Join the Beast Finale watch party now!',
                  url: window.location.href,
                });
              }
            }}
            className="mt-4 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Invite Friends →
          </button>

          {/* Close */}
          <Link
            href="/"
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-carbon/90 border-2 border-ash/30 shadow-elevated flex items-center justify-center text-white safe-top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // LIVE VOTE STATE
  if (finaleState === 'LIVE_VOTE') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 safe-top p-4 space-y-3">
          {/* Timer & Online */}
          <div className="flex items-center justify-between">
            <div className="bg-carbon/90 border-2 border-ash/30 shadow-elevated px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric-coral animate-pulse" />
              <span className="text-sm font-bold text-white">
                LIVE
              </span>
            </div>

            <div className="bg-carbon/90 border-2 border-ash/30 shadow-elevated px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-white">
                ⏱️ {formatTime(timeRemaining)}
              </span>
            </div>

            <div className="bg-carbon/90 border-2 border-ash/30 shadow-elevated px-4 py-2 rounded-full">
              <span className="text-xs text-white/80">
                👥 {onlineCount}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-1.5">
            {finalists.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-12 rounded-full ${
                  index === currentClipIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Clip Display */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden shadow-elevated">
            <img
              src={currentClip.thumbnailUrl}
              alt={currentClip.caption}
              className="w-full h-full object-cover"
            />

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-carbon/90">
              <p className="text-white font-semibold mb-1">
                {currentClip.user?.name}
              </p>
              <p className="text-white/80 text-sm">
                {currentClip.caption}
              </p>
            </div>
          </div>

          {/* Navigation */}
          {currentClipIndex > 0 && (
            <button
              onClick={() => setCurrentClipIndex(currentClipIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-carbon/90 border-2 border-ash/30 shadow-elevated flex items-center justify-center text-white"
            >
              ←
            </button>
          )}
          {currentClipIndex < finalists.length - 1 && (
            <button
              onClick={() => setCurrentClipIndex(currentClipIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-carbon/90 border-2 border-ash/30 shadow-elevated flex items-center justify-center text-white"
            >
              →
            </button>
          )}
        </div>

        {/* Vote Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 safe-bottom">
          <div className="max-w-md mx-auto">
            {votedClipId ? (
              <div className="bg-carbon/90 border-2 border-ash/30 shadow-elevated p-6 rounded-2xl text-center">
                <p className="text-white font-semibold">
                  {votedClipId === currentClip.id ? '✓ Your Vote' : 'You Voted'}
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Results after timer ends...
                </p>
              </div>
            ) : (
              <button
                onClick={() => handleVote(currentClip.id)}
                className="btn-primary w-full text-lg py-4"
              >
                🔥 Vote for {currentClip.user?.name}
              </button>
            )}
          </div>
        </div>

        {/* Floating Reactions (decorative) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-confetti"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '4s',
              }}
            >
              {['🔥', '😂', '💯', '👏', '❤️'][i]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // REVEAL STATE
  return (
    <div className="min-h-screen relative overflow-hidden bg-signal-lime">

      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-accent-gold animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center">
        {/* Trophy Icon */}
        <div className="text-8xl mb-6 animate-scale-in">
          🏆
        </div>

        {/* Winner Announcement */}
        <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
          Yo'll r Beast
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Champion of Week {beastWeek.weekNumber}
        </p>

        {/* Winner Card */}
        <div className="bg-carbon border-2 border-signal-lime/30 shadow-elevated p-8 rounded-3xl mb-8 max-w-sm w-full animate-scale-in">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-nightfall">
            <img
              src={winnerClip.thumbnailUrl}
              alt={winnerClip.user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {winnerClip.user?.name}
          </h2>
          <p className="text-white/70 text-sm mb-4">
            "{winnerClip.caption}"
          </p>
          <div className="inline-flex items-center gap-2 bg-nightfall/20 px-4 py-2 rounded-full border border-nightfall/30">
            <span className="text-2xl">💰</span>
            <span className="text-nightfall font-bold">
              ${beastWeek.prize.amount} Winner
            </span>
          </div>
        </div>

        {/* Runners Up */}
        <div className="mb-8">
          <p className="text-sm text-white/70 mb-4">
            Runners Up
          </p>
          <div className="flex gap-4 justify-center">
            {finalists.slice(1).map((clip) => (
              <div key={clip.id} className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-white/30">
                  <img
                    src={clip.thumbnailUrl}
                    alt={clip.user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-white/80">
                  {clip.user?.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 w-full max-w-sm">
          <Link href="/beast/reel" className="block">
            <button className="btn-primary w-full">
              Watch Full Beast Reel
            </button>
          </Link>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${winnerClip.user?.name} won Beast Week ${beastWeek.weekNumber}!`,
                  text: 'Check out this week\'s Beast winner!',
                  url: window.location.origin,
                });
              }
            }}
            className="btn-secondary w-full"
          >
            Share Results
          </button>

          <Link href="/" className="block">
            <button className="btn-ghost w-full">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
