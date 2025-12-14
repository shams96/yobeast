'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BeastWeek } from '@/types';

export function useCurrentBeastWeek() {
  const [beastWeek, setBeastWeek] = useState<BeastWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const beastWeeksRef = collection(db, 'beast_weeks');
    const q = query(
      beastWeeksRef,
      where('isActive', '==', true),
      orderBy('startDate', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setBeastWeek({ id: doc.id, ...doc.data() } as BeastWeek);
        } else {
          setBeastWeek(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching current beast week:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { beastWeek, loading, error };
}
