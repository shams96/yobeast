# YOLLR BEAST™ - COMPREHENSIVE ARCHITECTURE

## Executive Summary

Yollr Beast is a geo-fenced, campus-exclusive social competition platform combining:
- **Nikita Bier's viral social mechanics** (hyper-local, tribe-based engagement)
- **Mr Beast's spectacle-driven competition** (high-stakes prizes, weekly events)
- **BeReal's authenticity philosophy** (spontaneous moments, no curation)

## Core Philosophy

**Single Truth:** Campus students compete weekly for real money through authentic viral moments, creating the ultimate college spectacle.

---

## I. GEO-FENCING & CAMPUS IDENTITY

### Campus-Only Network
```
Every user exists within ONE campus universe
- Sign-up requires .edu email + ZIP code verification
- Content ONLY visible to same campus (except rivalry events)
- Cross-campus visibility ONLY during Beast finale
- Controlled growth through campus-specific invites
```

### Campus Graph Structure
```typescript
interface Campus {
  id: string;
  name: string;
  domain: string;           // "harvard.edu"
  zipCodes: string[];       // ["02138", "02139"]

  // Stats
  totalStudents: number;
  activeUsers: number;
  weeklyParticipation: number;

  // Rivalry
  rivals: string[];         // ["yale", "mit"]
  allTimeWins: number;
  currentRank: number;
}
```

---

## II. WEEKLY BEAST CYCLE

### Monday - REVEAL (Phase: BEAST_REVEAL)
```
🎪 Challenge Drops
- Campus-wide push notification
- Prize announcement (cash + business sponsors)
- Previous week's winner crowned
- Rivalry matchup announced (every 4th week)

Content: 30% of feed
- Beast Week card (hero position)
- Past winner spotlight
- "Predict next winner" polls
- Rivalry trash talk threads (if rivalry week)
```

### Tuesday-Wednesday - SUBMISSIONS (Phase: SUBMISSIONS_OPEN)
```
🎬 30-Second Window
- Random time notification (BeReal-style)
- 2-hour submission window
- Front camera required
- No filters, raw authenticity
- Submissions capped at 50 per campus

Content: 50% of feed
- Live submission counter
- "X slots remaining" FOMO
- Real-time submissions appearing
- Anonymous submission option for shy students
```

### Thursday-Friday - VOTING (Phase: VOTING_OPEN)
```
🔥 Campus Vote
- All submissions revealed
- Swipe-to-vote mechanics
- Top 10 announced Friday 6pm
- Comments open for finalists
- Cross-campus voting (rivalry week only)

Content: 60% of feed
- Vote interfaces
- Finalist showcase
- "Your friends voted for..." social proof
- Leaderboard updates
```

### Saturday - FINALE (Phase: FINALE_DAY)
```
🏆 Live Crowning
- 6pm synchronized event
- Top 3 live countdown
- Real-time vote tallies
- Winner announcement
- Prize distribution (instant transfer)
- Campus celebration

Content: 70% of feed
- Live finale stream
- Real-time reactions
- Campus rankings update
- Champion highlight
```

### Sunday - COOLDOWN (Phase: COOLDOWN_REEL)
```
🎬 Reflection & Recovery
- Highlight reel
- Mental health content
- Next week teaser
- Campus stats summary

Content: 20% of feed
- Best moments compilation
- "Everyone who participated is a winner"
- Counseling resources
- Campus community appreciation
```

---

## III. LOCAL BUSINESS PARTNERSHIPS

### Value Proposition

**To Businesses:**
```
"Authentic student engagement at scale

Example ROI:
- Investment: $500 prize package
- Reach: 5,000+ engaged students
- Impressions: 50,000+ weekly
- New customers: 40+ (winner + friends)
- UGC content: Winner posts with your product
- Word of mouth: Campus talks about your brand

Traditional advertising cost: $5,000+
Yollr Beast cost: $500
Savings: 90%
```

