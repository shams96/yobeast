'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useCurrentBeastWeek } from '@/lib/hooks/useCurrentBeastWeek';
import { SignInButton } from '@clerk/nextjs';

export default function Header() {
  const { user, loading: userLoading, isSignedIn } = useCurrentUser();
  const { beastWeek, loading: beastWeekLoading } = useCurrentBeastWeek();

  // Calculate Beast Week number based on campus launch date
  const campusLaunchDate = new Date('2024-11-25'); // Monday Nov 25, 2024
  const today = new Date();
  const weeksSinceLaunch = Math.floor((today.getTime() - campusLaunchDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const currentWeekNumber = beastWeek?.weekNumber || Math.max(1, weeksSinceLaunch);

  return (
    <header className="sticky top-0 z-50 glass border-b border-dark-border safe-top" role="banner">
      <nav className="flex items-center justify-between px-4 py-3" aria-label="Main navigation">
        {/* Logo - Clickable */}
        <Link href="/" className="flex items-center gap-2" aria-label="Yollr Beast home">
          <div className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-gradient">Yollr</span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-brand-mocha bg-dark-elevated px-2 py-1 rounded-full"
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
                className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-fire to-brand-pink hover:shadow-glow active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent-fire text-sm font-semibold text-white"
              >
                Sign In
              </button>
            </SignInButton>
          ) : userLoading || !user ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 bg-dark-elevated animate-pulse rounded-full" />
              <div className="w-9 h-9 bg-dark-elevated animate-pulse rounded-full" />
            </div>
          ) : (
            <>
              {/* Create Moment Button */}
              <Link href="/moment/new">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-fire to-brand-pink hover:shadow-glow active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent-fire"
                  aria-label="Create moment"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-semibold text-white">
                    Create
                  </span>
                </button>
              </Link>

              {/* Points Display */}
              <div
                className="flex items-center gap-2 glass-elevated px-3 py-1.5 rounded-full"
                role="status"
                aria-label={`${user.points.toLocaleString()} points earned`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-gold to-brand-mocha flex items-center justify-center">
                  <span className="text-xs font-bold" aria-hidden="true">⚡</span>
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  {user.points.toLocaleString()}
                </span>
              </div>

              {/* Beast Tokens (if any) */}
              {user.beastTokens > 0 && (
                <div
                  className="hidden sm:flex items-center gap-1.5 glass-elevated px-3 py-1.5 rounded-full"
                  role="status"
                  aria-label={`${user.beastTokens} Beast tokens`}
                >
                  <span className="text-sm" aria-hidden="true">🎟️</span>
                  <span className="text-xs font-semibold text-brand-mocha">
                    {user.beastTokens}
                  </span>
                </div>
              )}

              {/* User Avatar */}
              <Link href="/profile">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-white font-semibold text-sm ring-2 ring-dark-border hover:ring-brand-mocha transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-fire overflow-hidden"
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
