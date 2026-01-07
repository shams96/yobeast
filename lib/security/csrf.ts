/**
 * CSRF Protection Utilities
 * Prevents Cross-Site Request Forgery attacks
 */

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js environment
    const crypto = require('crypto');
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session storage
 */
export function setCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf_token', token);
  }
}

/**
 * Get CSRF token from session storage
 */
export function getCSRFToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf_token');
  }
  return null;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string | null): boolean {
  if (!token) return false;

  const storedToken = getCSRFToken();
  if (!storedToken) return false;

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(token, storedToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks by ensuring comparison takes constant time
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Initialize CSRF protection on page load
 */
export function initCSRFProtection(): string {
  let token = getCSRFToken();

  if (!token) {
    token = generateCSRFToken();
    setCSRFToken(token);
  }

  return token;
}

/**
 * Add CSRF token to fetch headers
 */
export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken();

  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  }

  return headers;
}

/**
 * Verify CSRF token from request headers
 * Use this on the server side to validate requests
 */
export function verifyCSRFFromHeaders(headers: Headers): boolean {
  const token = headers.get('X-CSRF-Token');
  return validateCSRFToken(token);
}