### Prize Bundle Structure
```typescript
interface BeastPrize {
  // Base cash prize
  cashAmount: number;        // $100-500

  // Business add-ons
  sponsors: Sponsor[];

  // Total value
  combinedValue: number;     // Cash + all sponsor prizes

  // Example: "$200 + Free pizza for your dorm"
  displayString: string;
}

interface Sponsor {
  businessName: string;      // "Insomnia Cookies"
  logo: string;              // Logo URL

  // Prize details
  prizeDescription: string;  // "Free dozen cookies/week for a month"
  claimLocation: string;     // "1234 College Ave"
  claimCode: string;         // "BEAST_WEEK_1"
  expirationDate: Date;

  // Value
  estimatedValue: number;    // $80
  retailValue: number;       // What students would pay: $120

  // Distribution
  claimRequirement: 'winner_only' | 'winner_plus_friends' | 'top_3';
  numberOfRecipients: number; // If winner_plus_friends: how many

  // Viral mechanics
  requiresPhoto: boolean;     // Winner must post photo with prize
  shareHashtag: string;       // "#YollrBeast #InsomniaWins"

  // Business metrics
  studentReach: number;       // Estimated impressions
  expectedROI: number;        // Expected return on investment
}
```

### Seasonal Campaign Examples

**Finals Week:**
```json
{
  "week": 14,
  "challenge": "Best Finals Week Survival Moment",
  "prize": {
    "cash": 100,
    "sponsors": [
      {
        "business": "Campus Coffee Co.",
        "prize": "Free coffee every day during finals",
        "value": 75,
        "claimRequirement": "winner_only"
      }
    ],
    "total": 175
  }
}
```

**Homecoming Week:**
```json
{
  "week": 7,
  "challenge": "Best School Spirit Moment",
  "prize": {
    "cash": 300,
    "sponsors": [
      {
        "business": "Campus Bookstore",
        "prize": "$200 school merchandise gift card",
        "value": 200,
        "claimRequirement": "winner_only"
      }
    ],
    "total": 500
  }
}
```

---

## IV. CAMPUS VS CAMPUS RIVALRY SYSTEM

### Rivalry Mechanics

**Weekly Leaderboard:**
```typescript
interface CampusStats {
  campusId: string;
  campusName: string;
  mascot: string;
  colors: string[];

  // Weekly metrics
  weeklyParticipation: number;    // % of students engaged
  beastSubmissions: number;       // Total submissions
  totalVotes: number;             // Total votes cast
  avgSubmissionQuality: number;   // Avg reactions per submission

  // All-time records
  totalBeastWins: number;
  longestWinStreak: number;
  currentStreak: number;

  // Rivalry records
  rivalryRecord: {
    [rivalCampusId: string]: {
      wins: number;
      losses: number;
      lastMeetup: Date;
      lastWinner: string;
      allTimeRecord: string;   // "12-8"
    }
  };

  // Rankings
  powerRanking: number;          // 1-100 composite score
  nationalRank: number;          // Rank among all campuses
  regionalRank: number;          // Rank in region
}
```

**Rivalry Week (Every 4th Week):**
```typescript
interface RivalryWeek extends BeastWeek {
  type: 'RIVALRY_BATTLE';

  matchup: {
    campus1: Campus;
    campus2: Campus;
    historicalRecord: string;  // "Harvard leads 12-8"
    lastMeetup: {
      week: number;
      winner: Campus;
      score: string;           // "Harvard 47 - Yale 38"
    };
  };

  // Special mechanics
  crossCampusVisibility: true;  // Both campuses see each other
  combinedLeaderboard: true;    // Joint top 10

  // Trophy
  trophy: {
    name: string;              // "The Beast Crown"
    image: string;
    description: string;
    displayDuration: '7_days';
  };

  // Trash talk
  campusThreads: {
    enabled: true;
    moderation: 'strict';      // No personal attacks
    allowedHashtags: string[]; // ["#BeatYale", "#HarvardPride"]
  };
}
```

