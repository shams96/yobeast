import { Poll, Moment, User, BeastWeek, CampusStats } from '@/types';

// UAT-READY: Fresh Beast Week with business sponsorship
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
    cashAmount: 100,
    currency: 'USD',
    sponsors: [
      {
        businessName: 'Insomnia Cookies',
        logo: '/sponsors/insomnia-cookies.png',
        prizeDescription: 'Free dozen cookies every week for a month',
        claimLocation: '1234 College Ave',
        claimCode: 'BEAST_WEEK_1',
        estimatedValue: 80,
        retailValue: 120,
        claimRequirement: 'winner_only',
        requiresPhoto: true,
        shareHashtag: '#YollrBeast #InsomniaWins',
      },
    ],
    combinedValue: 180,
    displayString: '$100 + Free Insomnia Cookies for a month',
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

// Campus Rivalry Stats
export const MOCK_CAMPUS_STATS: Record<string, CampusStats> = {
  'harvard': {
    campusId: 'harvard',
    campusName: 'Harvard University',
    mascot: 'Crimson',
    colors: ['#A51C30', '#FFFFFF'],
    weeklyParticipation: 24,
    beastSubmissions: 48,
    totalVotes: 8400,
    avgSubmissionQuality: 8.7,
    totalBeastWins: 12,
    longestWinStreak: 4,
    currentStreak: 2,
    rivalryRecord: {
      'yale': {
        wins: 12,
        losses: 8,
        allTimeRecord: '12-8',
      },
      'mit': {
        wins: 8,
        losses: 6,
        allTimeRecord: '8-6',
      },
    },
    powerRanking: 92,
    nationalRank: 3,
    regionalRank: 1,
  },
  'yale': {
    campusId: 'yale',
    campusName: 'Yale University',
    mascot: 'Bulldogs',
    colors: ['#00356B', '#FFFFFF'],
    weeklyParticipation: 22,
    beastSubmissions: 51,
    totalVotes: 7800,
    avgSubmissionQuality: 8.2,
    totalBeastWins: 8,
    longestWinStreak: 3,
    currentStreak: 0,
    rivalryRecord: {
      'harvard': {
        wins: 8,
        losses: 12,
        allTimeRecord: '8-12',
      },
    },
    powerRanking: 88,
    nationalRank: 5,
    regionalRank: 2,
  },
  'mit': {
    campusId: 'mit',
    campusName: 'Massachusetts Institute of Technology',
    mascot: 'Engineers',
    colors: ['#A31F34', '#8A8B8C'],
    weeklyParticipation: 18,
    beastSubmissions: 42,
    totalVotes: 6200,
    avgSubmissionQuality: 9.1,
    totalBeastWins: 15,
    longestWinStreak: 6,
    currentStreak: 1,
    rivalryRecord: {
      'harvard': {
        wins: 6,
        losses: 8,
        allTimeRecord: '6-8',
      },
    },
    powerRanking: 94,
    nationalRank: 2,
    regionalRank: 1,
  },
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
