import { MOCK_BEAST_WEEK } from '@/types';
import { getTimelineSteps } from '@/lib/beastPhases';
import BeastTimeline from '@/components/BeastTimeline';
import Link from 'next/link';

export const metadata = {
  title: 'Beast Challenge Details',
  description: 'Learn about this week\'s Yollr Beast challenge and how to compete.',
};

export default function BeastDetailPage() {
  const beastWeek = MOCK_BEAST_WEEK;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section - Solid Digital Grape background */}
      <div className="relative overflow-hidden bg-digital-grape">
        {/* Content */}
        <div className="relative px-6 pt-8 pb-12 space-y-6">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ash/80 hover:text-ash transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Feed</span>
          </Link>

          {/* Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎬</span>
              <span className="text-xs font-semibold text-ash/70 uppercase tracking-wider">
                Week {beastWeek.weekNumber}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-ash leading-tight">
              {beastWeek.title}
            </h1>
            <p className="text-lg text-ash/90 leading-relaxed">
              {beastWeek.description}
            </p>
          </div>

          {/* Prize Badge - Solid background */}
          <div className="inline-flex items-center gap-3 bg-nightfall/40 border border-ash/20 px-5 py-3 rounded-2xl">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-xs text-ash/70 font-medium">Grand Prize</div>
              <div className="text-xl font-bold text-ash">
                ${beastWeek.prize.amount}
              </div>
            </div>
            {beastWeek.prize.sponsor && (
              <>
                <div className="w-px h-8 bg-ash/20" />
                <div className="text-xs text-ash/70">
                  Sponsored by<br />
                  <span className="text-ash font-semibold">{beastWeek.prize.sponsor}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-carbon border-y border-steel/20">
        <BeastTimeline beastWeek={beastWeek} />
      </div>

      {/* How It Works */}
      <div className="px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold text-ash">
          How it works
        </h2>

        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Record Your Beast Clip',
              description: `Create a ${beastWeek.maxDuration}s video for this week's challenge. Keep it campus-appropriate and original.`,
              day: 'Tue-Wed',
              icon: '🎥',
            },
            {
              step: '2',
              title: 'Campus Votes',
              description: 'Top clips become finalists. Your campus votes to decide who moves forward.',
              day: 'Thu-Fri',
              icon: '🗳️',
            },
            {
              step: '3',
              title: 'Beast Finale Watch Party',
              description: 'Join the live finale Saturday at 6 PM. Final vote determines the winner.',
              day: 'Saturday',
              icon: '🎪',
            },
            {
              step: '4',
              title: 'Winner Crowned',
              description: 'Beast of the Week gets the prize + badge. Runner-ups get recognition.',
              day: 'Saturday',
              icon: '🏆',
            },
          ].map((item) => (
            <div key={item.step} className="card-elevated">
              <div className="flex gap-4">
                {/* Step Number - Solid color */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-digital-grape border-2 border-digital-grape/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-ash">{item.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-ash">
                      {item.title}
                    </h3>
                    <span className="text-xs text-digital-grape font-medium">
                      {item.day}
                    </span>
                  </div>
                  <p className="text-sm text-steel leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Section */}
      <div className="px-6 py-8 space-y-6 bg-carbon">
        <h2 className="text-2xl font-bold text-ash">
          The Rules
        </h2>

        <div className="space-y-3">
          {beastWeek.rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-electric-coral/15 border border-electric-coral/30 flex items-center justify-center mt-0.5">
                <span className="text-xs text-electric-coral font-bold">✓</span>
              </div>
              <p className="text-sm text-steel flex-1">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-nightfall/40 border border-steel/20 p-4 rounded-2xl">
          <p className="text-xs text-steel leading-relaxed">
            <span className="font-semibold text-ash">Important:</span> Submissions must follow campus community guidelines. Inappropriate content will be removed and may result in account suspension.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-carbon/95 backdrop-blur-sm border-t border-steel/20 safe-bottom">
        <div className="max-w-2xl mx-auto space-y-3">
          <Link href="/" className="block">
            <button className="btn-primary w-full">
              Got it — Remind me when submissions open
            </button>
          </Link>
          <Link href="/" className="block">
            <button className="btn-secondary w-full">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
