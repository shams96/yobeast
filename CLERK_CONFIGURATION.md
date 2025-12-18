# Clerk Configuration - CRITICAL SETUP

## ROOT CAUSE: Google OAuth Must Be Disabled in Clerk Dashboard

**Problem**: Google "Continue with Google" button shows even though we only want .edu email authentication.

**Root Cause**: Google OAuth provider is ENABLED in Clerk Dashboard settings.

**Fix Required**: Go to Clerk Dashboard and disable Google OAuth

### IMMEDIATE ACTION REQUIRED:

1. Go to https://dashboard.clerk.com
2. Select your "yobeast" application
3. Navigate to: **User & Authentication** → **Social Connections**
4. Find **Google** in the providers list
5. **Toggle OFF** the Google provider
6. **Save changes**

### Why This Matters:

- Users should ONLY sign up with .edu emails
- Google OAuth bypasses email domain validation
- Creates confusion in authentication flow
- Current CSS hiding is a hack, not a solution

### Correct Clerk Configuration:

**Authentication Methods** (Enable these):
- ✅ Email Address
- ✅ Email verification codes/links
- ✅ Password (optional)

**Social Providers** (Disable ALL):
- ❌ Google OAuth
- ❌ Facebook
- ❌ GitHub  
- ❌ Any other OAuth providers

### After Disabling Google OAuth:

The sign-in page will show ONLY:
- Email address input
- Password input (if enabled)
- Continue button
- No "Continue with Google" button
- No "or" divider line

This change applies globally to all users and all institutions.
