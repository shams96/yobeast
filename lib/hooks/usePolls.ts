'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Poll } from '@/types';

export function usePolls(beastWeekId?: string) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

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
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [beastWeekId]);

  return { polls, loading, error };
}
