'use client';

import { useAuth } from '@/context/AuthContext';
import type { User } from '@/types';

/**
 * Hook to get current user from auth context
 * No longer uses Clerk or Firebase - uses simple localStorage auth
 */
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useAuth();

  return {
    user,
    loading: !isLoaded,
    error: null,
    isSignedIn
  };
}
