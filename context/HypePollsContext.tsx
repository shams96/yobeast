'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  getTodayHypePolls,
  subscribeHypePolls,
  createPollVote,
  hasUserVotedOnPoll,
} from '@/lib/firestore';
import type { HypePoll, PollVote, ComplimentNotification } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Positive question library (Gas/TBH style)
const POSITIVE_QUESTIONS = [
  // Social & Personality
  "Who's the most welcoming person you know?",
  "Who makes everyone laugh?",
  "Who's the most creative thinker?",
  "Who always knows what to say?",
  "Who's the life of the party?",
  "Who has the best energy?",
  "Who's the most genuine person?",
  "Who would you want on your team?",

  // Academics & Skills
  "Who's going to change the world?",
  "Who gives the best advice?",
  "Who's the smartest person you know?",
  "Who's the most talented?",
  "Who's going to be famous?",
  "Who inspires you the most?",

  // Style & Vibes
  "Who has the best style?",
  "Who has main character energy?",
  "Who's the most confident?",
  "Who's the most down to earth?",
  "Who would you trust with a secret?",
  "Who's the best at making friends?",

  // Campus Life
  "Who's the most likely to help you out?",
  "Who makes campus better?",
  "Who's always there for you?",
  "Who's the most fun to be around?",
];

interface HypePollsContextType {
  dailyPolls: HypePoll[];
  myVotes: PollVote[];
  myNotifications: ComplimentNotification[];
  totalCompliments: number;
  voteForPerson: (pollId: string, personId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  hasVotedOnPoll: (pollId: string) => boolean;
}

const HypePollsContext = createContext<HypePollsContextType | undefined>(undefined);

export function HypePollsProvider({ children }: { children: ReactNode }) {
  const [dailyPolls, setDailyPolls] = useState<HypePoll[]>([]);
  const [myVotes, setMyVotes] = useState<PollVote[]>([]);
  const [myNotifications, setMyNotifications] = useState<ComplimentNotification[]>([]);
  const [totalCompliments, setTotalCompliments] = useState(0);

  const { user } = useAuth();
  const useFirebase = isFirebaseConfigured();

  // Initialize and subscribe to daily polls
  useEffect(() => {
    if (useFirebase) {
      loadFirebasePolls();
    } else {
      generateDailyPolls();
    }
    loadMyVotes();
    loadMyNotifications();
  }, [useFirebase]);

  // Subscribe to real-time poll updates
  useEffect(() => {
    if (!useFirebase) return;

    const unsubscribe = subscribeHypePolls((fetchedPolls) => {
      setDailyPolls(fetchedPolls);
    });

    return () => unsubscribe();
  }, [useFirebase]);

  const loadFirebasePolls = async () => {
    try {
      const polls = await getTodayHypePolls();
      setDailyPolls(polls);
    } catch (error) {
      console.error('Error loading Firebase polls:', error);
      generateDailyPolls(); // Fallback to localStorage
    }
  };

  const generateDailyPolls = () => {
    const today = new Date().toDateString();
    const storedPolls = localStorage.getItem('hype_polls');

    if (storedPolls) {
      const parsed = JSON.parse(storedPolls);
      if (parsed.date === today) {
        // Use existing polls for today
        setDailyPolls(parsed.polls.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          expiresAt: new Date(p.expiresAt),
        })));
        return;
      }
    }

    // Generate new polls for today (pick 5 random questions)
    const shuffled = [...POSITIVE_QUESTIONS].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

    const newPolls: HypePoll[] = selectedQuestions.map((question, index) => {
      const category = index % 2 === 0 ? 'social' : index % 3 === 0 ? 'academic' : 'style';
      return {
        id: `poll_${Date.now()}_${index}`,
        question,
        category,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        votesCount: Math.floor(Math.random() * 50) + 10, // Mock vote count for social proof
      };
    });

    localStorage.setItem('hype_polls', JSON.stringify({
      date: today,
      polls: newPolls,
    }));

    setDailyPolls(newPolls);
  };

  const loadMyVotes = () => {
    const storedVotes = localStorage.getItem('my_poll_votes');
    if (storedVotes) {
      const parsed = JSON.parse(storedVotes);
      setMyVotes(parsed.map((v: any) => ({
        ...v,
        votedAt: new Date(v.votedAt),
      })));
    }
  };

  const loadMyNotifications = () => {
    const storedNotifs = localStorage.getItem('my_compliments');
    if (storedNotifs) {
      const parsed = JSON.parse(storedNotifs);
      setMyNotifications(parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      })));

      // Calculate total compliments
      const total = parsed.reduce((sum: number, n: any) => sum + n.count, 0);
      setTotalCompliments(total);
    }
  };

  const voteForPerson = async (pollId: string, personId: string) => {
    if (!user?.id) {
      alert('Please sign in to vote');
      return;
    }

    try {
      if (useFirebase) {
        // Create vote in Firestore
        await createPollVote({
          userId: user.id,
          pollId,
          votedForUserId: personId,
          isAnonymous: true,
        });

        // Update local state
        const newVote: PollVote = {
          id: `vote_${Date.now()}`,
          userId: user.id,
          pollId,
          votedForUserId: personId,
          votedAt: new Date(),
          isAnonymous: true,
        };
        setMyVotes((prev) => [...prev, newVote]);

        // Simulate notification (in production, done server-side)
        simulateNotificationForVotedPerson(pollId, personId);
      } else {
        // Fallback to localStorage
        const newVote: PollVote = {
          id: `vote_${Date.now()}`,
          userId: user.id,
          pollId,
          votedForUserId: personId,
          votedAt: new Date(),
          isAnonymous: true,
        };

        const updatedVotes = [...myVotes, newVote];
        setMyVotes(updatedVotes);
        localStorage.setItem('my_poll_votes', JSON.stringify(updatedVotes));
        simulateNotificationForVotedPerson(pollId, personId);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Already voted on this poll or error occurred');
    }
  };

  const simulateNotificationForVotedPerson = (pollId: string, personId: string) => {
    // In production, this would increment a counter in the database
    // For demo, we'll create notifications for the current user
    const poll = dailyPolls.find(p => p.id === pollId);
    if (!poll || !user?.id) return;

    // Check if there's an existing notification for this poll
    const existingNotif = myNotifications.find(n => n.pollQuestion === poll.question);

    if (existingNotif) {
      // Increment count
      const updatedNotifs = myNotifications.map(n =>
        n.pollQuestion === poll.question
          ? { ...n, count: n.count + 1, isRead: false }
          : n
      );
      setMyNotifications(updatedNotifs);
      localStorage.setItem('my_compliments', JSON.stringify(updatedNotifs));
      setTotalCompliments(prev => prev + 1);
    } else {
      // Create new notification
      const newNotif: ComplimentNotification = {
        id: `notif_${Date.now()}`,
        recipientId: user.id,
        message: `Someone voted for you! 🔥`,
        count: 1,
        pollQuestion: poll.question,
        createdAt: new Date(),
        isRead: false,
      };
      const updatedNotifs = [newNotif, ...myNotifications];
      setMyNotifications(updatedNotifs);
      localStorage.setItem('my_compliments', JSON.stringify(updatedNotifs));
      setTotalCompliments(prev => prev + 1);
    }
  };

  const markNotificationRead = (notificationId: string) => {
    const updatedNotifs = myNotifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setMyNotifications(updatedNotifs);
    localStorage.setItem('my_compliments', JSON.stringify(updatedNotifs));
  };

  const hasVotedOnPollLocal = (pollId: string): boolean => {
    return myVotes.some(v => v.pollId === pollId);
  };

  return (
    <HypePollsContext.Provider value={{
      dailyPolls,
      myVotes,
      myNotifications,
      totalCompliments,
      voteForPerson,
      markNotificationRead,
      hasVotedOnPoll: hasVotedOnPollLocal,
    }}>
      {children}
    </HypePollsContext.Provider>
  );
}

export function useHypePolls() {
  const context = useContext(HypePollsContext);
  if (!context) {
    throw new Error('useHypePolls must be used within HypePollsProvider');
  }
  return context;
}
