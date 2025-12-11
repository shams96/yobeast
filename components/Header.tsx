'use client';

import { MOCK_CURRENT_USER } from '@/types';
import Link from 'next/link';

export default function Header() {
  const user = MOCK_CURRENT_USER;

  // Calculate Beast Week number based on campus launch date
  const campusLaunchDate = new Date('2024-11-25'); // Monday Nov 25, 2024
  const today = new Date();
  const weeksSinceLaunch = Math.floor((today.getTime() - campusLaunchDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const currentWeekNumber = Math.max(1, weeksSinceLaunch);

  return (
    <header className="sticky top-0 z-50 glass border-b border-dark-border safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo - Clickable */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-gradient">Yollr</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-brand-mocha bg-dark-elevated px-2 py-1 rounded-full">
            <span>🔥</span>
            <span>Beast Week {currentWeekNumber}</span>
          </div>
        </Link>

        {/* Right Section: Create + Points + Avatar */}
        <div className="flex items-center gap-3">
          {/* Create Moment Button */}
          <Link href="/moment/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-fire to-brand-pink hover:shadow-glow active:scale-95 transition-all"
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
          <div className="flex items-center gap-2 glass-elevated px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-gold to-brand-mocha flex items-center justify-center">
              <span className="text-xs font-bold">⚡</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {user.points.toLocaleString()}
            </span>
          </div>

          {/* Beast Tokens (if any) */}
          {user.beastTokens > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 glass-elevated px-3 py-1.5 rounded-full">
              <span className="text-sm">🎟️</span>
              <span className="text-xs font-semibold text-brand-mocha">
                {user.beastTokens}
              </span>
            </div>
          )}

          {/* User Avatar */}
          <button
            className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-white font-semibold text-sm ring-2 ring-dark-border hover:ring-brand-mocha transition-all active:scale-95"
            aria-label="User profile"
          >
            {user.name.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
}
