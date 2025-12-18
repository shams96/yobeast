'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { generateInviteCode } from '@/lib/utils/engagement';

const YEARS = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Grad Student'
];

function OnboardingContent() {
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [institutionDomain, setInstitutionDomain] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load selected institution and validate email
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      setEmail(userEmail);

      // Get selected institution from localStorage
      const selectedInstitutionStr = localStorage.getItem('selectedInstitution');

      if (selectedInstitutionStr) {
        try {
          const selectedInstitution = JSON.parse(selectedInstitutionStr);
          setCampus(selectedInstitution.name);
          setInstitutionDomain(selectedInstitution.domain);

          // Validate that email domain matches selected institution
          const emailDomain = userEmail.split('@')[1]?.toLowerCase();
          const expectedDomain = selectedInstitution.domain.toLowerCase();

          if (emailDomain !== expectedDomain) {
            setError(
              `Email mismatch: You selected ${selectedInstitution.name} but signed up with @${emailDomain}. ` +
              `Please sign up with your ${selectedInstitution.name} email (@${expectedDomain}).`
            );
          }
        } catch (err) {
          console.error('Error parsing selected institution:', err);
          setError('Please go back and select your institution again.');
        }
      } else {
        // No institution selected - redirect back
        router.push('/institution-select');
      }
    }
  }, [user, router]);

  const handleComplete = async () => {
    if (!year) {
      setError('Please select your year');
      return;
    }

    if (!user) return;

    // Check for email domain mismatch
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const expectedDomain = institutionDomain.toLowerCase();
    if (emailDomain !== expectedDomain) {
      setError(
        `Please sign up with your ${campus} email (@${expectedDomain}). ` +
        `You're currently using @${emailDomain}.`
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate unique invite code for new user
      const userInviteCode = generateInviteCode();

      // Prepare user data
      const userData: any = {
        campus: campus,
        year: year,
        inviteCode: userInviteCode,
        inviteSlots: 4,
        totalInvites: 0,
        engagementScore: 0,
        canInvite: false,
        sessionsCount: 1,
        lastActive: new Date(),
        votedInBeastWeek: false,
        postedMoment: false,
        reactedToContent: false,
        day1Return: false,
        day7Return: false,
        verificationLevel: 2, // Higher verification level due to .edu email
        isVerified: true, // Auto-verified with .edu email
      };

      // In UAT mode, store in Clerk metadata; in production, store in Firebase
      if (!isFirebaseConfigured()) {
        // UAT Mode: Store in Clerk user metadata
        await user.update({
          unsafeMetadata: {
            campus: campus,
            year: year,
            inviteCode: userInviteCode,
            onboardingComplete: true,
            verificationLevel: 2,
            isVerified: true,
          },
        });
      } else {
        // Production Mode: Store in Firebase
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, userData);

        // Create invite document for new user
        const inviteRef = doc(db, 'invites', userInviteCode);
        await setDoc(inviteRef, {
          id: userInviteCode,
          inviterId: user.id,
          inviteeId: null,
          code: userInviteCode,
          createdAt: new Date(),
          redeemedAt: null,
          status: 'pending',
          clickCount: 0,
          pointsAwarded: false,
          tokensAwarded: false,
        });
      }

      // Clear localStorage
      localStorage.removeItem('selectedInstitution');

      router.push('/');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  if (!campus) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-nightfall">
        <div className="animate-pulse text-ash">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-nightfall">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-digital-grape to-signal-lime bg-clip-text text-transparent mb-2">
            Welcome to Yollr Beast
          </h1>
          <p className="text-steel">
            One more step to complete your profile
          </p>
        </div>

        {/* Main Content */}
        <div className="card-elevated p-6 space-y-6">
          {/* Institution Verification */}
          <div className="p-4 bg-signal-lime/10 border border-signal-lime/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-signal-lime">
                  Institution Verified
                </p>
                <p className="text-lg font-bold text-ash mt-1">
                  {campus}
                </p>
                <p className="text-xs text-steel/70 mt-1">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Year Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ash block">
              What year are you?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {YEARS.map((y) => (
                <button
                  type="button"
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    year === y
                      ? 'bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall border-signal-lime shadow-lg scale-105'
                      : 'bg-carbon text-steel border-steel/20 hover:border-digital-grape hover:bg-carbon/80'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Complete Button */}
          <button
            type="button"
            onClick={handleComplete}
            disabled={loading || !year}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-semibold hover:shadow-elevated active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing...' : 'Complete Setup'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-steel/70">
            Your campus email is verified and you're ready to compete!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-nightfall">
        <div className="animate-pulse text-ash">Loading...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
