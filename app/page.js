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
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Public Agency Navbar */}
      <AgencyNavbar />

      {/* Main Agency Hero Slider */}
      <HeroSlider />

      {/* Dynamic Founder & CEO Leadership Section */}
      <FounderSection />

      {/* Dynamic Services Section (Managed via Super Admin) */}
      <ServicesSection />

      {/* Interactive Meta Ads Auditor Showcase Section */}
      <section id="auditor" className="py-20 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-b border-zinc-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant AI Performance Diagnostics</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ফেসবুক ক্যাম্পেইন হেলথ ও ল্যাকিং ক্যালকুলেটর
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              নিচের ঘরে আপনার সাম্প্রতিক ক্যাম্পেইনের মেট্রিকগুলো বসিয়ে এখনই লাইভ টেস্ট করুন আপনার বিজ্ঞাপনের হেলথ স্কোর কত এবং কোথায় বাজেট অপচয় হচ্ছে:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-6 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  ক্যাম্পেইনের মেট্রিক ইনপুট
                </span>
                <span className="text-xs text-zinc-500 font-mono">Live Interactive</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Ad Spend ($ বা ৳)</label>
                  <input
                    type="number"
                    value={demoSpend}
                    onChange={(e) => setDemoSpend(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Impressions</label>
                  <input
                    type="number"
                    value={demoImp}
                    onChange={(e) => setDemoImp(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Link Clicks</label>
                  <input
                    type="number"
                    value={demoClicks}
                    onChange={(e) => setDemoClicks(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Conversions / Sales</label>
                  <input
                    type="number"
                    value={demoConv}
                    onChange={(e) => setDemoConv(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Revenue ($ বা ৳)</label>
                  <input
                    type="number"
                    value={demoRev}
                    onChange={(e) => setDemoRev(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">3-Sec Hook Rate %</label>
                  <input
                    type="number"
                    value={demoHook}
                    onChange={(e) => setDemoHook(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  href="/register"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>সম্পূর্ণ ক্লায়েন্ট ড্যাশবোর্ডে সেভ করতে সাইন আপ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Live Diagnostics Preview */}
            <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider font-semibold block">
                    Calculated Ad Health
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-white">{demoResult.scores.overallScore}</span>
                    <span className="text-zinc-500 text-xl font-bold">/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block mb-1">পারফরম্যান্স গ্রেড</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${demoResult.scores.badgeBg}`}>
                    {demoResult.scores.grade}
                  </span>
                </div>
              </div>

              {/* Pillars progress */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">Creative & Hook</span>
                    <span className="font-bold text-white">{demoResult.scores.creativeScore}/25</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(demoResult.scores.creativeScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">Cost Efficiency</span>
                    <span className="font-bold text-white">{demoResult.scores.costScore}/25</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(demoResult.scores.costScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">Funnel & CVR</span>
                    <span className="font-bold text-white">{demoResult.scores.conversionScore}/30</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${(demoResult.scores.conversionScore / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">ROAS & Profit</span>
                    <span className="font-bold text-white">{demoResult.scores.roasScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(demoResult.scores.roasScore / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Identified lackings preview */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  শনাক্তকৃত ঘাটতি (Bottlenecks):
                </span>

                {demoResult.lackings.slice(0, 2).map((lack, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
                    <div className="flex items-center justify-between font-bold text-rose-300">
                      <span>{lack.title}</span>
                      <span className="font-mono text-[11px]">{lack.value} (Target: {lack.benchmark})</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">{lack.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registered Client Companies Logo & Name Slider */}
      <RegisteredCompaniesSlider />

      {/* Why Choose DataBaj Section */}
      <section id="why-us" className="py-20 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              কেন DataBaj আপনার বিশ্বস্ত আইটি পার্টনার?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              আমরা কোনো সাধারণ এজেন্সি নই — আমরা প্রতিটি ক্লায়েন্টের টেকনোলজি ও সেলস স্কেলিংয়ে ডেডিকেটেড গ্রোথ পার্টনার হিসেবে কাজ করি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">আধুনিক টেক স্ট্যাক</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Next.js 16, React 19 এবং ক্লাউড আর্কিটেকচার যা সহজে লোড হয় এবং বড় ট্রাফিকেও স্মুথ থাকে।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">হাই ROAS মার্কেটিং</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                বাজেট অপচয় কমিয়ে ৩-সেকেন্ড ভিডিও হুক টেস্ট ও ক্রিয়েটিভ অপ্টিমাইজেশন দিয়ে সর্বোচ্চ সেলস।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">১০০% নির্ভুল ট্র্যাকিং</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                সার্ভার-সাইড ক্লাউড GTM এবং Meta CAPI এর মাধ্যমে প্রতিটি পারচেজ ও ইভেন্ট নির্ভুল গণনা।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">ডেডিকেটেড পোর্টাল</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                প্রতিটি ক্লায়েন্টের জন্য নিজস্ব কোম্পানি ড্যাশবোর্ড এবং রিয়েল-টাইম পারফরম্যান্স অডিট সাপোর্ট।
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
