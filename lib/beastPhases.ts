import { BeastPhase, BeastWeek } from '@/types';

/**
 * Calculate current Beast phase based on date/time
 * This will be replaced with backend logic later
 */
export function getCurrentPhase(beastWeek: BeastWeek): BeastPhase {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // For demo purposes, you can override this manually
  // In production, this would come from the database
  if (process.env.NEXT_PUBLIC_DEMO_PHASE) {
    return process.env.NEXT_PUBLIC_DEMO_PHASE as BeastPhase;
  }

  // Monday - Beast Reveal
  if (dayOfWeek === 1) {
    return 'BEAST_REVEAL';
  }

  // Tuesday - Wednesday - Submissions Open
  if (dayOfWeek === 2 || dayOfWeek === 3) {
    return 'SUBMISSIONS_OPEN';
  }

  // Thursday - Friday - Voting Open
  if (dayOfWeek === 4 || dayOfWeek === 5) {
    return 'VOTING_OPEN';
  }

  // Saturday - Finale Day
  if (dayOfWeek === 6) {
    return 'FINALE_DAY';
  }

  // Sunday - Cooldown / Beast Reel
  return 'COOLDOWN_REEL';
}

/**
 * Get countdown text for current phase
 */
export function getPhaseCountdown(beastWeek: BeastWeek): string {
  const phase = getCurrentPhase(beastWeek);
  const now = new Date();

  switch (phase) {
    case 'BEAST_REVEAL':
      const submissionStart = new Date(beastWeek.startDate);
      submissionStart.setDate(submissionStart.getDate() + 1); // Tuesday
      return getTimeUntil(submissionStart);

    case 'SUBMISSIONS_OPEN':
      return getTimeUntil(beastWeek.submissionDeadline);

    case 'VOTING_OPEN':
      return getTimeUntil(beastWeek.votingDeadline);

    case 'FINALE_DAY':
      return getTimeUntil(beastWeek.finaleTime);

    case 'COOLDOWN_REEL':
      const nextWeekStart = new Date(beastWeek.endDate);
      nextWeekStart.setDate(nextWeekStart.getDate() + 1); // Next Monday
      return getTimeUntil(nextWeekStart);

    default:
      return '';
  }
}

/**
 * Format time until a future date
 */
function getTimeUntil(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return 'Starting soon...';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return `${minutes}m`;
  }

  if (hours < 24) {
    return `${hours}h ${minutes}m`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/**
 * Check if user can submit to Beast
 */
export function canSubmitBeast(beastWeek: BeastWeek): boolean {
  const phase = getCurrentPhase(beastWeek);
  return phase === 'SUBMISSIONS_OPEN' && new Date() < beastWeek.submissionDeadline;
}

/**
 * Check if user can vote in Beast
 */
export function canVoteInBeast(beastWeek: BeastWeek): boolean {
  const phase = getCurrentPhase(beastWeek);
  return phase === 'VOTING_OPEN' && new Date() < beastWeek.votingDeadline;
}

/**
 * Check if finale is active
 */
export function isFinaleActive(beastWeek: BeastWeek): boolean {
  const phase = getCurrentPhase(beastWeek);
  const now = new Date();

  if (phase !== 'FINALE_DAY') return false;

  // Finale typically runs for 2-3 hours on Saturday
  const finaleEnd = new Date(beastWeek.finaleTime);
  finaleEnd.setHours(finaleEnd.getHours() + 2);

  return now >= beastWeek.finaleTime && now <= finaleEnd;
}

/**
 * Get timeline data for progress visualization
 */
export interface TimelineStep {
  day: string;
  label: string;
  phase: BeastPhase;
  isActive: boolean;
  isComplete: boolean;
}

export function getTimelineSteps(beastWeek: BeastWeek): TimelineStep[] {
  const currentPhase = getCurrentPhase(beastWeek);
  const phases: BeastPhase[] = [
    'BEAST_REVEAL',
    'SUBMISSIONS_OPEN',
    'VOTING_OPEN',
    'FINALE_DAY',
    'COOLDOWN_REEL',
  ];

  const currentIndex = phases.indexOf(currentPhase);

  return [
    {
      day: 'Mon',
      label: 'Reveal',
      phase: 'BEAST_REVEAL',
      isActive: currentPhase === 'BEAST_REVEAL',
      isComplete: currentIndex > 0,
    },
    {
      day: 'Tue-Wed',
      label: 'Submit',
      phase: 'SUBMISSIONS_OPEN',
      isActive: currentPhase === 'SUBMISSIONS_OPEN',
      isComplete: currentIndex > 1,
    },
    {
      day: 'Thu-Fri',
      label: 'Vote',
      phase: 'VOTING_OPEN',
      isActive: currentPhase === 'VOTING_OPEN',
      isComplete: currentIndex > 2,
    },
    {
      day: 'Sat',
      label: 'Finale',
      phase: 'FINALE_DAY',
      isActive: currentPhase === 'FINALE_DAY',
      isComplete: currentIndex > 3,
    },
    {
      day: 'Sun',
      label: 'Reel',
      phase: 'COOLDOWN_REEL',
      isActive: currentPhase === 'COOLDOWN_REEL',
      isComplete: false,
    },
  ];
}
