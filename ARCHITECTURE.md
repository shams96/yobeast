# Yollr Beast™ — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      YOLLR BEAST PWA                        │
│                    (Next.js 15 App)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Single Vertical Feed (NO TABS)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌────────┐           ┌─────────┐          ┌──────────┐
   │ BEAST  │           │  POLLS  │          │ MOMENTS  │
   │ Engine │           │ Engine  │          │  Engine  │
   └────────┘           └─────────┘          └──────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
                   ▼                     ▼
            ┌─────────────┐      ┌─────────────┐
            │   Backend   │      │   Storage   │
            │ (Supabase)  │      │ (S3/Cloud)  │
            └─────────────┘      └─────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App (layout.tsx)
│
├── Header
│   ├── Logo
│   ├── Points Badge
│   └── User Avatar
│
└── Main Content
    │
    ├── Home Feed (page.tsx)
    │   ├── BeastCard (Pinned Top)
    │   ├── Poll Cards (Interleaved)
    │   ├── Moment Cards (Scrollable)
    │   └── Floating Camera Button
    │
    ├── Beast Detail (/beast)
    │   ├── Hero Section
    │   ├── Timeline Component
    │   ├── How It Works
    │   └── Rules Section
    │
    ├── Beast Submission (/beast/submit)
    │   ├── Brief Screen
    │   ├── Camera/Upload Screen
    │   ├── Review Screen
    │   └── Success Screen
    │
    ├── Beast Voting (/beast/vote)
    │   ├── Fullscreen Carousel
    │   ├── Finalist Info Overlay
    │   └── Vote Button
    │
    ├── Beast Finale (/beast/finale)
    │   ├── Lobby State
    │   ├── Live Vote State
    │   └── Reveal State
    │
    ├── Beast Reel (/beast/reel)
    │   ├── Winner Section
    │   ├── Finalists Grid
    │   └── Beast Moments Grid
    │
    └── Moment Creation (/moment/new)
        ├── Type Selector (Moment/Beast Moment)
        ├── Media Upload
        └── Caption Input
```

---

## State Management

### Current Implementation (MVP)

```
┌──────────────────────────────────────┐
│         React State (Local)          │
├──────────────────────────────────────┤
│ • Poll votes (useState)              │
│ • Moment reactions (useState)        │
│ • Finale state (useState)            │
│ • Current clip index (useState)      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│      Mock Data (In-Memory)           │
├──────────────────────────────────────┤
│ • MOCK_BEAST_WEEK                    │
│ • MOCK_POLLS                         │
│ • MOCK_MOMENTS                       │
│ • MOCK_FINALISTS                     │
│ • MOCK_CURRENT_USER                  │
└──────────────────────────────────────┘
```

### Future Implementation (Production)

```
┌──────────────────────────────────────┐
│     React Context + Zustand          │
├──────────────────────────────────────┤
│ • BeastContext (current week)        │
│ • UserContext (auth + profile)       │
│ • FeedContext (infinite scroll)      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│   Supabase Real-time Subscriptions   │
├──────────────────────────────────────┤
│ • beast_weeks (current challenge)    │
│ • beast_clips (submissions)          │
│ • polls (live updates)               │
│ • moments (ephemeral content)        │
└──────────────────────────────────────┘
```

---

## Data Flow

### Beast Week State Machine

```
┌─────────────┐
│   MONDAY    │  Beast Reveal
│  9:00 AM    │  Phase: BEAST_REVEAL
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  TUE-WED    │  Submissions Open
│ Until 11:59 │  Phase: SUBMISSIONS_OPEN
└──────┬──────┘  ✓ Users submit clips
       │         ✓ Beast Moments posted
       ▼
┌─────────────┐
│  THU-FRI    │  Voting Open
│ Until 11:59 │  Phase: VOTING_OPEN
└──────┬──────┘  ✓ Finalists selected
       │         ✓ Campus votes
       ▼
┌─────────────┐
│  SATURDAY   │  Beast Finale
│   6:00 PM   │  Phase: FINALE_DAY
└──────┬──────┘  ✓ Watch party
       │         ✓ Winner revealed
       ▼
┌─────────────┐
│   SUNDAY    │  Beast Reel
│  All Day    │  Phase: COOLDOWN_REEL
└─────────────┘  ✓ Archive available
                 ✓ Rewards distributed
```

### User Interaction Flow

```
User Opens App
      │
      ▼