**Administrative Pitch:**
```markdown
## To University Administration

### Student Engagement Benefits

✅ **40% increase** in student life participation
✅ **Positive school spirit** through healthy competition
✅ **Alumni engagement** (they vote for alma mater)
✅ **Recruitment tool** (prospective students see vibrant campus)
✅ **Mental health** benefits (sense of belonging)

### Safety & Moderation

✅ Moderated content (no bullying/harassment)
✅ Promotes inclusion (underdog spotlights)
✅ Mental health resources integrated
✅ Anonymous reporting system

### Cost & Revenue

✅ **$0 cost** to university
✅ Optional **revenue sharing** from local business sponsorships
✅ **Positive PR** from student satisfaction
✅ **Data insights** on student engagement
```

---

## V. NO STUDENT LEFT BEHIND (Inclusion System)

### Shy Student Support

**Anonymous Submission:**
```typescript
interface AnonymousSubmission {
  mode: 'anonymous';
  displayAs: 'Anonymous [Campus] Student';

  // Reveal conditions
  revealIfTop10: boolean;      // Default: true
  revealIfWinner: boolean;     // Default: true
  neverReveal: boolean;        // Default: false

  // User can choose to reveal later
  userCanReveal: boolean;
  revealedAt?: Date;
}
```

**First-Time Submitter Boost:**
```typescript
interface FirstTimeBoost {
  // Incentives
  bonusPoints: 25;

  // Mentor matching
  mentorMatch: {
    enabled: boolean;
    pastWinner: User;
    message: string;           // "Sarah (Week 3 Winner) wants to help!"
  };

  // Encouragement
  notification: {
    title: "🌟 First submission!";
    body: "You're braver than you think. 143 people are rooting for you!";
  };

  // Underdog multiplier
  voteBoost: 1.2;              // 20% more vote weight
}
```

**Underdog of the Week:**
```typescript
interface UnderdogSpotlight {
  // Selection criteria
  criteria: {
    lowestFollowerCount: boolean;
    firstTimeSubmitter: boolean;
    leastEngagedProfile: boolean;
    underrepresentedGroup: boolean;
  };

  // Spotlight features
  featuredOnFeed: boolean;     // Highlighted in feed
  bonusVotes: 10;              // System gives 10 automatic votes
  specialBadge: string;        // "Underdog Warrior 🦁"

  // Community support
  communityMessage: "Support our Underdog! Every vote counts.";
}
```

### Mental Health Integration

**Wellness Check-Ins:**
```typescript
interface WellnessCheck {
  triggers: {
    afterSubmission: "How are you feeling about your entry?";
    afterLoss: "Every competitor is valued. You participated!";
    multipleWeekLosses: "Taking breaks is healthy. Come back when ready.";
    weeklyCheckIn: "Remember: participation > winning";
  };

  responses: {
    negative: {
      message: "We noticed you might be struggling.";
      resources: CampusMentalHealthResource[];
      supportOptions: ['talk_to_peer', 'contact_counseling', 'take_break'];
    };

    neutral: {
      encouragement: "You're doing great by being here.";
    };

    positive: {
      celebration: "We're proud of you for competing!";
    };
  };
}
```

**Campus Resources:**
```typescript
interface MentalHealthResources {
  // Built into app
  campusCounselingCenter: {
    name: string;
    hours: string;
    phone: string;
    website: string;
    walkInAvailable: boolean;
    virtualAvailable: boolean;
  };

  // Peer support
  peerSupport: {
    enabled: boolean;
    description: "Talk to past Beast competitors";
    volunteers: User[];        // Past winners who volunteer
  };

  // Crisis resources
  crisisLine: {
    national: "988";           // National Suicide Prevention Lifeline
    campusSpecific: string;
    text: string;              // Crisis text line
    available247: boolean;
  };

  // Proactive interventions
  autoTriggers: {
    condition: 'multiple_week_losses' | 'low_engagement' | 'negative_comments';
    action: 'show_resources' | 'send_notification' | 'offer_peer_support';
    message: string;
  }[];
}
```

