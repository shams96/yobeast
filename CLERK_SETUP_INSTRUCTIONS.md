# Clerk Setup Instructions

You're almost ready to launch! The app now uses **real Firebase + Clerk authentication** instead of mock data.

## ✅ What's Already Done

- Firebase configuration added to `.env.local`
- All components updated to use real Firestore data
- Authentication hooks created (useCurrentUser, useCurrentBeastWeek, etc.)
- Onboarding flow for new users
- Real-time subscriptions for polls and moments

## 🔑 What You Need to Do: Get Clerk API Keys

### Step 1: Create a Clerk Account (2 minutes)

1. Go to [https://dashboard.clerk.com/sign-up](https://dashboard.clerk.com/sign-up)
2. Sign up with your email or GitHub
3. Verify your email

### Step 2: Create a New Application (1 minute)

1. Click **"Create application"**
2. **Application name**: `Yollr Beast` (or `Yollr Beast Dev` for testing)
3. **Sign-in options** - Enable:
   - ✅ **Email** (for easy testing)
   - ✅ **Phone** (recommended for production campus use)
   - ✅ **Google** (optional, makes sign-up faster)
4. Click **"Create application"**

### Step 3: Copy Your API Keys (30 seconds)

After creating the app, you'll see your API keys:

1. Copy **Publishable key** (starts with `pk_test_...`)
2. Copy **Secret key** (starts with `sk_test_...`)

**IMPORTANT**: Keep the Secret key private - never commit it to git!

### Step 4: Add Keys to .env.local (1 minute)

Open `.env.local` and replace the placeholder values:

```bash
# Replace these two lines:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# With your actual keys:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### Step 5: Restart the Development Server (30 seconds)

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### Step 6: Test It! (1 minute)

1. Open http://localhost:3000
2. You should see a **"Sign In"** button in the header
3. Click it and create a test account with your email
4. Complete the onboarding (select campus and year)
5. You're in! 🎉

## 🎨 Optional: Customize Clerk Appearance (2 minutes)

In Clerk Dashboard → **Customization** → **Theme**:

1. **Brand color**: `#A47764` (Mocha Mousse - matches app theme)
2. **Dark mode**: Enable (app uses dark theme)
3. **Logo**: Upload Yollr Beast logo (optional)

## 📊 What Happens After Setup

### For You (Developer)
- All mock data is now replaced with real Firebase/Clerk
- Users can sign up with email/phone
- Data persists across sessions
- Real-time updates work

### For Users (Students)
1. **First visit**: See sign-in page
2. **Sign up**: Email/phone verification (OTP)
3. **Onboarding**: Select campus and year
4. **Main app**: See real Weekly Beast, polls, moments
5. **Invite friends**: Each user gets unique invite code

## 🚀 Production Deployment (Later)

When you're ready to deploy to production:

1. **Create production Clerk app** (separate from dev)
2. **Add production keys** to Vercel/hosting environment
3. **Update Clerk settings**:
   - Add production domain to allowed origins
   - Set up custom email templates
   - Configure social login providers

## 🔒 Security Features Already Configured

- ✅ Middleware protects all routes (except sign-in/sign-up/onboarding)
- ✅ Firebase security rules enforce one vote per user per week
- ✅ Users can only edit their own content
- ✅ File size limits (10MB images, 50MB videos)

## 📝 Firebase Collections (Auto-Created on First Use)

When the first user signs up, these Firestore collections will be created:

```
users/                  # User profiles
beast_weeks/            # Weekly challenges (you'll create the first one)
beast_clips/            # User submissions
beast_votes/            # Voting records
polls/                  # Campus polls
poll_votes/             # Poll responses
moments/                # 24-hour content
invites/                # Referral tracking
```

## ⚡ Quick Troubleshooting

**"Clerk not configured" error:**
- Check that you copied both keys correctly
- Restart the dev server
- Clear browser cache

**"Permission denied" in Firestore:**
- You need to set up Firestore security rules (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) Part 5)
- Make sure Firebase project is initialized

**Users stuck on onboarding:**
- Check Firebase console - is the user document created?
- Check browser console for errors

## 🎯 Next Steps After Clerk Setup

1. **Create first Beast Week** - Add a document to `beast_weeks` collection in Firebase console
2. **Test the full flow** - Sign up → onboard → see feed
3. **Invite beta testers** - Share the app with friends
4. **Monitor Firebase** - Check usage in Firebase console

---

**Total Setup Time**: ~5 minutes

**You're ready to launch with real users!** 🔥
