# Yollr Beast™ — Quick Setup Guide

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

---

## Installation Steps

### 1. Install Dependencies

```bash
cd C:\Users\New User\dev\yo\yobeast
npm install
```

This will install:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- All dev dependencies

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will hot-reload as you make changes.

---

## Testing Different Beast Phases

The app demonstrates all 5 phases of the weekly Beast cycle. By default, it shows **BEAST_REVEAL** (Monday).

### To Test Other Phases

Edit `types/index.ts` and change the `phase` in `MOCK_BEAST_WEEK`:

```typescript
export const MOCK_BEAST_WEEK: BeastWeek = {
  // ... other fields
  phase: 'SUBMISSIONS_OPEN', // Change this line
  // Options: BEAST_REVEAL | SUBMISSIONS_OPEN | VOTING_OPEN | FINALE_DAY | COOLDOWN_REEL
};
```

**Or** use environment variables (future):

Create `.env.local`:
```bash
NEXT_PUBLIC_DEMO_PHASE=VOTING_OPEN
```

---

## Key Pages to Test

### 1. Home Feed
**URL**: `/`
- See Beast card (changes based on phase)
- Browse Polls and Moments
- Click floating camera button

### 2. Beast Detail
**URL**: `/beast`
- View challenge description
- See timeline visualization
- Read rules

### 3. Submit Beast Clip
**URL**: `/beast/submit`
- Brief screen → Camera/Upload → Review
- Test caption input
- See success animation

### 4. Create Moment
**URL**: `/moment/new`
- Toggle between Moment and Beast Moment
- Upload image/video
- Test Beast Reel toggle

### 5. Beast Voting
**URL**: `/beast/vote`
- Swipe through finalists
- Vote for a clip
- See confirmation

### 6. Beast Finale
**URL**: `/beast/finale`
- Experience Lobby state
- Demo live voting
- See winner reveal with confetti

### 7. Beast Reel
**URL**: `/beast/reel`
- Browse winner + finalists + moments
- See full week archive

---

## Testing Poll Overlay

Currently polls are embedded in feed. To make them interactive:

1. Click any Poll card in the feed
2. **Future**: Will open `PollOverlay` component
3. Vote and see animated results

---

## Mobile Testing

### Browser DevTools
1. Open Chrome/Edge DevTools (F12)
2. Click device toggle icon (Ctrl+Shift+M)
3. Select iPhone 12 Pro or similar
4. Refresh page

### Real Device Testing
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://[YOUR_IP]:3000`
3. Test touch interactions, swipes, gestures

### PWA Installation (Future)
1. Chrome menu → "Install Yollr Beast"
2. App appears as standalone
3. Test offline mode

---

## Project Structure Quick Reference

```
app/
├── page.tsx                 ← Main feed (START HERE)
├── beast/
│   ├── page.tsx            ← Challenge details
│   ├── submit/page.tsx     ← Submission flow
│   ├── vote/page.tsx       ← Voting screen
│   ├── finale/page.tsx     ← Watch party
│   └── reel/page.tsx       ← Week archive
└── moment/new/page.tsx     ← Create Moment

components/
├── Header.tsx              ← Top bar
├── Feed.tsx                ← Main feed logic
├── BeastTimeline.tsx       ← Progress visualization
├── PollOverlay.tsx         ← Poll modal
└── cards/                  ← Feed item components

lib/
├── beastPhases.ts          ← Phase calculations
├── mockData.ts             ← Demo polls/moments
└── mockBeastClips.ts       ← Demo finalists

types/index.ts              ← All TypeScript types
```

---

## Common Development Tasks

### Add New Mock Data

**Edit**: `lib/mockData.ts` or `lib/mockBeastClips.ts`

Example: Add a new Poll
```typescript
export const MOCK_POLLS: Poll[] = [
  {
    id: 'poll_new',
    question: 'Your question here?',
    options: [
      { id: 'opt_1', text: 'Option 1', votesCount: 100, percentage: 50 },
      { id: 'opt_2', text: 'Option 2', votesCount: 100, percentage: 50 },
    ],
    category: 'campus',
    totalVotes: 200,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  // ... existing polls
];
```

### Change Theme Colors

**Edit**: `tailwind.config.ts`

```typescript
colors: {
  brand: {
    mocha: '#YOUR_COLOR',
    pink: '#YOUR_COLOR',
    // ...
  },
}
```

### Add New Page

1. Create file: `app/your-page/page.tsx`
2. Export component:
```typescript
export default function YourPage() {
  return <div>Your content</div>;
}
```
3. Navigate: `<Link href="/your-page">Go</Link>`

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Type check
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Styling Issues
```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./out.css --watch
```

---

## Performance Optimization

### Production Build
```bash
npm run build
npm start
```

### Analyze Bundle Size
```bash
npm install @next/bundle-analyzer
```

Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

Run:
```bash
ANALYZE=true npm run build
```

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Deploy (automatic)

### Manual Deploy
```bash
npm run build
npm start
```

Or use Docker, AWS, Google Cloud, etc.

---

## Next Steps (Backend Integration)

1. **Set up Supabase**
   - Create project
   - Run SQL migrations for tables
   - Configure RLS policies

2. **Add Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Replace Mock Data**
   - Replace `MOCK_BEAST_WEEK` with Supabase query
   - Replace `MOCK_POLLS` with real-time subscriptions
   - Replace `MOCK_MOMENTS` with user-generated content

4. **Add Authentication**
   - Implement OTP with Supabase Auth
   - Store user sessions
   - Protect submission/voting endpoints

5. **Add File Upload**
   - Configure Supabase Storage
   - Or use Cloudinary/AWS S3
   - Add video processing

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase**: https://supabase.com/docs
- **PWA Guide**: https://web.dev/progressive-web-apps/

---

**Ready to build. Yo'll r Beast. 🔥**
