# Clerk Configuration - Email-Only Sign-Up

## 🎯 Goal
Configure Clerk to ONLY allow .edu email sign-ups (disable Google, phone, and other social logins).

## 🔧 Clerk Dashboard Configuration

### Step 1: Disable Social Logins

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your **Yollr Beast** application
3. Navigate to **User & Authentication** → **Email, Phone, Username**
4. Under **Authentication strategies**:
   - ✅ **Email address** - Keep ENABLED
   - ❌ **Phone number** - DISABLE
   - ❌ **Username** - DISABLE (optional, can keep if you want)

### Step 2: Disable OAuth Providers

1. In Clerk Dashboard, navigate to **User & Authentication** → **Social Connections**
2. **Disable ALL social providers**:
   - ❌ Google
   - ❌ Facebook
   - ❌ Apple
   - ❌ GitHub
   - ❌ Discord
   - ❌ Any other OAuth providers

### Step 3: Email Verification Settings (Use Links, NOT Codes)

1. Navigate to **User & Authentication** → **Email, Phone, Username**
2. Under **Email address**:
   - ✅ **Require email** - ENABLE
   - ✅ **Verify at sign-up** - ENABLE
3. Under **Verification methods**:
   - ❌ **Email verification code** - DISABLE (no OTP codes needed)
   - ✅ **Email link** - ENABLE (cleaner UX, one-click verification)

**Why email links over OTP codes?**
- ✅ Better UX: Click link vs typing 6-digit code
- ✅ Faster: One click verification
- ✅ Less friction: No copying/pasting codes
- ✅ Modern: Same as BeReal, GAS, and other campus apps
- ✅ Mobile-friendly: Opens directly in app

### Step 4: Disable Multi-Factor Authentication (MFA/2FA)

1. Navigate to **User & Authentication** → **Multi-factor**
2. **Disable ALL MFA methods**:
   - ❌ **SMS code** - DISABLE
   - ❌ **Authenticator app (TOTP)** - DISABLE
   - ❌ **Backup codes** - DISABLE

**Why disable MFA for campus app?**
- Users are verified by .edu email (sufficient security)
- No unnecessary OTP codes or 2FA prompts
- Simpler sign-in flow for students
- Email verification is the primary security layer

### Step 5: Restrict Email Domains (Optional but Recommended)

Clerk Pro/Enterprise feature - restrict to .edu domains only:

1. Navigate to **User & Authentication** → **Restrictions**
2. Under **Email address restrictions**:
   - Add allowlist: `*.edu`
   - This ensures ONLY .edu emails can sign up

**Note**: This is a paid feature. Alternative is to validate in your code (which we already do).

## ✅ Code Implementation (Already Done)

### Custom Sign-Up Page Enhancements

File: [app/sign-up/[[...sign-up]]/page.tsx](app/sign-up/[[...sign-up]]/page.tsx)

**What it does**:
- Hides Google login button via CSS (`hidden !important`)
- Shows institution banner with campus info
- Displays required email domain (@harvard.edu, @mit.edu, etc.)
- Reminds users to use campus email
- Styled with Yollr Beast colors

### Validation in Onboarding

File: [app/onboarding/page.tsx](app/onboarding/page.tsx)

**What it does**:
- Reads selected institution from localStorage
- Validates email domain matches selected institution
- Shows error if mismatch (e.g., @gmail.com for Harvard)
- Blocks completion until correct email used

## 🚀 Complete Sign-Up Flow

### User Journey:
1. **Landing Page** → Clicks "Get Started"
2. **Institution Selection** → Chooses university (e.g., Harvard)
3. **Campus Welcome** → Sees "Welcome to Harvard University!" with @harvard.edu requirement
4. **Clerk Sign-Up** → Email-only form (no Google button)
5. **Email Verification** → Clerk sends verification code
6. **Onboarding** → Validates email matches institution, selects year
7. **App Entry** → Verified student, ready to compete!

## 📋 Verification Checklist

After configuration, verify:

- [ ] Google "Continue with Google" button is hidden/disabled
- [ ] Phone number option is not available
- [ ] Email is the ONLY sign-up method
- [ ] Email verification is required
- [ ] Campus banner shows on sign-up page
- [ ] Email domain validation works in onboarding
- [ ] Error message appears for non-.edu emails (if restricted)

## 🔒 Why Email-Only?

### Security Benefits:
1. **Student Verification**: .edu emails prove student status
2. **Institution Match**: Email domain must match selected campus
3. **No Fake Accounts**: Can't use Gmail/Yahoo/etc.
4. **Exclusive Community**: Only verified students can join
5. **Like BeReal/GAS**: Industry standard for campus apps

### UX Benefits:
1. **Simple**: One clear path to sign up
2. **Trustworthy**: Users know it's verified students only
3. **Campus-Specific**: Email tied to institution
4. **No Confusion**: No deciding between Google/email/phone

## 🎨 UI Customization (Already Implemented)

### Custom Clerk Appearance:
```typescript
appearance={{
  variables: {
    colorPrimary: '#FF6F61', // Electric Coral
    colorBackground: '#141821', // Carbon
    colorInputBackground: '#0B0D10', // Nightfall
    colorInputText: '#EDEFF3', // Ash
  },
  elements: {
    socialButtonsBlockButton: 'hidden !important', // Hide Google
    dividerRow: 'hidden', // Hide "or" divider
    formButtonPrimary: 'bg-gradient-to-r from-electric-coral to-signal-lime',
  },
}}
```

## 🧪 Testing Email-Only Flow

### Test Case 1: Correct Email
1. Select "Harvard University"
2. Sign up with `test@harvard.edu`
3. ✅ Success - verified and onboarded

### Test Case 2: Wrong Domain
1. Select "Harvard University"
2. Sign up with `test@mit.edu`
3. ❌ Onboarding shows error: "Email mismatch"

### Test Case 3: Non-.edu Email
1. Select any institution
2. Sign up with `test@gmail.com`
3. ❌ Onboarding blocks: "Please use @harvard.edu email"

## 📞 Alternative: Clerk Webhook Validation

For even stronger enforcement, you can add a Clerk webhook:

### Webhook Configuration:
1. In Clerk Dashboard → **Webhooks**
2. Create webhook for `user.created` event
3. Endpoint: `https://yourdomain.com/api/webhooks/clerk`
4. Validate email domain server-side
5. Delete user if not .edu domain

**Implementation** (Future Enhancement):
```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email.endsWith('.edu')) {
    // Delete user or mark as unverified
    return new Response('Invalid email domain', { status: 400 });
  }

  return new Response('OK');
}
```

## 🎯 Summary

### Clerk Dashboard Settings:
- ✅ Email: ENABLED (required + verified)
- ❌ Phone: DISABLED
- ❌ Google: DISABLED
- ❌ All OAuth: DISABLED

### Code Implementation:
- ✅ Custom sign-up page with institution banner
- ✅ Hidden social login buttons
- ✅ Email domain validation in onboarding
- ✅ Error messages for mismatches

### Result:
- **Email-only sign-up**
- **.edu emails required**
- **Institution-verified students**
- **Clean, focused UX**

---

**Status**: ✅ Implemented in Code + Clerk Dashboard Config Required
**Clerk Dashboard**: [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
**Date**: 2025-12-17
