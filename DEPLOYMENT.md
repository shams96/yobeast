# YOLLR Beast - Deployment Guide

**Last Updated**: December 20, 2025

---

## 🚀 Deployment Overview

**Hosting**: Vercel (Frontend) + Firebase (Backend)
**Environment**: Production requires Firebase billing plan

---

## 📋 Pre-Deployment Checklist

### Required Before Production

**Critical** (Must Complete):
- [ ] Firestore Security Rules deployed
- [ ] Real authentication implemented (no "current_user")
- [ ] Firebase billing plan enabled
- [ ] Environment variables set in Vercel
- [ ] Video upload migrated to Firebase Storage
- [ ] Rate limiting configured

**Recommended**:
- [ ] Error monitoring (Sentry)
- [ ] Analytics (PostHog/Mixpanel)
- [ ] Performance monitoring
- [ ] Backup strategy

---

## 🔥 Firebase Setup

### 1. Deploy Security Rules

**Option A: Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy contents of [firestore.rules](firestore.rules)
5. Paste into Rules editor
6. Click **Publish**

**Option B: Firebase CLI**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore (if not done)
firebase init firestore

# Deploy Security Rules only
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules:get
```

### 2. Create Firestore Indexes

Some queries require composite indexes. Firebase will prompt you to create them when first accessed, or create manually:

```bash
# Navigate to Firebase Console → Firestore → Indexes
# Create indexes for:
# - beast_clips: (beastWeekId, status, votesCount DESC)
# - moments: (createdAt DESC)
# - hype_polls: (createdAt ASC)
```

### 3. Enable Firebase Billing

```bash
# Required for production usage
# Navigate to Firebase Console → Upgrade Project
# Select Blaze Plan (Pay as you go)
```

**Estimated Monthly Costs** (1,000 active users):
- Firestore reads: ~$3-5
- Firestore writes: ~$2-3
- Storage: ~$5-10
- Total: **~$10-20/month**

### 4. Configure Firebase Storage

```bash
# For video/image uploads
firebase init storage

# Deploy storage rules
firebase deploy --only storage
```

**Storage Rules** ([storage.rules](storage.rules)):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Beast clips - public read, authenticated write
    match /beast_clips/{clipId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }

    // Moments - public read, authenticated write
    match /moments/{momentId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

---

## ⚙️ Environment Configuration

### Development (.env.local)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_UAT_MODE=false  # Use Firestore

# Optional: Clerk Auth (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Production (Vercel Environment Variables)

```bash
# Navigate to Vercel Dashboard → Project → Settings → Environment Variables

# Add all variables from .env.local
# Set Environment: Production
```

---

## 🌐 Vercel Deployment

### 1. Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project (first time)
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# ... (add all env vars)
```

### 2. Deploy to Production

```bash
# Preview deployment (staging)
vercel

# Production deployment
vercel --prod

# Verify deployment
vercel ls
```

### 3. Configure Domains

```bash
# Add custom domain
vercel domains add yourbeast.com

# Configure DNS (in your domain provider):
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

---

## 🔒 Authentication Setup

### Replace Mock "current_user"

**Files to Update**:
1. [context/BeastWeekCycleContext.tsx](context/BeastWeekCycleContext.tsx)
2. [context/RealsContext.tsx](context/RealsContext.tsx)
3. [context/HypePollsContext.tsx](context/HypePollsContext.tsx)
4. [lib/firestore.ts](lib/firestore.ts)

**Before**:
```typescript
userId: 'current_user'  // Mock user
```

**After** (using Firebase Auth):
```typescript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const userId = auth.currentUser?.uid || 'anonymous';
```

**Or** (using Clerk):
```typescript
import { useAuth } from '@clerk/nextjs';

const { userId } = useAuth();
```

---

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Configure in next.config.js
```

### 2. Performance Monitoring

```bash
# Vercel Analytics (built-in)
# Navigate to Vercel Dashboard → Analytics

# Or use custom solution
npm install @vercel/analytics
```

