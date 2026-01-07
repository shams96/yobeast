# Production Setup Guide

## Critical Go-Live Checklist

### 1. ✅ Security (COMPLETED)

#### Authentication
- ✅ All mock user IDs replaced with real auth
- ✅ User context properly integrated

#### Security Headers (via middleware.ts)
- ✅ Content Security Policy (CSP) - Prevents XSS
- ✅ X-Frame-Options - Prevents clickjacking
- ✅ X-Content-Type-Options - Prevents MIME sniffing
- ✅ X-XSS-Protection - Browser XSS filter
- ✅ Referrer-Policy - Controls referrer info
- ✅ Permissions-Policy - Browser feature controls
- ✅ Strict-Transport-Security - HTTPS enforcement (production only)

#### Security Utilities Created
- ✅ Rate Limiting (`lib/security/rateLimit.ts`)
- ✅ Input Sanitization (`lib/security/sanitize.ts`)
- ✅ CSRF Protection (`lib/security/csrf.ts`)

### 2. ✅ Error Monitoring (COMPLETED)

#### Sentry Setup
- ✅ Sentry installed (`@sentry/nextjs`)
- ✅ Client configuration (`sentry.client.config.ts`)
- ✅ Server configuration (`sentry.server.config.ts`)
- ✅ Edge runtime configuration (`sentry.edge.config.ts`)

**To Enable Sentry:**
1. Create account at https://sentry.io/
2. Create new project for "Next.js"
3. Copy DSN from project settings
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
SENTRY_DSN=your_dsn_here
```

### 3. 📊 Analytics (READY)

Vercel Analytics already integrated via:
```tsx
import { Analytics } from '@vercel/analytics/react';
```

**Additional Tracking Recommendations:**
- Beast submission events
- Voting participation
- Finale attendance
- Moment creation
- Poll voting
- User retention metrics

### 4. 🔐 Rate Limiting Usage

```typescript
import { isRateLimited, RATE_LIMITS } from '@/lib/security/rateLimit';

// In API route or server action
const userIdentifier = user.id; // or IP address
if (isRateLimited(userIdentifier, RATE_LIMITS.BEAST_SUBMIT)) {
  return { error: 'Too many requests. Please try again later.' };
}
```

**Available Rate Limits:**
- `BEAST_SUBMIT`: 1 per hour
- `MOMENT_CREATE`: 5 per 5 minutes
- `BEAST_VOTE`: 1 per hour
- `POLL_VOTE`: 10 per minute
- `REALMOJI_REACT`: 20 per minute
- `AUTH_SIGNIN`: 5 per 5 minutes
- `AUTH_SIGNUP`: 3 per hour

### 5. 🛡️ Input Sanitization Usage

```typescript
import {
  sanitizeCaption,
  sanitizeUsername,
  sanitizeURL,
  isValidFileType,
  isValidFileSize,
  FILE_VALIDATORS,
  FILE_SIZE_LIMITS
} from '@/lib/security/sanitize';

// Sanitize user inputs
const cleanCaption = sanitizeCaption(userInput);
const cleanUsername = sanitizeUsername(usernameInput);

// Validate uploads
if (!isValidFileType(filename, FILE_VALIDATORS.VIDEO)) {
  return { error: 'Invalid file type' };
}

if (!isValidFileSize(fileSize, FILE_SIZE_LIMITS.BEAST_CLIP)) {
  return { error: 'File too large. Max 30MB.' };
}
```

### 6. 🔒 CSRF Protection Usage

```typescript
import { initCSRFProtection, addCSRFHeader } from '@/lib/security/csrf';

// Initialize on app load
useEffect(() => {
  initCSRFProtection();
}, []);

// Add to fetch requests
fetch('/api/submit', {
  method: 'POST',
  headers: addCSRFHeader({
    'Content-Type': 'application/json',
  }),
  body: JSON.stringify(data),
});
```

## Remaining Pre-Launch Tasks

### Infrastructure
- [ ] Set up CDN for media delivery (Cloudflare/CloudFront)
- [ ] Configure cloud storage (S3/Cloudinary) for uploads
- [ ] Set up Redis for caching (optional but recommended)
- [ ] Configure backup strategy for Firestore

### Testing
- [ ] Write E2E tests with Playwright
- [ ] Test on real mobile devices (iOS/Android)
- [ ] Load testing for concurrent users
- [ ] Security audit/penetration testing

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot/Pingdom)
- [ ] Configure performance monitoring
- [ ] Set up log aggregation (if needed)

### PWA
- [ ] Implement Service Worker for offline mode
- [ ] Test PWA installation on mobile
- [ ] Configure push notifications (optional)

### Content Moderation
- [ ] Set up admin dashboard for Beast curation
- [ ] Implement content moderation queue
- [ ] Configure automated content filters

### Legal & Compliance
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] GDPR compliance (if applicable)
- [ ] Age verification (if required)

## Environment Variables

Create `.env.local` with:

```bash
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_DSN=your_sentry_dsn

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Deployment Checklist

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Enable Vercel Analytics
4. Set up custom domain
5. Configure SSL/HTTPS
6. Test production build locally first:
```bash
npm run build
npm start
```

### Pre-Deploy Validation
```bash
# Type check
npm run type-check

# Build check
npm run build

# Test production bundle
npm start
```

## Performance Optimization

### Already Implemented
- ✅ Next.js 15 optimizations
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization

### Recommended Additions
- [ ] Implement lazy loading for heavy components
- [ ] Add skeleton loaders for better perceived performance
- [ ] Optimize video delivery with adaptive bitrate streaming
- [ ] Configure CDN caching headers

## Security Best Practices

### Already Implemented
- ✅ Security headers in middleware
- ✅ Rate limiting utilities
- ✅ Input sanitization
- ✅ CSRF protection

### Recommended Additions
- [ ] Implement API route protection with rate limiting
- [ ] Add request logging for security auditing
- [ ] Set up Web Application Firewall (Cloudflare/Vercel)
- [ ] Regular security dependency audits

## Monitoring & Alerts

### Set Up Alerts For:
- Error rate spikes (Sentry)
- API response time degradation
- High memory/CPU usage
- Failed deployments
- Unusual traffic patterns

## Support & Maintenance

### Post-Launch Monitoring
1. Monitor Sentry for errors (daily for first week)
2. Check Vercel Analytics for usage patterns
3. Review user feedback and bug reports
4. Monitor performance metrics

### Regular Maintenance
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews
- Continuous feature iterations based on usage data

---

**Status:** Core security and error monitoring implemented. Ready for infrastructure setup and final testing before launch.
