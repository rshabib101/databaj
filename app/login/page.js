'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('ইমেইল এবং পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientMeta = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        language: typeof navigator !== 'undefined' ? navigator.language : '',
        screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
        platform: typeof navigator !== 'undefined' ? navigator.platform : '',
        cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : true,
      };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: email.trim(),
          password,
          clientMeta,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয়');
      }

      if (data.token) {
        localStorage.setItem('databaj_token', data.token);
      }

      // Automatic role-based redirect
      const targetUrl = data.redirectTo || (data.user?.role === 'super_admin' ? '/admin' : '/dashboard');
      router.push(targetUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-black relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            DB
          </div>
          <span className="text-2xl font-black tracking-tight text-white">DataBaj</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          অ্যাকাউন্টে সাইন ইন করুন
        </h1>
        <p className="text-xs text-zinc-400">
          আপনার ইমেইল ও পাসওয়ার্ড দিন, সিস্টেম স্বয়ংক্রিয়ভাবে আপনার প্যানেলে প্রবেশ করাবে।
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                ইমেইল অ্যাড্রেস *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom link */}
          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <span>অ্যাকাউন্ট নেই?</span>
            <Link
              href="/register"
              className="text-emerald-400 font-bold hover:underline"
            >
              নতুন কোম্পানি রেজিস্টার করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
