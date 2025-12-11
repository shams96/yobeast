'use client';

import { MOCK_FINALISTS } from '@/lib/mockBeastClips';
import { MOCK_BEAST_WEEK } from '@/types';
import { MOCK_MOMENTS } from '@/lib/mockData';
import Link from 'next/link';

export default function BeastReelPage() {
  const beastWeek = MOCK_BEAST_WEEK;
  const winnerClip = MOCK_FINALISTS[0];
  const finalistClips = MOCK_FINALISTS.slice(1);
  const beastMoments = MOCK_MOMENTS.filter(m => m.isBeastMoment);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-dark-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <h1 className="text-lg font-bold text-text-primary">
            Beast Reel
          </h1>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Beast Week ${beastWeek.weekNumber} Reel`,
                  text: 'Check out this week\'s Beast Reel!',
                  url: window.location.href,
                });
              }
            }}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Reel Info */}
        <div className="px-4 pb-3 space-y-1">
          <h2 className="text-2xl font-bold text-text-primary">
            {beastWeek.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span>Week {beastWeek.weekNumber}</span>
            <span>•</span>
            <span>{MOCK_FINALISTS.length + beastMoments.length} clips</span>
            <span>•</span>
            <span>Best of the week</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 pt-6">
        {/* Winner Section */}
        <div className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-bold text-text-primary">
              Beast of the Week
            </h3>
          </div>

          <div className="card-elevated">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-4">
              <img
                src={winnerClip.thumbnailUrl}
                alt={winnerClip.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold to-accent-fire flex items-center justify-center text-white font-bold">
                {winnerClip.user?.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-text-primary">
                  {winnerClip.user?.name}
                </p>
                <p className="text-sm text-text-tertiary">
                  {winnerClip.user?.year}
                </p>
              </div>
              <div className="bg-accent-gold/20 px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold text-accent-gold">
                  Winner
                </span>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              {winnerClip.caption}
            </p>

            <div className="flex items-center gap-4 text-sm text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <span>🔥</span>
                <span>{winnerClip.reactionsCount}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>🗳️</span>
                <span>{winnerClip.votesCount} votes</span>
              </span>
            </div>
          </div>
        </div>

        {/* Finalists Section */}
        <div className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-bold text-text-primary">
              Top Finalists
            </h3>
          </div>

          <div className="space-y-3">
            {finalistClips.map((clip, index) => (
              <div key={clip.id} className="card">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-dark-surface">
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-white text-xs font-bold">
                          {clip.user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {clip.user?.name}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            Finalist #{index + 2}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary line-clamp-2">
                      {clip.caption}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>🔥 {clip.reactionsCount}</span>
                      <span>🗳️ {clip.votesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beast Moments Section */}
        {beastMoments.length > 0 && (
          <div className="px-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-bold text-text-primary">
                Beast Moments
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {beastMoments.map((moment) => (
                <div
                  key={moment.id}
                  className="aspect-square rounded-xl overflow-hidden bg-dark-surface"
                >
                  <img
                    src={moment.imageUrl}
                    alt={moment.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* End Section */}
        <div className="px-4 pb-8">
          <div className="glass-elevated p-6 rounded-2xl text-center space-y-3">
            <div className="text-4xl">🎬</div>
            <p className="text-text-primary font-semibold">
              That's a wrap for Week {beastWeek.weekNumber}!
            </p>
            <p className="text-sm text-text-secondary">
              New Beast challenge drops Monday at 9 AM
            </p>

            <div className="pt-4">
              <Link href="/" className="block">
                <button className="btn-primary w-full">
                  Back to Feed
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
