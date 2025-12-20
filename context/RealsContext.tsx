'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { createMoment, subscribeMoments } from '@/lib/firestore';
import { where, orderBy, Timestamp } from 'firebase/firestore';
import type { Moment } from '@/types';

interface RealsTime {
  todayTime: Date;
  nextRealsIn: number;
  isActive: boolean;
  hasPostedToday: boolean;
  timeRemaining: number;
  isLate: boolean;
}

interface RealsContextType {
  realsTime: RealsTime;
  generateDailyRealsTime: () => void;
  markAsPosted: (wasLate: boolean) => void;
  canSeeFeed: boolean;
  moments: Moment[];
  createNewMoment: (momentData: Omit<Moment, 'id' | 'createdAt'>) => Promise<void>;
}

const RealsContext = createContext<RealsContextType | undefined>(undefined);

export function RealsProvider({ children }: { children: ReactNode }) {
  const [realsTime, setRealsTime] = useState<RealsTime>({
    todayTime: new Date(),
    nextRealsIn: 0,
    isActive: false,
    hasPostedToday: false,
    timeRemaining: 0,
    isLate: false,
  });

  const [canSeeFeed, setCanSeeFeed] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);

  const useFirebase = isFirebaseConfigured();

  // Subscribe to real-time moments feed
  useEffect(() => {
    if (!useFirebase || !canSeeFeed) {
      // Load from localStorage if not using Firebase or feed locked
      if (!useFirebase) {
        loadLocalStorageMoments();
      }
      return;
    }

    // Real-time Firestore subscription
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const unsubscribe = subscribeMoments(
      (fetchedMoments) => {
        setMoments(fetchedMoments);
      },
      [
        where('createdAt', '>=', Timestamp.fromDate(today)),
        orderBy('createdAt', 'desc'),
      ]
    );

    return () => unsubscribe();
  }, [useFirebase, canSeeFeed]);

  // Generate random 4Real time for today (or load from localStorage)
  const generateDailyRealsTime = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('reals_time');

    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.date === today) {
        const realsDate = new Date(parsed.time);
        updateRealsState(realsDate, parsed.hasPosted || false, parsed.wasLate || false);
        return;
      }
    }

    // Generate new random time between 9 AM and 11 PM
    const now = new Date();
    const startHour = 9;
    const endHour = 23;
    const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const randomMinute = Math.floor(Math.random() * 60);

    const realsDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      randomHour,
      randomMinute,
      0
    );

    localStorage.setItem(
      'reals_time',
      JSON.stringify({
        date: today,
        time: realsDate.toISOString(),
        hasPosted: false,
        wasLate: false,
      })
    );

    updateRealsState(realsDate, false, false);
  };

  const updateRealsState = (realsDate: Date, hasPosted: boolean, wasLate: boolean) => {
    const now = new Date();
    const diff = realsDate.getTime() - now.getTime();
    const diffSeconds = Math.floor(diff / 1000);

    const WINDOW_DURATION = 2 * 60; // 2 minutes in seconds
    const timeSinceReals = Math.floor((now.getTime() - realsDate.getTime()) / 1000);

    const isActive = diffSeconds <= 0 && timeSinceReals < WINDOW_DURATION;
    const timeRemaining = isActive ? WINDOW_DURATION - timeSinceReals : 0;

    setRealsTime({
      todayTime: realsDate,
      nextRealsIn: diffSeconds > 0 ? diffSeconds : 0,
      isActive,
      hasPostedToday: hasPosted,
      timeRemaining,
      isLate: wasLate,
    });

    setCanSeeFeed(hasPosted);
  };

  const markAsPosted = (wasLate: boolean) => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('reals_time');

    if (storedData) {
      const parsed = JSON.parse(storedData);
      parsed.hasPosted = true;
      parsed.wasLate = wasLate;
      localStorage.setItem('reals_time', JSON.stringify(parsed));
    }

    setRealsTime((prev) => ({
      ...prev,
      hasPostedToday: true,
      isLate: wasLate,
    }));

    setCanSeeFeed(true);
  };

  const createNewMoment = async (momentData: Omit<Moment, 'id' | 'createdAt'>) => {
    try {
      if (useFirebase) {
        // Create in Firestore
        const expiresAt = new Date();
        expiresAt.setHours(23, 59, 59, 999); // Expires end of day

        await createMoment({
          ...momentData,
          expiresAt,
        });

        // Mark as posted
        markAsPosted(momentData.isLate || false);
      } else {
        // Fallback to localStorage
        const expiresAt = new Date();
        expiresAt.setHours(23, 59, 59, 999);

        const newMoment: Moment = {
          id: `moment_${Date.now()}`,
          ...momentData,
          createdAt: new Date(),
          expiresAt,
        };

        const storedMoments = localStorage.getItem('yollr_moments');
        const moments = storedMoments ? JSON.parse(storedMoments) : [];
        const updatedMoments = [newMoment, ...moments];

        localStorage.setItem('yollr_moments', JSON.stringify(updatedMoments));
        setMoments(updatedMoments);

        markAsPosted(momentData.isLate || false);
      }
    } catch (error) {
      console.error('Error creating moment:', error);
      throw error;
    }
  };

  const loadLocalStorageMoments = () => {
    const storedMoments = localStorage.getItem('yollr_moments');
    if (storedMoments) {
      const parsed = JSON.parse(storedMoments);
      setMoments(
        parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          expiresAt: new Date(m.expiresAt),
        }))
      );
    }
  };

  // Initialize 4Real time on mount
  useEffect(() => {
    generateDailyRealsTime();

    // Update every second for countdown
    const interval = setInterval(() => {
      const storedData = localStorage.getItem('reals_time');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        updateRealsState(
          new Date(parsed.time),
          parsed.hasPosted || false,
          parsed.wasLate || false
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RealsContext.Provider
      value={{
        realsTime,
        generateDailyRealsTime,
        markAsPosted,
        canSeeFeed,
        moments,
        createNewMoment,
      }}
    >
      {children}
    </RealsContext.Provider>
  );
}

export function useReals() {
  const context = useContext(RealsContext);
  if (!context) {
    throw new Error('useReals must be used within RealsProvider');
  }
  return context;
}
