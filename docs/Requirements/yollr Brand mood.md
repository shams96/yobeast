Visual Direction for Current Yollr Build
Brand Mood

Vibe:

GAS simplicity + BeReal authenticity + MrBeast hype, but in one calm, focused interface.

It should feel like a secret campus control room, not a Vegas slot machine.

Guiding rules:

Solid colors first, gradients only as subtle accent on very special things (e.g., winner state in Drop card).

Low noise, high clarity – every screen has one obvious action.

Feed-first – everything must feel like part of the same infinite scroll, just with different card types.

2. Updated Color System (Pantone 2025/26, Solid-First)

We keep your Gen-Z palette, but assign roles and emphasize flat fills, not gradient overload.

Core Tokens (Tailwind-style)
// tailwind.config.ts (extend section)
colors: {
  deepSpace: '#0A0A0A',        // app background
  galacticPurple: '#1A0B2E',   // card background
  electricViolet: '#8A2BE2',   // primary CTA / YoBeast accent
  neonCoral: '#FF6B6B',        // alert / danger / high-energy badges
  cyberLime: '#CCFF00',        // streaks, XP, mystery box, positive feedback
  digitalLavender: '#B57EDC',  // secondary accents, tags, pills
  glitchBlue: '#00FFFF',       // system info, subtle highlights
  y2kPink: '#FF1493',          // reactions, social feedback
  matrixGreen: '#00FF41',      // success, “live” indicators
  white: '#FFFFFF',
  offWhite: '#F6F6F8',
  graphite: '#232325',
}

Usage Mapping

App background: deepSpace

Cards: galacticPurple with a thin, soft border (graphite)

Primary CTA (Vote, Submit, Join Drop): electricViolet solid + white text

Secondary buttons: graphite background, offWhite text

Positive / Reward / XP: cyberLime

Alerts / “Ends soon” / Red states: neonCoral

Subtle accents (tags, chips): digitalLavender + glitchBlue

Social / fun reactions: y2kPink, matrixGreen

Gradients?

Only allowed on special hero moments (e.g., Drop winner reveal background), and even then: very soft, two-color blends (e.g., electricViolet → digitalLavender) with low saturation.

Regular cards & buttons stay flat.

3. Typography System (Simplified for Performance)

We keep your modern fonts but narrow the stack for sanity.

// tailwind.config.ts
fontFamily: {
  display: ['Bebas Neue', 'system-ui', 'sans-serif'], // large titles / YoBeast
  sans: ['Poppins', 'system-ui', 'sans-serif'],       // general UI
  alt: ['Rubik', 'system-ui', 'sans-serif'],          // optional for labels
}

Scale (Mobile-first)

App title / YoBeast title: 28–32px, font-display, all caps

Section titles (e.g. “This Week’s Drop”): 22–24px, font-sans font-semibold

Card titles (poll question, moment caption header): 18–20px

Body text: 16–18px

Meta / labels / timestamps: 14px (never smaller)

Text effects rules:

No crazy animated gradient text for base UI.

Allowed:

Slight outer glow (text-shadow) for winner text and XP popups.

Occasional 1px outline on big YoBeast titles.

4. Card Design – Yollr’s Three Engines in One Feed

Remember: user scrolls one feed; each card type has a distinct but consistent look.

4.1 Shared Card Structure

Background: bg-galacticPurple

Border: border border-graphite/60

Radius: rounded-3xl

Shadow: shadow-[0_12px_30px_rgba(0,0,0,0.5)]

Padding: p-4 mobile, p-5 large devices

Spacing between cards: gap-6, mt-4 mb-2

Micro-interaction (all cards):

Hover (desktop) / press (mobile):

scale-[1.01]

shadow-[0_16px_40px_rgba(0,0,0,0.7)]

transition: transition-transform transition-shadow duration-150 ease-out

4.2 DropCard (YoBeast™ / Weekly Drop)

This is the hero card at the top of the feed.

Structure:

Full-width card with:

Phase pill (Reveal / Submissions / Voting / Finale / Reel)

Title: THIS WEEK’S YO BEAST DROP

Subtitle: short, hype line (“Capture the craziest moment at Friday’s game.”)

Main CTA: one button only, based on phase (e.g., “See how it works”, “Submit your clip”, “Vote now”, “Watch the Reel”)

Visual:

Background: bg-galacticPurple

Subtle halo: inner border border-electricViolet/60

Phase pill:

Background color per phase:

Reveal: glitchBlue

Submissions: digitalLavender

Voting: electricViolet

Finale: neonCoral

Reel: cyberLime

CTA Button:

bg-electricViolet text-white font-semibold rounded-full px-4 py-2