### 3. Usage Analytics

```bash
# PostHog (recommended)
npm install posthog-js

# Or Mixpanel
npm install mixpanel-browser
```

---

## 🚨 Rate Limiting

### Firestore Rate Limits

**Configure in Firebase Console → Firestore → Usage**:

```javascript
// Example: Limit votes per user
// Implement in Cloud Functions or App Check
const MAX_VOTES_PER_DAY = 10;
const MAX_SUBMISSIONS_PER_WEEK = 1;
```

### API Rate Limiting (Vercel Edge Functions)

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export default async function middleware(request: Request) {
  const ip = request.headers.get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod --token=$VERCEL_TOKEN
```

---

## 📈 Scaling Considerations

### Database Optimization

**Firestore Costs**:
- Reads: $0.06 per 100K documents
- Writes: $0.18 per 100K documents
- Storage: $0.18 per GB/month

**Optimization Strategies**:
1. Use real-time listeners sparingly
2. Batch writes when possible
3. Cache frequently accessed data
4. Use Firestore bundle for initial loads

### CDN & Edge Caching

**Vercel Edge Network**:
- Automatic global CDN
- Edge caching for static assets
- ISR (Incremental Static Regeneration) for Beast Week pages

---

## 🔐 Security Hardening

### Firestore App Check

```bash
# Enable App Check in Firebase Console
# Prevents unauthorized access to Firestore

# Install in Next.js
npm install firebase/app-check

# Initialize
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
  isTokenAutoRefreshEnabled: true
});
```

### Environment Variable Security

- Never commit `.env.local` to git
- Use Vercel environment variables for production
- Rotate Firebase API keys regularly
- Use Firebase App Check for API protection

---

## 🧪 Deployment Testing

### Staging Environment

```bash
# Create staging branch
git checkout -b staging

# Deploy to preview
vercel

# Test preview URL before production
```

### Production Smoke Tests

After deployment:
- [ ] Homepage loads
- [ ] Beast Week pages accessible
- [ ] Firebase real-time updates work
- [ ] Authentication works
- [ ] Video upload works
- [ ] Voting works
- [ ] No console errors

---

## 🔄 Rollback Procedure

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Firebase Rollback

```bash
# Rollback Firestore rules
firebase firestore:rules:release --list
firebase firestore:rules:release --rollback <release-id>
```

---

## 📊 Post-Deployment Monitoring

### Key Metrics to Monitor

**Performance**:
- Page load time (<3s)
- Time to interactive (<5s)
- Core Web Vitals (LCP, FID, CLS)

**Functionality**:
- Error rate (<1%)
- Real-time update latency (<200ms)
- Vote success rate (>99%)

**Business**:
- Daily active users
- Beast Week participation rate
- 4Real posting rate
- Hype Poll engagement

---

## 🆘 Troubleshooting

### Common Issues

**"Firestore permission denied"**:
- Verify Security Rules deployed
- Check user authentication
- Verify UAT_MODE=false

**"Rate limit exceeded"**:
- Increase Firebase quotas
- Implement caching
- Optimize queries

**"Video upload fails"**:
- Check Storage Rules deployed
- Verify file size limits
- Check Firebase billing active

---

## ✅ Production Readiness Checklist

**Infrastructure**:
- [ ] Firestore Security Rules deployed
- [ ] Firebase Storage Rules deployed
- [ ] Firebase billing enabled
- [ ] Vercel production deployment
- [ ] Custom domain configured
- [ ] SSL certificate active

**Code**:
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console.errors in production
- [ ] Authentication implemented
- [ ] Rate limiting configured

**Monitoring**:
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)
- [ ] Performance monitoring
- [ ] Alerts configured

**Security**:
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured
- [ ] App Check enabled

---

**Deployment Status**: ⏳ Ready for staging deployment
**Production**: ⏳ Pending checklist completion
