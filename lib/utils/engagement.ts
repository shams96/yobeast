/**
 * Engagement Tracking & Invite Unlock System
 * Based on sequential validation framework
 */

import type { User } from '@/types';

/**
 * Calculate user's engagement score (0-100)
 *
 * Formula:
 * - Core actions: 40 points (voting, posting, reacting)
 * - Retention: 30 points (day 1, day 7 return)
 * - Activity: 30 points (sessions, consistency)
 */
export function calculateEngagementScore(user: Partial<User>): number {
  let score = 0;

  // Core actions (40 points total)
  if (user.votedInBeastWeek) score += 15;
  if (user.postedMoment) score += 15;
  if (user.reactedToContent) score += 10;

  // Retention (30 points total)
  if (user.day1Return) score += 15;
  if (user.day7Return) score += 15;

  // Activity (30 points total)
  const sessionsScore = Math.min((user.sessionsCount || 0) * 2, 15);
  score += sessionsScore;

  // Consistency bonus (if active recently)
  const daysSinceActive = user.lastActive
    ? Math.floor((Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceActive === 0) score += 10; // Active today
  else if (daysSinceActive === 1) score += 5; // Active yesterday

  return Math.min(score, 100);
}

/**
 * Check if user should unlock invite capability
 *
 * Stage 1 validation criteria:
 * - Engagement score >= 70
 * - Returned after 7 days
 * - Voted in Beast Week
 * - At least 3 sessions
 */
export function shouldUnlockInvites(user: Partial<User>): boolean {
  return (
    (user.engagementScore || 0) >= 70 &&
    user.day7Return === true &&
    user.votedInBeastWeek === true &&
    (user.sessionsCount || 0) >= 3
  );
}

/**
 * Determine how many invite slots to grant
 *
 * Tier system:
 * - Basic: 4 invites (first unlock)
 * - Active: +2 invites (per milestone)
 * - Super: Unlimited (campus ambassadors)
 */
export function calculateInviteSlots(user: Partial<User>): number {
  const baseSlots = 4; // Starting invites

  // Earn more invites based on total successful invites
  const totalInvites = user.totalInvites || 0;

  if (totalInvites >= 50) return 999; // Unlimited
  if (totalInvites >= 25) return baseSlots + 10;
  if (totalInvites >= 10) return baseSlots + 6;
  if (totalInvites >= 5) return baseSlots + 4;

  return baseSlots;
}

/**
 * Award points and tokens for successful invite
 *
 * Tier-based rewards:
 * - Tier 1 (0-4 invites): +50 points, +25 tokens
 * - Tier 2 (5-10 invites): +75 points, +50 tokens
 * - Tier 3 (10+ invites): +100 points, +100 tokens
 */
export function calculateInviteRewards(totalInvites: number): {
  points: number;
  tokens: number;
  tier: number;
} {
  if (totalInvites >= 10) {
    return { points: 100, tokens: 100, tier: 3 };
  } else if (totalInvites >= 5) {
    return { points: 75, tokens: 50, tier: 2 };
  } else {
    return { points: 50, tokens: 25, tier: 1 };
  }
}

/**
 * Calculate viral coefficient (K-factor)
 *
 * K = (Invites Sent per User) × (Acceptance Rate)
 *
 * Target: >1.2 for sustainable viral growth
 */
export function calculateViralCoefficient(data: {
  totalUsers: number;
  totalInvitesSent: number;
  totalInvitesAccepted: number;
}): {
  kFactor: number;
  isViral: boolean;
  projectedGrowth: 'exponential' | 'linear' | 'declining';
} {
  const avgInvitesSent = data.totalInvitesSent / data.totalUsers;
  const acceptanceRate = data.totalInvitesSent > 0
    ? data.totalInvitesAccepted / data.totalInvitesSent
    : 0;

  const kFactor = avgInvitesSent * acceptanceRate;

  return {
    kFactor,
    isViral: kFactor >= 1.0,
    projectedGrowth: kFactor > 1.0 ? 'exponential' : kFactor === 1.0 ? 'linear' : 'declining'
  };
}

/**
 * Track user action for engagement scoring
 */
export function trackEngagementAction(
  action: 'vote' | 'post' | 'react' | 'session' | 'return',
  user: Partial<User>
): Partial<User> {
  const updates: Partial<User> = { ...user };

  switch (action) {
    case 'vote':
      updates.votedInBeastWeek = true;
      break;
    case 'post':
      updates.postedMoment = true;
      break;
    case 'react':
      updates.reactedToContent = true;
      break;
    case 'session':
      updates.sessionsCount = (user.sessionsCount || 0) + 1;
      updates.lastActive = new Date();
      break;
    case 'return':
      // Check if day 1 or day 7 return
      const daysSinceCreated = user.createdAt
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (daysSinceCreated === 1) updates.day1Return = true;
      if (daysSinceCreated >= 7) updates.day7Return = true;
      break;
  }

  // Recalculate engagement score
  updates.engagementScore = calculateEngagementScore(updates);

  // Check if should unlock invites
  if (!user.canInvite && shouldUnlockInvites(updates)) {
    updates.canInvite = true;
    updates.inviteSlots = calculateInviteSlots(updates);
  }

  return updates;
}

/**
 * Generate unique 6-character invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars: I,O,0,1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Validate invite code format
 */
export function isValidInviteCode(code: string): boolean {
  return /^[A-Z2-9]{6}$/.test(code);
}
