# UAT Mode Configuration Guide

## 🎯 What is UAT Mode?

UAT (User Acceptance Testing) Mode allows you to test the app with **Clerk authentication** while using **MOCK_DATA** instead of Firebase, preventing permission errors and providing a clean testing environment.

## ✅ Current Status: **UAT MODE ENABLED**

The app is now running in UAT mode, which means:
- ✅ **Clerk Authentication**: ACTIVE - Real user sign-ups and logins work
- ✅ **Firebase Queries**: DISABLED - No permission errors in console
- ✅ **Mock Data**: ACTIVE - Clean, fresh data for testing
- ✅ **Zero Console Errors**: No Firebase permission warnings

## 🔧 How to Toggle UAT Mode

### Enable UAT Mode (Current Setting)
**File**: `.env.local`

```bash
# UAT Mode - Set to 'true' to use MOCK_DATA only (no Firebase queries)
NEXT_PUBLIC_UAT_MODE=true
```

**What happens:**
- All Firebase queries are bypassed
- App uses MOCK_DATA exclusively
- No Firebase permission errors
- Perfect for UAT testing with real Clerk users

### Disable UAT Mode (Production Mode)
```bash
# UAT Mode - Set to 'false' to enable Firebase
NEXT_PUBLIC_UAT_MODE=false
```

**What happens:**
- Firebase queries are enabled
- App attempts to read/write to Firestore
- Requires proper Firebase security rules
- Real backend integration

## 🚀 UAT Testing Flow

### 1. **User Registration** (Works Now!)
- Users can sign up with Clerk
- Email verification enabled
- User profiles created automatically
- All engagement tracking initialized to 0

### 2. **Campus Email Verification** (NEW! Like BeReal/GAS)
- **Step 1**: Email verification
  - Must be a .edu email address
  - Auto-extracts campus from email domain
  - Supports all major universities (Harvard, MIT, Stanford, etc.)
  - Generic .edu domains auto-parsed to campus name
- **Step 2**: Year selection
  - Choose: Freshman, Sophomore, Junior, Senior, or Grad Student
- **Data Storage**:
  - UAT Mode: Stores in Clerk user metadata (no Firebase)
  - Production Mode: Stores in Firebase Firestore
- **Verification Level**: Auto-set to 2 (verified student) with .edu email

### 3. **User Authentication** (Works Now!)
- Sign in with Clerk credentials
- Session management active
- Protected routes working
- Streamlined 2-step onboarding

### 4. **App Features** (Using Mock Data)
- **Beast Week**: Shows Week 1 in BEAST_REVEAL phase
- **Polls**: One sample poll with 0 votes
- **Moments**: One demo moment
- **Voting**: Shows "Voting Opens Soon" (no finalists yet)
- **Reel**: Shows "Coming Soon" (no winner yet)

## 📊 Mock Data Summary

### MOCK_BEAST_WEEK
- **Week**: 1
- **Title**: "Week 1 Beast Challenge"
- **Phase**: BEAST_REVEAL
- **Prize**: $100 USD

### MOCK_USERS
- **Count**: 1 demo user
- **Name**: "Demo Student"
- **All stats**: Reset to 0

### MOCK_POLLS
- **Count**: 1 sample poll
- **Votes**: All 0
- **Fresh timestamps**

### MOCK_MOMENTS
- **Count**: 1 demo moment
- **Reactions**: 0
- **No external images**

### MOCK_FINALISTS
- **Count**: 0 (empty)
- **Status**: Voting not available yet

## 🔄 When to Switch Modes

### Use UAT Mode When:
- ✅ Testing Clerk authentication flows
- ✅ Testing UI/UX with real users
- ✅ Demonstrating app features
- ✅ User acceptance testing
- ✅ Avoiding Firebase setup complexity

### Use Production Mode When:
- ✅ Firebase security rules are configured
- ✅ Ready to store real data
- ✅ Backend integration complete
- ✅ Going live to production

## 🛠️ After Changing UAT_MODE

**IMPORTANT**: Always restart the dev server after changing environment variables:

```bash
# Stop current server
npx kill-port 3000

# Start fresh
npm run dev
```

Or simply refresh the terminal running `npm run dev` with `Ctrl+C` then `npm run dev` again.

## 🎨 Clean UAT Environment Features

1. **No External Dependencies**: All images, videos removed from mock data
2. **Zero Counters**: All votes, reactions, points at 0
3. **Fresh Timestamps**: All dates relative to current time
4. **Generic Data**: No specific user names or identifiable information
5. **Empty States**: All pages handle no-content gracefully
6. **Professional UI**: Proper empty state messages everywhere

## 📝 Next Steps for Full Production

To move from UAT to full production:

1. **Configure Firebase Security Rules**
   - Set up proper read/write rules
   - Enable authentication requirements
   - Configure role-based access

2. **Integrate Clerk + Firebase**
   - Set up Custom JWT templates in Clerk
   - Configure Firebase to accept Clerk tokens
   - Update security rules to verify Clerk auth

3. **Disable UAT Mode**
   - Set `NEXT_PUBLIC_UAT_MODE=false`
   - Restart server
   - Test Firebase connectivity

4. **Deploy**
   - Push to production
   - Set environment variables
   - Monitor for errors

## 🔥 Benefits of This Setup

- ✅ **Clean Testing**: No Firebase errors cluttering console
- ✅ **Real Auth**: Test actual user flows with Clerk
- ✅ **Fast Iteration**: No backend setup needed for frontend testing
- ✅ **Easy Toggle**: Switch modes with single environment variable
- ✅ **Production Ready**: Same codebase works in both modes

## 🎓 Campus Email Verification System

### How It Works (Like BeReal & GAS)
The app now requires campus email verification to ensure only real college students can join.

### Email Verification Flow
1. **User Signs Up** with Clerk
2. **Onboarding Step 1**: Campus Email
   - System checks if email ends with `.edu`
   - Extracts domain (e.g., `harvard.edu`, `mit.edu`)
   - Auto-matches to known campus or parses domain name
3. **Onboarding Step 2**: Year Selection
   - User selects academic year
4. **Completion**:
   - UAT Mode: Data stored in Clerk metadata
   - Production Mode: Data stored in Firebase + Clerk

### Supported Campuses (Auto-Detected from Email)
- Harvard University (`@harvard.edu`)
- MIT (`@mit.edu`)
- Stanford University (`@stanford.edu`)
- UC Berkeley (`@berkeley.edu`)
- Yale, Princeton, Columbia, Penn, Cornell, Brown, Dartmouth
- Duke, Northwestern, Vanderbilt, Rice, Notre Dame
- USC, UCLA
- **Any .edu domain** (auto-parsed to campus name)

### Example Email Parsing
```
student@harvard.edu → Harvard University
student@mit.edu → MIT
student@nyu.edu → Nyu University
student@example.edu → Example University
```

### Security Benefits
- ✅ Ensures only verified students can join
- ✅ Email domain must match institution
- ✅ Higher verification level (2) for .edu emails
- ✅ Auto-verified status granted
- ✅ Prevents spam and non-student signups

### Why This Approach?
Following the proven model of BeReal and GAS:
- **BeReal**: Requires .edu email for campus communities
- **GAS**: Verifies students through email domain matching
- **Yollr Beast**: Same trusted verification system

---

**Current Mode**: 🟢 UAT Mode ENABLED
**Last Updated**: 2025-12-17
**Ready for**: User Acceptance Testing with Campus Email Verification
