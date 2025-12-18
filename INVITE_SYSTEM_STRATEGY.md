# Invite-First Growth Strategy

## 🎯 Model: Clubhouse + Superhuman + Cash App

**Core Principle:** Invites are the PRIMARY way to join, not a secondary feature.

---

## 📱 How Trending Apps Do Invites

### Clubhouse (Viral Invite Mechanics)
- **Started with 2 invites per user**
- Invite scarcity created FOMO (people selling invites on eBay)
- Could earn more invites by being active
- Personal invite link tracking
- Waitlist for those without invites

### Superhuman (Email Waitlist + Invites)
- **100,000+ person waitlist**
- Invite-only access created exclusivity
- $30/month but people desperately wanted in
- Referral program gave priority access

### Cash App (Dual Rewards)
- **Both inviter and invitee get $5**
- Personal referral code in app
- Instant gratification on successful invite
- Viral loop: new user wants to invite to get $5

### Robinhood (Stock Rewards)
- **Free stock for both parties**
- Random stock value ($5-$200) gamified it
- Visible invite leaderboard
- Made inviting competitive

### BeReal (Friend Graph)
- Import contacts
- See who else is on BeReal
- Daily "time to BeReal" notification creates urgency
- Friends invite friends organically

---

## 🚀 Yollr Beast Invite System

### Invite Flow Strategy

**Priority 1: Direct Invite Link (Recommended)**
```
User taps "Invite Friends"
→ Generates unique link: yobeast.app/i/ABC123
→ Share via: Instagram DM, SMS, Snapchat, etc.
→ Friend clicks link
→ If app installed: Opens app → Auto-applies code
→ If not installed: App Store → Download → Auto-applies code on first open
→ Friend completes signup
→ BOTH get rewards!
```

**Priority 2: QR Code (In-Person Sharing)**
```
User shows QR code in app
→ Friend scans with camera
→ Opens invite link
→ Same flow as above
```

**Priority 3: Manual Code Entry (Backup)**
```
Friend downloads app directly
→ During onboarding: "Have an invite code?"
→ Enters 6-digit code
→ Gets validated
→ Inviter earns points
```

**Priority 4: Waitlist (No Invite)**
```
User tries to sign up without invite
→ Redirected to waitlist page
→ "Join 1,234 students waiting for access"
→ Can request invite from friends
→ Or wait for campus rollout
```

---

## 🎁 Reward System (Gamified)

### For Inviter (Points System)

**Tier 1: Basic Invites (First 4 friends)**
- ✅ **+50 points** per successful signup
- ✅ **+25 Beast Tokens** (premium currency)
- ✅ **Unlock 2 more invite slots** after first 4

**Tier 2: Super Inviter (5-10 friends)**
- ✅ **+75 points** per signup
- ✅ **+50 Beast Tokens**
- ✅ **"Campus Ambassador" badge**

**Tier 3: Beast Recruiter (10+ friends)**
- ✅ **+100 points** per signup
- ✅ **+100 Beast Tokens**
- ✅ **Unlimited invites**
- ✅ **Early access to new features**

### For Invitee (Welcome Bonus)

- ✅ **+25 points** just for joining
- ✅ **+10 Beast Tokens** starter bonus
- ✅ **Immediate access** (skip waitlist)
- ✅ **See who invited you** (social proof)

### Bonus Multipliers

**Both Active Within 7 Days:**
- ✅ Inviter gets **2x points** (100 instead of 50)
- ✅ "Active Invite" achievement

**Invitee Becomes Top Voter:**
- ✅ Inviter gets **bonus 50 points**
- ✅ "Quality Recruit" badge

**Campus Milestone:**
- ✅ First 10 inviters get **500 bonus points**
- ✅ Leaderboard recognition

---

## 🔢 Invite Slot System (Scarcity Creates FOMO)

### Starting Invites: 2-4 Slots

**Why Limited?**
- Creates urgency ("I only have 2 invites left!")
- Makes each invite feel valuable
- Recipients feel special/chosen
- Drives conversation ("Did you get an invite yet?")

### Earning More Invites

**Automatic Unlocks:**
1. Complete onboarding → **+2 invites**
2. Vote in first Beast Week → **+2 invites**
3. Upload first moment → **+2 invites**
4. Friend accepts invite → **+1 invite**
5. Reach 100 points → **+5 invites**

