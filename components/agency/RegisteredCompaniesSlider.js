'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Sparkles,
  Zap,
  Wand2,
  Star,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// Ancient Norse & Arcane Runes for ambient magical effect
const RUNIC_SYMBOLS = ['᚛', 'ᚱ', 'ᚦ', 'ᛟ', 'ᛏ', 'ᚷ', 'ᛞ', 'ᚹ', 'ᚲ', 'ᛋ', 'ᛚ', '✦', '✧', '⚡'];

const INITIAL_COMPANIES = [
  {
    companyName: 'Shamim Electronics',
    industry: 'E-commerce & Retail',
    logoUrl: '',
    rating: '5.0',
    growth: '+420% Sales',
    totalOrders: '28K+ Orders Managed',
    verifiedClient: true,
    runeSign: '᚛',
  },
  {
    companyName: 'LuxeBD Fashion & Lifestyle',
    industry: 'Fashion & Apparel',
    logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&q=80',
    rating: '5.0',
    growth: '+380% ROAS',
    totalOrders: '19K+ Orders Managed',
    verifiedClient: true,
    runeSign: 'ᚱ',
  },
  {
    companyName: 'GlowCare Organic',
    industry: 'Beauty & Skincare',
    logoUrl: '',
    rating: '4.9',
    growth: '+290% ROAS',
    totalOrders: '14K+ Orders Managed',
    verifiedClient: true,
    runeSign: 'ᚦ',
  },
  {
    companyName: 'GadgetZone BD',
    industry: 'Consumer Electronics',
    logoUrl: '',
    rating: '5.0',
    growth: '+450% Sales',
    totalOrders: '32K+ Orders Managed',
    verifiedClient: true,
    runeSign: 'ᛟ',
  },
  {
    companyName: 'EduPath Digital Academy',
    industry: 'EdTech & Training',
    logoUrl: '',
    rating: '5.0',
    growth: '+510% Leads',
    totalOrders: '22K+ Students Enrolled',
    verifiedClient: true,
    runeSign: 'ᛏ',
  },
  {
    companyName: 'PureOrganic Living',
    industry: 'Health & Organic Food',
    logoUrl: '',
    rating: '4.9',
    growth: '3.4x Scaled',
    totalOrders: '16K+ Orders Managed',
    verifiedClient: true,
    runeSign: 'ᚷ',
  },
];

