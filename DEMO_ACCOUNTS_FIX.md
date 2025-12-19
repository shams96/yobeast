# CRITICAL FIX: Demo Accounts Email Verification

## THE PROBLEM
Demo accounts (demo@harvard.edu, etc.) hit email verification screen because Clerk requires email codes even though "Verify at sign-up" is disabled.

## THE ROOT CAUSE
Clerk has TWO separate email verification settings:
1. **Sign-up verification** (already disabled ✓)
2. **Sign-in verification strategy** (STILL ENABLED ❌)

## THE FIX - Clerk Dashboard Steps

### Step 1: Disable Email Verification Strategy
1. Go to https://dashboard.clerk.com
2. Select your **yobeast** application
3. Navigate to: **User & Authentication** → **Email, Phone, Username**
4. Find the **Email address** section
5. Click on **Email address** to expand settings
6. Look for **"Verification"** or **"Verification strategy"**
7. Change from **"Email code"** or **"Email link"** to **"None"** or **"Instant"**
8. **SAVE CHANGES**

### Step 2: Enable Password-Only Authentication
1. Still in **User & Authentication** → **Email, Phone, Username**
2. Make sure **Password** is enabled
3. Set password as the PRIMARY authentication method
4. Disable or set to optional: Email verification codes
5. **SAVE CHANGES**

### Step 3: Disable Multi-Factor Authentication (MFA)
1. Navigate to: **User & Authentication** → **Multi-factor**
2. Make sure MFA is **DISABLED** or **OPTIONAL**
3. **SAVE CHANGES**

## ALTERNATIVE FIX: Development Mode Override

If the above doesn't work, add this to your `.env.local`:

```bash
# Force Clerk development mode - skip all verification
NEXT_PUBLIC_CLERK_DEVELOPMENT_MODE=true
```

Then restart your dev server.

## WHY CSS/JavaScript Won't Work
- Clerk renders verification screen server-side before React hydrates
- The screen appears during Clerk's internal authentication flow
- Only Dashboard settings control this behavior

## EXPECTED RESULT
After fixing Clerk settings:
- User enters email (demo@harvard.edu) + password
- Clicks "Continue"
- **IMMEDIATELY** redirected to home page
- **NO** email verification screen
- **NO** code input required
