# Campus Verification Audit & Implementation Plan

## 🚨 Current Security Gaps

### ❌ What We're Missing

1. **No Email Domain Validation**
   - Users can sign up with Gmail, Yahoo, etc.
   - No requirement for .edu emails
   - No campus-specific domain checking

2. **Self-Reported Campus Selection**
   - Honor system only
   - Users can claim any campus
   - No verification mechanism

3. **No Verification Status**
   - Can't distinguish verified vs unverified users
   - No "verified" badges in UI
   - No trust indicators

4. **No Campus Isolation**
   - Users could potentially see content from all campuses
   - No enforcement of campus-specific feeds

## ✅ Solutions Available

### Solution 1: Clerk Email Domain Restrictions (Recommended - FREE)

**Clerk Dashboard Configuration:**

1. **Go to**: Clerk Dashboard → User & Authentication → Restrictions
2. **Enable**: "Email address domain allowlist"
3. **Add domains**:
   ```
   harvard.edu
   mit.edu
   stanford.edu
   berkeley.edu
   yale.edu
   princeton.edu
   columbia.edu
   upenn.edu
   cornell.edu
   brown.edu
   dartmouth.edu
   duke.edu
   northwestern.edu
   vanderbilt.edu
   rice.edu
   nd.edu (Notre Dame)
   usc.edu
   ucla.edu
   ```

**Pros:**
- ✅ Free (built into Clerk)
- ✅ No additional code needed
- ✅ Enforced at authentication layer
- ✅ Users can't bypass it

**Cons:**
- ⚠️ Need to manually add each campus domain
- ⚠️ Some schools have multiple domains (e.g., college.harvard.edu)
- ⚠️ Doesn't auto-detect campus from email

### Solution 2: Email Domain Parser + Auto Campus Detection

**Implementation:**
- Extract domain from user's email
- Auto-set campus based on domain
- Mark user as "verified" if using campus email

**Example:**
```javascript
Email: john@harvard.edu → Campus: "Harvard University" (verified ✓)
Email: jane@gmail.com → Campus: "Not Set" (unverified, needs manual approval)
```

**Code needed:**
- Email domain parser
- Campus domain mapping
- Verification status field in User type
- UI badges for verified users

### Solution 3: Hybrid Approach (RECOMMENDED)

**Phase 1: Soft Launch (Current)**
- Allow any email (Gmail, etc.)
- Self-reported campus selection
- Add "verified" status field
- Users with .edu emails get verified badge

**Phase 2: Verified-Only Mode**
- Enable Clerk domain restrictions
- Only .edu emails allowed
- Campus auto-detected from email
- All users verified

**Phase 3: Invite-Only Per Campus**
- Only verified users can invite
- Invites limited to same campus
- Referral tracking for growth

## 🔧 Implementation Options

### Option A: Quick Fix (30 minutes)

**What:**
- Add email domain checking in onboarding
- Show warning if not using .edu email
- Add "verified" field to user profile

**Code Changes:**
```javascript
// In onboarding, detect if email is .edu
const isEduEmail = user.emailAddresses[0]?.emailAddress.endsWith('.edu');

// Save verification status
await updateDoc(userRef, {
  campus: finalCampus,
  year: year,
  isVerified: isEduEmail,
  emailDomain: user.emailAddresses[0]?.emailAddress.split('@')[1]
});
```

**Pros:**
- ✅ Fast to implement
- ✅ Non-breaking (existing users unaffected)
- ✅ Adds trust indicators

**Cons:**
- ⚠️ Doesn't prevent fake signups
- ⚠️ Still relies on honor system

### Option B: Full Campus Verification (2 hours)

**What:**
- Email domain parser with campus mapping
- Clerk domain restrictions configured
- Auto-campus detection
- Verification badges in UI
- Manual verification flow for edge cases

**Features:**
1. **Email Domain → Campus Mapping**
   ```javascript
   const CAMPUS_DOMAINS = {
     'harvard.edu': 'Harvard University',
     'college.harvard.edu': 'Harvard University',
     'mit.edu': 'MIT',
     'stanford.edu': 'Stanford University',
     // ... etc
   };
   ```

2. **Auto-Campus Detection**
   - Extract domain from email
   - Look up campus in mapping
   - Auto-set campus (no manual selection)
   - Mark as verified

3. **Verification Badge UI**
   - Blue checkmark next to verified users
   - "Verified Student" label
   - Show verification status in profiles

