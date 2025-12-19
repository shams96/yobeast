'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

// Demo accounts (matches DEMO_ACCOUNTS.md)
const DEMO_ACCOUNTS = [
  { email: 'demo@harvard.edu', password: 'HarvardDemo2025!$', campus: 'Harvard University', domain: 'harvard.edu', username: 'demo_harvard' },
  { email: 'demo@mit.edu', password: 'MITDemo2025!$', campus: 'Massachusetts Institute of Technology', domain: 'mit.edu', username: 'demo_mit' },
  { email: 'demo@stanford.edu', password: 'StanfordDemo2025!$', campus: 'Stanford University', domain: 'stanford.edu', username: 'demo_stanford' },
  { email: 'demo@berkeley.edu', password: 'BerkeleyDemo2025!$', campus: 'University of California, Berkeley', domain: 'berkeley.edu', username: 'demo_berkeley' },
  { email: 'demo@yale.edu', password: 'YaleDemo2025!$', campus: 'Yale University', domain: 'yale.edu', username: 'demo_yale' },
];

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('yollr_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        if (parsedUser.createdAt) parsedUser.createdAt = new Date(parsedUser.createdAt);
        if (parsedUser.lastActive) parsedUser.lastActive = new Date(parsedUser.lastActive);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('yollr_user');
      }
    }
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check against demo accounts
    const account = DEMO_ACCOUNTS.find(acc => acc.email === email && acc.password === password);

    if (!account) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check if user already exists in localStorage (has completed onboarding)
    const existingUsers = localStorage.getItem('yollr_users');
    let users: User[] = [];
    if (existingUsers) {
      try {
        users = JSON.parse(existingUsers);
      } catch (e) {
        console.error('Failed to parse users:', e);
      }
    }

    const existingUser = users.find(u => u.username === account.username);

    if (existingUser) {
      // User has completed onboarding, restore their profile
      setUser(existingUser);
      localStorage.setItem('yollr_user', JSON.stringify(existingUser));
      return { success: true };
    } else {
      // New user, needs onboarding - create minimal user object
      const newUser: User = {
        id: `user_${account.username}`,
        name: account.campus.split(' ')[0], // Temporary name
        username: account.username,
        campus: account.campus,
        campusDomain: account.domain,
        points: 0,
        beastTokens: 0,
        createdAt: new Date(),
        inviteCode: account.username.toUpperCase().slice(0, 6),
        inviteSlots: 4,
        totalInvites: 0,
        engagementScore: 0,
        canInvite: false,
        sessionsCount: 1,
        votedInBeastWeek: false,
        postedMoment: false,
        reactedToContent: false,
        day1Return: false,
        day7Return: false,
        verificationLevel: 2,
        isVerified: true,
      };

      setUser(newUser);
      localStorage.setItem('yollr_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const signUp = async (email: string, password: string, name: string, username: string): Promise<{ success: boolean; error?: string }> => {
    // For demo, just validate email is from demo accounts
    const account = DEMO_ACCOUNTS.find(acc => acc.email === email);

    if (!account) {
      return { success: false, error: 'Email not in demo account list' };
    }

    if (account.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    // Create new user (will complete in onboarding)
    const newUser: User = {
      id: `user_${username}`,
      name,
      username,
      campus: account.campus,
      campusDomain: account.domain,
      points: 0,
      beastTokens: 0,
      createdAt: new Date(),
      inviteCode: username.toUpperCase().slice(0, 6),
      inviteSlots: 4,
      totalInvites: 0,
      engagementScore: 0,
      canInvite: false,
      sessionsCount: 1,
      votedInBeastWeek: false,
      postedMoment: false,
      reactedToContent: false,
      day1Return: false,
      day7Return: false,
      verificationLevel: 2,
      isVerified: true,
    };

    setUser(newUser);
    localStorage.setItem('yollr_user', JSON.stringify(newUser));
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('yollr_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('yollr_user', JSON.stringify(updatedUser));

    // Also update in users list
    const existingUsers = localStorage.getItem('yollr_users');
    let users: User[] = [];
    if (existingUsers) {
      try {
        users = JSON.parse(existingUsers);
      } catch (e) {
        console.error('Failed to parse users:', e);
      }
    }

    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem('yollr_users', JSON.stringify(users));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
