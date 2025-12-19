// Core Type Definitions for Yollr Beast™

export type BeastPhase =
  | 'BEAST_REVEAL'       // Monday
  | 'SUBMISSIONS_OPEN'   // Tue-Wed
  | 'VOTING_OPEN'        // Thu-Fri
  | 'FINALE_DAY'         // Saturday
  | 'COOLDOWN_REEL';     // Sunday

export type FinaleState =
  | 'LOBBY'              // Pre-show waiting room
  | 'LIVE_VOTE'          // Active voting period
  | 'REVEAL';            // Winner announcement

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  avatarUrl?: string; // Keep for backward compatibility
  campus: string;
  campusDomain?: string; // Institution email domain for data fencing (e.g., 'harvard.edu')
  year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Grad Student' | 'Not Set';
  points: number;
  beastTokens: number;
  createdAt: Date;

  // Invite system
  inviteCode: string;           // User's personal invite code (e.g., ABC123)
  invitedBy?: string;           // ID of user who invited them
  inviteSlots: number;          // How many invites they have left
  totalInvites: number;         // Total successful invites
  inviteRank?: number;          // Leaderboard position

  // Engagement tracking (for invite unlocking)
  engagementScore: number;      // 0-100, calculated from actions
  canInvite: boolean;           // Whether they've unlocked invites
  lastActive?: Date;            // Last time they opened app
  sessionsCount: number;        // Total sessions

  // Engagement actions
  votedInBeastWeek: boolean;    // Has voted in current week
  postedMoment: boolean;        // Has posted at least one moment
  reactedToContent: boolean;    // Has reacted to content

  // Retention tracking
  day1Return: boolean;          // Came back next day
  day7Return: boolean;          // Came back after 7 days

  // Location/verification
  zipCode?: string;             // For geo-based campus
  verificationLevel: number;    // 1=phone, 2=location, 3=.edu email
  isVerified: boolean;          // At least level 2

  // Inclusion features
  beastSubmissionsCount?: number;    // Total Beast submissions
  isFirstTimeSubmitter?: boolean;    // First time submitting to Beast
  preferAnonymous?: boolean;         // User prefers anonymous mode
  isUnderdog?: boolean;              // System identifies as underdog
}

// Business Sponsorship Types
export interface Sponsor {
  businessName: string;
  logo: string;
  prizeDescription: string;
  claimLocation: string;
  claimCode?: string;
  expirationDate?: Date;
  estimatedValue: number;
  retailValue: number;
  claimRequirement: 'winner_only' | 'winner_plus_friends' | 'top_3';
  numberOfRecipients?: number;
  requiresPhoto?: boolean;
  shareHashtag?: string;
  studentReach?: number;
  expectedROI?: number;
}

export interface BeastPrize {
  cashAmount: number;
  currency: string;
  sponsors: Sponsor[];
  combinedValue: number;
  displayString: string;
}

// Campus Rivalry Types
export interface CampusStats {
  campusId: string;
  campusName: string;
  mascot: string;
  colors: string[];

  // Weekly metrics
  weeklyParticipation: number;
  beastSubmissions: number;
  totalVotes: number;
  avgSubmissionQuality: number;

  // All-time records
  totalBeastWins: number;
  longestWinStreak: number;
  currentStreak: number;

  // Rivalry records
  rivalryRecord: {
    [rivalCampusId: string]: {
      wins: number;
      losses: number;
      lastMeetup?: Date;
      lastWinner?: string;
      allTimeRecord: string;
    };
  };

  // Rankings
  powerRanking: number;
  nationalRank: number;
  regionalRank?: number;
}

// Inclusion Features Types
export interface InclusionFeatures {
  anonymousMode?: {
    enabled: boolean;
    revealIfTop10?: boolean;
    revealIfWinner?: boolean;
    neverReveal?: boolean;
  };
  firstTimeSubmitter?: {
    bonusPoints: number;
    voteBoost: number;
  };
  isUnderdog?: boolean;
  underdogBoost?: number;
}

export interface BeastWeek {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  phase: BeastPhase;
  prize: BeastPrize; // Enhanced with sponsors
  rules: string[];
  submissionDeadline: Date;
  votingDeadline: Date;
  finaleTime: Date;
  maxDuration: number; // seconds
  isActive: boolean;

  // Rivalry week features
  isRivalryWeek?: boolean;
  rivalCampusId?: string;
  rivalCampusName?: string;
}

