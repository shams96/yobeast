'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { MOCK_POLLS } from '@/lib/mockData';
import type { Poll } from '@/types';

export function usePolls(beastWeekId?: string) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Use mock data if Firebase not configured
    if (!isFirebaseConfigured()) {
      setError(new Error('Firebase not configured'));
      setPolls(MOCK_POLLS);
      setLoading(false);
      return;
    }

    try {
      const pollsRef = collection(db, 'polls');
      let q = query(
        pollsRef,
        where('expiresAt', '>', Timestamp.now()),
        orderBy('expiresAt', 'asc')
      );

      if (beastWeekId) {
        q = query(
          pollsRef,
          where('beastWeekId', '==', beastWeekId),
          where('expiresAt', '>', Timestamp.now()),
          orderBy('expiresAt', 'asc')
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const pollsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Poll[];
          setPolls(pollsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching polls:', err);
          setError(err as Error);
          setPolls(MOCK_POLLS);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase error, using mock polls:', err);
      setError(err as Error);
      setPolls(MOCK_POLLS);
      setLoading(false);
      return () => {};
    }
  }, [beastWeekId]);

  return { polls, loading, error };
}