**Encouragement System:**
```typescript
interface EncouragementFlow {
  // For non-participants
  week1NoSubmit: {
    notification: "🌟 Your campus wants to see what you've got!";
    cta: "Watch past winners for inspiration";
    incentive: "+25 bonus points for first-time submitters";
  };

  week2NoSubmit: {
    notification: "💪 143 students submitted this week. You could be next!";
    cta: "See submissions from people like you";
    incentive: "First submission unlocks exclusive content";
  };

  week3NoSubmit: {
    notification: "🎯 Last week's winner was a first-time submitter!";
    cta: "Anonymous mode available - try risk-free";
    incentive: "Mentor matching available";
  };

  // For participants who lose
  afterLoss: {
    notification: "You competed. That makes you a champion. 💪";
    message: "Every submission takes courage. Your campus is proud.";
    nextSteps: ['try_again_next_week', 'become_voter', 'support_peers'];
  };
}
```

---

## VI. ENGAGEMENT LADDER (Progressive Unlocking)

### Tier 1: LURKER (0 points)
```
Access:
- View Beast Week card
- Watch top 3 submissions
- See campus leaderboard (read-only)

Locked:
- Voting
- Commenting
- Posting moments
- Beast submission

Unlock Path:
React to 3 pieces of content → Unlock voting
```

### Tier 2: VOTER (1-49 points)
```
Access:
- Vote in Beast Week
- Vote in polls
- React to all content
- View full leaderboard

Locked:
- Posting moments
- Beast submission
- Creating polls
- Invites

Unlock Path:
Vote in 10 polls OR react to 25 posts → Unlock content creation
```

### Tier 3: CREATOR (50-199 points)
```
Access:
- Post campus moments
- Submit to Beast Week
- Comment on all content
- Create polls

Locked:
- Invites
- Cross-campus features
- Leaderboard prominence

Unlock Path:
Get 50 total reactions OR submit to Beast 3 times → Unlock influencer tier
```

### Tier 4: INFLUENCER (200+ points)
```
Access:
- Unlimited invites
- Priority Beast Week slots
- Campus leaderboard prominence
- Multi-campus visibility (rivalry weeks)
- Exclusive badges
- Mentor new users

Special Status:
- "Campus Legend" badge
- Highlighted in feed
- Can volunteer for peer support
```

---

## VII. CONTENT DISTRIBUTION STRATEGY

### Feed Algorithm (Funnel-Optimized)

**60% Beast Ecosystem:**
- 30% Active Beast content (submissions, voting, finale)
- 15% Beast preparation (polls, predictions, hype)
- 15% Beast culture (past winners, rivalry, leaderboards)

**30% Campus Engagement:**
- 15% Campus moments (BeReal-style, potential Beast content)
- 10% Campus polls (building voting habits)
- 5% Campus challenges (mini-competitions)

**10% Strategic Glue:**
- 5% Trending topics (campus-contextualized)
- 3% Peak performance (mental health, resources)
- 2% Educational (campus resources, how-to guides)

### Adaptive Feed Based on Engagement Tier

**For Lurkers (0 points):**
```typescript
const lurkerFeed = [
  { type: 'beast_card', priority: 1000 },
  { type: 'top_moment', priority: 900 },
  { type: 'how_it_works', priority: 850 },
  { type: 'unlock_cta', priority: 800 },
  { type: 'past_winner_spotlight', priority: 750 },
];
```

**For Voters (1-49 points):**
```typescript
const voterFeed = [
  { type: 'beast_card', priority: 1000 },
  { type: 'vote_now_cta', priority: 950 },
  { type: 'campus_poll', priority: 900 },
  { type: 'trending_moment', priority: 850 },
  { type: 'unlock_creator_cta', priority: 800 },
];
```

