import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  QueryConstraint,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type {
  Moment,
  BeastWeek,
  BeastClip,
  BeastVote,
  HypePoll,
  PollVote,
  User,
  RealMojiReaction,
} from '@/types';

// ==================== COLLECTION NAMES ====================
export const COLLECTIONS = {
  USERS: 'users',
  MOMENTS: 'moments',
  BEAST_WEEKS: 'beast_weeks',
  BEAST_CLIPS: 'beast_clips',
  BEAST_VOTES: 'beast_votes',
  HYPE_POLLS: 'hype_polls',
  POLL_VOTES: 'poll_votes',
  REALMOJI_REACTIONS: 'realmoji_reactions',
  NOTIFICATIONS: 'notifications',
} as const;

// ==================== HELPER: CHECK FIREBASE ====================
function ensureFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured - using mock data');
  }
}

// ==================== USERS ====================
export async function createUser(userId: string, userData: Partial<User>) {
  ensureFirebase();
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userRef, {
    id: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...userData,
  });
}

export async function getUser(userId: string): Promise<User | null> {
  ensureFirebase();
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  ensureFirebase();
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ==================== MOMENTS (4Real) ====================
export async function createMoment(momentData: Omit<Moment, 'id' | 'createdAt'>) {
  ensureFirebase();
  const momentRef = doc(collection(db, COLLECTIONS.MOMENTS));
  const moment: Moment = {
    ...momentData,
    id: momentRef.id,
    createdAt: new Date(),
  };
  await setDoc(momentRef, {
    ...moment,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(moment.expiresAt),
  });
  return moment;
}

export async function getMoments(constraints: QueryConstraint[] = []) {
  ensureFirebase();
  const momentsRef = collection(db, COLLECTIONS.MOMENTS);
  const q = query(momentsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
  })) as Moment[];
}

export function subscribeMoments(
  callback: (moments: Moment[]) => void,
  constraints: QueryConstraint[] = []
) {
  ensureFirebase();
  const momentsRef = collection(db, COLLECTIONS.MOMENTS);
  const q = query(momentsRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const moments = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Moment[];
    callback(moments);
  });
}

export async function deleteMoment(momentId: string) {
  ensureFirebase();
  const momentRef = doc(db, COLLECTIONS.MOMENTS, momentId);
  await deleteDoc(momentRef);
}

// ==================== BEAST WEEKS ====================
export async function createBeastWeek(weekData: Omit<BeastWeek, 'id'>) {
  ensureFirebase();
  const weekRef = doc(collection(db, COLLECTIONS.BEAST_WEEKS));
  const week: BeastWeek = {
    ...weekData,
    id: weekRef.id,
  };
  await setDoc(weekRef, {
    ...week,
    startDate: Timestamp.fromDate(week.startDate),
    endDate: Timestamp.fromDate(week.endDate),
    submissionDeadline: Timestamp.fromDate(week.submissionDeadline),
    votingDeadline: Timestamp.fromDate(week.votingDeadline),
    finaleTime: Timestamp.fromDate(week.finaleTime),
  });
  return week;
}

export async function getCurrentBeastWeek(): Promise<BeastWeek | null> {
  ensureFirebase();
  const now = new Date();
  const weeksRef = collection(db, COLLECTIONS.BEAST_WEEKS);
  const q = query(
    weeksRef,
    where('isActive', '==', true),
    where('endDate', '>=', Timestamp.fromDate(now)),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    ...doc.data(),
    id: doc.id,
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate(),
    submissionDeadline: doc.data().submissionDeadline.toDate(),
    votingDeadline: doc.data().votingDeadline.toDate(),
    finaleTime: doc.data().finaleTime.toDate(),
  } as BeastWeek;
}

export function subscribeBeastWeek(callback: (week: BeastWeek | null) => void) {
  ensureFirebase();
  const now = new Date();
  const weeksRef = collection(db, COLLECTIONS.BEAST_WEEKS);
  const q = query(
    weeksRef,
    where('isActive', '==', true),
    where('endDate', '>=', Timestamp.fromDate(now)),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const doc = snapshot.docs[0];
    callback({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      submissionDeadline: doc.data().submissionDeadline.toDate(),
      votingDeadline: doc.data().votingDeadline.toDate(),
      finaleTime: doc.data().finaleTime.toDate(),
    } as BeastWeek);
  });
}

