/**
 * Sentry Server Configuration
 * Captures errors and performance metrics from the server
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Set your Sentry DSN here (from Sentry dashboard)
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV,

  // Sampling rates
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // Server-specific integrations
  integrations: [
    Sentry.httpIntegration(),
  ],

  // Filter out sensitive information
  beforeSend(event, hint) {
    // Don't send events if no DSN configured
    if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter sensitive data from request
    if (event.request) {
      // Remove cookies
      delete event.request.cookies;

      // Remove auth headers
      if (event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }

      // Remove query parameters that might contain sensitive data
      if (event.request.query_string && typeof event.request.query_string === 'string') {
        event.request.query_string = event.request.query_string.replace(
          /([?&])(token|key|secret|password)=[^&]*/gi,
          '$1$2=***'
        );
      }
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
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
  ],
});
