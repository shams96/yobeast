# CORE APP MECHANICS - The Real Implementation Plan

## 🎯 The Three Pillars - What Actually Makes Them Viral

### 1. yoBeast = Mr. Beast for Campus

**What Makes Mr. Beast Challenges Work:**
- **Weekly Hype Cycle**: Monday reveal → Build anticipation → Friday finale
- **Simple but Hard Challenges**: Anyone can try, few can win
- **Massive Prizes**: Life-changing money + sponsor packages
- **Production Value**: Edited reveals, countdown timers, professional presentation
- **Community Involvement**: Everyone votes on winners
- **Underdog Stories**: Regular people winning big
- **FOMO**: If you don't submit, you can't win

**Current Implementation:**
✅ Beast Week card with phases
✅ Prize display with sponsors
✅ Basic submission flow
✅ Mock data structure

**MISSING Critical Features:**
❌ **Backend Admin Panel**: Staff manually curates challenges, approves submissions, selects Top 10
❌ **7-Phase Weekly Cycle**:
   - Monday 6 PM: REVEAL (challenge announced with hype video)
   - Tuesday-Wednesday: SUBMISSIONS (students submit, staff reviews)
   - Thursday: TOP 10 LOCKED (finalists announced)
   - Friday 12 PM: VOTING OPENS (campus-wide voting)
   - Friday 6 PM: FINALE COUNTDOWN (live reveal event)
   - Saturday-Sunday: REEL (winner showcase, replay best moments)
❌ **Video Submission Player**: Watch all submissions with voting UI
❌ **Real-time Leaderboard**: See who's leading during voting
❌ **Prize Claim Flow**: Winner verification, photo with prize, social sharing
❌ **Push Notifications**: Every phase change, voting reminders
❌ **Past Winners Gallery**: Hall of fame, inspire submissions

---

### 2. Moments = BeReal Clone

**What Makes BeReal Addictive:**
- **Random Daily Notification**: "Time to BeReal" at unpredictable time
- **2-Minute Window**: Post within 2 minutes or marked "Late"
- **Dual Camera**: Front + back simultaneously = can't fake
- **No Filters/Edits**: Raw, authentic moments only
- **See After Posting**: Can't see friends until you post (reciprocity)
- **RealMojis**: React with your own selfie photo
- **Discovery Feed**: See random authentic moments after posting
- **Retakes Limited**: Max 2 retakes, shows "1 retake" badge
- **Screenshot Notifications**: Know if someone screenshots your moment

**Current Implementation:**
✅ Basic camera capture
✅ 24-hour expiration
✅ Caption + media upload
✅ Feed display

**MISSING Critical Features:**
❌ **Daily BeReal Notification**: Random time (e.g., 1:47 PM)
❌ **2-Minute Countdown Timer**: Urgency creates authenticity
❌ **Dual Camera Capture**: Front + back photos simultaneously
❌ **Late Badge**: Posts after 2 minutes marked "Late"
❌ **Discovery Lock**: Can't see others until you post
❌ **RealMoji Reactions**: Photo-based emoji reactions
❌ **Retake Counter**: Limited retakes (2 max) with badge
❌ **Friends-Only Visibility**: Not public, just campus friends
❌ **Time Since Posted**: "2h late" display
❌ **Location Tagging**: Optional campus location

---

### 3. Polls = Gas/TBH Reincarnation

**What Makes Gas/TBH Viral:**
- **100% Anonymous**: You never know who voted for you
- **Positive Only**: "Who's most likely to become famous?" not negative
- **Person-Specific**: Vote for specific people, not general opinions
- **Mystery Notifications**: "Someone thinks you're the funniest in class!"
- **Daily Questions**: New questions every day, refresh interest
- **Feel-Good Dopamine**: Get compliments, boost confidence
- **Campus-Wide**: Everyone in school participates
- **Share Results**: "I got 12 votes for most creative!" to story
- **No Bullying**: Only positive, uplifting questions allowed

**Current Implementation:**
✅ Basic poll voting UI
✅ Option selection
✅ Percentage display

