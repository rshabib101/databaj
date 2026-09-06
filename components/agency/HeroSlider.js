'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import ConsultationModal from '@/components/agency/ConsultationModal';

const slides = [
  {
    id: 1,
    tag: 'Next-Gen Engineering',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'Modern Web Development & Scalable SaaS Solutions',
    titleHighlight: 'Web Development',
    subtitle:
      'আধুনিক Next.js, React ও ক্লাউড আর্কিটেকচার দিয়ে আপনার ব্যবসার জন্য তৈরি করছি সুপার-ফাস্ট ওয়েব অ্যাপ্লিকেশন ও কাস্টম ই-কমার্স প্ল্যাটফর্ম।',
    icon: Code,
    highlights: ['Next.js 16 & React 19', 'Sub-second Load Time', 'SEO & Core Web Vitals', 'Custom Dashboards'],
    primaryCta: { text: 'আমাদের সার্ভিসেস দেখুন', href: '#services' },
    secondaryCta: { text: 'ফ্রি কনসালটেশন নিন', href: '/register' },
    accentGradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    stat: { label: 'Performance Score', val: '99/100' },
  },
  {
    id: 2,
    tag: 'Performance Marketing',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Data-Driven Digital Marketing & Meta Ads Scaling',
    titleHighlight: 'Digital Marketing',
    subtitle:
      'বিজ্ঞাপনী বাজেটের অপচয় রোধ করে উচ্চ কনভার্সন অ্যাড ক্রিয়েটিভ, অডিয়েন্স রিসার্চ এবং প্রফিটেবল স্কেলিং স্ট্র্যাটেজির মাধ্যমে সেলস বহুগুণ বৃদ্ধি করুন।',
    icon: TrendingUp,
    highlights: ['Average ROAS 3.5x - 5.2x', 'Video Hook & Creative Testing', 'Ad Fatigue Prevention', 'Audience Segmentation'],
    primaryCta: { text: 'মেটা অ্যাডস অডিট করুন', href: '#auditor' },
    secondaryCta: { text: 'মার্কেটিং প্ল্যান জানুন', href: '/register' },
    accentGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    stat: { label: 'Average Client ROAS', val: '4.2x' },
  },
  {
    id: 3,
    tag: '100% Accurate Data',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Server-Side Tracking, Meta CAPI & GA4 Analytics',
    titleHighlight: 'E-commerce Tracking',
    subtitle:
      'iOS 14+ এবং ব্রাউজার অ্যাড-ব্লকারজনিত ডেটা লস প্রতিরোধ করে সার্ভার-সাইড ক্লাউড GTM দিয়ে ১০০% নিখুঁত ই-কমার্স ট্র্যাকিং নিশ্চিত করুন।',
    icon: Activity,
    highlights: ['Server-Side GTM Setup', 'Meta CAPI (10/10 Match Quality)', 'Google Analytics 4 E-commerce', 'Custom Deduplication'],
    primaryCta: { text: 'সার্ভিস বিস্তারিত দেখুন', href: '#services' },
    secondaryCta: { text: 'ট্র্যাকিং সেটআপ নিন', href: '/register' },
    accentGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    stat: { label: 'Event Match Quality', val: '9.8/10' },
  },
  {
    id: 4,
    tag: 'AI Diagnostics Tool',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Facebook Ads Campaign Performance & Health Auditor',
    titleHighlight: 'Ad Audit Engine',
    subtitle:
      'বিজ্ঞাপনের সব মেট্রিক ইনপুট দিন — আমাদের ইঞ্জিন বের করে দেবে ঠিক কোথায় বাজেট লিক হচ্ছে (Ad Fatigue, Low CTR, নাকি Landing Page Friction) এবং সমাধানের গাইড।',
    icon: Sparkles,
    highlights: ['০-১০০ স্কেলে Ad Health Score', 'স্বয়ংক্রিয় Lacking সনাক্তকরণ', 'Actionable Improvement Plan', 'সুপার অ্যাডমিন প্যানেল'],
    primaryCta: { text: 'এখনই অ্যাড অডিট করুন', href: '#auditor' },
    secondaryCta: { text: 'ক্লায়েন্ট পোর্টাল লগইন', href: '/login' },
    accentGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    stat: { label: 'Audited Ad Spend', val: '$500k+' },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = slides[current];
  const IconComponent = slide.icon;

  const handleOpenConsultation = (s, e) => {
    e.preventDefault();
    setConsultationTopic({ title: s.titleHighlight, slug: '' });
    setIsConsultationOpen(true);
  };

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-b border-zinc-800/80 py-16 sm:py-24"
    >
      {/* Background ambient gradient glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${slide.accentGradient} opacity-60 transition-all duration-1000 pointer-events-none`}
      ></div>
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Slide Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slide Tag */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 backdrop-blur-md ${slide.tagColor}`}>
              <Zap className="w-3.5 h-3.5" />
              <span>{slide.tag}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight transition-all duration-500 min-h-[120px] sm:min-h-[150px]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
              {slide.subtitle}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {slide.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href={slide.primaryCta.href}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>{slide.primaryCta.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {slide.secondaryCta.href === '/login' ? (
                currentUser ? (
                  <Link
                    href={currentUser.role === 'super_admin' ? '/admin' : '/dashboard'}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm border border-zinc-700 transition-colors"
                  >
                    {currentUser.role === 'super_admin' ? 'সুপার অ্যাডমিন প্যানেল' : 'ক্লায়েন্ট ড্যাশবোর্ড'}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm border border-zinc-700 transition-colors"
                  >
                    {slide.secondaryCta.text}
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleOpenConsultation(slide, e)}
                  className="px-6 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm border border-zinc-700 transition-colors cursor-pointer"
                >
                  {slide.secondaryCta.text}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                    {slide.stat.label}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">{slide.stat.val}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                  DataBaj Core Service
                </span>
                <h3 className="text-xl font-bold text-white">{slide.titleHighlight}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  আমরা শুধু সার্ভিস দিই না, ব্যবসার পরিমাপযোগ্য উন্নতি ও টেকসই গ্রোথ নিশ্চিত করি।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Quality Standard</span>
                  <span className="text-emerald-400">100% Industry Grade</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Support & Monitoring</span>
                  <span className="text-blue-400">Dedicated 24/7 Team</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Dashboard Access</span>
                  <span className="text-amber-400">Real-time Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls & Progress Dots */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  current === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        service={consultationTopic}
        currentUser={currentUser}
      />
    </section>
  );
}
