import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          signUpUrl="/sign-up"
          redirectUrl="/feed"
          afterSignInUrl="/feed"
        />
      </div>
    </div>
  );
}