**Manual Rewards (Admin-granted):**
- Top contributors → **+10 invites**
- Campus ambassadors → **Unlimited**
- Contest winners → **+20 invites**

### Visual Invite Counter

```
In App Header:
┌─────────────────────┐
│  Invites: 3 left    │  ← Visible at all times
│  [Invite Friends]   │  ← Big CTA button
└─────────────────────┘
```

---

## 📊 Deep Link Implementation

### URL Structure

```
Primary Domain:
yobeast.app/i/{inviteCode}

Examples:
yobeast.app/i/ABC123  → User's invite code
yobeast.app/i/HARV01  → Campus-specific code
yobeast.app/join      → Waitlist (no code)
```

### Deep Link Behavior

**If App Installed:**
```javascript
// Universal Link (iOS) / App Link (Android)
yobeast.app/i/ABC123
→ Opens app directly
→ Auto-applies invite code
→ Shows: "Welcome! You were invited by @sarah_h"
```

**If App Not Installed:**
```javascript
// Deferred Deep Link (Firebase Dynamic Links)
yobeast.app/i/ABC123
→ Redirects to App Store / Play Store
→ After install & open
→ Auto-applies invite code saved in browser cookie
→ Shows welcome message with inviter name
```

### Technology Stack

**Option 1: Firebase Dynamic Links (FREE)**
- ✅ Works across iOS and Android
- ✅ Automatic deferred deep linking
- ✅ Analytics on link performance
- ✅ No monthly cost

**Option 2: Branch.io (Paid but powerful)**
- ✅ Better analytics
- ✅ A/B testing invite flows
- ✅ $Free tier: 10k link clicks/month
- ⚠️ Costs $299/month after

**Option 3: Custom Implementation**
- ✅ Full control
- ✅ No external dependencies
- ✅ Store invite code in localStorage
- ⚠️ Manual work for iOS/Android

**Recommendation:** Start with Firebase Dynamic Links (free, integrated)

---

## 🎪 Making Invites Feel Special

### Social Proof

**When Friend Clicks Invite Link:**
```
┌──────────────────────────────────┐
│  Sarah invited you to Yollr Beast │
│                                    │
│  [Profile Photo]                   │
│  @sarah_h                          │
│  Harvard · Sophomore               │
│                                    │
│  "Join my campus community         │
│   and compete in Weekly Beast!"   │
│                                    │
│  [Join Sarah's Campus]             │
└──────────────────────────────────┘
```

### Invite Leaderboard

**In-App Section:**
```
🏆 Top Inviters This Week

1. @mike_chen        23 invites  🔥
2. @sarah_h          18 invites  ⚡
3. @alex_j           15 invites  ✨

Your rank: #8 (12 invites)
Invite 4 more to reach top 5!
```

### Achievements & Badges

- 🌟 **First Invite** - "Connector"
- 🔥 **5 Invites** - "Campus Recruiter"
- ⚡ **10 Invites** - "Ambassador"
- 👑 **25 Invites** - "Beast Builder"
- 💎 **50 Invites** - "Campus Legend"

---

## 🚦 Rollout Strategy (Clubhouse-Style)

### Phase 1: Stealth Launch (Week 1)
- Start with 10 "seed users" at 1 campus
- Give each 10 invites
- Track who invites the most engaged users
- Create invite scarcity

### Phase 2: Campus Takeover (Week 2-4)
- Seed users invite their friend groups
- Each new user gets 2-4 invites
- Virality within tight-knit campus community
- Monitor growth: Should hit 100-500 users

### Phase 3: Multi-Campus (Month 2)
- Once Campus 1 hits critical mass
- Invite top users to bring friends from other campuses
- Launch campus-by-campus with same strategy
- Create inter-campus FOMO

### Phase 4: Public Launch (Month 3)
- Open waitlist to everyone
- Priority access to those with invites
- Still limit invites to maintain exclusivity

---

## 💾 Database Schema for Invites

