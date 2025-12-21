'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [selectedInstitution, setSelectedInstitution] = useState<{
    name: string;
    domain: string;
  } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp(email, password, name, username);

      if (result.success) {
        router.push('/onboarding');
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nightfall flex items-center justify-center p-4">
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

        {/* Sign Up Form */}
        <div className="bg-carbon rounded-2xl border border-ash/10 p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-electric-coral mb-2">
              Create Account
            </h1>
            <p className="text-ash/60 text-sm">Join your campus community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ash mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electric-coral focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ash mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electric-coral focus:border-transparent"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ash mb-2">
                Email {selectedInstitution && <span className="text-signal-lime">(@{selectedInstitution.domain})</span>}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electric-coral focus:border-transparent"
                placeholder={selectedInstitution ? `demo@${selectedInstitution.domain}` : 'your@email.edu'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ash mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electric-coral focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-electric-coral text-nightfall font-bold rounded-lg hover:bg-electric-coral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-ash/60 text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-electric-coral hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

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
