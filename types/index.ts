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
  avatarUrl: string;
  campus: string;
  year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  points: number;
  beastTokens: number;
  createdAt: Date;
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
  prize: {
    amount: number;
    currency: string;
    sponsor?: string;
  };
  rules: string[];
  submissionDeadline: Date;
  votingDeadline: Date;
  finaleTime: Date;
  maxDuration: number; // seconds
  isActive: boolean;
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
};

export const MOCK_BEAST_WEEK: BeastWeek = {
  id: 'beast_week_007',
  weekNumber: 7,
  title: '3-Clip Comedy Sprint',
  description: 'Make your campus laugh in 15 seconds or less. Best comedy clip wins.',
  theme: 'comedy',
  startDate: new Date('2025-01-13'),
  endDate: new Date('2025-01-19'),
  phase: 'BEAST_REVEAL',
  prize: {
    amount: 250,
    currency: 'USD',
    sponsor: 'Campus Eats',
  },
  rules: [
    'Must be 15 seconds or less',
    'Keep it campus-appropriate',
    'Original content only',
    'One submission per student',
  ],
  submissionDeadline: new Date('2025-01-15T23:59:59'),
  votingDeadline: new Date('2025-01-17T23:59:59'),
  finaleTime: new Date('2025-01-18T18:00:00'),
  maxDuration: 15,
  isActive: true,
};