```typescript
// invites collection
interface Invite {
  id: string;                    // ABC123
  inviterId: string;            // User who created invite
  inviteeId: string | null;     // User who used it (null until redeemed)
  code: string;                 // 6-char code: ABC123
  createdAt: Date;
  redeemedAt: Date | null;
  status: 'pending' | 'redeemed' | 'expired';

  // Analytics
  clickCount: number;           // How many times link was clicked
  source?: string;              // 'link' | 'qr' | 'manual'

  // Rewards
  pointsAwarded: boolean;
  tokensAwarded: boolean;
}

// users collection (add fields)
interface User {
  // ... existing fields
  invitedBy?: string;           // Who invited this user
  inviteCode: string;           // This user's personal invite code
  inviteSlots: number;          // How many invites they have left
  totalInvites: number;         // Total successful invites
  inviteRank?: number;          // Leaderboard position
}
```

---

## 🎨 UI/UX for Invite System

### Main Invite Screen

```
┌─────────────────────────────────┐
│  Invite Friends                  │
├─────────────────────────────────┤
│                                  │
│  You have 3 invites left         │
│  ▓▓▓░░░░░░░                     │
│                                  │
│  Your Invite Code:               │
│  ┌──────────────────────┐       │
│  │    ABC123    [Copy]  │       │
│  └──────────────────────┘       │
│                                  │
│  Share Your Link:                │
│  [Instagram] [SMS] [Snapchat]    │
│  [QR Code]   [Copy Link]         │
│                                  │
│  ────────────────────────────    │
│                                  │
│  💰 Earn Rewards                 │
│  +50 points per successful invite│
│  +25 Beast Tokens                │
│                                  │
│  🏆 Your Invite Stats            │
│  Total invites: 12               │
│  This week: 3                    │
│  Campus rank: #8                 │
│                                  │
└─────────────────────────────────┘
```

### Onboarding (With Invite Code)

```
Step 1: Phone verification
Step 2: "Do you have an invite code?"
        ┌──────────────────────┐
        │  Enter code: [____]   │
        │                       │
        │  Don't have one?      │
        │  [Join Waitlist]      │
        └──────────────────────┘

Step 3: If valid → Campus auto-selected
        "Welcome! Sarah invited you to Harvard campus"

Step 4: Complete profile
Step 5: Get your own invite codes!
```

---

## 📈 Growth Projections

### Viral Coefficient Target: 1.5-2.0

**What This Means:**
- Each user invites 1.5-2 friends who actually join
- Exponential growth if maintained
- Clubhouse achieved ~2.5 at peak

**Realistic Scenario (Conservative):**
```
Week 1: 10 users  → 20 invites  → 10 new users  (50% conversion)
Week 2: 20 users  → 40 invites  → 20 new users
Week 3: 40 users  → 80 invites  → 40 new users
Week 4: 80 users  → 160 invites → 80 new users
Week 8: 1,280 users (within one campus)
```

**Optimistic Scenario (Clubhouse-level):**
```
Week 1: 10 users  → 40 invites  → 30 new users  (75% conversion)
Week 2: 40 users  → 160 invites → 120 new users
Week 3: 160 users → 640 invites → 480 new users
Week 4: 640 users → 2,560 invites → 1,920 users
Week 8: 40,000+ users (campus-wide + spillover)
```

---

## ✅ Implementation Checklist

**Phase 1: Core Invite System (2 hours)**
- [ ] Generate unique 6-char invite codes
- [ ] Create invite links: yobeast.app/i/{code}
- [ ] Track invite redemptions in Firebase
- [ ] Award points/tokens on successful invite
- [ ] Limit invite slots (2-4 per user)

**Phase 2: Deep Links (1 hour)**
- [ ] Set up Firebase Dynamic Links
- [ ] Handle deep link routing in app
- [ ] Store invite code for deferred deep linking
- [ ] Auto-apply code on first app open

**Phase 3: UI/UX (2 hours)**
- [ ] Invite screen with code + share buttons
- [ ] QR code generator
- [ ] Onboarding with invite code input
- [ ] Invite leaderboard
- [ ] Achievement badges

**Phase 4: Analytics (1 hour)**
- [ ] Track invite link clicks
- [ ] Monitor conversion rates
- [ ] Calculate viral coefficient
- [ ] A/B test invite messaging

**Total: ~6 hours for complete invite system**

---

**Ready to implement this invite-first growth strategy?** This is exactly how Clubhouse went from 0 to millions of users.
