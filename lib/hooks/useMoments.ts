'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Moment } from '@/types';

export function useMoments(userId?: string) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

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
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { moments, loading, error };
}