┌─────────────────┐
│   Home Feed     │ ← Always starts here
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┐
    │         │        │          │
    ▼         ▼        ▼          ▼
┌───────┐ ┌──────┐ ┌────────┐ ┌────────┐
│ Beast │ │ Poll │ │ Moment │ │ Create │
│ Card  │ │ Card │ │  Card  │ │ Button │
└───┬───┘ └──┬───┘ └───┬────┘ └───┬────┘
    │        │         │           │
    ▼        ▼         ▼           ▼
Beast     Poll      View       Moment
Detail   Overlay   Moment     Creation
    │                           │
    ▼                           ▼
Submit → Review → Success   Upload → Post
    │                           │
    └───────────┬───────────────┘
                ▼
           Back to Feed
```

---

## Database Schema (Future)

### Core Tables

```sql
-- Users
users
├── id (uuid, PK)
├── phone_number (unique)
├── name (text)
├── username (text, unique)
├── campus (text)
├── year (enum)
├── points (int, default 0)
├── beast_tokens (int, default 0)
└── created_at (timestamp)

-- Beast Weeks
beast_weeks
├── id (uuid, PK)
├── week_number (int)
├── title (text)
├── description (text)
├── theme (text)
├── start_date (date)
├── end_date (date)
├── phase (enum: BEAST_REVEAL | SUBMISSIONS_OPEN | ...)
├── prize_amount (decimal)
├── max_duration (int, seconds)
└── is_active (boolean)

-- Beast Clips
beast_clips
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── beast_week_id (uuid, FK → beast_weeks)
├── video_url (text)
├── thumbnail_url (text)
├── caption (text)
├── duration (int)
├── is_finalist (boolean)
├── finalist_rank (int, nullable)
├── votes_count (int, default 0)
├── reactions_count (int, default 0)
├── status (enum: pending | approved | finalist | winner)
└── created_at (timestamp)

-- Beast Votes
beast_votes
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── beast_clip_id (uuid, FK → beast_clips)
├── beast_week_id (uuid, FK → beast_weeks)
├── round (enum: preliminary | final)
└── voted_at (timestamp)
└── UNIQUE(user_id, beast_week_id)  ← One vote per week

-- Polls
polls
├── id (uuid, PK)
├── question (text)
├── category (enum: beast | campus | general)
├── beast_week_id (uuid, FK, nullable)
├── beast_linkage (enum, nullable)
├── total_votes (int, default 0)
├── expires_at (timestamp)
└── created_at (timestamp)

-- Poll Options
poll_options
├── id (uuid, PK)
├── poll_id (uuid, FK → polls)
├── text (text)
├── votes_count (int, default 0)
└── sort_order (int)

-- Poll Votes
poll_votes
├── id (uuid, PK)
├── poll_id (uuid, FK → polls)
├── user_id (uuid, FK → users)
├── option_id (uuid, FK → poll_options)
└── voted_at (timestamp)
└── UNIQUE(user_id, poll_id)  ← One vote per poll

-- Moments
moments
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── image_url (text, nullable)
├── video_url (text, nullable)
├── caption (text)
├── is_beast_moment (boolean)
├── beast_week_id (uuid, FK, nullable)
├── allow_in_beast_reel (boolean)
├── reactions_count (int, default 0)
├── created_at (timestamp)
└── expires_at (timestamp)  ← Auto-delete after 24h
```

### Indexes

```sql
-- Performance optimization
CREATE INDEX idx_beast_clips_week ON beast_clips(beast_week_id, created_at DESC);
CREATE INDEX idx_beast_votes_week ON beast_votes(beast_week_id);
CREATE INDEX idx_moments_active ON moments(expires_at) WHERE expires_at > NOW();
CREATE INDEX idx_polls_active ON polls(expires_at) WHERE expires_at > NOW();
```

---

## API Routes (Future)

### Beast Endpoints

```
GET    /api/beast/current              → Current week's Beast
POST   /api/beast/submit               → Submit Beast clip
GET    /api/beast/:id/finalists        → Get finalists
POST   /api/beast/:id/vote             → Vote for finalist
GET    /api/beast/:id/results          → Get voting results
GET    /api/beast/:id/reel             → Get Beast Reel content
```

### Poll Endpoints

```
GET    /api/polls                      → Active polls
POST   /api/polls/:id/vote             → Vote on poll
GET    /api/polls/:id/results          → Poll results
```

### Moment Endpoints

```
POST   /api/moments                    → Create moment
GET    /api/moments/feed               → Get active moments
POST   /api/moments/:id/react          → React to moment
DELETE /api/moments/:id                → Delete own moment
```

### User Endpoints

```
POST   /api/auth/otp/send              → Send OTP
POST   /api/auth/otp/verify            → Verify OTP
GET    /api/user/profile               → Get user profile
PUT    /api/user/profile               → Update profile
GET    /api/user/stats                 → User stats & points
```

---

## File Upload Architecture

### Video/Image Processing Pipeline

```
User Device
    │
    ▼
