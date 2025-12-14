'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CAMPUSES = [
  'Harvard University',
  'MIT',
  'Stanford University',
  'UC Berkeley',
  'Yale University',
  'Princeton University',
  'Columbia University',
  'University of Pennsylvania',
  'Cornell University',
  'Brown University',
  'Dartmouth College',
  'Duke University',
  'Northwestern University',
  'Vanderbilt University',
  'Rice University',
  'Notre Dame',
  'USC',
  'UCLA',
  'Other'
];

const YEARS = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Grad Student'
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campus, setCampus] = useState('');
  const [customCampus, setCustomCampus] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1 && !campus) {
      setError('Please select your campus');
      return;
    }
    if (step === 1 && campus === 'Other' && !customCampus.trim()) {
      setError('Please enter your campus name');
      return;
    }
    if (step === 2 && !year) {
      setError('Please select your year');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const finalCampus = campus === 'Other' ? customCampus.trim() : campus;
      const userRef = doc(db, 'users', user.id);

      await updateDoc(userRef, {
        campus: finalCampus,
        year: year,
      });

      router.push('/');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Welcome to Yollr Beast
          </h1>
          <p className="text-text-secondary">
            Let's set up your profile in just 2 steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-accent-fire to-brand-pink' : 'bg-dark-elevated'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="card-elevated p-6 space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary block">
                  Select Your Campus
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-elevated border border-dark-border rounded-lg text-text-primary focus:border-brand-mocha focus:ring-2 focus:ring-brand-mocha/20 outline-none transition-all"
                >
                  <option value="">Choose your campus...</option>
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {campus === 'Other' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary block">
                    Enter Campus Name
                  </label>
                  <input
                    type="text"
                    value={customCampus}
                    onChange={(e) => setCustomCampus(e.target.value)}
                    placeholder="e.g., University of Example"
                    className="w-full px-4 py-3 bg-dark-elevated border border-dark-border rounded-lg text-text-primary placeholder-text-tertiary focus:border-brand-mocha focus:ring-2 focus:ring-brand-mocha/20 outline-none transition-all"
                  />
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary block">
                What year are you?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      year === y
                        ? 'bg-gradient-to-r from-accent-fire to-brand-pink text-white'
                        : 'bg-dark-elevated text-text-secondary hover:bg-dark-border'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-lg bg-dark-elevated text-text-primary font-semibold hover:bg-dark-border transition-all"
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              onClick={step === 2 ? handleComplete : handleNext}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-fire to-brand-pink text-white font-semibold hover:shadow-glow active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Completing...' : step === 2 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>

        {/* Campus Info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-text-tertiary">
            Step {step} of 2
          </p>
          <p className="text-xs text-text-tertiary">
            Your campus and year help us connect you with the right Weekly Beast challenges
          </p>
        </div>
      </div>
    </div>
  );
}
