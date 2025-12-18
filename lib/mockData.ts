import { Poll, Moment, User, BeastWeek } from '@/types';

// UAT-READY: Fresh Beast Week with minimal data
export const MOCK_BEAST_WEEK: BeastWeek = {
  id: 'beast_week_001',
  weekNumber: 1,
  title: 'Week 1 Beast Challenge',
  description: 'Submit your best campus content and compete to become this week\'s Beast champion!',
  theme: 'Campus Life',
  startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  phase: 'BEAST_REVEAL',
  prize: {
    amount: 100,
    currency: 'USD',
  },
  rules: [
    'Must be original content filmed this week',
    'Keep it campus-appropriate',
    'Maximum 30 seconds duration',
  ],
  submissionDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  votingDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  finaleTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  maxDuration: 30,
  isActive: true,
};

// UAT-READY: Clean user data without specific identities
export const MOCK_USERS: User[] = [
  {
    id: 'demo_user_001',
    name: 'Demo Student',
    username: 'demo_student',
    campus: 'Demo University',
    year: 'Sophomore',
    points: 0,
    beastTokens: 0,
    inviteCode: 'DEMO01',
    inviteSlots: 0,
    totalInvites: 0,
    engagementScore: 0,
    canInvite: false,
    sessionsCount: 1,
    votedInBeastWeek: false,
    postedMoment: false,
    reactedToContent: false,
    day1Return: false,
    day7Return: false,
    verificationLevel: 1,
    isVerified: false,
    createdAt: new Date(),
  },
];

// UAT-READY: Single sample poll with fresh data
export const MOCK_POLLS: Poll[] = [
  {
    id: 'poll_demo_001',
    question: 'What should next week\'s Beast challenge be?',
    options: [
      { id: 'opt_1', text: 'Campus Tour', votesCount: 0, percentage: 0 },
      { id: 'opt_2', text: 'Talent Show', votesCount: 0, percentage: 0 },
      { id: 'opt_3', text: 'Sports Challenge', votesCount: 0, percentage: 0 },
      { id: 'opt_4', text: 'Creative Content', votesCount: 0, percentage: 0 },
    ],
    category: 'beast',
    beastLinkage: 'next_theme',
    beastWeekId: 'beast_week_001',
    totalVotes: 0,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
];

// UAT-READY: Single sample moment with no external URLs
export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'moment_demo_001',
    userId: 'demo_user_001',
    campusDomain: 'demo.edu',
    caption: 'Getting ready for Week 1 Beast Challenge!',
    isBeastMoment: true,
    beastWeekId: 'beast_week_001',
    allowInBeastReel: true,
    reactionsCount: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    user: MOCK_USERS[0],
  },
];
