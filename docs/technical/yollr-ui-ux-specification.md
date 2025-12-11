# YOLLR — FULL UI/UX SPECIFICATION  
Version: 1.0  
Audience: UI/UX Designers, Product Leads, Prototypers, Motion Design, Figma Teams  
Format: Master Visual Specification for Entire App  
Scope: ALL SCREENS, ALL FLOWS, ALL COMPONENTS (FULL APP)

---

# 1. DESIGN PRINCIPLES

## 1.1 Core Aesthetic
Yollr must feel:
- Fast  
- Gen Z native  
- Minimal but bold  
- High contrast  
- Zero clutter  
- Emotionally expressive  

```
Inspiration blend:
• TikTok (scroll + momentum)
• GAS (simplicity)
• BeReal (authenticity)
• MrBeast (event energy)
• VSCO/Apple (polish)
```

## 1.2 Restrictions (NON-NEGOTIABLE)
- **NO tabs**  
- **NO bottom navigation**  
- **NO hamburger menu**  
- **NO infinite settings pages**  
- **ONE main feed**, everything branches from it  
- **One solid accent color** (Pantone 2025/26 palette)  
- **Dark mode only**  

---

# 2. COLOR PALETTE (PANTONE 2025/26 SOLID GEN Z PALETTE)

## 2.1 Primary Colors
```
Primary Background: #0B0B0E (Midnight Matte)
Primary Accent: #FF5E5B (Pantone Pop Coral)
Primary Text: #FFFFFF
Secondary Text: #A8A8B3
Card BG: #121317
Card Border: #2A2B31
Success: #72FF8F
Warning: #FFDE59
Error: #FF5E78
```

## 2.2 Interaction Colors
```
Button Accent: #FF5E5B
Button Accent Pressed: #E04640
Poll Option Selected: #FF8579
Poll Result Bars: #27272E
Poll Result Highlight: #FF5E5B
```

## 2.3 Video/Media Surfaces
```
Moment Overlay Gradient: rgba(0,0,0,0.25) → rgba(0,0,0,0.55)
Beast Clip Frame: #FF5E5B (2px)
```

---

# 3. TYPOGRAPHY SYSTEM (GEN Z FIRST)

Use **Inter**, standardized weights.

```
Display XL — 34px / Bold  
Display L — 28px / Bold  
Title — 22px / Semibold  
Subtitle — 18px / Medium  
Body — 16px / Regular  
Caption — 14px / Medium  
Label — 12px / Semibold
```

---

# 4. UI COMPONENT LIBRARY (MASTER COMPONENT SET)

Below is the master UI kit required to build all screens.

## 4.1 Buttons
```
Primary Button
- Solid Accent (#FF5E5B)
- Rounded XL (12px)
- Full width or auto
- Hover: lighten 5%
- Pressed: darken 8%
- Text: white, bold
```

```
Ghost Button
- Transparent
- Border: 1px #FF5E5B
- Rounded XL
```

```
Icon Button
- Circle, 48px
- Semi-transparent dark background
- White icon
```

---

## 4.2 Cards (Core Content Blocks)

### Beast Card (Pinned at Top)
Sections:
1. Week title  
2. Phase label  
3. CTA button  
4. Countdown strip  
5. Theme color accent  

### Poll Card
- Compact height  
- Choice preview  
- Category color label  
- Tap → Fullscreen overlay  

### Moment Card
- Full-bleed thumbnail  
- Creator name  
- Time left indicator (circle radial)  
- Tap → Lightbox viewer  

### Beast Moment Card
- Moment + Special border  
- Beast tag bubble  

---

## 4.3 Overlays / Modals
- Fullscreen blur background
- Slide-up animation (250ms)
- Rounded 24px top corners

---

## 4.4 Interaction Micro-Animations
```
Poll vote: 200ms ease-out pulse  
Vote confirmation: checkmark burst (60ms)  
Moment publish: upward whoosh + fade  
Beast vote: haptic tap + confetti micro  
Finale countdown: pulsing glow  
Reel scroll: 60fps momentum  
```

