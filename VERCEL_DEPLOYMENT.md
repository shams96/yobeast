# Vercel Deployment Guide - Yollr Beast

## 🚨 Current Issue: Missing Environment Variables

**Error**: `Missing publishableKey` during Vercel build

**Root Cause**: Environment variables from `.env.local` are NOT automatically deployed to Vercel. They must be manually added to Vercel project settings.

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Yollr Beast** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Required Environment Variables

Copy these EXACT variable names and values from your `.env.local` file:

#### 🔑 Clerk Authentication (CRITICAL - App won't work without these)

| Variable Name | Value from .env.local | Environment |
|---------------|----------------------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_Y29tcGxldGUta29hbGEtODguY2xlcmsuYWNjb3VudHMuZGV2JA` | Production, Preview, Development |
| `CLERK_SECRET_KEY` | `sk_test_K3z9mQS6pRhytPTujAnaBe0BnuwzlIFYICN69L81Rs` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/onboarding` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/onboarding` | Production, Preview, Development |

#### 🔧 App Configuration

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_UAT_MODE` | `true` (UAT) or `false` (Production) | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., `https://yobeast.vercel.app`) | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `Yollr Beast` | Production, Preview, Development |

#### 🔥 Firebase Configuration (Required if UAT_MODE=false)

| Variable Name | Value from .env.local | Environment |
|---------------|----------------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCql84vPs8_K2TEURtdiTVFwnZKKLHeSzM` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `campuscheers.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `campuscheers` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `campuscheers.firebasestorage.app` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `129118297129` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:129118297129:web:df868ece6b845c69595038` | Production, Preview, Development |

### Step 3: Add Variables to Vercel

For EACH variable above:

1. Click **Add New** button
2. Enter the **Variable Name** (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
3. Paste the **Value** from your `.env.local` file
4. Check ALL environments: ✅ Production ✅ Preview ✅ Development
5. Click **Save**

### Step 4: Trigger Redeploy

After adding ALL variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. ✅ Build should succeed now

## 🎯 Quick Copy-Paste for Vercel

You can copy this JSON and bulk import in Vercel (if supported), or add manually:

```json
{
  "NEXT_PUBLIC_UAT_MODE": "true",
  "NEXT_PUBLIC_APP_URL": "https://your-app.vercel.app",
  "NEXT_PUBLIC_APP_NAME": "Yollr Beast",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_Y29tcGxldGUta29hbGEtODguY2xlcmsuYWNjb3VudHMuZGV2JA",
  "CLERK_SECRET_KEY": "sk_test_K3z9mQS6pRhytPTujAnaBe0BnuwzlIFYICN69L81Rs",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL": "/sign-in",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL": "/sign-up",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL": "/onboarding",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL": "/onboarding",
  "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyCql84vPs8_K2TEURtdiTVFwnZKKLHeSzM",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "campuscheers.firebaseapp.com",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "campuscheers",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "campuscheers.firebasestorage.app",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "129118297129",
  "NEXT_PUBLIC_FIREBASE_APP_ID": "1:129118297129:web:df868ece6b845c69595038"
}
```

## 🔒 Security Notes

### Current Configuration (Test Keys)

- ✅ Using Clerk **test** keys (`pk_test_*` and `sk_test_*`)
- ✅ Safe to deploy to public repositories during development
- ⚠️ **Before Production Launch**: Switch to Clerk **production** keys

### Production Checklist

Before launching to real users:

- [ ] Switch to Clerk production keys (starts with `pk_live_*`)
- [ ] Update Firebase to production database (if not using UAT mode)
- [ ] Set `NEXT_PUBLIC_UAT_MODE=false` for production environment
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Enable Firebase security rules for production
- [ ] Set up Vercel environment-specific variables (Production vs Preview)

## 📋 Verification Checklist

After adding variables and redeploying:

- [ ] Vercel build completes successfully
- [ ] No "Missing publishableKey" error in build logs
- [ ] Sign-in page loads correctly
- [ ] Institution selection works
- [ ] Sign-up flow functions properly
- [ ] Clerk authentication works on deployed app
- [ ] UAT mode displays mock data (if enabled)

## 🆘 Troubleshooting

### Build Still Failing After Adding Variables

**Problem**: "Missing publishableKey" error persists

**Solution**:
1. Verify variable name is EXACTLY: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (no spaces, correct casing)
2. Ensure value doesn't have extra quotes or spaces
3. Check that variable is added to ALL environments
4. Trigger a NEW deployment (not just redeploy)

### Authentication Not Working on Deployed App

**Problem**: Clerk sign-in fails on Vercel deployment

**Solution**:
1. Check Clerk Dashboard → Allowed Origins
2. Add your Vercel URL (e.g., `https://yobeast.vercel.app`)
3. Add your Vercel preview URLs (e.g., `https://*.vercel.app`)
4. Ensure `NEXT_PUBLIC_APP_URL` matches your deployed URL

### Firebase Errors on Deployed App

**Problem**: Firebase permission errors on Vercel

**Solution**:
1. If testing: Set `NEXT_PUBLIC_UAT_MODE=true` on Vercel
2. If production: Configure Firebase security rules
3. Verify all Firebase variables are added correctly
4. Check Firebase console for API key restrictions

## 🎯 Current Status

- ✅ `.env.local` has all required keys
- ✅ `.env.example` created for reference
- ⏳ **Next Step**: Add variables to Vercel project settings
- ⏳ **Then**: Redeploy and verify build succeeds

---

**Last Updated**: 2025-12-18
**Vercel Project**: Yollr Beast
**Environment**: UAT Mode (Test Keys)
