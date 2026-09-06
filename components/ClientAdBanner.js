'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Heart,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ClientAdBanner({ currentUser }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/admin/client-ad', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.ad && data.ad.isActive) {
          setAd(data.ad);
          if (data.userHasInterested) {
            setInterested(true);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInterestClick = async () => {
    if (interested || submittingInterest) return;
    setSubmittingInterest(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/client-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clientName: currentUser?.name,
          companyName: currentUser?.companyName,
          email: currentUser?.email,
          phone: currentUser?.phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInterested(true);
        setInterestSuccess(true);
        setTimeout(() => setInterestSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingInterest(false);
    }
  };

  if (loading || !ad || !ad.isActive) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-emerald-500/40 p-5 sm:p-7 shadow-2xl shadow-emerald-500/10 mb-8 animate-fadeIn group">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid: Visual Image First (Left) + Offer Content & Actions (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* 1. HIGHLIGHTED EYE-CATCHING PROMO IMAGE (Cols 1-5) */}
        <div className="lg:col-span-5 relative">
          <div className="relative w-full h-52 sm:h-64 lg:h-72 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl group-hover:scale-[1.01] transition-transform duration-500">
            {ad.imageUrl ? (
              <Image
                src={ad.imageUrl}
                alt={ad.headline || 'Exclusive Client Offer'}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                <Zap className="w-12 h-12 text-emerald-400" />
              </div>
            )}

            {/* Gradient Overlay for photo depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Float badge over image */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-black font-black text-[11px] shadow-lg uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ad.badge || 'স্পেশাল অফার'}</span>
              </span>
            </div>

            {/* Bottom floating badge on image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DataBaj Verified
              </span>
              <span className="text-emerald-400 font-bold">Limited Slot</span>
            </div>
          </div>
        </div>

        {/* 2. HEADLINE, BULLET POINTS IN ROWS, & ACTION BUTTONS (Cols 6-12) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Badge & Mini Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>DataBaj Exclusive Client Promo</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              রেগুলার ক্লায়েন্টদের জন্য বিশেষ সুবিধা
            </span>
          </div>

          {/* Eye-catching Headline */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
            {ad.headline}
          </h2>

          {/* Sub-headline description */}
          {ad.subHeadline && (
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {ad.subHeadline}
            </p>
          )}

          {/* OFFER POINTS DISPLAYED IN ROWS */}
          {ad.offerPoints && ad.offerPoints.length > 0 && (
            <div className="pt-2 pb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider block mb-2">
                অফারের বিশেষ সুবিধাসমূহ:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ad.offerPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 shadow-sm hover:border-emerald-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS (Order Now + Interested Button) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Button 1: Clickable Order / Link Button */}
            {ad.orderBtnLink && (
              <a
                href={ad.orderBtnLink}
                target={ad.orderBtnLink.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{ad.orderBtnText || 'অর্ডার করতে ক্লিক করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            {/* Button 2: I am Interested Button (Connected to Super Admin) */}
            <button
              onClick={handleInterestClick}
              disabled={interested || submittingInterest}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                interested
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 hover:border-pink-500/40 active:scale-95'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  interested ? 'text-pink-400 fill-pink-400' : 'text-zinc-400 group-hover:text-pink-400'
                }`}
              />
              <span>
                {submittingInterest
                  ? 'রেকর্ড হচ্ছে...'
                  : interested
                  ? '✓ আপনি আগ্রহ প্রকাশ করেছেন'
                  : 'আমি এতে আগ্রহী (I am Interested)'}
              </span>
            </button>
          </div>

          {/* Quick confirmation notification */}
          {interestSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                ধন্যবাদ! আপনার আগ্রহ অ্যাডমিন প্যানেলে জমা হয়েছে। আমাদের এক্সপার্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
