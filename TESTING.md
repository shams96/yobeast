# YOLLR Beast - Testing Guide

**Last Updated**: December 20, 2025

---

## 🧪 Testing Strategy

### Test Levels
1. **Unit Tests** - Individual functions
2. **Integration Tests** - Multi-component flows
3. **E2E Tests** - Full user journeys
4. **Manual Testing** - UAT scenarios

---

## 🎯 Feature Testing

### yoBeast 7-Phase Cycle

**Phase Transitions** (Manual):
```bash
# Test each phase by changing system time or waiting for natural transitions
```

- [ ] **Monday (BEAST_REVEAL)**: Challenge visible, no submission/voting
- [ ] **Tuesday-Wednesday (SUBMISSIONS_OPEN)**: Can submit, can't vote
- [ ] **Thursday-Saturday (VOTING_OPEN)**: Can't submit, can vote
- [ ] **Saturday 6PM+ (FINALE_DAY)**: Winner revealed with confetti
- [ ] **Sunday (COOLDOWN_REEL)**: Beast Reel available, top 5 carousel
- [ ] **Sunday-Monday (COOLDOWN_PREPARE)**: No actions available

**Submission Testing**:
- [ ] Video file upload works
- [ ] Caption required (validation)
- [ ] One submission per user per week enforced
- [ ] Submission appears in feed for others

**Voting Testing**:
- [ ] Can vote during voting phase
- [ ] One vote per user per week enforced
- [ ] Vote increments count in real-time
- [ ] Leaderboard updates automatically
- [ ] Can't vote on own submission

**Winner Calculation**:
- [ ] Top 3 calculated correctly
- [ ] Ties handled appropriately
- [ ] Winner revealed Saturday 6PM
- [ ] Confetti animation plays

---

### 4Real (BeReal Clone)

**Discovery Lock Testing**:
- [ ] Feed locked before posting
- [ ] Post unlocks feed for 24 hours
- [ ] Feed shows only today's moments
- [ ] Late posts marked correctly

**Moment Creation**:
- [ ] Dual camera capture works
- [ ] Front + back cameras captured
- [ ] Caption optional
- [ ] Moment visible to all users after posting

**Time Window**:
- [ ] Random time generated daily (9 AM - 11 PM)
- [ ] 2-minute window active
- [ ] Late posting allowed after window
- [ ] Next day resets window

---

### Hype Polls (Gas/TBH Clone)

**Poll Generation**:
- [ ] 5 random questions daily
- [ ] Questions reset each day
- [ ] Same questions for all users

**Anonymous Voting**:
- [ ] Vote recorded anonymously
- [ ] One vote per poll per user
- [ ] Can't see who voted for you
- [ ] Notification system works

---

### Enhanced Video Player

**Playback Controls**:
- [ ] Play/pause with single tap
- [ ] Volume control works
- [ ] Progress bar seeking
- [ ] Fullscreen toggle

**Interactive Gestures**:
- [ ] Double-tap to vote (shows heart)
- [ ] Vote only when enabled
- [ ] Buffering spinner shows when loading
- [ ] Controls auto-hide after 3 seconds

**Mobile**:
- [ ] Touch controls responsive
- [ ] Fullscreen on mobile
- [ ] Video orientation correct

---

## 🔥 Multi-User Testing (Firestore)

### Setup
```bash
# Turn off UAT Mode
NEXT_PUBLIC_UAT_MODE=false

# Restart dev server
npm run dev
```

### Test Scenarios

#### yoBeast Multi-User
**Setup**: Open two browser windows (or incognito)

1. **Window 1**: Submit Beast video
   - [ ] Video submission form appears (Tue-Wed only)
   - [ ] Upload video file
   - [ ] Add caption
   - [ ] Submit successfully

2. **Window 2**: Verify submission
   - [ ] Video appears in feed **instantly** (no refresh)
   - [ ] Caption displays correctly
   - [ ] Vote count shows 0

3. **Window 2**: Cast vote (Thu-Sat only)
   - [ ] Can vote on Window 1's video
   - [ ] Vote button disabled after voting
   - [ ] "Voted!" badge appears

