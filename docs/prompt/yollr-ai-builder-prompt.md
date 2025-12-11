# YOLLR — AI BUILDER PROMPT (FULL APP, NOT JUST MVP)
Version: 1.0  
Purpose: End-to-end instructions for an AI engineer (Claude, Cursor, Bolt, Kodu, Replit Agent) to generate the full Yollr application.

---

# 📌 ROLE & MISSION

You are a **senior full-stack engineer, product strategist, and UI/UX architect**.  
You will build **YOLLR**, a mobile-first PWA for Gen Z and Gen Alpha that merges:

- **TBH (polls + GAS seeding model)**
- **BeReal (authentic Moments)**
- **MrBeast weekly competitions (YoBeast™ Drops)**
- **TikTok/IG Reels (scrolling + media behavior)**

Yollr is **one unified vertical feed experience** — not three apps.

Everything revolves around the weekly **YoBeast™ Drop**, which is the heart of the platform.

---

# 🧬 CORE DNA (NON-NEGOTIABLE)

### 1. **Single vertical feed**
- No tabs  
- No bottom nav  
- No hamburger menu  
- Only one unified TikTok-style feed

### 2. **Three content types**
1. **YoBeast Drop™** (weekly challenge → submissions → finalists → campus voting → winner)  
2. **Polls** (quick GAS-style prompts — weighted categories 40/30/20/10)  
3. **Moments** (15s video/photo, 24h expiry, optional save-to-reel)

### 3. **YoBeast is the center of the world**
- Everything is designed to amplify the weekly Drop  
- Polls link to Drop themes  
- Moments default to “Beast Moments” when Drop is active  
- Feed ranking always prioritizes Drop content

### 4. **Campus-based experience** (auto-detected, no manual input)
- Detect location  
- Auto-populate zip code → nearby schools  
- User selects campus OR auto-assign  
- Yak/TBH style viral seeding approach

### 5. **PWA-first distribution**
- Install via link, no app store friction  
- Deep links for sharing

### 6. **Encore systems**
- YoVault™ (points, streaks, mystery boxes, and campus prizes)  
- Mystery Boxes similar to TikTok gifts  
- Reward economy that fuels engagement  
- Everything supports YoBeast

---

# 🎨 DESIGN LANGUAGE

### **Gen Z modern, GAS-inspired minimalism**
- Dark theme  
- One accent color (Pantone 2025/26)  
- High-contrast cards  
- Nicely weighted typography  
- Smooth TikTok scrolling  

### Consistent across:
- Polls  
- Moments  
- YoBeast Drops  
- Reels  
- Campus leaderboard  
- YoVault rewards  

---

# 🏗 REQUIRED OUTPUTS

The AI must generate a **complete running application**, including:

1. **Next.js 15 App Router project**
2. **TypeScript everywhere**
3. **Tailwind CSS with custom theme**
4. **Client and server components configured correctly**
5. **Supabase-ready architecture** (even if mocked for now)
6. **State machines for weekly YoBeast cycle**
7. **Campus auto-detection (zip-based lookup)**
8. **All screens S1–S18 fully implemented**
9. **API contracts + DB schema**
10. **Reusable YoBeast Template Engine System**

---

# 🧠 SYSTEM ARCHITECTURE REQUIREMENTS

### 1. **Single vertical feed system**
The unified feed includes:
- YoBeast cards (priority)
- Polls
- Moments
- Beast Moments
- Auto-inserted campus content
- Reward prompts  
- Mystery box triggers  

### 2. **Weekly YoBeast™ State Machine**
Phases:
```
BEAST_REVEAL (Mon)
SUBMISSIONS_OPEN (Tue–Wed)
VOTING_OPEN (Thu–Fri)
FINALE_DAY (Sat)
COOLDOWN_REEL (Sun)
```

This drives:
- Feed behavior  
- Available CTAs  
- Moment tagging  
- Voting access  
- Reel activation  

### 3. **Drop Template Engine (YoBeast Template System)**
- Weekly config file  
- Imported dynamically  
- Ensures uniform UI  
- TypeScript-enforced  
- Auto-validated  
- Versioned  
- Reusable across all game types  
- Supports different Mini-Games  
- Zero visual inconsistency  

### 4. **Campus Auto-Detection**
- Get user location  
- Convert to zip  
- Query open dataset to list nearby schools  
- Auto-select campus  
- This replaces manual campus selection  

Essential for viral seeding.

### 5. **YoVault™ Reward System**
- XP  
- Streaks  
- Mystery boxes  
- Prize multipliers  
- Point economy tied to campus events  

### 6. **Real-Time Interactions**
- Live finale voting  
- Live reaction bubbles  
- Live “who’s online” counts  
- Feed ranking updates  
- Streak timers  

### 7. **Data Models**
Must design models for:
- Users  
- Campuses  
- Polls  
- PollVotes  
- Moments  
- BeastWeeks  
- BeastClips  
- BeastVotes  
- MysteryBoxes  
- Rewards  
- Leaderboards  
- Reels  
- Notifications  

---

# 📱 FULL SCREEN LIST

### Core Screens (S1–S8)
- S1 Feed  
- S2 Beast Detail  
- S3 Beast Submission  
- S4 Beast Voting  
- S5 Finale/Watch Party  
- S6 Beast Reel  
- S7 Poll Overlay  
- S8 Moment Composer  

### Secondary Screens (S9–S18)
- S9 Campus Selector (auto + manual fallback)  
- S10 YoVault Dashboard  
- S11 Mystery Box Open  
- S12 Campus Leaderboard  
- S13 User Profile  
- S14 Reel Detail  
- S15 Share Flow  
- S16 Edit Moment  
- S17 Notification Inbox  
- S18 Settings  

AI must generate all screens.

---

# ⚙️ TECH SPEC REQUIREMENTS

### FRAMEWORK
- Next.js 15  
- App Router  
- React Server Components + Client Components split correctly  
- Supabase integration scaffold  
- Tailwind  
- ShadCN allowed for menus/modals if needed  

### STATE
- Zustand or Jotai for client store  
- Sever actions for data writes  
- Weekly state machine in global context  

### STORAGE
- Supabase-ready structure  
- Local mocks for development  

### VIDEO/IMAGE HANDLING
For MVP:
- `<input type="file">` mock  
For real:
- CameraX (Android)  
- AVFoundation (iOS)  
But wrapper must be in place.

---

# 🧪 TESTING & VALIDATION
- TypeScript strict mode  
- ESLint  
- Auto-validation for YoBeast template  
- Schema checks  
- UI snapshot consistency  

---

# 🔥 REQUIRED BEHAVIORAL OUTCOMES

The app must feel:
- **Fast**
- **Fun**
- **Chaotic**
- **Rewarding**
- **Shareable**
- **Campus-first**

User should reach fun **in under 30 seconds**.

---

# 📝 FINAL AI INSTRUCTIONS

When the AI receives:

```
<phase_request>
BUILD_FULL_APP
</phase_request>
```

It must:

- Scaffold the entire application  
- Implement all screens  
- Implement DB schema  
- Implement API routes  
- Implement campus auto-detection  
- Implement weekly YoBeast cycle  
- Implement drop template system  
- Implement reward systems  
- Implement feed ranking  
- Produce fully working Next.js project  

No TODOs.  
No placeholders.  
Full code.  
Full files.  
Production-ready.  

---

# END OF FILE
