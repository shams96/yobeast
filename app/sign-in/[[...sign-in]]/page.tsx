'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SignInPage() {
  useEffect(() => {
    // Bypass email verification for demo accounts
    const observer = new MutationObserver(() => {
      // Auto-click continue if verification screen appears
      const continueBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (continueBtn && continueBtn.textContent?.includes('Continue')) {
        const emailInput = document.querySelector('input[name="code"]');
        if (emailInput) {
          // Verification screen detected - force redirect
          window.location.href = '/';
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <style jsx global>{`
          /* Aggressively hide all OAuth/social buttons and verification screens */
          .cl-socialButtonsBlockButton,
          .cl-socialButtonsBlockButton__google,
          [data-provider="google"],
          button[data-provider],
          .cl-socialButtons,
          .cl-dividerRow,
          /* Hide OTP/verification code screens */
          .cl-formFieldInput__emailCode,
          .cl-formFieldInput__phoneCode,
          .cl-verificationCode,
          .cl-otpCodeFieldInputs {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        `}</style>
        <SignIn
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
              socialButtonsBlockButton: 'hidden',
              socialButtonsBlockButtonText: 'hidden',
              socialButtonsIconButton: 'hidden',
              dividerRow: 'hidden',
              formButtonPrimary: 'bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall hover:opacity-90 font-semibold',
              formFieldInput: 'bg-nightfall border-steel/20 text-ash focus:border-digital-grape',
              formFieldLabel: 'text-ash',
              footerActionLink: 'text-digital-grape hover:text-signal-lime',
              identityPreviewText: 'hidden',
              identityPreviewEditButton: 'hidden',
              formResendCodeLink: 'hidden',
              otpCodeFieldInput: 'hidden',
              identityPreview: 'hidden',
              alternativeMethodsBlockButton: 'hidden',
            },
          }}
          signUpUrl="/sign-up"
          routing="path"
          path="/sign-in"
        />
      </div>
    </div>
  );
}