4. **Window 1**: Verify vote
   - [ ] Vote count increments to 1 **instantly**
   - [ ] Leaderboard position updates
   - [ ] No page refresh needed

5. **Window 2**: Duplicate vote test
   - [ ] Try voting again
   - [ ] Error message: "Already voted this week"
   - [ ] Vote count doesn't change

#### 4Real Multi-User

1. **Window 1**: Post moment
   - [ ] Post unlocks feed
   - [ ] Moment visible in Window 1 feed

2. **Window 2**: Post moment
   - [ ] Window 2 feed unlocks
   - [ ] Both moments visible in **both windows**
   - [ ] Real-time sync (~100ms latency)

3. **Window 1**: Add RealMoji
   - [ ] Select emoji + take selfie
   - [ ] Reaction appears on Window 2's moment

4. **Window 2**: See reaction
   - [ ] Reaction appears **instantly**
   - [ ] Selfie displays correctly

#### Hype Polls Multi-User

1. **Window 1**: Vote on poll
   - [ ] Select person for poll question
   - [ ] Vote recorded

2. **Window 2**: Verify poll count
   - [ ] Poll vote count increments
   - [ ] Updates in real-time

3. **Window 1**: Duplicate vote test
   - [ ] Try voting on same poll
   - [ ] Error: "Already voted on this poll"

4. **Both Windows**: Verify daily polls match
   - [ ] Same 5 questions in both windows
   - [ ] Randomization consistent across users

---

## 🚨 UAT Mode Testing (localStorage)

### Setup
```bash
# Turn on UAT Mode
NEXT_PUBLIC_UAT_MODE=true

# Restart dev server
npm run dev
```

### Verify Fallback

- [ ] No Firebase queries made (check DevTools Network tab)
- [ ] All features work with localStorage
- [ ] yoBeast submissions stored locally
- [ ] Voting updates localStorage
- [ ] 4Real moments stored locally
- [ ] Hype Polls use localStorage

---

## ⚡ Performance Testing

### Real-Time Latency
- [ ] Vote updates appear <200ms
- [ ] Moment feed updates <200ms
- [ ] Poll count updates <200ms

### Animation Performance
- [ ] Confetti animation 60fps
- [ ] Video player controls smooth
- [ ] Page transitions smooth
- [ ] No jank during swipe gestures

### Mobile Performance
- [ ] Loads under 3 seconds on 3G
- [ ] Smooth scrolling
- [ ] Touch gestures responsive

---

## 🔒 Security Testing

### Firestore Rules
- [ ] Can't vote twice (enforced by rules)
- [ ] Can't edit others' content
- [ ] Can't delete others' content
- [ ] Anonymous votes stay anonymous

### Authentication
- [ ] Must be logged in to post
- [ ] Must be logged in to vote
- [ ] Session persists correctly

---

## 🐛 Known Issues

### Minor Issues (Non-Blocking)
- Missing `type="button"` on some buttons (accessibility warning)
- RealMoji not yet migrated to Firestore

### To Fix Before Production
- Replace "current_user" with real auth
- Add rate limiting
- Migrate RealMoji to Firestore
- Add error boundaries

---

## 📊 Test Coverage Goals

- **Unit Tests**: 70%+ coverage
- **Integration Tests**: Key flows covered
- **E2E Tests**: Critical user journeys
- **Manual Testing**: All features validated

---

## 🧪 Running Automated Tests

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## ✅ Pre-Deployment Checklist

**Functionality**:
- [ ] All 7 Beast Week phases work
- [ ] Multi-user real-time updates work
- [ ] Video player gestures work
- [ ] Discovery Lock enforced
- [ ] Voting limits enforced

**Performance**:
- [ ] No performance regressions
- [ ] Animations smooth (60fps)
- [ ] Real-time updates fast (<200ms)

**Security**:
- [ ] Firestore rules deployed
- [ ] No exposed API keys
- [ ] Authentication required

**Quality**:
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Linter passes
- [ ] Accessibility checks pass

---

**Testing Status**: ✅ Manual tests complete, automated tests pending
