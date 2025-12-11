# Yollr Beast™ — Yo'll r Beast

**Every week, your campus becomes the arena.**

A mobile-first PWA combining the best of:
- **GAS** (polls & simplicity)
- **BeReal** (authentic Moments)
- **MrBeast** (weekly campus challenges)
- **TikTok/IG** (scrolling & media behavior)

## Core Concept

One single vertical feed. NO tabs, NO bottom nav, NO hamburger menu.

Three content types:
1. **Beast** — Weekly campus challenge with submissions, voting, and finale
2. **Polls** — Quick votes that influence Beast dynamics
3. **Moments** — 24-hour authentic snapshots (Beast-tagged or regular)

## Tech Stack

- **Next.js 15** (App Router) with React 19
- **TypeScript** (strict mode)
- **Tailwind CSS** (with 2025 Pantone colors)
- **PWA** (offline-first, installable)
- **Framer Motion** (smooth animations)

## Weekly Beast Flow

| Day | Phase | User Action |
|-----|-------|-------------|
| **Mon** | BEAST_REVEAL | See challenge, understand rules |
| **Tue-Wed** | SUBMISSIONS_OPEN | Submit 15s Beast Clip |
| **Thu-Fri** | VOTING_OPEN | Vote for finalists |
| **Sat** | FINALE_DAY | Watch party + winner reveal |
| **Sun** | COOLDOWN_REEL | Watch Beast Reel, earn rewards |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
yobeast/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with PWA metadata
│   ├── page.tsx           # Home feed
│   └── globals.css        # Global styles + Tailwind
├── components/            # React components
│   ├── Header.tsx         # Sticky header with points
│   ├── Feed.tsx           # Main vertical feed
│   └── cards/             # Feed item cards
│       ├── BeastCard.tsx  # Weekly Beast challenge card
│       ├── PollCard.tsx   # Poll with voting UI
│       └── MomentCard.tsx # Image/video Moment
├── lib/                   # Utilities & mock data
│   └── mockData.ts        # Demo content
├── types/                 # TypeScript definitions
│   └── index.ts           # Core types & interfaces
├── public/                # Static assets
│   └── manifest.json      # PWA manifest
└── tailwind.config.ts     # Theme configuration
```

## Design System

### Colors (Pantone 2025)
- **Mocha Mousse**: `#A47764` (Brand primary)
- **Vibrant Pink**: `#E85D75` (CTAs & accents)
- **True Black**: `#0A0A0B` (OLED-optimized background)

### Typography
- **Font**: Inter (variable weight 300-900)
- **Scale**: Responsive, mobile-first

### Components
- **Glassmorphism**: Backdrop blur + transparency
- **Micro-interactions**: Scale on tap, smooth transitions
- **Dark theme**: Optimized for Gen Z OLED screens

## Key Features

- ✅ Progressive Web App (installable)
- ✅ Offline-first architecture
- ✅ Responsive mobile-first design
- ✅ SEO optimized metadata
- ✅ View Transitions API ready
- ✅ Web Share API integration
- ✅ Dark theme (OLED optimized)
- ✅ Accessibility compliant

## Environment Variables

```bash
# Create .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Development Phases

- [x] **Phase 1**: Project scaffold + theme + feed
- [ ] **Phase 2**: Weekly state machine + Beast detail
- [ ] **Phase 3**: Submission flow + Moment capture
- [ ] **Phase 4**: Voting screen + Poll overlay
- [ ] **Phase 5**: Finale/Watch Party + Beast Reel

## License

Proprietary — Yollr Team

---

**Yo'll r Beast.** 🔥
