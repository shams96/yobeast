'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BeastWeek, BeastPhase, BeastClip, BeastVote } from '@/types';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  getCurrentBeastWeek,
  subscribeBeastWeek,
  createBeastWeek,
  updateBeastWeek,
  createBeastClip,
  subscribeBeastClips,
  createBeastVote,
  hasUserVoted,
} from '@/lib/firestore';

interface BeastWeekCycleContextType {
  currentWeek: BeastWeek | null;
  currentPhase: BeastPhase;
  phaseTimeRemaining: number;
  nextPhaseStartsAt: Date | null;

  submissions: BeastClip[];
  submitVideo: (videoData: Partial<BeastClip>) => Promise<void>;
  hasSubmitted: boolean;

  votes: BeastVote[];
  voteForClip: (clipId: string) => Promise<void>;
  hasVoted: boolean;
  leaderboard: BeastClip[];

  winner: BeastClip | null;
  topThree: BeastClip[];
  finaleState: 'LOBBY' | 'LIVE_VOTE' | 'REVEAL';

  beastReel: BeastClip[];

  canSubmit: boolean;
  canVote: boolean;
  isFinaleTime: boolean;
  isReelTime: boolean;
}

const BeastWeekCycleContext = createContext<BeastWeekCycleContextType | undefined>(undefined);

const PHASE_SCHEDULE = {
  BEAST_REVEAL: { day: 1, hour: 0 },
  SUBMISSIONS_OPEN: { day: 2, hour: 0 },
  VOTING_OPEN: { day: 4, hour: 0 },
  FINALE_DAY: { day: 6, hour: 18 },
  COOLDOWN_REEL: { day: 0, hour: 0 },
} as const;

