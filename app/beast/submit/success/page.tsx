'use client';

import Link from 'next/link';

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Confetti Animation */}
        <div className="relative">
          <div className="text-8xl animate-scale-in">
            🎉
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-accent-fire to-brand-purple animate-confetti"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 30}%`,
                  top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 30}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-text-primary">
            You're in this week's Beast!
          </h1>
          <p className="text-lg text-brand-mocha font-semibold">
            Yo'll r Beast.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Your clip has been submitted. Finalists will be announced Thursday. Good luck!
          </p>
        </div>

        {/* Reward Badge */}
        <div className="card-elevated inline-flex items-center gap-3 px-6 py-4">
          <span className="text-3xl">⚡</span>
          <div className="text-left">
            <p className="text-xs text-text-tertiary">You earned</p>
            <p className="text-xl font-bold text-accent-gold">+50 Points</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="glass-elevated p-6 rounded-2xl space-y-4 text-left">
          <h2 className="text-sm font-semibold text-text-primary">
            What happens next?
          </h2>
          <div className="space-y-3">
            {[
              { day: 'Thu-Fri', text: 'Voting opens for finalists' },
              { day: 'Saturday', text: 'Beast Finale at 6 PM' },
              { day: 'Sunday', text: 'Beast Reel goes live' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-mocha/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs text-brand-mocha font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-tertiary">{item.day}</p>
                  <p className="text-sm text-text-primary">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-4">
          <Link href="/" className="block">
            <button className="btn-primary w-full">
              Back to Feed
            </button>
          </Link>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'I just submitted to Yollr Beast!',
                  text: "I'm competing in this week's Beast Challenge. Wish me luck! 🔥",
                  url: window.location.origin,
                });
              }
            }}
            className="btn-secondary w-full"
          >
            Share with Friends
          </button>
        </div>
      </div>
    </div>
  );
}
