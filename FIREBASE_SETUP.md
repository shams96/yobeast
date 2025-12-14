# Firebase + Clerk Setup Guide

Complete backend integration for Yollr Beast with real-time data and authentication.

---

## 🔥 **Part 1: Firebase Setup** (5 minutes)

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: **"yollr-beast"** (or your choice)
4. Disable Google Analytics (optional for now)
5. Click **"Create project"**

### **Step 2: Enable Firestore Database**

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add security rules)
4. Choose location: **us-central** (or closest to your users)
5. Click **"Enable"**

### **Step 3: Enable Firebase Storage**

1. In Firebase Console → **Build** → **Storage**
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Use same location as Firestore
5. Click **"Done"**

### **Step 4: Get Firebase Config**

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **Web icon** (</>) to add a web app
4. App nickname: **"Yollr Beast Web"**
5. **DON'T** check "Firebase Hosting"
6. Click **"Register app"**
7. **Copy the config object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "yollr-beast.firebaseapp.com",
  projectId: "yollr-beast",
  storageBucket: "yollr-beast.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔐 **Part 2: Clerk Authentication Setup** (5 minutes)

### **Step 1: Create Clerk Account**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign up with GitHub or email
3. Click **"Create application"**
4. Application name: **"Yollr Beast"**
5. Enable sign-in methods:
   - ✅ **Phone number** (for campus users)
   - ✅ **Email** (backup method)
   - ✅ **Google** (optional, for easy sign-up)
6. Click **"Create application"**

### **Step 2: Get Clerk Keys**

1. In Clerk Dashboard → **API Keys**
2. Copy these values:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### **Step 3: Configure Clerk Settings**

1. **User Profile Fields** → Add custom fields:
   - `campus` (text) - Required
   - `year` (select: Freshman, Sophomore, Junior, Senior, Grad) - Required
   - `points` (number, default: 0) - Read-only
   - `beastTokens` (number, default: 0) - Read-only

2. **Appearance** → Customize to match your brand:
   - Primary color: `#A47764` (Mocha Mousse)
   - Dark mode: Enabled

---

## ⚙️ **Part 3: Environment Variables**

Update your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yollr-beast.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yollr-beast
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yollr-beast.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 **Part 4: Firestore Database Structure**

### **Collections**

```
yollr-beast/
├── users/                          # User profiles
│   └── {userId}/
│       ├── name: string
│       ├── username: string
│       ├── campus: string
│       ├── year: string
│       ├── points: number
│       ├── beastTokens: number
│       ├── invitedBy: string?
│       ├── inviteCode: string
│       └── createdAt: timestamp
│
├── beast_weeks/                    # Weekly challenges
│   └── {weekId}/
│       ├── weekNumber: number
│       ├── title: string
│       ├── description: string
│       ├── theme: string
│       ├── startDate: timestamp
│       ├── endDate: timestamp
│       ├── phase: enum
│       ├── prizeAmount: number
│       ├── maxDuration: number
│       └── isActive: boolean
│
├── beast_clips/                    # User submissions
│   └── {clipId}/
│       ├── userId: string
│       ├── beastWeekId: string
│       ├── videoUrl: string
│       ├── thumbnailUrl: string
│       ├── caption: string
│       ├── duration: number
│       ├── isFinalist: boolean
│       ├── votesCount: number
│       ├── reactionsCount: number
│       ├── status: enum
│       └── createdAt: timestamp
│
├── beast_votes/                    # Voting records
│   └── {voteId}/
│       ├── userId: string
│       ├── clipId: string
│       ├── beastWeekId: string
│       ├── round: enum
│       └── votedAt: timestamp
│
├── polls/                          # Campus polls
│   └── {pollId}/
│       ├── question: string
│       ├── category: string
│       ├── beastWeekId: string?
│       ├── options: array
│       ├── totalVotes: number
│       ├── expiresAt: timestamp
│       └── createdAt: timestamp
│
├── poll_votes/                     # Poll voting
│   └── {voteId}/
│       ├── pollId: string
│       ├── userId: string
│       ├── optionId: string
│       └── votedAt: timestamp
│
├── moments/                        # 24-hour content
│   └── {momentId}/
│       ├── userId: string
│       ├── imageUrl: string?
│       ├── videoUrl: string?
│       ├── caption: string
│       ├── isBeastMoment: boolean
│       ├── beastWeekId: string?
│       ├── allowInBeastReel: boolean
│       ├── reactionsCount: number
│       ├── expiresAt: timestamp
│       └── createdAt: timestamp
│
└── invites/                        # Referral tracking
    └── {inviteId}/
        ├── inviterId: string
        ├── inviteeId: string
        ├── code: string
        ├── status: enum
        └── createdAt: timestamp
```

