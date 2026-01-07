/**
 * Sentry Edge Runtime Configuration
 * Captures errors from Edge Runtime (middleware, edge API routes)
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Set your Sentry DSN here (from Sentry dashboard)
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV,

  // Sampling rates
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // Filter out sensitive information
  beforeSend(event, hint) {
    // Don't send events if no DSN configured
    if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }
    }

    return event;
  },
});