**MISSING Critical Features:**
❌ **Anonymous Voting**: No tracking who voted
❌ **Person-Specific Polls**: "Who has the best smile?" → Pick from classmates
❌ **Positive Question Library**: Curated feel-good questions only
❌ **Results Notifications**: "3 people think you're most likely to succeed!"
❌ **Mystery Reveal**: Don't show WHO voted, just that SOMEONE did
❌ **Daily Question Rotation**: Fresh questions every 24 hours
❌ **Campus Directory Integration**: Vote from your campus roster
❌ **Share to Story**: Screenshot-friendly results cards
❌ **Moderation System**: Filter out inappropriate questions
❌ **Compliment Counter**: Track total compliments received

---

## 🏗️ Technical Architecture Needed

### Backend Requirements

**Firebase/Backend Services:**
```
Collections Needed:
├── beast_weeks (manually curated by admin)
│   ├── Weekly challenges created by staff
│   ├── Phase automation (scheduled functions)
│   └── Prize packages configured
│
├── beast_submissions (user-uploaded videos)
│   ├── Approval queue for staff review
│   ├── Top 10 selection by admin
│   └── Vote counting in real-time
│
├── moments (BeReal-style posts)
│   ├── Daily BeReal time (server-generated)
│   ├── Posted within window tracking
│   └── Friends graph for visibility
│
├── polls (Gas/TBH style)
│   ├── Question templates (positive only)
│   ├── Anonymous vote tracking
│   └── Results aggregation per user
│
├── users
│   ├── Campus verification
│   ├── Friends list
│   └── Notification preferences
│
└── notifications
    ├── Push notification queue
    ├── Phase change alerts
    └── BeReal time notifications
```

**Cloud Functions Needed:**
```
Scheduled Functions:
- Monday 6 PM: Trigger REVEAL phase
- Wednesday 11:59 PM: Close submissions, notify Top 10
- Friday 12 PM: Open voting
- Friday 6 PM: Close voting, announce winner
- Daily Random Time: Send BeReal notification

Real-time Functions:
- On submission: Add to approval queue
- On vote: Update leaderboard
- On moment post: Notify friends
- On poll vote: Increment anonymous counts
```

---

## 📱 User Experience Flows

### yoBeast Weekly Cycle

**Monday 6 PM - REVEAL:**
```
1. Push notification: "🔥 This Week's Beast Challenge is LIVE!"
2. User opens app → Full-screen reveal video
3. Challenge explained: "Best campus tour in 30 seconds"
4. Prize shown: "$100 + Chipotle for a Month!"
5. CTA: "Submit by Wednesday 11:59 PM"
```

**Tuesday-Wednesday - SUBMISSIONS:**
```
1. User clicks "Submit Beast Clip"
2. Records 30-second video (countdown timer)
3. Adds caption/hashtags
4. Submits → "Submitted! Staff is reviewing..."
5. Push notification when approved: "Your clip made it in!"
```

**Thursday - TOP 10 ANNOUNCED:**
```
1. Push notification: "Top 10 Finalists Revealed!"
2. User sees gallery of top 10 clips
3. Can watch all finalists
4. Reminded: "Voting opens Friday 12 PM"
```

**Friday 12 PM - VOTING:**
```
1. Push notification: "Vote for this week's Beast!"
2. Swipe through finalists (TikTok-style)
3. Heart button to vote (1 vote per user)
4. Live leaderboard updates every 30 seconds
5. Countdown to finale: "Voting closes in 6 hours"
```

**Friday 6 PM - FINALE:**
```
1. App-wide countdown: "Winner reveals in 5... 4... 3..."
2. Winner announcement with confetti animation
3. Winner's video plays full-screen
4. Prize claim instructions sent to winner
5. Everyone sees winner's post + celebration
```

**Saturday-Sunday - REEL:**
```
1. Beast Reel auto-generated: Top 10 highlights
2. Winner interview (if they opt-in)
3. Behind-the-scenes of prize claim
4. Teaser for next week
```

---

### BeReal Daily Flow

**Random Time (e.g., 2:34 PM):**
```
1. Push notification: "⚠️ Time to BeReal ⚠️"
2. User has 2 minutes to post
3. App opens directly to camera
4. Countdown timer: "1:47 remaining"
5. Tap once → Dual capture (front + back)
6. Post immediately or retake (max 2)
7. If late: Badge shows "23 min late"
```

**Discovery After Posting:**
```
1. After posting, unlock friends' feed
2. See who posted on time vs. late
3. React with RealMojis (selfie reactions)
4. Discovery feed: Random campus moments
5. Screenshot notifies poster
```