Press: darken to bg-[#6b1fbd] + small scale scale-95

States in UI:

Reveal (Mon):

Short description + “See how it works”

Submissions (Tue–Wed):

Adds small strip: “Submissions close in 5h 23m” in neonCoral text

CTA: “Submit your Drop clip”

Voting (Thu–Fri):

Text: “Finalists locked. Help pick the winner.”

CTA: “Vote in YoBeast”

Finale (Sat):

Pre-event: countdown + “Finale tonight at 7PM in the gym”

In-event (simulated in MVP): CTA → Finale screen

Reel (Sun):

“Watch last night’s chaos”

CTA: “Watch Drop Reel”

4.3 PollCard (GAS-mode)

Purpose: feels like TBH: fast, fun, stupidly simple.

Visual:

Background: bg-galacticPurple

Question text:

font-display text-[20px] leading-tight text-white

Category chip:

Top-left chip (Career / Academic / Trend / Community)

Colors:

Career → bg-digitalLavender

Academic → bg-glitchBlue

Trend → bg-y2kPink

Community → bg-cyberLime

Options:

Full-width pills:

Background: graphite

Radius: rounded-full

Padding: py-2 px-4

On hover/press: background flips to electricViolet + white text

After voting (MVP):

Show percentage bars in solid electricViolet fill over graphite track.

Small icon next to the option user selected.

4.4 MomentCard (BeReal-mode)

Purpose: capture authentic daily life, especially around the Drop.

Visual:

Media container:

16:9 or 4:5 aspect ratio

bg-black rounded-2xl overflow-hidden

Overlay gradient: keep subtle, bottom-only:

From transparent → bg-black/60 for legible text

Caption:

text-[14px] text-offWhite below media

Meta row:

Left: username + “• 3h ago”

Right: small icons for reactions (❤️, 😂, 🔥) in y2kPink / cyberLime

Beast Moments:

Tag pill in top-left: bg-matrixGreen/70 text-xs — “YO BEAST MOMENT”

Slight thicker border or halo to differentiate from normal moments.

5. Animation & Micro-interactions (Tuned Down but Still Gen Z)

We keep animations tight and purposeful. No casino vibe.

Key Tailwind Extensions
extend: {
  keyframes: {
    'yollr-pulse': {
      '0%, 100%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.03)', opacity: '0.9' },
    },
    'yollr-pop': {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '60%': { transform: 'scale(1.05)', opacity: '1' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
  },
  animation: {
    'pulse-soft': 'yollr-pulse 1.4s ease-in-out infinite',
    'pop-once': 'yollr-pop 220ms ease-out forwards',
  },
  boxShadow: {
    'yollr-card': '0 12px 30px rgba(0,0,0,0.5)',
    'yollr-cta': '0 0 16px rgba(138,43,226,0.7)', // electricViolet glow
  },
  borderRadius: {
    'yollr-card': '1.5rem', // 24px
  },
}

Where to Use

YoBeast CTA button: shadow-yollr-cta + hover:animate-pulse-soft

Mystery Box icon / XP badge: animate-pop-once on reveal

Card entry: simple opacity-0 translate-y-2 → opacity-100 translate-y-0 transition, no looping.

6. Layout & Flow – How It All Feels In-Hand
Feed Layout (S1)

Edge-to-edge vertical scroll, with consistent margins:

Root container: px-4 pt-4 pb-24 (padding bottom for camera FAB)

Card order example:

YoBeast DropCard (pinned)

1–2 PollCards

3–5 MomentCards

Repeat pattern

Header

Top static bar:

Left: Yollr wordmark (or yollr in font-display text-electricViolet)

Right: mini XP / streak indicator (“🔥 7 days”, “⭐ 1200 XP”)

Capture Button (No Bottom Nav)

Floating Action Button near bottom center-right:

Circle, bg-electricViolet text-white

Icon: camera

Position: fixed bottom-6 right-5

Tap → Moment composer (with toggle for Moment / Drop Moment during Drop weeks)

7. Developer Mapping – How to Translate This to the Current Codebase
Tailwind Config (High-Level Checklist)

 Add color tokens under theme.extend.colors as above

 Add fontFamily.display and fontFamily.sans

 Add boxShadow.yollr-card and boxShadow.yollr-cta

 Add borderRadius['yollr-card']

 Add keyframes + animation for pulse-soft, pop-once

Component Styling Guidelines

For each core component, developers should:

DropCard (DropCard.tsx / YoBeastCard.tsx):

Use bg-galacticPurple border border-graphite/60 rounded-yollr-card shadow-yollr-card

Use phase pill colors correctly

Keep one CTA button with bg-electricViolet

PollCard:

Use font-display on the question

Use category chips with mapped colors

Options as full-width pills with hover/active states

MomentCard:

Media container: black background, rounded, overflow hidden

Subtle overlay for captions

Reactions in y2kPink / cyberLime

Header:

Dark, minimalist – no more than logo + XP/streak mini widget.

8. How This Fits the New YoBeast / Yollr Beast Mechanics

YoBeast (Drop) still feels special but not like a different app; it’s just the hero card and a few specialized views using the same typography & colors.

Polls visually echo TBH (big question, fun chips) but in our darker, richer palette.

Moments feel like BeReal/TikTok clips but stay within the same card system.