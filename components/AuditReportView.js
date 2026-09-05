'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Target,
  MessageSquare,
  Save,
  Check,
  Zap,
} from 'lucide-react';

export default function AuditReportView({
  campaign,
  isSuperAdmin,
  onNotesUpdated,
}) {
  const [adminNotes, setAdminNotes] = useState(campaign?.adminNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!campaign) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
        কোনো ক্যাম্পেইন সিলেক্ট করা নেই। তালিকা থেকে একটি ক্যাম্পেইন বেছে নিন বা নতুন অডিট যোগ করুন।
      </div>
    );
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign._id,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (onNotesUpdated) onNotesUpdated(campaign._id, adminNotes);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-blue-400 stroke-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 45) return 'text-amber-400 stroke-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 stroke-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'high') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> জরুরি সমাধান দরকার (High)
        </span>
      );
    }
    if (severity === 'medium') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> অপ্টিমাইজেশন দরকার (Medium)
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> ভালো (Good)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overall Score Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {campaign.companyName}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Objective: {campaign.objective}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {new Date(campaign.createdAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {campaign.campaignName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              ফেসবুক ক্যাম্পেইনের সমন্বিত হেলথ রিপোর্ট ও পারফরম্যান্স বিশ্লেষণ
            </p>
          </div>

          {/* Large Overall Health Score Badge */}
          <div className="flex items-center gap-4 bg-black/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 shadow-inner">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline justify-center">
                <span>{campaign.overallScore}</span>
                <span className="text-zinc-500 text-xl font-medium">/100</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold block mt-0.5">
                Ad Health Score
              </span>
            </div>

            <div className="border-l border-zinc-800 pl-4 space-y-1">
              <span className="text-xs text-zinc-400 block font-medium">গ্রেড রেটিং:</span>
              <span className={`text-sm font-bold block ${getScoreColor(campaign.overallScore).split(' ')[0]}`}>
                {campaign.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Health Pillars Progress Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Creative & Hook</span>
              <span className="font-bold text-white">{campaign.creativeScore}/25</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(campaign.creativeScore / 25) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Cost Efficiency</span>
              <span className="font-bold text-white">{campaign.costScore}/25</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(campaign.costScore / 25) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Funnel & CVR</span>
              <span className="font-bold text-white">{campaign.conversionScore}/30</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(campaign.conversionScore / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">ROAS & Profit</span>
              <span className="font-bold text-white">{campaign.roasScore}/20</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(campaign.roasScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Conversion Funnel Flow */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-emerald-400" />
          বিজ্ঞাপন ফানেল ফ্লো (Ad Conversion Funnel)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          {/* Funnel Step 1: Reach & Impressions */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 relative">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ধাপ ১: বিজ্ঞাপন প্রদর্শন (Top)
            </span>
            <div className="mt-2">
              <span className="text-lg font-black text-white">{campaign.impressions?.toLocaleString()}</span>
              <span className="text-xs text-zinc-400 block">Impressions</span>
            </div>
            <div className="mt-2 text-xs text-zinc-500 font-mono">
              Reach: {campaign.reach?.toLocaleString()} • Freq: {campaign.frequency}x
            </div>
          </div>

          {/* Funnel Step 2: Clicks & CTR */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 relative">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ধাপ ২: ক্লিক ও এনগেজমেন্ট (Mid)
            </span>
            <div className="mt-2">
              <span className="text-lg font-black text-white">{campaign.clicks?.toLocaleString()}</span>
              <span className="text-xs text-zinc-400 block">Link Clicks</span>
            </div>
            <div className="mt-2 text-xs">
              <span className={`font-bold ${campaign.ctr >= 1.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                CTR: {campaign.ctr}%
              </span>{' '}
              <span className="text-zinc-500">• CPC: ${campaign.cpc}</span>
            </div>
          </div>

          {/* Funnel Step 3: Conversions & CVR */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 relative">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ধাপ ৩: সেলস / কনভার্সন (Bottom)
            </span>
            <div className="mt-2">
              <span className="text-lg font-black text-white">{campaign.conversions?.toLocaleString()}</span>
              <span className="text-xs text-zinc-400 block">Results / Orders</span>
            </div>
            <div className="mt-2 text-xs">
              <span className={`font-bold ${campaign.cvr >= 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                CVR: {campaign.cvr}%
              </span>{' '}
              <span className="text-zinc-500">• CPA: ${campaign.cpa}</span>
            </div>
          </div>

          {/* Funnel Step 4: ROAS & Value */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 relative">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ধাপ ৪: ফলাফল ও মুনাফা (Outcome)
            </span>
            <div className="mt-2">
              <span className="text-lg font-black text-emerald-400">${campaign.revenue?.toLocaleString()}</span>
              <span className="text-xs text-zinc-400 block">Total Revenue</span>
            </div>
            <div className="mt-2 text-xs font-bold text-white">
              ROAS:{' '}
              <span className={campaign.roas >= 2.5 ? 'text-emerald-400' : 'text-amber-400'}>
                {campaign.roas}x
              </span>{' '}
              <span className="text-zinc-500 font-normal">• Spend: ${campaign.adSpend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LACKINGS SECTION (কোথায় সমস্যা বা ঘাটতি) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ক্যাম্পেইনে কোথায় সমস্যা? (Bottlenecks & Lackings)</h3>
              <p className="text-xs text-zinc-400">
                এই জায়গাগুলোতে ঘাটতি থাকায় আপনার বিজ্ঞাপনের বাজেট অপচয় হচ্ছে:
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            {campaign.lackings?.length || 0} টি সমস্যা সনাক্ত
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {campaign.lackings?.map((lacking, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                lacking.severity === 'high'
                  ? 'bg-rose-950/20 border-rose-900/50'
                  : lacking.severity === 'medium'
                  ? 'bg-amber-950/20 border-amber-900/50'
                  : 'bg-zinc-900/40 border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-white">{lacking.title}</h4>
                {getSeverityBadge(lacking.severity)}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-3">{lacking.description}</p>

              <div className="flex items-center gap-3 text-xs bg-black/40 p-2.5 rounded-xl border border-zinc-800/80 font-mono">
                <div>
                  <span className="text-zinc-500">আপনার মান:</span>{' '}
                  <span className="font-bold text-rose-400">{lacking.value}</span>
                </div>
                <div className="text-zinc-600">|</div>
                <div>
                  <span className="text-zinc-500">আদর্শ বেঞ্চমার্ক:</span>{' '}
                  <span className="font-semibold text-emerald-400">{lacking.benchmark}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONABLE RECOMMENDATIONS & GUIDE */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              পারফরম্যান্স বৃদ্ধির গাইড (Actionable Improvement Plan)
            </h3>
            <p className="text-xs text-zinc-400">
              ঘাটতিগুলো সমাধান করতে ক্রমান্বয়ে এই পদক্ষেপগুলো গ্রহণ করুন:
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {campaign.recommendations?.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      rec.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-400'
                        : rec.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    Priority: {rec.priority}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">• {rec.area}</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Super Admin Consulting Notes / Advice Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                সুপার অ্যাডমিন কনসাল্টিং নোট (Expert Consulting Advice)
              </h3>
              <p className="text-xs text-zinc-400">
                {isSuperAdmin
                  ? 'এই ক্লায়েন্টের জন্য আপনার স্পেশাল পরামর্শ বা মতামত এখানে লিখুন এবং সেভ করুন:'
                  : 'সুপার অ্যাডমিন / অ্যাডভাইজারের সুনির্দিষ্ট পরামর্শ:'}
              </p>
            </div>
          </div>

          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> সফলভাবে সেভ হয়েছে!
            </span>
          )}
        </div>

        {isSuperAdmin ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="ক্লায়েন্টের জন্য আপনার স্পেশাল স্ট্র্যাটেজিক নোট লিখুন..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSavingNotes ? 'সেভ হচ্ছে...' : 'নোট সেভ করুন'}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300 leading-relaxed italic">
            {campaign.adminNotes ? (
              campaign.adminNotes
            ) : (
              <span className="text-zinc-500 not-italic">
                সুপার অ্যাডমিন এখনো কোনো কাস্টম নোট যোগ করেননি।
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
