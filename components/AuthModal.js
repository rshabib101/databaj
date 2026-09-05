'use client';

import { useState } from 'react';
import { X, ShieldCheck, Building2, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('E-commerce & Retail');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedDemoCode, setGeneratedDemoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      if (mode === 'verify') {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify',
            email,
            code: verificationCode.trim(),
          }),
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'ভেরিফিকেশন সম্পন্ন হয়নি');
        }

        if (data.token) {
          localStorage.setItem('databaj_token', data.token);
        }
        onAuthSuccess(data.user);
        onClose();
        return;
      }

      const payload =
        mode === 'login'
          ? { action: 'login', email, password }
          : { action: 'register', email, password, name, companyName, industry };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('databaj_token', data.token);
      }

      // If registered and requires verification code
      if (mode === 'register' && data.verificationCode) {
        setGeneratedDemoCode(data.verificationCode);
        setMode('verify');
        setInfoMessage(`আপনার ভেরিফিকেশন কোড: ${data.verificationCode} (নিচে কোডটি লিখে ভেরিফাই সম্পন্ন করুন)`);
        return;
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (demoEmail, demoPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: demoEmail,
          password: demoPassword,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      if (data.token) {
        localStorage.setItem('databaj_token', data.token);
      }
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
              DB
            </span>
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
              DataBaj Access & Verification Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login'
              ? 'অ্যাকাউন্টে লগইন করুন'
              : mode === 'register'
              ? 'নতুন কোম্পানি অ্যাকাউন্ট তৈরি'
              : 'ইউজার অ্যাকাউন্ট ভেরিফিকেশন (OTP)'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'login'
              ? 'আপনার ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।'
              : mode === 'register'
              ? 'ক্লায়েন্ট কোম্পানি হিসেবে যুক্ত হতে তথ্য পূরণ করুন।'
              : 'আপনার ইমেইলে প্রেরিত ৬-সংখ্যার কোড দিয়ে ভেরিফাই করুন।'}
          </p>
        </div>

        {/* Quick Demo Login Switcher */}
        {mode !== 'verify' && (
          <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 mb-4 space-y-2">
            <span className="text-[11px] text-zinc-400 font-semibold block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ১-ক্লিকে টেস্ট অ্যাকাউন্ট দিয়ে লগইন করুন:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => demoLogin('rshabib300@gmail.com', 'admin123')}
                disabled={loading}
                className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition-colors cursor-pointer text-left"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <div className="truncate">
                  <span className="block font-bold">Habib (Super Admin)</span>
                  <span className="text-[10px] text-zinc-400 truncate">Siraj Agro • All Clients</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('tanvir@trendwear.com', 'client123')}
                disabled={loading}
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors cursor-pointer text-left"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <span className="block font-bold">Client User</span>
                  <span className="text-[10px] text-zinc-400 truncate">TrendWear BD</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        {mode !== 'verify' && (
          <div className="flex bg-zinc-900 p-1 rounded-xl mb-4 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              রেজিস্ট্রেশন (Register)
            </button>
          </div>
        )}

        {/* Info Message banner */}
        {infoMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 mb-3 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{infoMessage}</span>
              {generatedDemoCode && (
                <button
                  type="button"
                  onClick={() => setVerificationCode(generatedDemoCode)}
                  className="block text-emerald-400 font-bold underline text-[11px] cursor-pointer"
                >
                  কোডটি অটো-ফিল করুন ({generatedDemoCode})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'verify' ? (
            /* Verification Code Screen */
            <div className="space-y-3 py-2">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">যাচাইকৃত ইমেইল:</span>
                <span className="font-mono text-sm font-bold text-white">{email}</span>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">৬-ডিজিটের ভেরিফিকেশন কোড লিখুন *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 582194"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>কোড পাননি?</span>
                <button
                  type="button"
                  onClick={() => setVerificationCode('123456')}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  ডিফল্ট কোড (123456) ব্যবহার করুন
                </button>
              </div>
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">আপনার নাম *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g., Habib"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">কোম্পানি বা ব্র্যান্ড নাম *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g., Siraj Agro"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">ইন্ডাস্ট্রি / ধরন</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Agro & Food Products">কৃষি ও ফুড প্রোডাক্টস (Agro & Food)</option>
                      <option value="E-commerce & Retail">ই-কমার্স ও রিটেইল (E-commerce)</option>
                      <option value="Fashion & Apparel">ফ্যাশন ও ক্লথিং (Fashion)</option>
                      <option value="Beauty & Skincare">বিউটি ও স্কিনকেয়ার (Cosmetics)</option>
                      <option value="Lead Generation / Agency">লিড জেনারেশন ও সার্ভিস (Leads)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs text-zinc-300 mb-1">ইমেইল অ্যাড্রেস *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="rshabib300@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            {loading
              ? 'প্রসেসিং হচ্ছে...'
              : mode === 'verify'
              ? 'অ্যাকাউন্ট ভেরিফাই সম্পন্ন করুন'
              : mode === 'login'
              ? 'লগইন করুন'
              : 'অ্যাকাউন্ট খুলুন ও ভেরিফাই করুন'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