---

### Gas/TBH Daily Polls

**Daily Question Drop:**
```
1. New question every 24 hours
2. "Who has the best laugh?"
3. Scroll through campus roster
4. Pick 3 people anonymously
5. Submit votes
```

**Results Notification:**
```
1. "3 people think you have the best laugh!"
2. Can't see WHO voted
3. Share result card to story
4. Compliment counter increments
5. Feel-good dopamine hit
```

---

## 🎨 UI/UX Principles

### yoBeast:
- **Bold, Hype-Driven**: Red/orange theme, countdown timers
- **Video-First**: Autoplaying submissions, swipe interface
- **Competitive**: Leaderboards, vote counts, rankings
- **Event-Driven**: Countdowns, phase banners, urgency

### Moments (BeReal):
- **Minimal, Authentic**: Clean white/black, no clutter
- **Camera-First**: Instant capture, no overthinking
- **Time-Pressure**: Countdown timers, late badges
- **Social-Reciprocal**: Can't see until you post

### Polls (Gas/TBH):
- **Friendly, Positive**: Pastel colors, soft UI
- **Anonymous, Safe**: No names shown, mystery vibes
- **Feel-Good**: Compliments, positive reinforcement
- **Daily Habit**: Fresh questions, quick participation

---

## 🚀 Implementation Priority

### Phase 1: Core Mechanics (Week 1)
1. **yoBeast Backend**: Firebase collections, admin panel basics
2. **BeReal Timer**: Daily notification + 2-minute window
3. **Gas/TBH Anonymous**: Anonymous vote tracking

### Phase 2: Essential Features (Week 2)
4. **yoBeast Phases**: Automated weekly cycle with Cloud Functions
5. **BeReal Dual Camera**: Front + back simultaneous capture
6. **Gas/TBH Questions**: Positive question library + rotation

### Phase 3: Viral Features (Week 3)
7. **yoBeast Finale**: Live countdown, winner reveal, prize claim
8. **BeReal RealMojis**: Photo reactions, discovery feed
9. **Gas/TBH Results**: Mystery notifications, compliment counter

### Phase 4: Polish & Launch (Week 4)
10. **Push Notifications**: All phase changes, BeReal time, poll results
11. **Admin Dashboard**: Staff can curate, approve, select winners
12. **Testing & QA**: End-to-end flows for all three systems

---

## 🧪 Testing Scenarios

### yoBeast E2E:
```
1. Monday 6 PM: Reveal notification received
2. Submit video → Appears in approval queue
3. Thursday: Selected for Top 10
4. Friday: Vote on finalists
5. Friday 6 PM: Winner revealed
6. Prize claim initiated
```

### BeReal E2E:
```
1. Random time notification (e.g., 3:12 PM)
2. Open app within 2 minutes
3. Dual camera capture
4. Post → Unlock friends feed
5. React with RealMoji
6. Post late (5 min) → "Late" badge
```

### Gas/TBH E2E:
```
1. Daily question: "Who's most creative?"
2. Vote for 3 classmates anonymously
3. Later: Notification "2 people think you're creative!"
4. Can't see who voted
5. Share result to story
6. Check compliment counter
```

---

## 💡 Key Insights

**What User Wants:**
> "I need you to understand this picture, then try to implement this meticulously to mimic and capture the working and the buzz around it."

**Translation:**
- **Not just features** → Capture the FEELING
- **Not just UI** → Capture the PSYCHOLOGY
- **Not just code** → Capture the MAGIC

**BeReal = Authenticity through time pressure**
**Gas/TBH = Positivity through anonymity**
**yoBeast = Hype through community events**

Each needs its own engagement loop, not just a generic "post and scroll" feed.

---

## ✅ Commitment

I will implement **ALL** of these mechanics, not surface-level features. Each pillar will work independently AND together. This requires:

1. **Backend architecture** (Firebase, Cloud Functions)
2. **Dual camera** (front + back simultaneously)
3. **Real-time notifications** (push alerts for all events)
4. **Admin curation panel** (staff selects winners)
5. **Anonymous voting** (Gas/TBH style)
6. **Phase automation** (weekly cycle runs itself)
7. **Time windows** (BeReal 2-minute urgency)

This is the **real** yollr app. Not a prototype. The actual product.
