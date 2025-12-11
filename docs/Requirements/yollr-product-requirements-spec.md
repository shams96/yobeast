# YOLLR — PRODUCT REQUIREMENTS SPECIFICATION (PRS)
Version: 1.0  
Document Type: Product Requirements Specification  
Audience: Founders, Architects, Engineers, UI/UX, PMs, Campus Ops Teams  

---

# 1. EXECUTIVE SUMMARY

Yollr is a **mobile-first PWA for Gen Z and Gen Alpha**, built around three engagement pillars:

1. **YoBeast™ Weekly Drops**  
   - A campus-wide MrBeast-style challenge cycle (Mon–Sun)
   - Students submit videos, vote for finalists, and join the live finale party
   - 100% designed by Yollr team for safety, creativity, and virality

2. **Polls (GAS-style)**  
   - Short, anonymous, positive-only prompts  
   - Weighted categories (40/30/20/10)  
   - Auto-personalized to campus and Drop themes

3. **Moments (BeReal-style)**  
   - Authentic 15-sec video or image  
   - 24-hour lifespan  
   - Auto-tagged to Drop week by default

Yollr’s design principle is **one single infinite vertical feed** — not tabs, not menus, not clutter.  
Everything flows through the **Feed**, with YoBeast anchoring the entire experience.

The ecosystem includes:
- Auto campus detection  
- Viral sharing  
- Live finale events  
- Campus leaderboard  
- YoVault™ reward economy  
- Mystery Boxes  
- Reels and recap experiences  

---

# 2. TARGET USERS

### Primary Users
- High school students ages 13–18  
- University students ages 17–23  
- Gen Z / Gen Alpha digital-native, short-attention, hyper-social

### Secondary Users
- Campus clubs, student orgs  
- Local businesses sponsoring Drops  
- Yollr creative team designing weekly games  

### Non-Users
- Adults >25 (not target demo)  
- Teachers/admins (support roles only)

---

# 3. PRODUCT GOALS

### 3.1 Engagement Goals
- Become the **#1 campus social ritual**  
- Elevate YoBeast Drops to weekly campus holidays  
- Daily DAU via Polls + Moments  
- Peak Saturday campus interaction during finale day

### 3.2 Growth Goals
- Automatic campus detection → frictionless onboarding  
- Viral sharing loops from Drop clips + Reels  
- Campus rewards → shareable → external interest  

### 3.3 Safety Goals
- All Drop challenges curated by Yollr  
- Clear safety guardrails on all submissions  
- Age-appropriate content tools  
- Scalable moderation tools

---

# 4. SYSTEM OVERVIEW

The system has **six interconnected engines**:

1. **YoBeast Engine**  
2. **Poll Engine**  
3. **Moment Engine**  
4. **Feed Ranking Engine**  
5. **Campus Engine (Zip-code Seeding)**  
6. **YoVault Reward Engine**

All engines unify under one **Feed-first architecture**, meaning every action, creation, interaction, and discovery begins in the feed.

---

# 5. CORE FEATURES

## 5.1 YoBeast Weekly Drop (Main Feature)

A weekly competitive cycle across all campuses.  
One challenge per week.  
Designed by Yollr (not user-generated).

### Weekly State Machine (Mon–Sun)

| Day | Phase | Description |
|-----|-------|-------------|
| **Mon** | BEAST_REVEAL | Drop announced; hype starts |
| **Tue–Wed** | SUBMISSIONS_OPEN | Students submit 15s videos |
| **Thu–Fri** | VOTING_OPEN | Campus votes for finalists |
| **Sat** | FINALE_DAY | Live campus finale party + winner reveal |
| **Sun** | COOLDOWN_REEL | Recap Reel published |

### Core YoBeast Components

- Challenge Template  
- Submission Flow  
- AI Moderation (optional for MVP)  
- Finalist Selection  
- Campus Voting  
- Live Finale  
- Reel Recap  
- Share Flows  

### Challenge Template Structure

```
id
title
description
theme
exampleVideos
rules
safetyGuardrails
timeline
prize
campusImpactRating
```

---

## 5.2 Poll Engine

