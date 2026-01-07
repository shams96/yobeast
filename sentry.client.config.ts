/**
 * Sentry Client Configuration
 * Captures errors and performance metrics from the browser
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Set your Sentry DSN here (from Sentry dashboard)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV,

  // Sampling rates
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Enable Session Replay for debugging
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out sensitive information
  beforeSend(event, hint) {
    // Don't send events if no DSN configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter out localStorage/sessionStorage data
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(
        (breadcrumb) => breadcrumb.category !== 'console'
      );
    }

    // Sanitize user data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }

    return event;
  },

  // Ignore common non-critical errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension',
    'moz-extension',
    // Network errors
    'NetworkError',
    'Failed to fetch',
    // User aborted requests
    'AbortError',
    'The user aborted a request',
  ],

  // Configure allowed URLs (only send errors from your domain)
  allowUrls: [
    /https?:\/\/(.+\.)?yollr\.com/,
    /https?:\/\/(.+\.)?vercel\.app/,
    /localhost/,
  ],
});