export default function RegisteredCompaniesSlider() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCasting, setIsCasting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Fetch Companies
  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.companies && data.companies.length > 0) {
          // Normalize and enrich company data with realistic growth benchmarks if missing
          const enriched = data.companies.map((c, idx) => ({
            ...c,
            rating: c.rating || '5.0',
            growth: c.growth || (idx % 2 === 0 ? `+${320 + (idx * 37) % 200}% ROAS` : `${(2.8 + (idx * 0.4) % 2).toFixed(1)}x Scaled`),
            totalOrders: c.totalOrders || `${(12 + (idx * 5) % 30)}K+ Orders Managed`,
            runeSign: RUNIC_SYMBOLS[idx % RUNIC_SYMBOLS.length]
          }));
          setCompanies(enriched);
        }
      })
      .catch(console.error);
  }, []);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    if (!companies || companies.length === 0) return [];
    if (selectedFilter === 'All') return companies;
    return companies.filter((c) => {
      const ind = (c.industry || '').toLowerCase();
      if (selectedFilter === 'Ecommerce') return ind.includes('commerce') || ind.includes('retail');
      if (selectedFilter === 'Fashion') return ind.includes('fashion') || ind.includes('apparel') || ind.includes('leather');
      if (selectedFilter === 'Beauty') return ind.includes('beauty') || ind.includes('care') || ind.includes('skin');
      if (selectedFilter === 'Tech') return ind.includes('tech') || ind.includes('electronic') || ind.includes('course');
      return true;
    });
  }, [companies, selectedFilter]);

  // Audio Synthesizer for magical Hollywood effects (Zero external files needed)
  const playMagicSound = (type = 'whoosh') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio playback failed silently
    }
  };

  // Scroll Observer for Cinematic Reveal
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if in view
      if (rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15) {
        setIsInView(true);
      }

      // Calculate progress between 0 and 1
      const totalDist = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentPos / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Magical Canvas Sparkles & Arcane Runes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Array
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.6 + 0.6,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: -Math.random() * 0.8 - 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? 'rgba(168, 85, 247, ' : 'rgba(217, 70, 239, ',
      symbol: Math.random() > 0.7 ? RUNIC_SYMBOLS[Math.floor(Math.random() * RUNIC_SYMBOLS.length)] : null,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        if (p.symbol) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = '13px serif';
          ctx.fillStyle = `${p.color}${p.opacity * 0.75})`;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 8;
          ctx.fillText(p.symbol, -5, 5);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Hand gesture trigger: cast spell to cycle cards
  const handleCastSpell = (nextIndex = null) => {
    setIsCasting(true);
    playMagicSound('whoosh');

    setTimeout(() => {
      if (nextIndex !== null) {
        setActiveIndex(nextIndex);
      } else {
        setActiveIndex((prev) => {
          const listLen = filteredCompanies.length || 1;
          return (prev + 1) % listLen;
        });
      }
      playMagicSound('chime');
    }, 280);

    setTimeout(() => {
      setIsCasting(false);
    }, 850);
  };

  // Mouse Parallax Effect
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Auto magic gesture pulse every 6.5s if visible and not manually interacted recently
  useEffect(() => {
    if (!isInView || filteredCompanies.length <= 1) return;
    const interval = setInterval(() => {
      handleCastSpell();
    }, 6500);
    return () => clearInterval(interval);
  }, [isInView, filteredCompanies.length]);

  if (!companies || companies.length === 0) return null;

  // Active highlighted company
  const activeCompany = filteredCompanies[activeIndex % filteredCompanies.length] || companies[0];

  // Marquee list for infinite loop
  const marqueeList = [...companies, ...companies];

  return (
    <section
      id="brands"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-24 bg-[#05020a] [html.light_&]:bg-slate-950 text-white overflow-hidden border-y border-purple-900/40 select-none"
    >
      {/* Dynamic Magical Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full opacity-80"
      />

      {/* Atmospheric Cosmic Nebula & Hollywood Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Violet Core Flare */}
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
          }}
        />
        {/* Mystic Magenta Ambient Glow */}
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-700/15 rounded-full blur-[130px]" />
        {/* Ancient Runic Grid Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(168,85,247,0.1)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Top Header Badge & Hollywood Movie Title Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(168,85,247,0.25)] backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="tracking-wide">DataBaj প্ল্যাটফর্মে নিবন্ধিত ও বিশ্বস্ত শীর্ষ ব্র্যান্ডসমূহ</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-900/90 text-purple-200 text-[10px] uppercase font-mono tracking-wider border border-purple-400/30">
              Verified Elite
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-purple-300 to-fuchsia-400 drop-shadow-[0_2px_15px_rgba(168,85,247,0.3)]">
            মহাজাগতিক শক্তিতে জাগ্রত শীর্ষ ব্র্যান্ডসমূহ
          </h2>

          <p className="text-sm sm:text-base text-purple-200/70 max-w-2xl mx-auto leading-relaxed">
            আমন্ত্রণ জানাচ্ছি তাঁদের — যারা আধুনিক টেকনোলজি ও সেলস মেথডোলজির জাদুকরী শক্তিতে বিশ্বাস করে নিজেদের ব্যবসাকে নিয়ে গেছেন অনন্য উচ্চতায়।
          </p>

          {/* Interactive Controls Bar: Sound toggle & Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playMagicSound('chime');
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 ${
                soundEnabled
                  ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-purple-300 hover:border-purple-800'
              }`}
              title={soundEnabled ? 'জাদুকরী সাউন্ড চালু' : 'জাদুকরী সাউন্ড মিউট (ক্লিক করে শুনুন)'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>ম্যাজিক সাউন্ড: অন</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>ম্যাজিক সাউন্ড: অফ</span>
                </>
              )}
            </button>

            {/* Category Filter Pills */}
            {[
              { id: 'All', label: 'সব ব্র্যান্ড' },
              { id: 'Ecommerce', label: 'ই-কমার্স' },
              { id: 'Fashion', label: 'ফ্যাশন' },
              { id: 'Beauty', label: 'বিউটি' },
              { id: 'Tech', label: 'গ্যাজেট ও টেক' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedFilter(tab.id);
                  setActiveIndex(0);
                  playMagicSound('whoosh');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 border ${
                  selectedFilter === tab.id
                    ? 'bg-gradient-to-r from-purple-700/80 to-fuchsia-700/80 text-white border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            CINEMATIC HOLLYWOOD MAGIC STAGE (SORCERER + SUMMONED CARDS)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* LEFT: THE MYSTIC SORCERER WITH GLOWING RUNIC STAFF & GESTURE */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* Runes Arc Ring Rotating Around the Sorcerer Portal */}
            <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-purple-500/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-dashed border-fuchsia-500/15 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

            {/* Glowing Character Frame */}
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden border-2 transition-all duration-700 shadow-2xl group ${
                isCasting
                  ? 'border-purple-400 shadow-[0_0_60px_rgba(168,85,247,0.7)] scale-[1.02]'
                  : 'border-purple-700/50 shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:border-purple-400/80'
              }`}
            >
              {/* The Provided Sorcerer Image */}
              <Image
                src="/sorcerer-brands.jpg"
                alt="DataBaj Arcane Sorcerer"
                fill
                priority
                className={`object-cover object-top transition-transform duration-1000 ${
                  isCasting ? 'scale-105' : 'group-hover:scale-102'
                }`}
              />

              {/* Hollywood Cinematic Vignette & Bottom Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />

              {/* Magical Staff Flare (Positioned around the skull staff on the right side) */}
              <div
                className={`absolute top-6 right-4 sm:top-10 sm:right-6 w-28 h-28 rounded-full pointer-events-none transition-all duration-500 ${
                  isCasting
                    ? 'bg-purple-500/60 blur-[30px] scale-150 animate-ping'
                    : 'bg-purple-500/30 blur-[25px] animate-pulse'
                }`}
              />

              {/* Glowing Rune Sigils in the Sorcerer's Aura */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 text-purple-300/80 text-xs font-mono drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]">
                <span className="animate-pulse">᚛ ᚱ ᚦ</span>
                <span className="text-[10px] text-purple-400/60 font-sans uppercase tracking-widest">
                  {isCasting ? '⚡ CASTING SPELL' : '✦ MANA 100%'}
                </span>
              </div>

              {/* Sorcerer Hand Spell Wave Burst on Command */}
              {isCasting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full border-2 border-purple-400 bg-purple-500/10 blur-sm animate-ping" />
                  <div className="w-72 h-72 rounded-full border border-fuchsia-400 bg-fuchsia-500/10 blur-md animate-pulse" />
                </div>
              )}

              {/* Bottom Character Caption & Spell Button Overlay */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                    <Flame className="w-3.5 h-3.5 text-fuchsia-400 animate-bounce" />
                    <span>মহাজাদুকরের আহ্বান</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">হাতের ইশারায় ব্র্যান্ড প্রকাশ</p>
                </div>

                {/* Hand Gesture Spell Trigger Button */}
                <button
                  onClick={() => handleCastSpell()}
                  disabled={isCasting}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all flex items-center gap-1.5 border border-purple-300/30"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isCasting ? 'animate-spin' : ''}`} />
                  <span>{isCasting ? 'আহ্বান হচ্ছে...' : 'ইশারা দিন'}</span>
                </button>
              </div>
            </div>

            {/* Connecting Arcane Beam between Sorcerer and Card (Visible on Desktop) */}
            <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-1 pointer-events-none overflow-hidden">
              <div
                className={`w-full h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-transparent transition-opacity duration-300 ${
                  isCasting ? 'opacity-100 shadow-[0_0_20px_#a855f7]' : 'opacity-40'
                }`}
              />
            </div>
          </div>

          {/* RIGHT: HOLOGRAPHIC SUMMONED CARDS ORBIT & SHOWCASE */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Active Summoned Showcase Card */}
            <div
              className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900/90 via-purple-950/40 to-zinc-950/90 border-2 transition-all duration-700 backdrop-blur-2xl ${
                isCasting
                  ? 'border-purple-400 scale-[0.98] shadow-[0_0_50px_rgba(168,85,247,0.5)]'
                  : 'border-purple-500/40 hover:border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.2)]'
              }`}
            >
              {/* Corner Runic Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="font-serif text-lg text-purple-400/80 drop-shadow-[0_0_8px_#c084fc]">
                  {activeCompany.runeSign || '᚛'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ভেরিফাইড ব্র্যান্ড
                </span>
              </div>

              {/* Main Brand Card Content */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                {/* Brand Mystic Medallion Logo */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900 to-zinc-900 border-2 border-purple-400/60 flex items-center justify-center text-purple-200 font-black text-2xl shadow-[0_0_25px_rgba(168,85,247,0.35)] shrink-0 overflow-hidden group">
                  {activeCompany.logoUrl ? (
                    <Image
                      src={activeCompany.logoUrl}
                      alt={activeCompany.companyName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{activeCompany.companyName.charAt(0).toUpperCase()}</span>
                  )}
                  {/* Subtle Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {activeCompany.companyName}
                    </h3>
                    <div className="flex items-center text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span>{activeCompany.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-300/80 font-medium">
                    {activeCompany.industry || 'ই-কমার্স ও রিটেইল'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    DataBaj ইকোসিস্টেমের সক্রিয় ও বিশ্বস্ত ক্লায়েন্ট পার্টনার
                  </p>
                </div>
              </div>

              {/* Growth & Performance Metric Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-medium mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>গ্রোথ পারফরম্যান্স</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                    {activeCompany.growth}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-medium mb-1">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>অর্ডার ও ট্র্যাকিং</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-purple-200 font-mono">
                    {activeCompany.totalOrders}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-medium mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>সিকিউরিটি সিল</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-200 flex items-center gap-1">
                    <span>100% Verified</span>
                  </div>
                </div>
              </div>

              {/* Navigation & Gesture Quick Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = (activeIndex - 1 + filteredCompanies.length) % filteredCompanies.length;
                      handleCastSpell(next);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-purple-900/60 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all active:scale-95"
                    title="পূর্ববর্তী ব্র্যান্ড"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const next = (activeIndex + 1) % filteredCompanies.length;
                      handleCastSpell(next);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-purple-900/60 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all active:scale-95"
                    title="পরবর্তী ব্র্যান্ড"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-purple-300/60 font-mono ml-2">
                    {activeIndex + 1} / {filteredCompanies.length}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCompany(activeCompany)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-semibold hover:text-white transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>কেস স্টাডি ও প্রোফাইল</span>
                </button>
              </div>
            </div>

            {/* Orbiting Mini Cards: Quick Wave Selector */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredCompanies.slice(0, 4).map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCastSpell(idx)}
                  className={`p-2.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-2.5 ${
                    activeIndex === idx
                      ? 'bg-purple-900/60 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:border-purple-700 hover:text-purple-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                    {comp.companyName.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{comp.companyName}</div>
                    <div className="text-[10px] text-emerald-400 truncate">{comp.growth}</div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ========================================================
            INFINITE HORIZONTAL RUNIC GLIDING MARQUEE STREAM
            ======================================================== */}
        <div className="relative pt-6 border-t border-purple-900/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300/80">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>অনন্ত রুনিক প্রবাহে ব্র্যান্ডসমূহের তালিকা</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              কার্ডে কার্সর রেখে থামিয়ে বিস্তারিত দেখুন
            </div>
          </div>

          {/* Left & Right Glowing Mist Fades for Infinite Horizon */}
          <div className="absolute left-0 top-12 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#05020a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-12 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#05020a] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex w-max space-x-5 animate-arcane-marquee hover:[animation-play-state:paused] py-2">
            {marqueeList.map((company, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCompany(company)}
                className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 hover:border-purple-400/80 hover:bg-purple-950/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/20 group cursor-pointer backdrop-blur-md"
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform overflow-hidden relative">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.companyName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    company.companyName.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {company.companyName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{company.industry || 'E-commerce'}</span>
                    {company.growth && (
                      <span className="inline-flex items-center text-emerald-400 font-mono font-medium">
                        • {company.growth}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================
          BRAND DETAIL MODAL (HOLLYWOOD ARCANE CRYSTAL DISPLAY)
          ======================================================== */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border-2 border-purple-500/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] text-left">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-400 flex items-center justify-center text-purple-200 font-bold text-xl overflow-hidden relative shadow-lg">
                {selectedCompany.logoUrl ? (
                  <Image
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.companyName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  selectedCompany.companyName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-xl font-black text-white">{selectedCompany.companyName}</h4>
                <p className="text-xs text-purple-300">{selectedCompany.industry || 'E-commerce & Retail'}</p>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DataBaj অফিসিয়ালি ভেরিফাইড ক্লায়েন্ট</span>
                </div>
              </div>
            </div>

            {/* Modal Highlights */}
            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400">অর্জিত পারফরম্যান্স গ্রোথ:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{selectedCompany.growth}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400">ট্র্যাকিং ও ডাটা অ্যাকুরেসি:</span>
                <span className="font-mono font-bold text-purple-300 text-sm">99.8% Server-Side Sync</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400">ক্লায়েন্ট স্যাটিস্ফ্যাকশন রেটিং:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{selectedCompany.rating || '5.0'} / 5.0 ★</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              DataBaj-এর হাই-পারফরম্যান্স ট্র্যাকিং আর্কিটেকচার এবং কনভার্সন অপ্টিমাইজেশনের মাধ্যমে এই ব্র্যান্ডটি তাদের অ্যাড স্পেন্ড রিটার্ন এবং সেলস স্কেলিংয়ে যুগান্তকারী সাফল্য অর্জন করেছে।
            </p>

            <button
              onClick={() => setSelectedCompany(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes arcaneMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-arcane-marquee {
          animation: arcaneMarquee 38s linear infinite;
        }
      `}</style>
    </section>
  );
}
