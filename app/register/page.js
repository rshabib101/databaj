'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' | 'pending_approval'
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('E-commerce & Retail');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const clientMeta = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : true,
    };

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name,
          companyName,
          industry,
          phone,
          email,
          password,
          clientMeta,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      if (data.pendingApproval) {
        setApprovalMessage(data.message);
        setStep('pending_approval');
        return;
      }

      if (data.token) {
        localStorage.setItem('databaj_token', data.token);
      }

      router.push(data.user?.role === 'super_admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-black relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            DB
          </div>
          <span className="text-2xl font-black tracking-tight text-white">DataBaj</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {step === 'form' ? 'নতুন কোম্পানি অ্যাকাউন্ট তৈরি' : 'অনুমোদনের জন্য অপেক্ষমাণ'}
        </h1>
        <p className="text-xs text-zinc-400">
          {step === 'form'
            ? 'আমাদের ক্লায়েন্ট প্যানেলে যুক্ত হয়ে বিজ্ঞাপনের পারফরম্যান্স অ্যানালাইসিস শুরু করুন।'
            : 'আপনার অ্যাকাউন্টটি সুপার অ্যাডমিনের পর্যালোচনার জন্য জমা নেওয়া হয়েছে।'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 backdrop-blur-xl">
          {step === 'pending_approval' ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  রেজিস্ট্রেশন সফলভাবে জমা হয়েছে!
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {approvalMessage || 'আপনার অ্যাকাউন্টটি তৈরি হয়েছে। সুপার অ্যাডমিন অনুমোদন (Approve) করার পর আপনি আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।'}
                </p>
              </div>

              <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 text-left text-xs text-zinc-300 space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>কোম্পানি:</span>
                  <span className="text-white font-semibold">{companyName}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>লগইন ইমেইল:</span>
                  <span className="font-mono text-emerald-400">{email}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>ফোন নম্বর:</span>
                  <span className="font-mono text-zinc-200">{phone}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>স্ট্যাটাস:</span>
                  <span className="text-amber-400 font-bold">⏳ Pending Super Admin Approval</span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>লগইন পেজে যান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">আপনার নাম *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sadik Hasan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  কোম্পানি বা ব্র্যান্ড নাম *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nova Fashion"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ফোন নম্বর (হোয়াটসঅ্যাপ/মোবাইল) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 017XXXXXXXX বা +8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">ইন্ডাস্ট্রি</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="E-commerce & Retail">ই-কমার্স ও রিটেইল (E-commerce)</option>
                  <option value="Fashion & Apparel">ফ্যাশন ও ক্লথিং (Fashion)</option>
                  <option value="Agro & Food Products">কৃষি ও ফুড প্রোডাক্টস (Agro & Food)</option>
                  <option value="Beauty & Skincare">বিউটি ও স্কিনকেয়ার (Cosmetics)</option>
                  <option value="Lead Generation / Agency">লিড জেনারেশন ও সার্ভিস (Leads)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
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
                <span>{loading ? 'প্রসেসিং হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <span>ইতিমধ্যে অ্যাকাউন্ট আছে?</span>
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              লগইন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