4. **Manual Verification Flow**
   - For non-standard domains
   - Admin approval queue
   - Student ID upload (optional)

**Pros:**
- ✅ Secure and trustworthy
- ✅ Great user experience (auto-detected)
- ✅ Prevents fake accounts
- ✅ Scalable

**Cons:**
- ⚠️ Takes 2 hours to implement
- ⚠️ Requires maintaining domain list
- ⚠️ Some edge cases (faculty, staff emails)

### Option C: Third-Party Email Verification API

**Services:**
1. **Clearbit Enrichment API** (Free tier: 100/month)
   - Verifies email is real
   - Returns company/school info
   - Auto-detects .edu domains

2. **Hunter.io Email Verifier** (Free tier: 50/month)
   - Verifies email exists
   - Checks domain validity
   - Detects disposable emails

3. **EmailListVerify** ($4/1000 verifications)
   - Real-time verification
   - Detects fake/temporary emails
   - High accuracy

**Pros:**
- ✅ Professional-grade verification
- ✅ Detects fake/disposable emails
- ✅ Auto-detects institution

**Cons:**
- ⚠️ Costs money (after free tier)
- ⚠️ Adds API dependency
- ⚠️ Slower onboarding (API call)

## 📋 Other Security Gaps We Found

### 1. ❌ No Firestore Security Rules Set Up

**Problem:**
- You haven't published Firestore security rules yet
- Database is currently open OR completely locked

**Solution:**
- Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) Part 5
- Publish the security rules I provided
- Test with real user signup

### 2. ❌ No Campus Isolation

**Problem:**
- Users from different campuses see each other's content
- No filtering by campus in queries

**Solution:**
```javascript
// In usePolls, useMoments, etc.
const q = query(
  pollsRef,
  where('campus', '==', user.campus), // Filter by user's campus
  where('expiresAt', '>', Timestamp.now()),
  orderBy('expiresAt', 'asc')
);
```

### 3. ❌ No Rate Limiting

**Problem:**
- No protection against spam signups
- No limits on voting, posting, invites

**Solution:**
- Enable Clerk rate limiting in dashboard
- Add Firestore rate limit rules
- Track user actions in Firestore

### 4. ❌ No Content Moderation

**Problem:**
- Users can post anything
- No profanity filter
- No image moderation

**Solution:**
- Integrate with moderation API (e.g., Sightengine, AWS Rekognition)
- Add report/flag functionality
- Admin moderation queue

### 5. ❌ No Invite Code Validation

**Problem:**
- Invite codes generated but not enforced
- Anyone can skip invite flow

**Solution:**
- Make invites required for signup (in Clerk)
- Validate invite code during onboarding
- Track invite redemptions

## 🎯 Recommended Action Plan

### Immediate (Today - 30 min):
1. ✅ **Set up Firestore security rules** (Part 5 of FIREBASE_SETUP.md)
2. ✅ **Add email verification status** to user profiles
3. ✅ **Show warning** for non-.edu emails in onboarding

### Short Term (This Week - 2 hours):
1. ✅ **Implement email domain parser** with campus auto-detection
2. ✅ **Add verification badges** to UI
3. ✅ **Configure Clerk domain restrictions** (optional, for verified-only mode)
4. ✅ **Add campus filtering** to all queries

### Medium Term (Next Week - 4 hours):
1. ✅ **Build admin dashboard** for manual verifications
2. ✅ **Add content reporting** functionality
3. ✅ **Implement rate limiting**
4. ✅ **Set up invite-only mode**

### Long Term (Month 2 - 8 hours):
1. ✅ **Integrate content moderation API**
2. ✅ **Build analytics dashboard**
3. ✅ **Add student ID verification** (photo upload)
4. ✅ **Multi-campus expansion** features

## 💡 My Recommendation

**Start with Option B (Full Campus Verification)** because:

1. **You're in beta** - Better to start strict than tighten later
2. **Prevents fake accounts** - Critical for campus trust
3. **Better UX** - Auto-campus detection is elegant
4. **Scalable** - Easy to add more campuses
5. **Only 2 hours** - Worth the investment now

**Then add:**
- Firestore security rules (Part 5)
- Campus filtering in queries
- Verification badges in UI

**Total time: ~3 hours for production-ready campus verification**

---

**Want me to implement Option B now?** I can have campus email verification working in the next hour.
