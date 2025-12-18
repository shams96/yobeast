'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [selectedInstitution, setSelectedInstitution] = useState<{
    name: string;
    domain: string;
  } | null>(null);

  useEffect(() => {
    // Get selected institution from localStorage
    const institutionStr = localStorage.getItem('selectedInstitution');
    if (institutionStr) {
      try {
        const institution = JSON.parse(institutionStr);
        setSelectedInstitution(institution);
      } catch (err) {
        console.error('Error parsing institution:', err);
      }
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Institution Banner */}
        {selectedInstitution && (
          <div className="card-elevated p-4 text-center">
            <div className="text-4xl mb-2">🎓</div>
            <p className="text-sm text-steel/70">Signing up for</p>
            <p className="text-lg font-bold text-ash mt-1">
              {selectedInstitution.name}
            </p>
            <p className="text-xs text-signal-lime mt-2">
              Use your @{selectedInstitution.domain} email
            </p>
          </div>
        )}

        {/* Clerk Sign Up Component */}
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#FF6F61', // Electric Coral
              colorBackground: '#141821', // Carbon
              colorInputBackground: '#0B0D10',
              colorInputText: '#EDEFF3', // Ash
              colorText: '#EDEFF3',
              colorTextSecondary: '#9AA3B2', // Steel
              fontFamily: 'Inter, system-ui, sans-serif',
              borderRadius: '0.75rem',
            },
            elements: {
              rootBox: 'w-full',
              card: 'bg-carbon border-steel/20 shadow-elevated',
              headerTitle: 'text-ash',
              headerSubtitle: 'text-steel',
              socialButtonsBlockButton: 'hidden !important', // Hide Google login
              socialButtonsBlockButtonText: 'hidden',
              dividerRow: 'hidden', // Hide "or" divider
              formButtonPrimary: 'bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall hover:opacity-90 font-semibold',
              formFieldInput: 'bg-nightfall border-steel/20 text-ash focus:border-digital-grape',
              formFieldLabel: 'text-ash',
              footerActionLink: 'text-digital-grape hover:text-signal-lime',
              identityPreviewText: 'text-ash',
              identityPreviewEditButton: 'text-digital-grape',
              formResendCodeLink: 'text-digital-grape hover:text-signal-lime',
              otpCodeFieldInput: 'bg-nightfall border-steel/20 text-ash',
            },
          }}
          signInUrl="/sign-in"
          redirectUrl="/onboarding"
          afterSignUpUrl="/onboarding"
        />

        {/* .edu Email Reminder */}
        {selectedInstitution && (
          <div className="card-elevated p-4 border-signal-lime/20">
            <p className="text-xs text-steel/70 text-center leading-relaxed">
              <span className="font-semibold text-ash">⚠️ Important:</span> You must use your <span className="text-signal-lime font-semibold">@{selectedInstitution.domain}</span> email address to verify you're a {selectedInstitution.name} student.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/institution-select"
            className="text-sm text-steel/70 hover:text-ash transition-colors"
          >
            ← Choose a different institution
          </Link>
        </div>
      </div>
    </div>
  );
}
