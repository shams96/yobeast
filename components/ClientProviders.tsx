'use client';

import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './ErrorBoundary';
import FeedbackWidget from './FeedbackWidget';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <FeedbackWidget />
      <Analytics />
    </ErrorBoundary>
  );
}

export default ClientProviders;
