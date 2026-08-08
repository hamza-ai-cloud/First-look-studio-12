"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  // Note: middleware handles redirecting authenticated admins away from /admin/signin.

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    if (res?.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="max-w-md w-full p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Admin sign in</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full" />
        </label>
        <button disabled={loading} className="w-full py-2 px-4 bg-sky-600 text-white rounded">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