export async function updateBeastWeek(weekId: string, updates: Partial<BeastWeek>) {
  ensureFirebase();
  const weekRef = doc(db, COLLECTIONS.BEAST_WEEKS, weekId);
  const updateData: any = { ...updates };

  // Convert Date fields to Timestamps
  if (updates.startDate) updateData.startDate = Timestamp.fromDate(updates.startDate);
  if (updates.endDate) updateData.endDate = Timestamp.fromDate(updates.endDate);
  if (updates.submissionDeadline) updateData.submissionDeadline = Timestamp.fromDate(updates.submissionDeadline);
  if (updates.votingDeadline) updateData.votingDeadline = Timestamp.fromDate(updates.votingDeadline);
  if (updates.finaleTime) updateData.finaleTime = Timestamp.fromDate(updates.finaleTime);

  await updateDoc(weekRef, updateData);
}

// ==================== BEAST CLIPS ====================
export async function createBeastClip(clipData: Omit<BeastClip, 'id' | 'createdAt'>) {
  ensureFirebase();
  const clipRef = doc(collection(db, COLLECTIONS.BEAST_CLIPS));
  const clip: BeastClip = {
    ...clipData,
    id: clipRef.id,
    createdAt: new Date(),
  };
  await setDoc(clipRef, {
    ...clip,
    createdAt: serverTimestamp(),
  });
  return clip;
}

export async function getBeastClips(weekId: string) {
  ensureFirebase();
  const clipsRef = collection(db, COLLECTIONS.BEAST_CLIPS);
  const q = query(
    clipsRef,
    where('beastWeekId', '==', weekId),
    where('status', '==', 'approved'),
    orderBy('votesCount', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as BeastClip[];
}

export function subscribeBeastClips(weekId: string, callback: (clips: BeastClip[]) => void) {
  ensureFirebase();
  const clipsRef = collection(db, COLLECTIONS.BEAST_CLIPS);
  const q = query(
    clipsRef,
    where('beastWeekId', '==', weekId),
    where('status', '==', 'approved'),
    orderBy('votesCount', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const clips = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
    })) as BeastClip[];
    callback(clips);
  });
}

export async function updateBeastClip(clipId: string, updates: Partial<BeastClip>) {
  ensureFirebase();
  const clipRef = doc(db, COLLECTIONS.BEAST_CLIPS, clipId);
  await updateDoc(clipRef, updates);
}

// ==================== BEAST VOTES ====================
export async function createBeastVote(voteData: Omit<BeastVote, 'id' | 'votedAt'>) {
  ensureFirebase();

  // Check if user already voted in this week
  const votesRef = collection(db, COLLECTIONS.BEAST_VOTES);
  const existingVoteQuery = query(
    votesRef,
    where('userId', '==', voteData.userId),
    where('beastWeekId', '==', voteData.beastWeekId),
    limit(1)
  );
  const existingVote = await getDocs(existingVoteQuery);

  if (!existingVote.empty) {
    throw new Error('User has already voted this week');
  }

  // Create vote
  const voteRef = doc(collection(db, COLLECTIONS.BEAST_VOTES));
  const vote: BeastVote = {
    ...voteData,
    id: voteRef.id,
    votedAt: new Date(),
  };
  await setDoc(voteRef, {
    ...vote,
    votedAt: serverTimestamp(),
  });

  // Increment vote count on clip
  const clipRef = doc(db, COLLECTIONS.BEAST_CLIPS, voteData.beastClipId);
  await updateDoc(clipRef, {
    votesCount: increment(1),
  });

  return vote;
}