---

## 🔒 **Part 5: Firestore Security Rules**

In Firebase Console → **Firestore Database** → **Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // Users can't delete their own account
    }

    // Beast Weeks (read-only for users)
    match /beast_weeks/{weekId} {
      allow read: if isSignedIn();
      allow write: if false; // Admin only
    }

    // Beast Clips
    match /beast_clips/{clipId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Beast Votes (one vote per week per user)
    match /beast_votes/{voteId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() &&
        !exists(/databases/$(database)/documents/beast_votes/$(request.auth.uid + '_' + request.resource.data.beastWeekId));
      allow update, delete: if false;
    }

    // Polls
    match /polls/{pollId} {
      allow read: if isSignedIn();
      allow write: if false; // Admin only
    }

    // Poll Votes (one vote per poll per user)
    match /poll_votes/{voteId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() &&
        !exists(/databases/$(database)/documents/poll_votes/$(request.auth.uid + '_' + request.resource.data.pollId));
      allow update, delete: if false;
    }

    // Moments (24-hour expiration)
    match /moments/{momentId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Invites
    match /invites/{inviteId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if false;
    }
  }
}
```

**Click "Publish"**

---

## 📁 **Part 6: Firebase Storage Rules**

In Firebase Console → **Storage** → **Rules**, paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    function isVideo() {
      return request.resource.contentType.matches('video/.*');
    }

    function isUnder10MB() {
      return request.resource.size < 10 * 1024 * 1024;
    }

    function isUnder50MB() {
      return request.resource.size < 50 * 1024 * 1024;
    }

    // User uploads
    match /users/{userId}/{allPaths=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }

    // Beast clips (videos)
    match /beast-clips/{userId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() &&
                      request.auth.uid == userId &&
                      isVideo() &&
                      isUnder50MB();
    }

    // Moments (images/videos)
    match /moments/{userId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() &&
                      request.auth.uid == userId &&
                      (isImage() || isVideo()) &&
                      isUnder10MB();
    }

    // Profile pictures
    match /avatars/{userId}/{fileName} {
      allow read: if true; // Public
      allow write: if isSignedIn() &&
                      request.auth.uid == userId &&
                      isImage() &&
                      isUnder10MB();
    }
  }
}
```

**Click "Publish"**

---

## ✅ **Part 7: Verification**

Test that everything is configured:

```bash
# Restart dev server with new env vars
npm run dev
```

Visit http://localhost:3000 and you should see:
- ✅ Clerk sign-in page (if not authenticated)
- ✅ No console errors about Firebase/Clerk
- ✅ App loads correctly

---

## 🚀 **Next Steps**

After completing this setup, the app will:
1. ✅ Use Clerk for real authentication (phone/email OTP)
2. ✅ Store all data in Firebase Firestore
3. ✅ Upload files to Firebase Storage
4. ✅ Real-time updates for votes, likes, submissions
5. ✅ Automated Weekly Beast creation and phase transitions
6. ✅ Invite system with referral tracking

---

**Ready to transform your app into a real production platform!** 🔥
