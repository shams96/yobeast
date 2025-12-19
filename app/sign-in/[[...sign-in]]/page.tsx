'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nightfall flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-carbon rounded-2xl border border-ash/10 p-8 shadow-xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-electricCoral mb-2">
              Yollr Beast™
            </h1>
            <p className="text-ash/60 text-sm">Sign in to your campus</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Accounts Info */}
          <div className="mb-6 p-4 bg-electricCoral/10 border border-electricCoral/20 rounded-lg">
            <p className="text-electricCoral text-xs font-medium mb-2">Demo Accounts Available:</p>
            <ul className="text-ash/60 text-xs space-y-1">
              <li>• demo@harvard.edu</li>
              <li>• demo@mit.edu</li>
              <li>• demo@stanford.edu</li>
              <li>• demo@berkeley.edu</li>
              <li>• demo@yale.edu</li>
            </ul>
            <p className="text-ash/40 text-xs mt-2">See DEMO_ACCOUNTS.md for passwords</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ash mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electricCoral focus:border-transparent"
                placeholder="demo@harvard.edu"
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
                className="w-full px-4 py-3 bg-nightfall border border-ash/20 rounded-lg text-ash placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-electricCoral focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-electricCoral text-nightfall font-bold rounded-lg hover:bg-electricCoral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-ash/60 text-sm">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-electricCoral hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
