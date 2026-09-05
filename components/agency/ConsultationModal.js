'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  User,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  LogIn,
} from 'lucide-react';

export default function ConsultationModal({
  isOpen,
  onClose,
  service = null,
  currentUser = null,
}) {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState('স্ট্যান্ডার্ড বাজেট (Standard)');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [prevUser, setPrevUser] = useState(currentUser);

  // Sync with current user if logged in
  if (currentUser !== prevUser) {
    setPrevUser(currentUser);
    if (currentUser) {
      setClientName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setCompanyName(currentUser.companyName || '');
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clientName: clientName.trim(),
          email: email.trim(),
          companyName: companyName.trim(),
          phone: phone.trim(),
          serviceSlug: service?.slug || '',
          serviceTitle: service?.title || 'General Consultation',
          notes: notes.trim(),
          budget,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অর্ডার ও ফ্রি কনসালটেশন</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {service ? service.title : 'DataBaj IT Agency Consultation'}
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed">
            আপনার প্রজেক্টের প্রয়োজনীয়তা জানান। আমাদের এক্সপার্ট টিম দ্রুত পর্যালোচনা করে কাস্টম প্ল্যান ও এস্টিমেট শেয়ার করবে।
          </p>
        </div>

        {/* Logged in indicator banner */}
        {currentUser ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                লগইন করা অ্যাকাউন্ট: <strong>{currentUser.companyName}</strong> ({currentUser.email})
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs text-zinc-300">
            <span className="text-zinc-400">ইতিমধ্যে ক্লায়েন্ট অ্যাকাউন্ট আছে?</span>
            <Link
              href="/login"
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন করুন</span>
            </Link>
          </div>
        )}

        {/* Success View */}
        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                আপনার পছন্দের সার্ভিস <strong>{service?.title || 'Consultation'}</strong>-এর জন্য আমাদের সিনিয়র স্পেশালিস্ট অতি দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              {currentUser && (
                <Link
                  href={currentUser.role === 'super_admin' ? '/admin' : '/dashboard'}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                >
                  ড্যাশবোর্ডে যান
                </Link>
              )}
              <button
                onClick={resetAndClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-800 cursor-pointer"
              >
                ঠিক আছে (বন্ধ করুন)
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  আপনার নাম *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sadik Hasan"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  কোম্পানি বা ব্র্যান্ড *
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. TrendWear BD"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  ইমেইল অ্যাড্রেস *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  ফোন / হোয়াটসঅ্যাপ নম্বর
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+880 1700-000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                বাজেট রেঞ্জ (আনুমানিক)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="স্ট্যান্ডার্ড বাজেট (Standard)">স্ট্যান্ডার্ড বাজেট (Standard)</option>
                <option value="গ্রোথ / স্কেলিং প্ল্যান (Growth)">গ্রোথ / স্কেলিং প্ল্যান (Growth)</option>
                <option value="এন্টারপ্রাইজ কাস্টম সলিউশন (Enterprise)">এন্টারপ্রাইজ কাস্টম সলিউশন (Enterprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                প্রজেক্ট রিকোয়ারমেন্ট বা মেসেজ
              </label>
              <div className="relative">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="আপনার রিকোয়ারমেন্ট সংক্ষেপে লিখুন..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                বাতিল
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'পাঠানো হচ্ছে...' : 'অর্ডার / কনসালটেশন সাবমিট করুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
