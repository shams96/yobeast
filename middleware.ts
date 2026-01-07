import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Demo mode - no authentication middleware required
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers (Critical for production)
  const headers = response.headers;

  // Content Security Policy - Prevents XSS attacks
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' data: blob: https: http:",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://challenges.cloudflare.com",
      "frame-src 'self' https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );

  // X-Frame-Options - Prevents clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options - Prevents MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection - Enables XSS filter in older browsers
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy - Controls referrer information
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy - Controls browser features
  headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(self), geolocation=(), interest-cohort=()'
  );

  // Strict-Transport-Security - Enforces HTTPS (only in production)
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
