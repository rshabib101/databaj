'use client';

import { useState } from 'react';
import Link from 'next/link';
import AgencyNavbar from '@/components/agency/AgencyNavbar';
import HeroSlider from '@/components/agency/HeroSlider';
import FounderSection from '@/components/agency/FounderSection';
import ServicesSection from '@/components/agency/ServicesSection';
import RegisteredCompaniesSlider from '@/components/agency/RegisteredCompaniesSlider';
import AgencyFooter from '@/components/agency/AgencyFooter';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code,
  Activity,
  BarChart3,
  Users,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { analyzeCampaign } from '@/lib/adScoringEngine';

export default function HomePage() {
  // Live Quick Calculator state for prospective clients
  const [demoSpend, setDemoSpend] = useState('400');
  const [demoImp, setDemoImp] = useState('50000');
  const [demoClicks, setDemoClicks] = useState('1400');
  const [demoConv, setDemoConv] = useState('42');
  const [demoRev, setDemoRev] = useState('1650');
  const [demoHook, setDemoHook] = useState('32');

  const demoResult = analyzeCampaign({
    adSpend: Number(demoSpend),
    impressions: Number(demoImp),
    clicks: Number(demoClicks),
    conversions: Number(demoConv),
    revenue: Number(demoRev),
    videoHookRate: Number(demoHook),
  });

  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Public Agency Navbar */}
      <AgencyNavbar />

      {/* Main Agency Hero Slider */}
      <HeroSlider />

      {/* Dynamic Founder & CEO Leadership Section */}
      <FounderSection />

      {/* Dynamic Services Section (Managed via Super Admin) */}
      <ServicesSection />

      {/* Interactive Meta Ads Auditor Showcase Section */}
      <section id="auditor" className="py-24 bg-gradient-to-b from-zinc-950/90 via-black/95 to-zinc-950/90 [html.light_&]:from-slate-100/80 [html.light_&]:via-white [html.light_&]:to-slate-100/80 border-b border-zinc-800/80 [html.light_&]:border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 [html.light_&]:text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>INSTANT AI PERFORMANCE DIAGNOSTICS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white [html.light_&]:text-slate-900 tracking-tight">
              ফেসবুক ক্যাম্পেইন হেলথ ও ল্যাকিং ক্যালকুলেটর
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
              নিচের ঘরে আপনার সাম্প্রতিক ক্যাম্পেইনের মেট্রিকগুলো বসিয়ে এখনই লাইভ টেস্ট করুন আপনার বিজ্ঞাপনের হেলথ স্কোর কত এবং কোথায় বাজেট অপচয় হচ্ছে:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-6 bg-zinc-900/80 [html.light_&]:bg-white border border-zinc-800/90 [html.light_&]:border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between border-b border-zinc-800 [html.light_&]:border-slate-200 pb-3">
                <span className="text-sm font-bold text-white [html.light_&]:text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400 [html.light_&]:text-emerald-600" />
                  <span>ক্যাম্পেইনের মেট্রিক ইনপুট</span>
                </span>
                <span className="text-xs text-zinc-500 [html.light_&]:text-slate-500 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Interactive</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">Ad Spend ($ বা ৳)</label>
                  <input
                    type="number"
                    value={demoSpend}
                    onChange={(e) => setDemoSpend(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">Impressions</label>
                  <input
                    type="number"
                    value={demoImp}
                    onChange={(e) => setDemoImp(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">Link Clicks</label>
                  <input
                    type="number"
                    value={demoClicks}
                    onChange={(e) => setDemoClicks(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">Conversions / Sales</label>
                  <input
                    type="number"
                    value={demoConv}
                    onChange={(e) => setDemoConv(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">Total Revenue ($ বা ৳)</label>
                  <input
                    type="number"
                    value={demoRev}
                    onChange={(e) => setDemoRev(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 [html.light_&]:text-slate-700 mb-1.5">3-Sec Hook Rate %</label>
                  <input
                    type="number"
                    value={demoHook}
                    onChange={(e) => setDemoHook(e.target.value)}
                    className="w-full bg-black/60 [html.light_&]:bg-slate-50 border border-zinc-800 [html.light_&]:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-white [html.light_&]:text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  href="/register"
                  className="w-full py-3.5 rounded-2xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 [html.light_&]:bg-emerald-600 [html.light_&]:hover:bg-emerald-700 text-black [html.light_&]:text-white transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                >
                  <span>সম্পূর্ণ ক্লায়েন্ট ড্যাশবোর্ডে সেভ করতে সাইন আপ করুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Live Diagnostics Preview */}
            <div className="lg:col-span-6 bg-zinc-950/90 [html.light_&]:bg-white border border-zinc-800/90 [html.light_&]:border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Subtle top indicator beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 [html.light_&]:text-slate-500 uppercase font-mono tracking-wider font-semibold block">
                    Calculated Ad Health
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-black text-white [html.light_&]:text-slate-900 font-mono tracking-tight">{demoResult.scores.overallScore}</span>
                    <span className="text-zinc-500 [html.light_&]:text-slate-400 text-2xl font-bold">/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 [html.light_&]:text-slate-500 block mb-1">পারফরম্যান্স গ্রেড</span>
                  <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-sm ${demoResult.scores.badgeBg}`}>
                    {demoResult.scores.grade}
                  </span>
                </div>
              </div>

              {/* Pillars progress with animated meters */}
              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-zinc-900 [html.light_&]:border-slate-200">
                <div className="bg-zinc-900/60 [html.light_&]:bg-slate-50 p-3.5 rounded-2xl border border-zinc-800/80 [html.light_&]:border-slate-200 transition-all hover:border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 [html.light_&]:text-slate-600 font-medium">Creative & Hook</span>
                    <span className="font-bold text-white [html.light_&]:text-slate-900 font-mono">{demoResult.scores.creativeScore}/25</span>
                  </div>
                  <div className="w-full bg-zinc-800 [html.light_&]:bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${(demoResult.scores.creativeScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 [html.light_&]:bg-slate-50 p-3.5 rounded-2xl border border-zinc-800/80 [html.light_&]:border-slate-200 transition-all hover:border-blue-500/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 [html.light_&]:text-slate-600 font-medium">Cost Efficiency</span>
                    <span className="font-bold text-white [html.light_&]:text-slate-900 font-mono">{demoResult.scores.costScore}/25</span>
                  </div>
                  <div className="w-full bg-zinc-800 [html.light_&]:bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      style={{ width: `${(demoResult.scores.costScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 [html.light_&]:bg-slate-50 p-3.5 rounded-2xl border border-zinc-800/80 [html.light_&]:border-slate-200 transition-all hover:border-purple-500/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 [html.light_&]:text-slate-600 font-medium">Funnel & CVR</span>
                    <span className="font-bold text-white [html.light_&]:text-slate-900 font-mono">{demoResult.scores.conversionScore}/30</span>
                  </div>
                  <div className="w-full bg-zinc-800 [html.light_&]:bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      style={{ width: `${(demoResult.scores.conversionScore / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 [html.light_&]:bg-slate-50 p-3.5 rounded-2xl border border-zinc-800/80 [html.light_&]:border-slate-200 transition-all hover:border-amber-500/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 [html.light_&]:text-slate-600 font-medium">ROAS & Profit</span>
                    <span className="font-bold text-white [html.light_&]:text-slate-900 font-mono">{demoResult.scores.roasScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 [html.light_&]:bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      style={{ width: `${(demoResult.scores.roasScore / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Identified lackings preview */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-white [html.light_&]:text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>শনাক্তকৃত ঘাটতি (Bottlenecks):</span>
                </span>

                {demoResult.lackings.slice(0, 2).map((lack, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-rose-950/20 [html.light_&]:bg-rose-50 border border-rose-900/40 [html.light_&]:border-rose-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-rose-300 [html.light_&]:text-rose-700">
                      <span>{lack.title}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-rose-900/30 [html.light_&]:bg-rose-100">{lack.value} (Target: {lack.benchmark})</span>
                    </div>
                    <p className="text-zinc-400 [html.light_&]:text-slate-600 text-[11px] mt-1.5 leading-relaxed">{lack.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registered Client Companies Logo & Name Slider */}
      <RegisteredCompaniesSlider />

      {/* Why Choose DataBaj Section with Cybernetic Cards */}
      <section id="why-us" className="py-24 bg-black/90 [html.light_&]:bg-white border-b border-zinc-900 [html.light_&]:border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 [html.light_&]:text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>THE DATABAJ ADVANTAGE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white [html.light_&]:text-slate-900 tracking-tight">
              কেন DataBaj আপনার বিশ্বস্ত আইটি পার্টনার?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
              আমরা কোনো সাধারণ এজেন্সি নই — আমরা প্রতিটি ক্লায়েন্টের টেকনোলজি ও সেলস স্কেলিংয়ে ডেডিকেটেড গ্রোথ পার্টনার হিসেবে কাজ করি।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative p-7 rounded-3xl bg-zinc-950/80 [html.light_&]:bg-slate-50 border border-zinc-800/80 [html.light_&]:border-slate-200/90 hover:border-blue-500/50 [html.light_&]:hover:border-blue-500 space-y-4 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-400 [html.light_&]:text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-600 [html.light_&]:text-slate-400">01</span>
              </div>
              <h3 className="text-lg font-bold text-white [html.light_&]:text-slate-900 group-hover:text-blue-400 [html.light_&]:group-hover:text-blue-600 transition-colors">আধুনিক টেক স্ট্যাক</h3>
              <p className="text-xs text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
                Next.js 16, React 19 এবং ক্লাউড আর্কিটেকচার যা সহজে লোড হয় এবং বড় ট্রাফিকেও আল্ট্রা-স্মুথ পারফর্ম করে।
              </p>
            </div>

            <div className="group relative p-7 rounded-3xl bg-zinc-950/80 [html.light_&]:bg-slate-50 border border-zinc-800/80 [html.light_&]:border-slate-200/90 hover:border-emerald-500/50 [html.light_&]:hover:border-emerald-500 space-y-4 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 [html.light_&]:text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-600 [html.light_&]:text-slate-400">02</span>
              </div>
              <h3 className="text-lg font-bold text-white [html.light_&]:text-slate-900 group-hover:text-emerald-400 [html.light_&]:group-hover:text-emerald-600 transition-colors">হাই ROAS মার্কেটিং</h3>
              <p className="text-xs text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
                বাজেট অপচয় কমিয়ে ৩-সেকেন্ড ভিডিও হুক টেস্ট ও ক্রিয়েটিভ অপ্টিমাইজেশন দিয়ে সর্বোচ্চ কনভার্সন ও সেলস।
              </p>
            </div>

            <div className="group relative p-7 rounded-3xl bg-zinc-950/80 [html.light_&]:bg-slate-50 border border-zinc-800/80 [html.light_&]:border-slate-200/90 hover:border-purple-500/50 [html.light_&]:hover:border-purple-500 space-y-4 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400 [html.light_&]:text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-600 [html.light_&]:text-slate-400">03</span>
              </div>
              <h3 className="text-lg font-bold text-white [html.light_&]:text-slate-900 group-hover:text-purple-400 [html.light_&]:group-hover:text-purple-600 transition-colors">১০০% নির্ভুল ট্র্যাকিং</h3>
              <p className="text-xs text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
                সার্ভার-সাইড ক্লাউড GTM এবং Meta CAPI এর মাধ্যমে প্রতিটি পারচেজ ও ইভেন্টের শতভাগ নির্ভুল গণনা।
              </p>
            </div>

            <div className="group relative p-7 rounded-3xl bg-zinc-950/80 [html.light_&]:bg-slate-50 border border-zinc-800/80 [html.light_&]:border-slate-200/90 hover:border-amber-500/50 [html.light_&]:hover:border-amber-500 space-y-4 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 [html.light_&]:text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-600 [html.light_&]:text-slate-400">04</span>
              </div>
              <h3 className="text-lg font-bold text-white [html.light_&]:text-slate-900 group-hover:text-amber-400 [html.light_&]:group-hover:text-amber-600 transition-colors">ডেডিকেটেড পোর্টাল</h3>
              <p className="text-xs text-zinc-400 [html.light_&]:text-slate-600 leading-relaxed">
                প্রতিটি ক্লায়েন্টের জন্য নিজস্ব কোম্পানি ড্যাশবোর্ড এবং রিয়েল-টাইম পারফরম্যান্স অডিট ও টিকিট সাপোর্ট।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Footer */}
      <AgencyFooter />
    </div>
  );
}
