'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import ClientProviders from '@/components/ClientProviders';

/**
 * ClientLayout - Global App Layout
 *
 * IMPORTANT: This component renders the Header on EVERY page.
 *
 * When creating new pages:
 * ✅ DO: Design pages to work WITH the header (use min-h-[calc(100vh-4rem)] to account for header height)
 * ❌ DON'T: Create standalone full-screen pages with their own headers (will conflict with global Header)
 *
 * The Header provides:
 * - Logo and Beast Week badge
 * - Sign In button (for unauthenticated users)
 * - Create button, points, and avatar (for authenticated users)
 *
 * All page content will render BELOW the header in the <main> section.
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
      <div className="flex flex-col min-h-screen max-w-screen-xl mx-auto">
        {/* Global Header - Always visible on all pages */}
        <Header />
        <main className="flex-1 pb-safe-bottom" role="main">
          {children}
        </main>
      </div>
    </ClientProviders>
  );
}
