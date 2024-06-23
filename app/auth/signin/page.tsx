'use client';

import { useState, FormEvent, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignIn() {
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // State to handle error
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      checkCampaignStatus(session.user.id);
    }
  }, [session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state before trying to sign in

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        if (session?.user) {
          checkCampaignStatus(session.user.id);
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const checkCampaignStatus = async (userId: number) => {
    try {
      const res = await axios.get('/api/campaign-buddhist-lent', { params: { userId } });
      if (res.data.completed) {
        router.push('/profile');
      } else {
        router.push('/form_campaign_buddhist_lent/create');
      }
    } catch (error) {
      console.error('Error checking campaign status:', error);
      setError('Failed to check campaign status.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-4 text-center">Sign In</h1>
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign In
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push('./forgot-password')}
            className="text-slate-800 hover:text-slate-500 font-bold"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}