GAS-style, fast, anonymous, positive polls.

### Weighted Categories  
- **Academics – 40%**  
- **Career – 30%**  
- **Trend/Pop Culture – 20%**  
- **Campus Community – 10%**

### Key Poll Mechanics
- One tap vote  
- Animated reveal  
- Personalized based on user interactions  
- Some polls thematically tied to YoBeast challenge

---

## 5.3 Moments Engine

BeReal-style, authentic, 15-second max video or photo.

### Key Features
- 24-hour expiry  
- Choose: **Moment** or **Beast Moment**  
- Auto-tag Beast Moments during Drop phase  
- Quick share, reactions, and comments  
- Moments auto-added to the weekly Drop Reel if allowed

---

## 5.4 Unified Vertical Feed

Single infinite scroll containing:
- YoBeast Cards  
- Poll Cards  
- Moment Cards  
- Beast Moments  
- Mystery Boxes  
- Share prompts  
- Sponsor content (later)

Feed updates based on weekly phase.

---

## 5.5 Campus Engine — Zipcode Auto-Detection (Nikita Bier Model)

### Goal
Instant campus seeding via **automatic campus identification**.

### Flow
1. Get user permission for location  
2. Convert GPS → Zip code  
3. Query public K–12 + university dataset  
4. Auto-populate nearest campuses  
5. User selects their campus OR auto-assign if only one  
6. Feed adjusts to that campus instantly

This replicates GAS/TBH viral loops.

---

## 5.6 YoVault™ Reward System

The reward + economy engine that powers:
- XP  
- Streaks  
- Leaderboards  
- Mystery Boxes  
- Campus Prizes  
- Point Multipliers  
- Shared goals

### Yollr Mystery Boxes
Similar to TikTok gifts:
- Open → get rewards  
- Burst animation  
- Random rarity  

### Reward Sources
- Completing Polls  
- Posting Moments  
- Submitting Beast Clips  
- Voting in Beast  
- Watching the Finale  
- Sharing Yollr  
- Inviting Friends  

---

# 6. END-TO-END USER FLOWS

Below is every core flow required for the full app experience.

---

# 6.1 Onboarding Flow (Campus Auto-Detection)

1. User lands on intro screen  
2. App requests location  
3. Reverse geocode → zipcode  
4. Fetch campuses (API dataset)  
5. Auto-select or display list  
6. User confirms  
7. User sees feed instantly  
8. Optional Profile Setup later

---

# 6.2 YoBeast Weekly Flow (Full End-to-End)

### **Monday — Reveal**
- Feed shows Drop Announcement card (pinned)
- User taps → sees full challenge details
- Trailer + examples + prize
- CTA: “Get Ready”

### **Tue–Wed — Submissions**
- Top card → “Submit Your Clip”
- User enters 3-step submission flow:
  1. Brief  
  2. Camera  
  3. Review + Submit  
- Clip enters moderation queue
- User earns XP and Mystery Box chance  
- Campus feed starts showcasing early submissions

### **Thu–Fri — Voting**
- Finalists randomly ordered  
- One vote per student  
- Feed badges visually differentiate finalists  
- Voting closes Friday midnight  
- System automatically locks finalists

### **Saturday — Finale Party**
- Countdown screen appears
- Watch party UI opens at scheduled time
- Live reaction bubbles (hearts, emojis)
- Winner revealed with confetti
- Campus awards distributed
- YoVault bonuses triggered

### **Sunday — Recap Reel**
- Full week recap reel published
- Includes:
  - Winner  
  - Finalists  
  - Beast Moments  
  - Top campus reactions  
- Shareable deep link for virality  
- New week begins next day

---

# 6.3 Moments Flow

1. Tap camera button  
2. Choose **Moment** or **Beast Moment**  
3. Capture/upload  
4. Add caption  
5. Optional: allow in Beast Reel  
6. Publish  
7. Appears in feed + ephemeral section  
8. Auto-expires in 24h

---

# 6.4 Poll Flow

1. User scrolls feed  
2. Poll card appears  
3. Tap → Poll Overlay  
4. Select answer (single tap)  
5. Animated results  
6. Close returns user to feed  
7. XP Reward  
8. Next day: personalized poll queue updates

