/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags
 */
export function sanitizeHTML(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize text input (captions, usernames, etc.)
 * Allows basic text but removes dangerous characters
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  // Remove control characters and null bytes
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Sanitize username (alphanumeric + underscore only)
 */
export function sanitizeUsername(input: string): string {
  if (!input) return '';

  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20); // Max 20 chars
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 */
export function sanitizeURL(input: string): string {
  if (!input) return '';

  const url = input.trim().toLowerCase();

  // Block dangerous protocols
  if (
    url.startsWith('javascript:') ||
    url.startsWith('data:') ||
    url.startsWith('vbscript:') ||
    url.startsWith('file:')
  ) {
    return '';
  }

  // Only allow http, https, and relative URLs
  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://') &&
    !url.startsWith('/')
  ) {
    return '';
  }

  return input.trim();
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(input: string): string {
  if (!input) return '';

  const email = input.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '';
  }

  return email;
}

/**
 * Sanitize caption/comment text
 * Allows emoji but removes HTML and script tags
 */
export function sanitizeCaption(input: string): string {
  if (!input) return '';

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove script-like content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Trim and limit length
  sanitized = sanitized.trim().slice(0, 500);

  return sanitized;
}

/**
 * Validate file type for uploads
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  if (!filename) return false;

  const extension = filename.toLowerCase().split('.').pop();
  return extension ? allowedTypes.includes(extension) : false;
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size > 0 && size <= maxSize;
}

/**
 * Common file type validators
 */
export const FILE_VALIDATORS = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  VIDEO: ['mp4', 'webm', 'mov'],
  MEDIA: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'],
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  BEAST_CLIP: 30 * 1024 * 1024, // 30MB
} as const;
