'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Quote,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Globe,
  Share2,
  Mail,
} from 'lucide-react';
import ConsultationModal from '@/components/agency/ConsultationModal';

const DEFAULT_PROFILE = {
  founderName: 'রাশেদুল হাবিব',
  founderRole: 'Founder & CEO, DataBaj IT',
  founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  badge: 'LEADERSHIP & VISION',
  founderQuote: 'আমাদের মূল লক্ষ্য কেবল ক্যাম্পেইন বা ওয়েবসাইট তৈরি নয়—ক্লায়েন্টের বিজ্ঞাপনের বাজেট অপচয় বন্ধ করে রিয়েল প্রফিটেবল স্কেলে নিয়ে যাওয়া।',
  founderBio: '৭+ বছর ধরে ডেটা অ্যানালিটিক্স, ফেসবুক অ্যাড স্কেলিং ও হাই-পারফরম্যান্স ওয়েব ডেভেলপমেন্টে অগাধ অভিজ্ঞতা নিয়ে DataBaj-এর মাধ্যমে আমরা দেশ-বিদেশের ই-কমার্স এবং এসএমই ব্র্যান্ডগুলোকে শতভাগ ট্র্যাকড ও লাভজনক রূপ দিচ্ছি।',
  experienceYears: '৭+ বছর',
  stats: [
    { label: 'সন্তুষ্ট ক্লায়েন্ট', value: '১৫০+' },
    { label: 'সফল ক্যাম্পেইন ও প্রজেক্ট', value: '৩৫০+' },
    { label: 'অ্যাভারেজ আরওএএস (ROAS)', value: '৪.৮x' },
    { label: 'ডেটা ট্র্যাকিং অ্যাকুরেসি', value: '৯৯.৪%' },
  ],
  socials: {
    linkedin: '',
    facebook: '',
    email: 'ceo@databaj.com',
  },
};

export default function FounderSection() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setCurrentUser(data.user);
      })
      .catch(() => {});

    // Fetch dynamic profile
    fetch('/api/agency/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-zinc-950 to-black border-b border-zinc-900 overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.badge || 'LEADERSHIP & VISION'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            নেতৃত্ব ও ভিশন: প্রতিষ্ঠাতা ও প্রধান নির্বাহীর বার্তা
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            ক্লায়েন্টের প্রতিটি টাকার সঠিক মূল্য ও সর্বোচ্চ রিটার্ন নিশ্চিত করাই আমাদের মূল প্রতিশ্রুতি
          </p>
        </div>

        {/* Founder Card Container */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Founder Image & Key Highlight */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                {/* Decorative border ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-zinc-700/80 bg-zinc-950">
                  <Image
                    src={profile.founderImage || DEFAULT_PROFILE.founderImage}
                    alt={profile.founderName}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating experience pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">{profile.experienceYears || '৭+ বছর'} অভিজ্ঞতা</span>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Name & Role below image for mobile / centered */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Executive</span>
                </div>
                <h3 className="text-2xl font-black text-white">{profile.founderName}</h3>
                <p className="text-sm text-emerald-400 font-medium mt-0.5">{profile.founderRole}</p>
                
                {/* Social icons */}
                <div className="flex items-center justify-center gap-3 mt-4 text-zinc-400">
                  {profile.socials?.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                      </svg>
                    </a>
                  )}
                  {profile.socials?.facebook && (
                    <a
                      href={profile.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                      aria-label="Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                      </svg>
                    </a>
                  )}
                  {profile.socials?.email && (
                    <a
                      href={`mailto:${profile.socials.email}`}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Message, Quote & Stats */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quote block */}
              <div className="relative p-6 sm:p-7 rounded-2xl bg-black/40 border border-zinc-800/80">
                <Quote className="w-10 h-10 text-emerald-500/20 absolute -top-4 -left-3" />
                <p className="text-lg sm:text-xl font-semibold text-zinc-100 leading-relaxed italic relative z-10">
                  &ldquo;{profile.founderQuote}&rdquo;
                </p>
              </div>

              {/* Bio message */}
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {profile.founderBio}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(profile.stats && profile.stats.length > 0 ? profile.stats : DEFAULT_PROFILE.stats).map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-emerald-500/30 transition text-center"
                  >
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {st.value}
                    </div>
                    <div className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-1">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition group cursor-pointer"
                >
                  <span>সিইও-র সাথে সরাসরি কনসালটেশন নিন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>১০০% ফ্রি স্ট্র্যাটেজি সেশন ও প্রজেক্ট রোডম্যাপ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal Integration */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        service={{
          title: 'সিইও স্ট্র্যাটেজি কনসালটেশন (CEO Strategy Session)',
          slug: 'ceo-consultation',
        }}
      />
    </section>
  );
}
