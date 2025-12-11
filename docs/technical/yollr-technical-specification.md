# YOLLR — TECHNICAL SPECIFICATION DOCUMENT (TSD)
Version: 1.0  
Audience: Architects, Full-Stack Engineers, DevOps, Security, UI/UX Teams  
Format: Technical Specification & System Architecture  
Scope: FULL APPLICATION (NOT MVP)

---

# 1. SYSTEM OVERVIEW

Yollr is a **mobile-first PWA** combining:
- **YoBeast Weekly Drops** (MrBeast-inspired campus games)
- **Polls** (GAS)
- **Moments** (BeReal)
- **Unified Infinite Feed** (TikTok/Instagram behavior)
- **Campus-Aware Engine** (Nikita Bier model)
- **YoVault Rewards** (gamification + economy)

The system operates as:
- **A multi-tenant campus network**
- **A weekly event-driven social platform**
- **A media-rich creator ecosystem**
- **A location-aware PWA**

---

# 2. ARCHITECTURE DIAGRAM (LOGICAL)

```
 ┌──────────────────────────────┐
 │          YOLLR PWA           │
 │   Next.js 15 + React + TS    │
 └───────────┬──────────────────┘
             │
             ▼
 ┌──────────────────────────────┐
 │       STATE & DATA LAYER     │
 │   Zustand / React Query      │
 │   Supabase Client SDK        │
 └───────────┬──────────────────┘
             │
             ▼
 ┌──────────────────────────────┐
 │         SUPABASE DB          │
 │  Postgres + RLS + Storage    │
 └─────┬───────────┬────────────┘
       │           │
       ▼           ▼
┌────────────┐  ┌──────────────┐
│Edge Funcs  │  │Storage CDN   │
│(Deno)      │  │Videos/Images │
└────────────┘  └──────────────┘

```

---

# 3. TECH STACK

## 3.1 Frontend (PWA)
- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **TailwindCSS (solid-color Pantone 2025/26 palette)**
- **Zustand** (client state)
- **React Query** (server state)
- **Web Push API**
- **Web Share API**
- **Media Capture APIs**
- **Service Workers**  
  - offline feed caching  
  - queue for offline submissions  

## 3.2 Backend
- **Supabase Postgres**
- **Supabase Edge Functions (Deno)**
- **Supabase Auth (later real OTP)**
- **Supabase Storage for videos/images**
- **Supabase RLS for campus isolation**

## 3.3 Infrastructure
- **Vercel for deployment**
- **Supabase for DB/APIs**
- **Cloudflare for performance (optional)**  
- **S3 optional mirror for long-term media archival**

---

# 4. DATABASE SCHEMA (FULL DESIGN)

Below is the **complete relational schema** for Yollr.

```
TABLE users (
  id uuid pk,
  phone text,
  name text,
  avatar_url text,
  campus_id uuid fk,
  xp int default 0,
  created_at timestamp
);

TABLE campuses (
  id uuid pk,
  name text,
  type text,     -- high school / university
  zipcode text,
  latitude float,
  longitude float,
  created_at timestamp
);

TABLE beast_weeks (
  id uuid pk,
  title text,
  description text,
  prize text,
  theme text,
  phase text,         -- REVEAL, SUBMISSIONS, VOTING, FINALE, REEL
  start_date date,
  end_date date,
  created_at timestamp
);

TABLE beast_clips (
  id uuid pk,
  user_id uuid fk,
  campus_id uuid fk,
  beast_week_id uuid fk,
  video_url text,
  caption text,
  is_finalist boolean default false,
  votes_count int default 0,
  created_at timestamp
);

TABLE beast_votes (
  id uuid pk,
  user_id uuid fk,
  beast_week_id uuid fk,
  finalist_clip_id uuid fk,
  created_at timestamp
);

TABLE moments (
  id uuid pk,
  user_id uuid fk,
  campus_id uuid fk,
  beast_week_id uuid fk nullable,
  media_url text,
  caption text,
  is_beast_moment boolean,
  created_at timestamp,
  expires_at timestamp
);

TABLE polls (
  id uuid pk,
  campus_id uuid fk,
  question text,
  category text, -- 40/30/20/10 weighted types
  beast_link boolean,
  created_at timestamp
);

TABLE poll_options (
  id uuid pk,
  poll_id uuid fk,
  choice text
);

TABLE poll_votes (
  id uuid pk,
  poll_id uuid fk,
  user_id uuid fk,
  option_id uuid fk,
  created_at timestamp
);

TABLE mystery_boxes (
  id uuid pk,
  user_id uuid fk,
  beast_week_id uuid fk,
  reward_type text,
  quantity int,
  created_at timestamp
);

TABLE reels (
  id uuid pk,
  beast_week_id uuid fk,
  campus_id uuid fk,
  content jsonb,
  created_at timestamp
);

TABLE xp_events (
  id uuid pk,
  user_id uuid fk,
  type text, -- poll, moment, vote, submission, etc
  points int,
  created_at timestamp
);
```