---

# 5. SCREEN SYSTEM (ALL 16 SCREENS)

Below is the definitive list of all screens required in the full experience.

---

# S1 — HOME FEED (PRIMARY SURFACE)

## Purpose
This is the “TikTok feed” of the app.  
Everything starts here.  
Everything returns here.

## Structure
```
Header:
  - Yollr wordmark (left)
  - XP badge (right)

Pinned Beast Card:
  - Week title
  - Phase state
  - CTA
  - Countdown
  - Hero thumbnail

Feed Stream:
  - Beast Moments
  - Polls
  - Regular Moments
  - Mystery Box Drops
  - Announcements
  - Boost notifications

Floating Camera Button:
  - Bottom right, circular
  - 60px
  - Press → Moment Capture Flow
```

---

# S2 — BEAST DETAIL + TIMELINE

### Content Sections
1. Header (Back, XP)
2. Beast Title + Subtitle
3. Description
4. “How it works” sequence
5. Weekly timeline with pills:
   - REVEAL  
   - SUBMISSIONS  
   - VOTING  
   - FINALE  
   - REEL  
6. CTA changes per phase (auto-driven)

---

# S3 — BEAST SUBMISSION FLOW

```
Step 1 — Brief Screen
  - Intro copy
  - Rules / Guardrails
  - CTA → Open Camera

Step 2 — Capture Screen
  - Camera preview
  - Record button
  - Upload fallback
  - 15s limit rail

Step 3 — Review Screen
  - Clip preview
  - Caption field
  - Checkbox: “I understand campus rules”
  - Submit
```

---

# S4 — VOTING (FINALISTS CAROUSEL)

```
- Fullscreen horizontally swipable cards
- Video autoplay (muted)
- Creator name
- "Vote" button (locked after vote)
- Progress dots (finalist 1/X)
```

---

# S5 — YO BEAST FINALE (EVENT MODE)

Three states:

### 1. Pre-Show Lobby
- Countdown timer  
- Live user count  
- Invite button  

### 2. Live Voting Room
- Top 3–5 finalists displayed  
- Live reactions (emojis float up)  
- Vote timer  

### 3. Winner Reveal
- Fullscreen winner clip  
- Confetti  
- Runner-ups strip  
- “View Weekly Reel” CTA  

---

# S6 — BEAST REEL (WEEKLY RECAP)
Vertical scroll:

1. Winner clip  
2. Finalists  
3. Beast Moments  
4. Event highlights  
5. Share buttons  

---

# S7 — POLL OVERLAY FLOW

```
Poll Header:
  - Category tag
  - Close button

Body:
  - Question text
  - Choices (large tappable buttons)
  - Tapping → immediate animation

Results View:
  - Percent bars
  - Winning option highlight
  - “Next poll” carousel
```

---

# S8 — MOMENT CAPTURE FLOW

```
Modes:
  - “Moment”
  - “Beast Moment” (auto during active week)

UI:
  - Camera preview
  - Flip camera
  - Record/shutter
  - Duration rail
  - Caption
  - Publish
```

---

# S9 — PROFILE (LIGHTWEIGHT)

Only what’s necessary:
- Avatar  
- XP + streak  
- Saved clips/Moments  
- Beast stats  
- Campus badge  

---

# S10 — CAMPUS ONBOARDING (ZIP-AWARE)

## Flow (post-login)
1. Allow location  
2. Autodetect ZIP  
3. Auto-populate campuses  
4. 1-tap select  
5. Enter feed  

---

# S11 — SETTINGS (MINIMAL)

- Edit name + avatar  
- Notification toggles  
- Change campus (limit once/30 days)  
- Support & safety  
- Terms  

---

# 6. MICROINTERACTIONS & MOTION SPEC

## 6.1 Feed Scrolling
- 60fps  
- Slight momentum easing  
- Snap-back if paused on video  

## 6.2 Beast Card CTA
- Expand transition 240ms  
- Fade background  
- Slide upward  

