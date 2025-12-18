'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isValidInviteCode } from '@/lib/utils/engagement';
import { useUser } from '@clerk/nextjs';

export default function InviteLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const inviteCode = (params.code as string)?.toUpperCase();

  const [inviterData, setInviterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInviterData = async () => {
      if (!inviteCode || !isValidInviteCode(inviteCode)) {
        setError('Invalid invite code');
        setLoading(false);
        return;
      }

      try {
        // Store invite code in localStorage for deferred deep linking
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingInviteCode', inviteCode);
        }

        // Fetch invite document
        const inviteRef = doc(db, 'invites', inviteCode);
        const inviteDoc = await getDoc(inviteRef);

        if (inviteDoc.exists()) {
          const inviteData = inviteDoc.data();

          // Fetch inviter's user data
          const inviterRef = doc(db, 'users', inviteData.inviterId);
          const inviterDoc = await getDoc(inviterRef);

          if (inviterDoc.exists()) {
            setInviterData({
              ...inviterDoc.data(),
              id: inviterDoc.id,
            });
          }
        } else {
          setError('Invite code not found');
        }
      } catch (err) {
        console.error('Error fetching inviter data:', err);
        setError('Failed to load invite information');
      } finally {
        setLoading(false);
      }
    };

    fetchInviterData();
  }, [inviteCode]);

  // If user is already logged in, redirect to onboarding with code
  useEffect(() => {
    if (user && inviteCode) {
      router.push(`/onboarding?code=${inviteCode}`);
    }
  }, [user, inviteCode, router]);

  const handleJoin = () => {
    // Redirect to sign-up with invite code
    router.push(`/sign-up?redirect_url=${encodeURIComponent(`/onboarding?code=${inviteCode}`)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mocha mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
        <div className="max-w-md w-full card-elevated p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Invalid Invite Link
          </h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push('/sign-up')}
            className="px-6 py-3 bg-gradient-to-r from-accent-fire to-brand-pink text-white font-semibold rounded-lg hover:shadow-glow transition-all"
          >
            Sign Up Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Invite Card */}
        <div className="card-elevated p-8 text-center space-y-6">
          {/* Inviter Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-fire to-brand-pink flex items-center justify-center text-white text-3xl font-bold">
              {inviterData?.name?.charAt(0) || inviterData?.username?.charAt(0) || '?'}
            </div>
          </div>

          {/* Inviter Info */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              {inviterData?.name || 'A friend'} invited you!
            </h1>
            {inviterData?.username && (
              <p className="text-text-secondary">@{inviterData.username}</p>
            )}
            {inviterData?.campus && (
              <p className="text-sm text-text-tertiary mt-1">
                {inviterData.campus}
                {inviterData.year && ` · ${inviterData.year}`}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="p-4 bg-dark-elevated rounded-lg">
            <p className="text-text-primary">
              "Join my campus community and compete in Weekly Beast challenges!"
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleJoin}
            className="w-full px-8 py-4 bg-gradient-to-r from-accent-fire to-brand-pink text-white font-bold text-lg rounded-lg hover:shadow-glow active:scale-95 transition-all"
          >
            Join {inviterData?.campus ? `${inviterData.campus.split(' ')[0]}'s Campus` : 'Now'}
          </button>

          {/* Invite Code Display */}
          <div className="pt-4 border-t border-dark-border">
            <p className="text-xs text-text-tertiary mb-2">Your invite code</p>
            <p className="text-2xl font-mono font-bold text-gradient tracking-widest">
              {inviteCode}
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="card-elevated p-6 space-y-3">
          <h2 className="font-bold text-text-primary text-center mb-4">
            What is Yollr Beast?
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-semibold text-text-primary">
                  Weekly Competitions
                </p>
                <p className="text-text-tertiary">
                  Compete for prizes in themed video challenges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-semibold text-text-primary">Campus Community</p>
                <p className="text-text-tertiary">
                  Connect with students from your campus
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-semibold text-text-primary">Win Prizes</p>
                <p className="text-text-tertiary">
                  Cash prizes and campus rewards every week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-tertiary">
          By joining, you'll get +25 welcome points and +10 Beast Tokens
        </p>
      </div>
    </div>
  );
}