[Upload to CDN]
    │
    ├─ S3 / Cloudinary / Supabase Storage
    │
    ▼
[Processing Queue]
    │
    ├─ Video transcoding (HLS, DASH)
    ├─ Thumbnail generation
    ├─ Compression & optimization
    ├─ Moderation API check
    │
    ▼
[Database Record]
    │
    ├─ video_url (CDN)
    ├─ thumbnail_url (CDN)
    ├─ status: approved/rejected
    │
    ▼
[Serve to Users]
```

### CDN Strategy

```
┌────────────────────────────┐
│   CloudFront / Cloudflare  │
│        (CDN Layer)         │
└────────────┬───────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  [Videos]      [Images]
   (HLS)         (WebP)
      │             │
      └──────┬──────┘
             │
             ▼
      [Origin Server]
    (S3/Cloudinary)
```

---

## Security Architecture

### Authentication Flow

```
1. User enters phone number
   ↓
2. Backend sends OTP (Twilio/Supabase)
   ↓
3. User enters OTP
   ↓
4. Backend verifies OTP
   ↓
5. Generate JWT token
   ↓
6. Store in httpOnly cookie
   ↓
7. Subsequent requests include token
   ↓
8. Middleware validates token
```

### Row-Level Security (RLS)

```sql
-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can only submit one Beast clip per week
CREATE POLICY "One submission per week"
  ON beast_clips FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM beast_clips
      WHERE user_id = auth.uid()
      AND beast_week_id = NEW.beast_week_id
    )
  );

-- Users can only vote once per week
CREATE POLICY "One vote per week"
  ON beast_votes FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM beast_votes
      WHERE user_id = auth.uid()
      AND beast_week_id = NEW.beast_week_id
    )
  );
```

---

## Performance Optimization

### Caching Strategy

```
┌─────────────────────────────────────┐
│      Browser Cache                  │
│  (Static assets, images, videos)    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Service Worker                 │
│  (Offline-first, API caching)       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      CDN Cache                      │
│  (CloudFront/Cloudflare, 1hr TTL)   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Redis Cache                    │
│  (API responses, 5min TTL)          │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Database                       │
│  (Supabase Postgres)                │
└─────────────────────────────────────┘
```

### Code Splitting

```
Route-based splitting (Next.js automatic):
├── / (home)                    → ~50KB
├── /beast                      → ~30KB
├── /beast/submit               → ~40KB
├── /beast/vote                 → ~45KB
├── /beast/finale               → ~60KB
└── /beast/reel                 → ~35KB

Component lazy loading:
├── PollOverlay (on-demand)
├── Confetti (on winner reveal)
└── Video Player (on scroll)
```

---

## Monitoring & Analytics

### Metrics Dashboard (Future)

```
┌────────────────────────────────────┐
│        Mixpanel / Amplitude        │
├────────────────────────────────────┤
│ • Daily/Weekly Active Users        │
│ • Beast submission rate            │
│ • Voting participation             │
│ • Finale attendance                │
│ • Retention (D1, D7, D30)          │
│ • Funnel: Submit → Vote → Finale   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│          Sentry / LogRocket        │
├────────────────────────────────────┤
│ • Error tracking                   │
│ • Performance monitoring           │
│ • Session replay                   │
│ • User feedback                    │
└────────────────────────────────────┘
```

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│     (Next.js hosting + CDN)         │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│   Supabase   │    │  Cloudinary  │
│  (Database)  │    │   (Media)    │
└──────────────┘    └──────────────┘
```

### CI/CD Pipeline

```
GitHub Push
    ↓
GitHub Actions
    ├─ Run tests
    ├─ Type check
    ├─ Build
    ├─ Deploy preview (Vercel)
    └─ Deploy production (on merge to main)
```

---

**Architecture designed for scale, built for speed. Yo'll r Beast. 🔥**