## 6.3 Voting Button
- Press ripple  
- Lock animation  
- Checkmark bounce  

## 6.4 Moment Publish
- Whoosh upward  
- Mini vibration  
- Toast: “Shared!”  

---

# 7. LIGHTBOX SYSTEM (MEDIA VIEWER)

When tapping any Moment or clip:
- Fullscreen view  
- Darkened background  
- Swipe left/right  
- Exit by pull-down  
- Share button  
- Reaction icons  

---

# 8. COMPONENT VARIANTS (THEME-SAFE)

Each key component has variants for:

- Beast sub-states  
- Poll question type  
- Moment type (photo/video)  
- Time-of-week (phase-coded)  
- Campus-branded overlays  

---

# 9. NAVIGATION MAP (MASTER FLOW DIAGRAM)

```
Login 
 → Campus Detection 
 → Feed (S1)
      ↳ Beast Detail (S2)
      ↳ Beast Submission (S3)
      ↳ Beast Voting (S4)
      ↳ Beast Finale (S5)
      ↳ Beast Reel (S6)
      ↳ Poll Overlay (S7)
      ↳ Moment Capture (S8)
      ↳ Profile (S9)
```

---

# 10. EDGE CASE UX SCENARIOS

### Missing Permissions
- If location blocked → manual campus entry  
- If camera blocked → upload fallback  

### Submission Fails
- Offline → queue + retry  
- Large file → compression prompt  

### Voting Edge Cases
- Voting closed → lock with message  
- Already voted → display chosen finalist  

### Finale
- User joins late → auto-skip lobby  
- Connection drop → reconnect to current state  

---

# 11. ACCESSIBILITY GUIDELINES

- Minimum 16px type  
- High contrast  
- Haptic events  
- VoiceOver labels for all buttons  
- Avoid flashing sequences  

---

# 12. FEA (Feed Emotional Architecture)

Every 3–5 cards:
- Insert moment of humor or hype  
- Insert polls to break monotony  
- Insert random mystery box  
- Maintain dopamine pacing  

---

# 13. FINGER PATH OPTIMIZATION

### All major controls:
- Right-hand zone: Camera, vote, submit  
- Left-hand zone: Back, exit, close  
- Center zone: Scroll, tap feed items  

Gen Z uses the device **one-handed** 90% of the time.

---

# 14. FINALE EVENT MODE — CINEMATIC GUIDELINE

### Visual Style:
- Dark stage  
- Neon coral borders  
- Confetti sequences  
- Hype animations  
- Runner-up strip sliding in  

### Sound:
- Soft haptics  
- Finale hit sound  
- Crowd effect optional  

---

# 15. Figma File Structure (READY TO IMPORT)

```
/YOLLR_UI
   /Design System
      - Color Palette
      - Typography
      - Grid & Spacing
      - Components
         - Buttons
         - Cards
         - Overlays
         - Lightbox
         - Forms
         - Headers
         - Modals

   /Flows
      /Onboarding
         - Login
         - Campus Detection
         - Permissions
         - First Feed

      /Feed
         - Feed Master
         - Beast Card States
         - Poll Card States
         - Moment Cards

      /Beast
         - Detail
         - Submission Intro
         - Submission Camera
         - Submission Review
         - Voting
         - Finale Lobby
         - Finale Live
         - Finale Winner
         - Reel

      /Moments
         - Capture
         - Preview
         - Viewer

      /Polls
         - Poll Question
         - Results Overlay

      /Profile
      /Settings
```

---

# 16. DELIVERABLE CHECKLIST (DESIGN TEAM)

- [ ] Full Design System  
- [ ] All screens S1–S16  
- [ ] All component variants  
- [ ] Motion mocks (Lottie or MP4)  
- [ ] Interaction prototypes  
- [ ] Figma variables for weekly Drop themes  
- [ ] Responsive behaviors  
- [ ] PWA Offline states  
- [ ] Share sheet mocks  
- [ ] Error states  

---

# END OF DOCUMENT  
