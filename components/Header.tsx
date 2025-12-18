'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useCurrentBeastWeek } from '@/lib/hooks/useCurrentBeastWeek';
import { SignInButton } from '@clerk/nextjs';

export default function Header() {
  const { user, loading: userLoading, isSignedIn } = useCurrentUser();
  const { beastWeek } = useCurrentBeastWeek();

  // Use beast week number from data (defaults to 1 for UAT mode)
  const currentWeekNumber = beastWeek?.weekNumber || 1;

  return (
    <header className="sticky top-0 z-50 bg-carbon/95 backdrop-blur-sm border-b border-steel/20 safe-top" role="banner">
      <nav className="flex items-center justify-between px-4 py-3" aria-label="Main navigation">
        {/* Logo - Clickable */}
        <Link href="/" className="flex items-center gap-2" aria-label="Yollr Beast home">
          <div className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-ash">Yollr</span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-digital-grape bg-carbon px-2.5 py-1 rounded-full border border-digital-grape/30"
            aria-label={`Current Beast Week ${currentWeekNumber}`}
          >
            <span aria-hidden="true">🔥</span>
            <span>Beast Week {currentWeekNumber}</span>
          </div>
        </Link>

        {/* Right Section: Create + Points + Avatar OR Sign In */}
        <div className="flex items-center gap-3" role="toolbar" aria-label="User actions">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-future-dusk hover:bg-future-dusk/90 border border-future-dusk/30 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-future-dusk text-sm font-semibold text-ash shadow-button"
              >
                Sign In
              </button>
            </SignInButton>
          ) : userLoading || !user ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 bg-carbon animate-pulse rounded-full" />
              <div className="w-9 h-9 bg-carbon animate-pulse rounded-full" />
            </div>
          ) : (
            <>
              {/* Create Moment Button */}
              <Link href="/moment/new">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-electric-coral hover:bg-electric-coral/90 border border-electric-coral/30 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-electric-coral shadow-button"
                  aria-label="Create moment"
                >
                  <svg className="w-5 h-5 text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-semibold text-ash">
                    Create
                  </span>
                </button>
              </Link>

              {/* Points Display */}
              <div
                className="flex items-center gap-2 bg-carbon px-3 py-1.5 rounded-full border border-steel/30"
                role="status"
                aria-label={`${user.points.toLocaleString()} points earned`}
              >
                <div className="w-6 h-6 rounded-full bg-signal-lime flex items-center justify-center border border-signal-lime/30">
                  <span className="text-xs font-bold text-nightfall" aria-hidden="true">⚡</span>
                </div>
                <span className="text-sm font-semibold text-ash">
                  {user.points.toLocaleString()}
                </span>
              </div>

              {/* Beast Tokens (if any) */}
              {user.beastTokens > 0 && (
                <div
                  className="hidden sm:flex items-center gap-1.5 bg-carbon px-3 py-1.5 rounded-full border border-digital-grape/30"
                  role="status"
                  aria-label={`${user.beastTokens} Beast tokens`}
                >
                  <span className="text-sm" aria-hidden="true">🎟️</span>
                  <span className="text-xs font-semibold text-digital-grape">
                    {user.beastTokens}
                  </span>
                </div>
              )}

              {/* User Avatar */}
              <Link href="/profile">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-digital-grape flex items-center justify-center text-ash font-semibold text-sm border-2 border-digital-grape/30 hover:border-ash/50 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-future-dusk overflow-hidden"
                  aria-label={`${user.name} profile menu`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