export function BeastWeekCycleProvider({ children }: { children: ReactNode }) {
  const [currentWeek, setCurrentWeek] = useState<BeastWeek | null>(null);
  const [currentPhase, setCurrentPhase] = useState<BeastPhase>('BEAST_REVEAL');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number>(0);
  const [nextPhaseStartsAt, setNextPhaseStartsAt] = useState<Date | null>(null);

  const [submissions, setSubmissions] = useState<BeastClip[]>([]);
  const [votes, setVotes] = useState<BeastVote[]>([]);
  const [winner, setWinner] = useState<BeastClip | null>(null);
  const [topThree, setTopThree] = useState<BeastClip[]>([]);
  const [beastReel, setBeastReel] = useState<BeastClip[]>([]);
  const [finaleState, setFinaleState] = useState<'LOBBY' | 'LIVE_VOTE' | 'REVEAL'>('LOBBY');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const useFirebase = isFirebaseConfigured();

  // Initialize Beast Week
  useEffect(() => {
    if (useFirebase) {
      loadFirebaseBeastWeek();
    } else {
      loadLocalStorageBeastWeek();
    }
  }, [useFirebase]);

  // Subscribe to real-time submissions
  useEffect(() => {
    if (!currentWeek || !useFirebase) return;

    const unsubscribe = subscribeBeastClips(currentWeek.id, (clips) => {
      setSubmissions(clips);
      checkIfUserSubmitted(clips);
      calculateWinnerFromClips(clips);
    });

    return () => unsubscribe();
  }, [currentWeek?.id, useFirebase]);

  // Subscribe to user's voting status
  useEffect(() => {
    if (!currentWeek || !useFirebase) return;

    checkUserVotingStatus();
  }, [currentWeek?.id, useFirebase]);

  // Auto phase transition timer
  useEffect(() => {
    const phaseTimer = setInterval(() => {
      updatePhaseAndTimer();
    }, 1000);

    return () => clearInterval(phaseTimer);
  }, [currentWeek]);

  // ==================== FIREBASE METHODS ====================

  const loadFirebaseBeastWeek = async () => {
    try {
      let week = await getCurrentBeastWeek();

      if (!week) {
        // Create new week if none exists
        week = await createNewBeastWeek();
      }

      setCurrentWeek(week);

      // Subscribe to week updates
      const unsubscribe = subscribeBeastWeek((updatedWeek) => {
        if (updatedWeek) {
          setCurrentWeek(updatedWeek);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading Beast Week from Firebase:', error);
      // Fallback to localStorage
      loadLocalStorageBeastWeek();
    }
  };

  const createNewBeastWeek = async (): Promise<BeastWeek> => {
    const monday = getNextMonday(new Date());
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weekData: Omit<BeastWeek, 'id'> = {
      weekNumber: getWeekNumber(monday),
      title: 'Beast Week Challenge',
      description: 'Show us your most creative moment this week!',
      theme: 'Creativity Unleashed',
      startDate: monday,
      endDate: sunday,
      phase: 'BEAST_REVEAL',
      prize: {
        cashAmount: 500,
        currency: 'USD',
        sponsors: [],
        combinedValue: 500,
        displayString: '$500 Cash Prize',
      },
      rules: [
        'Video must be 15-60 seconds',
        'Original content only',
        'Follow community guidelines',
        'One submission per user',
      ],
      submissionDeadline: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000),
      votingDeadline: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000),
      finaleTime: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
      maxDuration: 60,
      isActive: true,
    };

    return await createBeastWeek(weekData);
  };

  const checkIfUserSubmitted = (clips: BeastClip[]) => {
    const userClip = clips.find((c) => c.userId === 'current_user');
    setHasSubmitted(!!userClip);
  };

  const checkUserVotingStatus = async () => {
    if (!currentWeek) return;

    try {
      const voted = await hasUserVoted('current_user', currentWeek.id);
      setHasVoted(voted);
    } catch (error) {
      console.error('Error checking voting status:', error);
    }
  };

  const submitVideo = async (videoData: Partial<BeastClip>) => {
    if (!currentWeek || currentPhase !== 'SUBMISSIONS_OPEN') {
      alert('Submissions are not open right now!');
      return;
    }

    if (hasSubmitted) {
      alert('You have already submitted this week!');
      return;
    }

    try {
      if (useFirebase) {
        await createBeastClip({
          userId: 'current_user',
          beastWeekId: currentWeek.id,
          videoUrl: videoData.videoUrl || '',
          caption: videoData.caption || '',
          duration: videoData.duration || 30,
          isFinalist: false,
          votesCount: 0,
          reactionsCount: 0,
          isBoosted: false,
          showUsername: true,
          status: 'approved',
        });
        setHasSubmitted(true);
      } else {
        // Fallback to localStorage
        const newSubmission: BeastClip = {
          id: `clip_${Date.now()}`,
          userId: 'current_user',
          beastWeekId: currentWeek.id,
          videoUrl: videoData.videoUrl || '',
          caption: videoData.caption || '',
          duration: videoData.duration || 30,
          isFinalist: false,
          votesCount: 0,
          reactionsCount: 0,
          isBoosted: false,
          showUsername: true,
          status: 'approved',
          createdAt: new Date(),
        };

        const updatedSubmissions = [...submissions, newSubmission];
        setSubmissions(updatedSubmissions);
        setHasSubmitted(true);
        localStorage.setItem('beast_submissions', JSON.stringify(updatedSubmissions));
      }
    } catch (error) {
      console.error('Error submitting video:', error);
      alert('Error submitting video. Please try again.');
    }
  };

  const voteForClip = async (clipId: string) => {
    if (!currentWeek || !['VOTING_OPEN', 'FINALE_DAY'].includes(currentPhase)) {
      alert('Voting is not open right now!');
      return;
    }

    if (hasVoted) {
      alert('You have already voted this week!');
      return;
    }

    try {
      if (useFirebase) {
        await createBeastVote({
          userId: 'current_user',
          beastClipId: clipId,
          beastWeekId: currentWeek.id,
          round: 'preliminary',
        });
        setHasVoted(true);
      } else {
        // Fallback to localStorage
        const newVote: BeastVote = {
          id: `vote_${Date.now()}`,
          userId: 'current_user',
          beastClipId: clipId,
          beastWeekId: currentWeek.id,
          votedAt: new Date(),
          round: 'preliminary',
        };

        const updatedSubmissions = submissions.map((s) =>
          s.id === clipId ? { ...s, votesCount: s.votesCount + 1 } : s
        );

        const updatedVotes = [...votes, newVote];
        setVotes(updatedVotes);
        setSubmissions(updatedSubmissions);
        setHasVoted(true);

        localStorage.setItem('beast_votes', JSON.stringify(updatedVotes));
        localStorage.setItem('beast_submissions', JSON.stringify(updatedSubmissions));
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert(error instanceof Error ? error.message : 'Error voting. Please try again.');
    }
  };

  // ==================== LOCALSTORAGE FALLBACK ====================

  const loadLocalStorageBeastWeek = () => {
    const stored = localStorage.getItem('current_beast_week');
    const today = new Date();

    if (stored) {
      const parsed = JSON.parse(stored);
      const weekStart = new Date(parsed.startDate);
      const weekEnd = new Date(parsed.endDate);

      if (today >= weekStart && today <= weekEnd) {
        setCurrentWeek({
          ...parsed,
          startDate: weekStart,
          endDate: weekEnd,
          submissionDeadline: new Date(parsed.submissionDeadline),
          votingDeadline: new Date(parsed.votingDeadline),
          finaleTime: new Date(parsed.finaleTime),
        });
        loadLocalStorageSubmissions();
        loadLocalStorageVotes();
        return;
      }
    }

    // Generate new week
    const monday = getNextMonday(today);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const newWeek: BeastWeek = {
      id: `week_${Date.now()}`,
      weekNumber: getWeekNumber(monday),
      title: 'Beast Week Challenge',
      description: 'Show us your most creative moment this week!',
      theme: 'Creativity Unleashed',
      startDate: monday,
      endDate: sunday,
      phase: 'BEAST_REVEAL',
      prize: {
        cashAmount: 500,
        currency: 'USD',
        sponsors: [],
        combinedValue: 500,
        displayString: '$500 Cash Prize',
      },
      rules: [
        'Video must be 15-60 seconds',
        'Original content only',
        'Follow community guidelines',
        'One submission per user',
      ],
      submissionDeadline: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000),
      votingDeadline: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000),
      finaleTime: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
      maxDuration: 60,
      isActive: true,
    };

    localStorage.setItem('current_beast_week', JSON.stringify(newWeek));
    setCurrentWeek(newWeek);
  };

  const loadLocalStorageSubmissions = () => {
    const stored = localStorage.getItem('beast_submissions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSubmissions(
        parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }))
      );

      const userSubmitted = parsed.some((s: any) => s.userId === 'current_user');
      setHasSubmitted(userSubmitted);
    }
  };

  const loadLocalStorageVotes = () => {
    const stored = localStorage.getItem('beast_votes');
    if (stored) {
      const parsed = JSON.parse(stored);
      setVotes(
        parsed.map((v: any) => ({
          ...v,
          votedAt: new Date(v.votedAt),
        }))
      );

      const userVoted = parsed.some((v: any) => v.userId === 'current_user');
      setHasVoted(userVoted);
    }
  };

  // ==================== PHASE LOGIC (Client-Side) ====================

  const updatePhaseAndTimer = () => {
    if (!currentWeek) return;

    const now = new Date();
    const detectedPhase = detectCurrentPhase(now, currentWeek.startDate);

    if (detectedPhase !== currentPhase) {
      setCurrentPhase(detectedPhase);
      handlePhaseTransition(detectedPhase);
    }

    const nextPhase = getNextPhaseTime(now, currentWeek.startDate);
    if (nextPhase) {
      const timeLeft = Math.floor((nextPhase.getTime() - now.getTime()) / 1000);
      setPhaseTimeRemaining(Math.max(0, timeLeft));
      setNextPhaseStartsAt(nextPhase);
    }
  };

  const detectCurrentPhase = (now: Date, weekStart: Date): BeastPhase => {
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    if (dayOfWeek === 1) return 'BEAST_REVEAL';
    if (dayOfWeek === 2 || dayOfWeek === 3) return 'SUBMISSIONS_OPEN';
    if (dayOfWeek === 4 || dayOfWeek === 5) return 'VOTING_OPEN';
    if (dayOfWeek === 6) {
      if (hour < 18) return 'VOTING_OPEN';
      return 'FINALE_DAY';
    }
    if (dayOfWeek === 0) return 'COOLDOWN_REEL';

    return 'BEAST_REVEAL';
  };

  const getNextPhaseTime = (now: Date, weekStart: Date): Date | null => {
    const currentPhaseIndex = ['BEAST_REVEAL', 'SUBMISSIONS_OPEN', 'VOTING_OPEN', 'FINALE_DAY', 'COOLDOWN_REEL'].indexOf(
      currentPhase
    );

    const phaseTransitions = [
      { day: 1, hour: 0 },
      { day: 2, hour: 0 },
      { day: 4, hour: 0 },
      { day: 6, hour: 18 },
      { day: 0, hour: 0 },
    ];

    if (currentPhaseIndex >= phaseTransitions.length - 1) {
      const nextMonday = getNextMonday(now);
      return nextMonday;
    }

    const nextTransition = phaseTransitions[currentPhaseIndex + 1];
    const nextPhaseDate = new Date(weekStart);

    const daysToAdd = nextTransition.day === 0 ? 6 : nextTransition.day - 1;
    nextPhaseDate.setDate(nextPhaseDate.getDate() + daysToAdd);
    nextPhaseDate.setHours(nextTransition.hour, 0, 0, 0);

    return nextPhaseDate;
  };

  const handlePhaseTransition = (newPhase: BeastPhase) => {
    console.log(`🔄 Phase transition: ${currentPhase} → ${newPhase}`);

    switch (newPhase) {
      case 'BEAST_REVEAL':
        resetWeekData();
        break;
      case 'FINALE_DAY':
        calculateWinnerFromClips(submissions);
        setFinaleState('LOBBY');
        break;
      case 'COOLDOWN_REEL':
        generateBeastReel();
        break;
    }
  };

  const resetWeekData = () => {
    setSubmissions([]);
    setVotes([]);
    setWinner(null);
    setTopThree([]);
    setBeastReel([]);
    setHasSubmitted(false);
    setHasVoted(false);
    setFinaleState('LOBBY');

    if (!useFirebase) {
      localStorage.removeItem('beast_submissions');
      localStorage.removeItem('beast_votes');
      localStorage.removeItem('beast_winner');
    }
  };

  const calculateWinnerFromClips = (clips: BeastClip[]) => {
    if (clips.length === 0) return;

    const sorted = [...clips].sort((a, b) => b.votesCount - a.votesCount);
    const top3 = sorted.slice(0, 3);
    setTopThree(top3);

    if (sorted[0]) {
      setWinner(sorted[0]);
      if (!useFirebase) {
        localStorage.setItem('beast_winner', JSON.stringify(sorted[0]));
      }
    }
  };

  const generateBeastReel = () => {
    const sorted = [...submissions].sort((a, b) => b.votesCount - a.votesCount);
    const reel = sorted.slice(0, 5);
    setBeastReel(reel);

    if (!useFirebase) {
      localStorage.setItem('beast_reel', JSON.stringify(reel));
    }
  };

  // Computed values
  const leaderboard = [...submissions].sort((a, b) => b.votesCount - a.votesCount);
  const canSubmit = currentPhase === 'SUBMISSIONS_OPEN' && !hasSubmitted;
  const canVote = ['VOTING_OPEN', 'FINALE_DAY'].includes(currentPhase) && !hasVoted;
  const isFinaleTime = currentPhase === 'FINALE_DAY';
  const isReelTime = currentPhase === 'COOLDOWN_REEL';

  return (
    <BeastWeekCycleContext.Provider
      value={{
        currentWeek,
        currentPhase,
        phaseTimeRemaining,
        nextPhaseStartsAt,

        submissions,
        submitVideo,
        hasSubmitted,

        votes,
        voteForClip,
        hasVoted,
        leaderboard,

        winner,
        topThree,
        finaleState,

        beastReel,

        canSubmit,
        canVote,
        isFinaleTime,
        isReelTime,
      }}
    >
      {children}
    </BeastWeekCycleContext.Provider>
  );
}

export function useBeastWeekCycle() {
  const context = useContext(BeastWeekCycleContext);
  if (!context) {
    throw new Error('useBeastWeekCycle must be used within BeastWeekCycleProvider');
  }
  return context;
}

// Utility functions
function getNextMonday(from: Date): Date {
  const monday = new Date(from);
  const dayOfWeek = monday.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
  monday.setDate(monday.getDate() + daysUntilMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Calculate sequential week number since app launch
 * Week 1 = First week of Beast competition (starting December 23, 2024)
 * This gives users context: "This is week 3 of the competition"
 * instead of confusing ISO week numbers like "W52"
 */
function getWeekNumber(date: Date): number {
  // App launch date (first Beast Week Monday)
  const APP_LAUNCH_DATE = new Date('2024-12-23T00:00:00');

  // Get the Monday of the week for the given date
  const currentMonday = getMondayOfWeek(date);

  // Calculate weeks since launch
  const daysSinceLaunch = Math.floor(
    (currentMonday.getTime() - APP_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weeksSinceLaunch = Math.floor(daysSinceLaunch / 7);

  // Week 1 is the launch week, so add 1
  return weeksSinceLaunch + 1;
}

/**
 * Get the Monday of the week for any given date
 */
function getMondayOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
