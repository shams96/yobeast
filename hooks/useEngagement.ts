import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  trackEngagementAction,
  calculateEngagementScore,
  shouldUnlockInvites,
  calculateInviteSlots,
} from '@/lib/utils/engagement';
import type { User } from '@/types';

type EngagementAction = 'vote' | 'post' | 'react' | 'session' | 'return';

export function useEngagement() {
  const { user: clerkUser } = useUser();
  const [userData, setUserData] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser) return;

      try {
        const userRef = doc(db, 'users', clerkUser.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [clerkUser]);

  // Track session on mount
  useEffect(() => {
    if (clerkUser && userData) {
      trackAction('session');
    }
  }, [clerkUser]);

  const trackAction = useCallback(
    async (action: EngagementAction) => {
      if (!clerkUser || !userData) return;

      setLoading(true);

      try {
        // Calculate new engagement data
        const updatedUserData = trackEngagementAction(action, userData);

        // Prepare update object
        const updates: Partial<User> = {
          engagementScore: updatedUserData.engagementScore,
          lastActive: updatedUserData.lastActive,
          sessionsCount: updatedUserData.sessionsCount,
        };

        // Update action-specific fields
        if (action === 'vote') {
          updates.votedInBeastWeek = true;
        } else if (action === 'post') {
          updates.postedMoment = true;
        } else if (action === 'react') {
          updates.reactedToContent = true;
        } else if (action === 'return') {
          if (updatedUserData.day1Return !== undefined) {
            updates.day1Return = updatedUserData.day1Return;
          }
          if (updatedUserData.day7Return !== undefined) {
            updates.day7Return = updatedUserData.day7Return;
          }
        }

        // Check if invites should be unlocked
        if (!userData.canInvite && updatedUserData.canInvite) {
          updates.canInvite = true;
          updates.inviteSlots = calculateInviteSlots(updatedUserData);

          // Show notification that invites are unlocked
          console.log('🎉 Invites unlocked!', {
            engagementScore: updatedUserData.engagementScore,
            inviteSlots: updates.inviteSlots,
          });
        }

        // Update Firestore
        const userRef = doc(db, 'users', clerkUser.id);
        await updateDoc(userRef, updates as any);

        // Update local state
        setUserData({ ...userData, ...updates });

        return updatedUserData;
      } catch (error) {
        console.error('Error tracking engagement action:', error);
      } finally {
        setLoading(false);
      }
    },
    [clerkUser, userData]
  );

  const checkInviteUnlock = useCallback(() => {
    if (!userData) return false;
    return shouldUnlockInvites(userData);
  }, [userData]);

  const getEngagementScore = useCallback(() => {
    if (!userData) return 0;
    return calculateEngagementScore(userData);
  }, [userData]);

  return {
    userData,
    loading,
    trackVote: () => trackAction('vote'),
    trackPost: () => trackAction('post'),
    trackReact: () => trackAction('react'),
    trackReturn: () => trackAction('return'),
    trackSession: () => trackAction('session'),
    checkInviteUnlock,
    getEngagementScore,
  };
}