---

# 5. CAMPUS ENGINE (AUTO-DETECTION LOGIC)

## 5.1 Steps
1. Get **geolocation permission**  
2. Convert lat/lng → **zipcode**  
3. Call `/campus/nearby?zip=`  
4. If only **1** campus: auto-select  
5. If more: present list sorted by distance  
6. Assign campus_id to user  
7. Feed + Drops filtered to that campus

## 5.2 Edge Cases
- Permission denied → manual campus input  
- Switching campuses allowed once every 30 days  
- Campus seeding auto-refresh every 90 days  

---

# 6. FEED ENGINE (ALGORITHM)

Feed is sorted by:

1. **YoBeast relevance (phase-aware priority)**
2. Polls (GAS scoring rules)
3. Moments (recency + engagement)
4. Beast Moments (phase boosted)
5. Mystery Boxes triggers
6. Local campus content only

Pseudo-ranking:

```
score = 
  (contentType == 'BEAST' ? 1000 : 0) +
  (isFinalist ? 800 : 0) +
  (isBeastMoment ? 600 : 0) +
  recencyScore +
  engagementScore +
  campusAffinity
```

---

# 7. YO BEAST ENGINE — FULL CYCLE MECHANICS

## 7.1 Monday (Reveal)
- System publishes new BeastWeek  
- Feed pinned Beast card  
- Students preview challenge  

## 7.2 Tue–Wed (Submissions)
- Upload 15 sec clips  
- Pre-moderation  
- Finalists selected Friday  

## 7.3 Thu–Fri (Voting)
- Single vote per student  
- Finalist carousel  
- Lock Friday Midnight  

## 7.4 Saturday (Finale)
- Live watch party  
- Real-time reactions  
- Confetti + Winner sequence  
- Rewards distributed  

## 7.5 Sunday (Reel)
- Auto-generated weekly recap reel  
- Shareable deep links  

---

# 8. MOMENT ENGINE

### Moment Types
- **Regular Moment** (BeReal style)
- **Beast Moment** (attached to YoBeast week)

### Logic
- Max 15 sec  
- Auto-expire in 24h  
- Auto-tag Beast Moments during Drop week  

---

# 9. POLL ENGINE

### Weighted Categories
- Academics – 40  
- Career – 30  
- Trend – 20  
- Community – 10  

### Poll Refresh
- 8–12 polls per day per campus  
- Personalization via:
  - previous answers  
  - campus trends  
  - beast week theme  

---

# 10. YOVAULT REWARD ENGINE

### Rewards from:
- Poll votes  
- Moments  
- Beast submissions  
- Beast votes  
- Finale participation  
- Daily streaks  
- Mystery Boxes  

### Reward Types
- XP  
- Boost Tokens  
- Themes  
- Frames  
- Stickers  
- Bonus votes (non-Beast only)

---

# 11. UX/UI FLOWS (FULL SYSTEM)

## 11.1 Login → Campus
- Enter phone  
- Auto OTP bypass (MVP)  
- Location request  
- Campus auto-select  

## 11.2 Feed Experience
- Vertical infinite scroll  
- Hero YoBeast card (pinned)  
- Cards:
  - Beast Card  
  - Moment Card  
  - Poll Card  
  - Beast Moment Card  
  - Mystery Box Card  

