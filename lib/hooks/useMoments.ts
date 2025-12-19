'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { MOCK_MOMENTS } from '@/lib/mockData';
import type { Moment } from '@/types';

export function useMoments(userId?: string) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Use mock data + localStorage if Firebase not configured
    if (!isFirebaseConfigured()) {
      setError(new Error('Firebase not configured'));

      // Load moments from localStorage
      try {
        const momentsStr = localStorage.getItem('yollr_moments');
        const localMoments = momentsStr ? JSON.parse(momentsStr) : [];

        // Convert ISO strings back to Date objects
        const parsedLocalMoments = localMoments.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          expiresAt: new Date(m.expiresAt),
        }));

        // Filter out expired moments
        const now = new Date();
        const validMoments = parsedLocalMoments.filter((m: any) => new Date(m.expiresAt) > now);

        // Combine with mock data and sort by createdAt
        const allMoments = [...validMoments, ...MOCK_MOMENTS].sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
        );

        setMoments(allMoments);
      } catch (err) {
        console.error('Error loading moments from localStorage:', err);
        setMoments(MOCK_MOMENTS);
      }

      setLoading(false);
      return;
    }

    try{
      const momentsRef = collection(db, 'moments');
      let q = query(
        momentsRef,
        where('expiresAt', '>', Timestamp.now()),
        orderBy('createdAt', 'desc')
      );

      if (userId) {
        q = query(
          momentsRef,
          where('userId', '==', userId),
          where('expiresAt', '>', Timestamp.now()),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const momentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Moment[];
          setMoments(momentsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching moments:', err);
          setError(err as Error);
          setMoments(MOCK_MOMENTS);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase error, using mock moments:', err);
      setError(err as Error);
      setMoments(MOCK_MOMENTS);
      setLoading(false);
      return () => {};
    }
  }, [userId]);

  return { moments, loading, error };
}
