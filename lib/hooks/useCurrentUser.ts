'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/types';

export function useCurrentUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [firestoreUser, setFirestoreUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setFirestoreUser(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, 'users', clerkUser.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setFirestoreUser(userSnap.data() as User);
        } else {
          // Create new user document
          const newUser: User = {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || 'User',
            username: clerkUser.username || `user_${clerkUser.id.slice(0, 8)}`,
            avatar: clerkUser.imageUrl,
            campus: 'Not Set',
            campusDomain: undefined, // Will be set during onboarding
            year: 'Not Set',
            points: 0,
            beastTokens: 0,
            inviteCode: generateInviteCode(),
            inviteSlots: 0,
            totalInvites: 0,
            engagementScore: 0,
            canInvite: false,
            sessionsCount: 1,
            votedInBeastWeek: false,
            postedMoment: false,
            reactedToContent: false,
            day1Return: false,
            day7Return: false,
            verificationLevel: 1,
            isVerified: false,
            createdAt: new Date(),
          };

          await setDoc(userRef, newUser);
          setFirestoreUser(newUser);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [clerkUser, isLoaded, isSignedIn]);

  return { user: firestoreUser, loading, error, isSignedIn };
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