---

# 6.5 YoVault Rewards

1. User completes action (poll, moment, submission, vote)  
2. Earns points + streak progression  
3. Mystery Box may trigger  
4. Box opens with animation  
5. Rewards added to YoVault dashboard  
6. Leaderboard updates

---

# 7. SYSTEM RULES

### 7.1 Strict No-Tabs Rule
No bottom navigation  
No hamburger  
Only feed with contextual overlays/routes

### 7.2 Drop-first App Logic
All content is influenced by:
- The current weekly challenge  
- User's campus  
- Campus engagement levels  

### 7.3 Safety Constraints
All Drops must follow 5 guardrails:
1. Legal & safe  
2. On-campus or <10 min walk  
3. Under 2 hours  
4. Max 200 participants  
5. Sponsor tagged if applicable

---

# 8. NON-FEATURE REQUIREMENTS

### Performance
- Sub-100ms interactions  
- Local caching  
- Prefetch feed blocks  

### Accessibility
- High contrast  
- Scalable text sizes  
- Voice-over compatibility  

### Moderation
- AI moderation queue for videos  
- Flagging system  
- Manual review tools  

### Security
- RLS on Supabase  
- Campus isolation  
- Verified student logic (later)

---

# 9. APP NAVIGATION MAP

Since there are no tabs:  
All screens branch from **Feed** or **YoBeast card**.

**Feed → Beast Detail**  
**Feed → Beast Submission**  
**Feed → Beast Voting**  
**Feed → Beast Finale**  
**Feed → Poll Overlay**  
**Feed → Moment Composer**  
**Feed → Beast Reel**  
**Feed → YoVault**  
**Feed → Campus selector**  
**Feed → Notifications**  
**Feed → Profile**

Everything flows *downstream* of the Feed.

---

# 10. DATABASE DESIGN (High-Level)

### Tables
```
users
campuses
user_campus
beast_weeks
beast_clips
beast_votes
polls
poll_options
poll_votes
moments
mystery_boxes
leaderboards
reels
notifications
xp_events
rewards
```

### Core Keys
- user_id  
- campus_id  
- beast_week_id  
- moment_id  
- poll_id  

Each table is fully normalizable and Supabase-ready.

---

# 11. APIs (High-Level Contract)

### Auth
- POST /auth/login  
- POST /auth/verify  

### Campus
- GET /campus/nearby?zip=  
- POST /campus/select  

### YoBeast
- GET /beast/current  
- POST /beast/submit  
- POST /beast/vote  
- GET /beast/finalists  
- GET /beast/reel  

### Polls
- GET /polls  
- POST /polls/vote  

### Moments
- POST /moment  
- GET /moments  

### Rewards
- POST /reward/claim  
- GET /vault  

---

# 12. CAMPUS SEEDING STRATEGY (Nikita Bier Model)

### Core Principles
- Campus identity matters more than global identity  
- Students care about **their school**  
- Viral loops rely on proximity and exclusivity  

### Implementation
1. Auto-detect location  
2. Fetch nearby schools  
3. Auto-select or user select  
4. All content is *campus-local*  
5. This drives hyper-local virality  
6. Encourage in-school sharing  
7. Weekly Drop becomes campus tradition  

---

# 13. OPERATIONAL REQUIREMENTS

### Weekly YoBeast Creation
- Yollr team creates 36–42 high school Drops  
- And 28–34 university Drops  
- Uses the YoBeast Template System  
- Consistent but never repetitive  
- Safe, fun, and campus-optimized  

### Sponsorship Integration
- Optional sponsor logos  
- Sponsor-funded prizes  
- Local business cross-promotion  

---

# 14. REQUIREMENTS COMPLETENESS SCORECHECK

This PRS includes:
- All primary features  
- All flows  
- All engines  
- All logic  
- All safety systems  
- All weekly mechanics  
- All viral loops  
- Campus auto-detection  
- Rewards ecosystem  
- YoBeast template engine  
- Full app structure  

**This is the complete PRD for the full application.**

---

# END OF FILE