export interface BeastClip {
  id: string;
  userId: string;
  beastWeekId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  duration: number;
  isFinalist: boolean;
  finalistRank?: number;
  votesCount: number;
  reactionsCount: number;
  isBoosted: boolean;
  showUsername: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'finalist' | 'winner';
  createdAt: Date;
  user?: User;

  // Inclusion features
  isAnonymous?: boolean;         // Submitted anonymously
  isFirstTimeSubmission?: boolean; // User's first Beast submission
  hasUnderdogBoost?: boolean;    // Has received underdog boost
  revealedAt?: Date;             // When anonymous user revealed identity
}

export interface BeastVote {
  id: string;
  userId: string;
  beastClipId: string;
  beastWeekId: string;
  votedAt: Date;
  round: 'preliminary' | 'final';
}

export interface Moment {
  id: string;
  userId: string;
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  isBeastMoment: boolean;
  beastWeekId?: string;
  allowInBeastReel: boolean;
  reactionsCount: number;
  createdAt: Date;
  expiresAt: Date;
  user?: User;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  category: 'beast' | 'campus' | 'general';
  beastWeekId?: string;
  beastLinkage?: 'multiplier' | 'wildcard' | 'bonus' | 'next_theme';
  totalVotes: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  percentage: number;
}

export interface PollVote {
  id: string;
  pollId: string;
  userId: string;
  selectedOptionId: string;
  votedAt: Date;
}

export interface BeastReel {
  id: string;
  beastWeekId: string;
  clips: BeastClip[];
  moments: Moment[];
  winnerClip?: BeastClip;
  totalViews: number;
  createdAt: Date;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

// Feed Item Types
export type FeedItemType = 'beast_card' | 'beast_clip' | 'poll' | 'moment' | 'beast_moment';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  data: BeastWeek | BeastClip | Poll | Moment;
  priority: number;
  createdAt: Date;
}

// UI State Types
export interface AppState {
  currentUser: User | null;
  currentBeastWeek: BeastWeek | null;
  currentPhase: BeastPhase;
  finaleState?: FinaleState;
  hasVoted: boolean;
  hasSubmitted: boolean;
}

// Mock Data Helpers
export const MOCK_CURRENT_USER: User = {
  id: 'user_001',
  name: 'Alex Chen',
  username: 'alexc',
  avatarUrl: '/avatars/default.png',
  campus: 'State University',
  year: 'Sophomore',
  points: 1250,
  beastTokens: 15,
  createdAt: new Date('2024-09-01'),

  // Invite system
  inviteCode: 'ALEXC1',
  invitedBy: undefined,
  inviteSlots: 4,
  totalInvites: 0,
  inviteRank: undefined,

  // Engagement tracking
  engagementScore: 45,
  canInvite: false,
  lastActive: new Date(),
  sessionsCount: 8,

  // Engagement actions
  votedInBeastWeek: true,
  postedMoment: false,
  reactedToContent: true,

  // Retention tracking
  day1Return: true,
  day7Return: false,

  // Location/verification
  zipCode: undefined,
  verificationLevel: 1,
  isVerified: false,
};

export const MOCK_BEAST_WEEK: BeastWeek = {
  id: 'beast_week_001',
  weekNumber: 1,
  title: 'Week 1 Beast Challenge',
  description: 'Submit your best campus content and compete to become this week\'s Beast champion!',
  theme: 'campus_life',
  startDate: new Date('2025-01-13'),
  endDate: new Date('2025-01-19'),
  phase: 'BEAST_REVEAL',
  prize: {
    cashAmount: 100,
    currency: 'USD',
    sponsors: [
      {
        businessName: 'Insomnia Cookies',
        logo: '/sponsors/insomnia-cookies.png',
        prizeDescription: 'Free dozen cookies every week for a month',
        claimLocation: '1234 College Ave',
        claimCode: 'BEAST_WEEK_1',
        expirationDate: new Date('2025-02-19'),
        estimatedValue: 80,
        retailValue: 120,
        claimRequirement: 'winner_only',
        requiresPhoto: true,
        shareHashtag: '#YollrBeast #InsomniaWins',
        studentReach: 5000,
        expectedROI: 500,
      },
    ],
    combinedValue: 180,
    displayString: '$100 + Free Insomnia Cookies for a month',
  },
  rules: [
    'Must be 30 seconds or less',
    'Keep it campus-appropriate',
    'Original content only',
    'One submission per student',
  ],
  submissionDeadline: new Date('2025-01-15T23:59:59'),
  votingDeadline: new Date('2025-01-17T23:59:59'),
  finaleTime: new Date('2025-01-18T18:00:00'),
  maxDuration: 30,
  isActive: true,
};