## 11.3 YoBeast Submission
1. Intro  
2. Camera  
3. Preview  
4. Submit  

## 11.4 YoBeast Voting
1. Finalist carousel  
2. Vote button  
3. Confirmation  

## 11.5 Finale Day
1. Lobby countdown  
2. Live vote  
3. Winner reveal  
4. Reel unlocked  

## 11.6 Moments
- Capture → Caption → Publish  
- Filter by:  
  - recent  
  - beast moments  
  - friends  

## 11.7 Polls
1. Click card → full overlay  
2. Select option  
3. Animated reveal  

---

# 12. PWA REQUIREMENTS

- Service worker caching  
- Offline queue for Moments and Beast submissions  
- Instant load of feed shell  
- Add to Home Screen prompt  
- 60fps scroll  
- Haptic feedback on poll votes & reactions  

---

# 13. SECURITY MODEL

### 13.1 Supabase RLS
- Restrict users to **their** campus_id data  
- Beast votes limited to once per user per week  
- Moderation logs stored for every submitted clip  

### 13.2 Storage Security
- Signed URLs for video  
- Limited expiration  
- Upload policy:
  - max 60mb  
  - MP4/H.265, WebM  

### 13.3 Abuse Prevention
- Rate limits:
  - moments/day = 3  
  - polls/day = 30  
- Flag system  
- AI moderation (future)

---

# 14. API CONTRACTS (FRONTEND ↔ BACKEND)

### /auth/login
```
POST 
{ phone }
→ { user_id, campus_id }
```

### /campus/nearby
```
GET ?zip=
→ [ campuses ]
```

### /beast/current
```
GET
→ BeastWeek object
```

### /beast/submit
```
POST
{ user_id, beast_week_id, video_url, caption }
```

### /beast/vote
```
POST
{ user_id, finalist_clip_id }
```

### /polls
```
GET
→ list of polls
```

### /polls/vote
```
POST
{ poll_id, option_id }
```

### /moment
```
POST
{ user_id, media_url, is_beast_moment }
```

---

# 15. YOBEAST TEMPLATE SYSTEM (Dynamic Weekly Template)

### Purpose  
Ensures **consistent design**, **fast weekly rollout**, and **strict UX uniformity** across all Drops.

### Components
1. **Central Config Hub**  
2. **Reusable screens & flows**  
3. **TypeScript enforcement**  
4. **Automated weekly validation (CI/CD)**  
5. **State-machine refresh mechanism**  
6. **Cross-game compatibility**  
7. **Audit trail logging**

### Template Schema
```
{
  id,
  title,
  themeColor,
  mechanics,
  safetyGuardrails,
  timing,
  exampleClips: [],
  prize,
  rules
}
```

---

# 16. SHARING AND VIRALITY LOOPS

### Auto-Generated Share Assets:
- Reel clips  
- Finalist clips  
- Winner announcement  
- Beast Moments  
- Mystery Box openings  

### Sharing Channels:
- Snap  
- IG Stories  
- TikTok  
- SMS deep links  

---

# 17. ANALYTICS & METRICS

Track:
- DAU/WAU  
- Submission count  
- Poll completion rate  
- Campus engagement  
- Finale attendance  
- Viral shares  
- Mystery Box open rate  
- Drop winner patterns  

---

# 18. ADMIN DASHBOARD

### Features
- Create/manage Drops  
- Review submissions  
- Select finalists  
- Monitor votes  
- Push finale sequences  
- Manage campuses  
- Manage reward tiers  

---

# 19. PERFORMANCE TARGETS
- First load < 1.5s  
- Feed frame latency < 16ms  
- Submission upload < 3s (avg)  
- Live finale latency < 150ms  

---

# 20. COMPLETENESS CHECK

This TSD includes:
- Full architecture  
- Full DB schema  
- Full flows  
- Full APIs  
- Full engines  
- Campus logic  
- Reward economy  
- UX flows  
- PWA setup  
- Security model  
- Analytics  
- Admin tools  
- Template engine  
- Virality mechanics  
- All core + secondary features  

**This is the complete Technical Specification.**

---

# END OF FILE