**For Creators (50-199 points):**
```typescript
const creatorFeed = [
  { type: 'beast_card', priority: 1000 },
  { type: 'submit_beast_cta', priority: 950 },
  { type: 'campus_moment', priority: 900 },
  { type: 'poll', priority: 850 },
  { type: 'leaderboard_preview', priority: 800 },
];
```

**For Influencers (200+ points):**
```typescript
const influencerFeed = [
  { type: 'beast_card', priority: 1000 },
  { type: 'rivalry_stats', priority: 950 },
  { type: 'full_leaderboard', priority: 900 },
  { type: 'beast_submissions', priority: 850 },
  { type: 'mentor_opportunity', priority: 800 },
];
```

---

## VIII. METRICS & SUCCESS CRITERIA

### North Star Metric
**Weekly Active Beast Participants (WABP)**
= Users who submit OR vote in Beast Week

Target: 40% of active users participate weekly

### Supporting Metrics

**Engagement:**
- Submission rate: % of eligible users who submit
- Voting rate: % of campus who votes
- Daily active users (DAU)
- Weekly active users (WAU)

**Growth:**
- Invite acceptance rate
- D1/D7/D30 retention
- Time to first Beast submission
- Campus growth rate (viral coefficient)

**Quality:**
- Average submission quality (reactions/submission)
- Comment sentiment analysis
- Reported content rate (lower is better)
- User satisfaction score

**Business:**
- Sponsor acquisition rate
- Sponsor renewal rate
- Average prize value
- Business ROI metrics

**Rivalry:**
- Cross-campus engagement during rivalry weeks
- Trash talk participation (positive sentiment only)
- Alumni participation rate
- Campus pride score

**Inclusion:**
- First-time submitter rate
- Anonymous submission rate
- Underdog winner frequency
- Mental health resource utilization
- User-reported "felt supported" score

---

## IX. TECHNICAL ARCHITECTURE

### Geo-Fencing Implementation
```typescript
// Email verification
const verifyEmail = (email: string): boolean => {
  const domain = email.split('@')[1];
  return APPROVED_EDU_DOMAINS.includes(domain);
};

// ZIP code verification
const verifyZipCode = (zipCode: string, campusId: string): boolean => {
  const campus = CAMPUSES[campusId];
  return campus.approvedZipCodes.includes(zipCode);
};

// Content visibility
const canViewContent = (viewer: User, content: Content): boolean => {
  // Same campus only
  if (viewer.campusId !== content.author.campusId) {
    // Exception: Rivalry week finals
    if (content.type === 'beast_submission' && isRivalryWeek() && content.isFinalist) {
      return true;
    }
    return false;
  }
  return true;
};
```

### Real-Time Features
```typescript
// Live vote counting (WebSocket)
socket.on('vote_cast', (data) => {
  updateVoteCount(data.submissionId);
  broadcastToCanvas(data.campusId, {
    type: 'vote_update',
    submission: data.submissionId,
    newCount: data.count
  });
});

// FOMO notifications
const sendFOMONotification = (event: 'submission_window' | 'voting_closes' | 'slots_remaining') => {
  const message = FOMO_MESSAGES[event];
  sendPushNotification(campus.users, message);
};
```

---

## X. SAFETY & MODERATION

### Content Moderation
```typescript
interface ModerationSystem {
  // Auto-moderation
  aiModeration: {
    enabled: true;
    checks: ['profanity', 'nudity', 'violence', 'hate_speech'];
    autoRemove: ['explicit_nudity', 'hate_speech'];
    flagForReview: ['suggestive_content', 'mild_profanity'];
  };

  // Human moderation
  reportingSystem: {
    userReports: boolean;
    reasons: ['harassment', 'inappropriate_content', 'spam', 'other'];
    reviewQueue: 'priority_by_severity';
    responseTime: '< 2 hours';
  };

  // User protection
  blockingSystem: {
    userCanBlock: true;
    hideBlockedContent: true;
    preventInteraction: true;
  };

  // Campus-specific rules
  campusGuidelines: {
    customRules: string[];
    enforcement: 'campus_moderators';
    appealProcess: 'available';
  };
}
```

