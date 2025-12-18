'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { MOCK_MOMENTS } from '@/lib/mockData';
import type { Moment } from '@/types';

export function useMoments(userId?: string, campusDomain?: string) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Use mock data if Firebase not configured
    if (!isFirebaseConfigured()) {
      setError(new Error('Firebase not configured'));
      setMoments(MOCK_MOMENTS);
      setLoading(false);
      return;
    }

    try{
      const momentsRef = collection(db, 'moments');

      // Build query with institution filtering
      if (userId && campusDomain) {
        // User-specific moments with institution filter
        var q = query(
          momentsRef,
          where('userId', '==', userId),
          where('campusDomain', '==', campusDomain),
          where('expiresAt', '>', Timestamp.now()),
          orderBy('expiresAt', 'desc'),
          orderBy('createdAt', 'desc')
        );
      } else if (userId) {
        // User-specific moments without institution filter (backward compatibility)
        var q = query(
          momentsRef,
          where('userId', '==', userId),
          where('expiresAt', '>', Timestamp.now()),
          orderBy('expiresAt', 'desc'),
          orderBy('createdAt', 'desc')
        );
      } else if (campusDomain) {
        // Institution-wide moments
        var q = query(
          momentsRef,
          where('campusDomain', '==', campusDomain),
          where('expiresAt', '>', Timestamp.now()),
          orderBy('expiresAt', 'desc'),
          orderBy('createdAt', 'desc')
        );
      } else {
        // All moments (no filtering - for backward compatibility)
        var q = query(
          momentsRef,
          where('expiresAt', '>', Timestamp.now()),
          orderBy('expiresAt', 'desc'),
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
  }, [userId, campusDomain]);

  return { moments, loading, error };
}
