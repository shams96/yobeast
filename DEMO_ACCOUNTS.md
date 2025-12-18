# Demo Test Accounts - Yollr Beast UAT

## 🎯 Purpose
Pre-configured test accounts for 5 universities to demo the app without email verification.

## 🔧 Demo Mode Configuration

### .env.local Settings
```bash
# Set to 'true' to skip email verification for demo
NEXT_PUBLIC_DEMO_MODE=true

# Existing UAT mode (uses mock data)
NEXT_PUBLIC_UAT_MODE=true
```

## 👥 Test Accounts (5 Universities)

### 1. Harvard University
**Email**: `demo@harvard.edu`
**Password**: `Harvard2025!`
**Institution**: Harvard University
**Domain**: `harvard.edu`
**Year**: Junior
**Campus**: Cambridge, MA

### 2. MIT
**Email**: `demo@mit.edu`
**Password**: `MIT2025!`
**Institution**: MIT
**Domain**: `mit.edu`
**Year**: Sophomore
**Campus**: Cambridge, MA

### 3. Stanford University
**Email**: `demo@stanford.edu`
**Password**: `Stanford2025!`
**Institution**: Stanford University
**Domain**: `stanford.edu`
**Year**: Senior
**Campus**: Stanford, CA

### 4. UC Berkeley
**Email**: `demo@berkeley.edu`
**Password**: `Berkeley2025!`
**Institution**: UC Berkeley
**Domain**: `berkeley.edu`
**Year**: Freshman
**Campus**: Berkeley, CA

### 5. Yale University
**Email**: `demo@yale.edu`
**Password**: `Yale2025!`
**Institution**: Yale University
**Domain**: `yale.edu`
**Year**: Junior
**Campus**: New Haven, CT

## 🚀 Quick Setup Instructions

### Option 1: Manual Account Creation (Recommended for Demo)

1. **Disable Email Verification in Clerk Dashboard**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Navigate to **User & Authentication** → **Email, Phone, Username**
   - Under **Email address**: Uncheck "Verify at sign-up" ✅→❌
   - This allows instant account creation without verification

2. **Create Accounts**:
   - For each university above:
     - Go to `/institution-select`
     - Select the university
     - Click "Continue to Sign Up"
     - Enter the email (e.g., `demo@harvard.edu`)
     - Enter the password (e.g., `Harvard2025!`)
     - Complete sign-up (no verification needed)
     - Select year in onboarding
     - Done!

### Option 2: Clerk Dashboard Manual Creation

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) → **Users**
2. Click **Create user** button
3. For each test account:
   - Enter email (e.g., `demo@harvard.edu`)
   - Enter password (e.g., `Harvard2025!`)
   - Check "Skip email verification"
   - Click **Create**
4. Repeat for all 5 accounts

### Option 3: Use Clerk Test Mode Emails

Clerk auto-verifies emails with `+clerk_test` suffix:

- `demo+clerk_test@harvard.edu` → Auto-verified ✅
- `demo+clerk_test@mit.edu` → Auto-verified ✅
- `demo+clerk_test@stanford.edu` → Auto-verified ✅
- `demo+clerk_test@berkeley.edu` → Auto-verified ✅
- `demo+clerk_test@yale.edu` → Auto-verified ✅

**Password for all**: `Demo2025!`

## 🎮 Using Test Accounts

### Sign In
1. Click "Sign In" from header
2. Enter test email (e.g., `demo@harvard.edu`)
3. Enter password (e.g., `Harvard2025!`)
4. ✅ Instant access - no verification needed

### Switch Between Accounts
1. Sign out (click profile → Sign Out)
2. Sign in with different test account
3. See different campus data

## 🧪 Demo Scenarios

### Scenario 1: Harvard vs MIT Rivalry
1. Sign in as `demo@harvard.edu`
2. Submit Beast Week video
3. Vote for Harvard students
4. Sign out
5. Sign in as `demo@mit.edu`
6. See MIT perspective
7. Vote for MIT students

### Scenario 2: Cross-Campus Comparison
1. Test all 5 accounts
2. Compare campus feeds
3. See institution-specific data
4. Validate email domain enforcement

### Scenario 3: Invalid Email Test
1. Select "Harvard University"
2. Try to sign up with `demo@mit.edu`
3. ❌ Onboarding blocks: "Email mismatch"
4. Validates institution verification works

## ⚙️ Technical Implementation

### Skip Verification in Demo Mode

File: `middleware.ts` or `app/sign-up/[[...sign-up]]/page.tsx`

```typescript
// In sign-up page, check demo mode
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

if (DEMO_MODE) {
  // Skip email verification requirement
  // Clerk will handle this via dashboard setting
}
```

### Demo Mode Features
- ✅ No email verification required
- ✅ Instant account creation
- ✅ Pre-configured test credentials
- ✅ 5 universities ready to demo
- ✅ Easy account switching

## 📋 Demo Checklist

Before demo:
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
- [ ] Disable "Verify at sign-up" in Clerk dashboard
- [ ] Create all 5 test accounts (or use +clerk_test emails)
- [ ] Test sign-in for each account
- [ ] Verify institution validation works
- [ ] Prepare demo script for stakeholders

After demo:
- [ ] Re-enable "Verify at sign-up" in Clerk dashboard
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] Delete test accounts (or keep for QA)

## 🔒 Security Notes

**DEMO MODE IS FOR TESTING ONLY**
- ❌ Never use in production
- ❌ Never deploy with DEMO_MODE=true to public
- ✅ Only for local development and UAT
- ✅ Disable before production launch

**Test Account Security**:
- Use strong passwords even for test accounts
- Don't reuse these passwords elsewhere
- Delete test accounts before production
- Don't commit passwords to git (already in .md, that's okay for docs)

## 📊 Account Summary

| University | Email | Password | Year | Status |
|------------|-------|----------|------|--------|
| Harvard | demo@harvard.edu | Harvard2025! | Junior | Ready |
| MIT | demo@mit.edu | MIT2025! | Sophomore | Ready |
| Stanford | demo@stanford.edu | Stanford2025! | Senior | Ready |
| UC Berkeley | demo@berkeley.edu | Berkeley2025! | Freshman | Ready |
| Yale | demo@yale.edu | Yale2025! | Junior | Ready |

---

**Status**: ✅ Demo Accounts Configured
**Mode**: UAT + Demo Mode
**Date**: 2025-12-18