### Harassment Prevention
```typescript
// Automatic detection
const harassmentDetection = {
  patterns: [
    'repeated_negative_comments',
    'targeted_downvoting',
    'personal_attacks',
    'discriminatory_language'
  ],

  actions: {
    warn_user: 'first_offense',
    temporary_ban: 'second_offense',
    permanent_ban: 'third_offense',
    notify_campus_authorities: 'severe_cases'
  },

  // Support for victims
  victimSupport: {
    hideContent: true,
    blockHarasser: true,
    reportToCampus: 'optional',
    counselingResources: true
  }
};
```

---

## XI. MONETIZATION STRATEGY

### Revenue Streams

**1. Business Sponsorships**
- Local businesses pay for prize packages
- Revenue share: 30% platform fee
- Estimated: $500-2000 per campus per week

**2. Premium Features (Future)**
- "Beast Plus" subscription
- Priority submission slots
- Exclusive badges
- Ad-free experience
- Estimated: $4.99/month

**3. Campus Partnerships**
- Universities pay for engagement analytics
- Custom branding options
- Alumni engagement tools
- Estimated: $1000-5000 per campus per year

**4. Merchandise**
- Campus-specific Beast Week merch
- Winner commemorative items
- Rivalry week collectibles
- Estimated: 10-15% margin

### Cost Structure

**Fixed Costs:**
- Server infrastructure: $2000/month
- Content moderation: $3000/month
- Development team: $15000/month
- Legal/compliance: $1000/month

**Variable Costs:**
- Prize payouts: $500-2000 per campus per week
- Transaction fees: 3% of prizes
- Customer support: Scales with users

---

## XII. GROWTH STRATEGY

### Campus Launch Sequence

**Phase 1: Single Campus Pilot (Weeks 1-4)**
- Launch at one university (Harvard, Stanford, etc.)
- Validate mechanics
- Gather user feedback
- Iterate quickly

**Phase 2: Rivalry Expansion (Weeks 5-12)**
- Add rival campus (Yale, Cal, etc.)
- Test cross-campus features
- Optimize rivalry mechanics
- Build press buzz

**Phase 3: Regional Rollout (Months 4-6)**
- Expand to 5-10 campuses in region
- Establish regional rivalries
- Prove business model
- Secure more sponsors

**Phase 4: National Expansion (Months 7-12)**
- 50+ campuses nationwide
- National championship event
- Major brand partnerships
- Series A fundraising

### Viral Mechanics

**Invite-Only Growth:**
- Each user starts with 3 invites
- Unlock more invites through engagement
- FOMO: "Join your friends on Yollr Beast"

**Campus FOMO:**
- "5 other campuses have Yollr Beast. When will we?"
- Student demand drives university adoption

**Press & Influencers:**
- Partner with campus influencers
- College media coverage
- Viral Beast Week moments
- National college sports media

---

## XIII. SUCCESS STORIES (Projected)

### Week 1 Example
```
Campus: Harvard University
Users: 1,200 active (24% of undergrads)
Submissions: 48 Beast entries
Votes Cast: 8,400
Winner: Anonymous student (revealed as shy freshman)
Prize: $200 + Free pizza for dorm (Sponsored by Pinocchio's)

Impact:
- Winner's confidence boost
- 40 students tried Pinocchio's for first time
- Viral moment: winner's reveal video
- Campus pride: Harvard crushes it Week 1
```

---

**END OF ARCHITECTURE DOCUMENT**

This architecture provides the foundation for a viral, campus-focused social competition platform that prioritizes:
1. Student engagement and inclusion
2. Local business partnerships
3. Healthy campus rivalry
4. Mental health and well-being
5. Authentic, spontaneous content creation

Implementation follows in phases with feature flags to prevent breaking changes.