export async function hasUserVoted(userId: string, weekId: string): Promise<boolean> {
  ensureFirebase();
  const votesRef = collection(db, COLLECTIONS.BEAST_VOTES);
  const q = query(
    votesRef,
    where('userId', '==', userId),
    where('beastWeekId', '==', weekId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// ==================== HYPE POLLS ====================
export async function createHypePoll(pollData: Omit<HypePoll, 'id' | 'createdAt'>) {
  ensureFirebase();
  const pollRef = doc(collection(db, COLLECTIONS.HYPE_POLLS));
  const poll: HypePoll = {
    ...pollData,
    id: pollRef.id,
    createdAt: new Date(),
  };
  await setDoc(pollRef, {
    ...poll,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(poll.expiresAt),
  });
  return poll;
}

export async function getTodayHypePolls(): Promise<HypePoll[]> {
  ensureFirebase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pollsRef = collection(db, COLLECTIONS.HYPE_POLLS);
  const q = query(
    pollsRef,
    where('createdAt', '>=', Timestamp.fromDate(today)),
    where('createdAt', '<', Timestamp.fromDate(tomorrow)),
    orderBy('createdAt', 'asc'),
    limit(5)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
  })) as HypePoll[];
}

export function subscribeHypePolls(callback: (polls: HypePoll[]) => void) {
  ensureFirebase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pollsRef = collection(db, COLLECTIONS.HYPE_POLLS);
  const q = query(
    pollsRef,
    where('createdAt', '>=', Timestamp.fromDate(today)),
    where('createdAt', '<', Timestamp.fromDate(tomorrow)),
    orderBy('createdAt', 'asc'),
    limit(5)
  );

  return onSnapshot(q, (snapshot) => {
    const polls = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as HypePoll[];
    callback(polls);
  });
}

export async function createPollVote(voteData: Omit<PollVote, 'id' | 'votedAt'>) {
  ensureFirebase();

  // Check if user already voted on this poll
  const votesRef = collection(db, COLLECTIONS.POLL_VOTES);
  const existingVoteQuery = query(
    votesRef,
    where('userId', '==', voteData.userId),
    where('pollId', '==', voteData.pollId),
    limit(1)
  );
  const existingVote = await getDocs(existingVoteQuery);

  if (!existingVote.empty) {
    throw new Error('User has already voted on this poll');
  }

  // Create vote
  const voteRef = doc(collection(db, COLLECTIONS.POLL_VOTES));
  const vote: PollVote = {
    ...voteData,
    id: voteRef.id,
    votedAt: new Date(),
  };
  await setDoc(voteRef, {
    ...vote,
    votedAt: serverTimestamp(),
  });

  // Increment vote count on poll
  const pollRef = doc(db, COLLECTIONS.HYPE_POLLS, voteData.pollId);
  await updateDoc(pollRef, {
    votesCount: increment(1),
  });

  return vote;
}

export async function hasUserVotedOnPoll(userId: string, pollId: string): Promise<boolean> {
  ensureFirebase();
  const votesRef = collection(db, COLLECTIONS.POLL_VOTES);
  const q = query(
    votesRef,
    where('userId', '==', userId),
    where('pollId', '==', pollId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// ==================== REALMOJI REACTIONS ====================
export async function createRealMojiReaction(reactionData: Omit<RealMojiReaction, 'id' | 'createdAt'>) {
  ensureFirebase();
  const reactionRef = doc(collection(db, COLLECTIONS.REALMOJI_REACTIONS));
  const reaction: RealMojiReaction = {
    ...reactionData,
    id: reactionRef.id,
    createdAt: new Date(),
  };
  await setDoc(reactionRef, {
    ...reaction,
    createdAt: serverTimestamp(),
  });
  return reaction;
}

export async function getMomentReactions(momentId: string): Promise<RealMojiReaction[]> {
  ensureFirebase();
  const reactionsRef = collection(db, COLLECTIONS.REALMOJI_REACTIONS);
  const q = query(
    reactionsRef,
    where('momentId', '==', momentId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as RealMojiReaction[];
}

export function subscribeReactions(momentId: string, callback: (reactions: RealMojiReaction[]) => void) {
  ensureFirebase();
  const reactionsRef = collection(db, COLLECTIONS.REALMOJI_REACTIONS);
  const q = query(
    reactionsRef,
    where('momentId', '==', momentId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const reactions = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
    })) as RealMojiReaction[];
    callback(reactions);
  });
}

export async function deleteReaction(reactionId: string) {
  ensureFirebase();
  const reactionRef = doc(db, COLLECTIONS.REALMOJI_REACTIONS, reactionId);
  await deleteDoc(reactionRef);
}
