'use client';

import { useState } from 'react';
import { X, Sparkles, AlertCircle, TrendingUp, Info } from 'lucide-react';

export default function AuditFormModal({
  isOpen,
  onClose,
  onAuditSaved,
  clients,
  isSuperAdmin,
  currentClientId,
}) {
  const [targetClientId, setTargetClientId] = useState(currentClientId || (clients?.[0]?._id || ''));
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('conversions');
  const [adSpend, setAdSpend] = useState('');
  const [impressions, setImpressions] = useState('');
  const [reach, setReach] = useState('');
  const [clicks, setClicks] = useState('');
  const [conversions, setConversions] = useState('');
  const [revenue, setRevenue] = useState('');
  const [videoHookRate, setVideoHookRate] = useState('');
  const [qualityRanking, setQualityRanking] = useState('average');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Real-time live derived metrics
  const nSpend = Number(adSpend) || 0;
  const nImp = Number(impressions) || 0;
  const nReach = Number(reach) || (nImp > 0 ? Math.round(nImp * 0.8) : 0);
  const nClicks = Number(clicks) || 0;
  const nConv = Number(conversions) || 0;
  const nRev = Number(revenue) || 0;

  const liveFreq = nReach > 0 ? (nImp / nReach).toFixed(2) : '1.00';
  const liveCpm = nImp > 0 ? ((nSpend / nImp) * 1000).toFixed(2) : '0.00';
  const liveCtr = nImp > 0 ? ((nClicks / nImp) * 100).toFixed(2) : '0.00';
  const liveCpc = nClicks > 0 ? (nSpend / nClicks).toFixed(2) : '0.00';
  const liveCvr = nClicks > 0 ? ((nConv / nClicks) * 100).toFixed(2) : '0.00';
  const liveCpa = nConv > 0 ? (nSpend / nConv).toFixed(2) : '0.00';
  const liveRoas = nSpend > 0 ? (nRev / nSpend).toFixed(2) : '0.00';

  // Preset loaders for fast testing
  const loadPreset = (type) => {
    if (type === 'winning') {
      setCampaignName('Winning Scale - UGC Video Hook');
      setObjective('conversions');
      setAdSpend('500');
      setImpressions('62000');
      setReach('48000');
      setClicks('1650');
      setConversions('82');
      setRevenue('2350');
      setVideoHookRate('38');
      setQualityRanking('above_average');
    } else if (type === 'fatigue') {
      setCampaignName('Summer Catalog - Ad Fatigue Issue');
      setObjective('conversions');
      setAdSpend('320');
      setImpressions('58000');
      setReach('15000'); // Frequency 3.86x
      setClicks('430'); // Low CTR 0.74%
      setConversions('9');
      setRevenue('380');
      setVideoHookRate('14');
      setQualityRanking('below_average');
    } else if (type === 'lpfriction') {
      setCampaignName('High Traffic but Low Landing Page Sales');
      setObjective('conversions');
      setAdSpend('400');
      setImpressions('42000');
      setReach('36000');
      setClicks('1350'); // High CTR 3.2%
      setConversions('11'); // Low CVR 0.8%
      setRevenue('550');
      setVideoHookRate('31');
      setQualityRanking('average');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      setError('ক্যাম্পেইনের নাম দিন');
      return;
    }
    if (!adSpend || !impressions) {
      setError('Ad Spend এবং Impressions দেওয়া আবশ্যক');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        campaignName,
        objective,
        adSpend: Number(adSpend),
        impressions: Number(impressions),
        reach: Number(reach) || undefined,
        clicks: Number(clicks),
        conversions: Number(conversions),
        revenue: Number(revenue),
        videoHookRate: videoHookRate !== '' ? Number(videoHookRate) : undefined,
        qualityRanking,
        targetClientId: isSuperAdmin ? targetClientId : undefined,
        adminNotes: adminNotes.trim(),
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'ক্যাম্পেইন সেভ করতে সমস্যা হয়েছে');
      }

      onAuditSaved(data.campaign);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-8 relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
              Meta Ads Performance Audit
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">নতুন ফেসবুক অ্যাড ক্যাম্পেইন অডিট</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Facebook Ads Manager থেকে মেট্রিকগুলো ইনপুট দিন, আমাদের ইঞ্জিন স্বয়ংক্রিয়ভাবে পারফরম্যান্স স্কোর ও ল্যাকিং রিপোর্ট তৈরি করবে।
          </p>
        </div>

        {/* Test Preset Buttons */}
        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 mb-6 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            দ্রুত টেস্ট করার জন্য ডেমো ডাটা লোড করুন:
          </span>
          <button
            type="button"
            onClick={() => loadPreset('winning')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-medium transition-colors cursor-pointer"
          >
            🔥 Winning Scale (উচ্চ ROAS)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('fatigue')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-medium transition-colors cursor-pointer"
          >
            ⚠️ Ad Fatigue (উচ্চ Frequency)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('lpfriction')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 font-medium transition-colors cursor-pointer"
          >
            🛑 Landing Page Friction
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client selector for super admin */}
          {isSuperAdmin && clients && clients.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-xl">
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                কোন ক্লায়েন্ট কোম্পানির জন্য এই ক্যাম্পেইন অডিট সেভ করতে চান?
              </label>
              <select
                value={targetClientId}
                onChange={(e) => setTargetClientId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
              >
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName} ({c.name} - {c.industry})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Basic Campaign Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">ক্যাম্পেইনের নাম *</label>
              <input
                type="text"
                placeholder="e.g., Summer Video Promo 2026"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">ক্যাম্পেইন অবজেক্টিভ</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="conversions">Sales / Purchases (Conversions)</option>
                <option value="leads">Lead Generation (Leads)</option>
                <option value="traffic">Traffic (Link Clicks)</option>
                <option value="awareness">Awareness & Reach</option>
              </select>
            </div>
          </div>

          {/* Section 1: Spend, Impressions & Reach */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              ১. বাজেট, ইমপ্রেশন ও পৌঁছানো (Spend & Reach)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Ad Spend ($ বা ৳) *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="350"
                  value={adSpend}
                  onChange={(e) => setAdSpend(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Impressions *</label>
                <input
                  type="number"
                  placeholder="45000"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Reach (দর্শক সংখ্যা)</label>
                <input
                  type="number"
                  placeholder="36000"
                  value={reach}
                  onChange={(e) => setReach(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clicks & Creative Engagement */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              ২. ক্লিক ও ক্রিয়েটিভ হুক (Engagement & Hook)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Link Clicks *</label>
                <input
                  type="number"
                  placeholder="1200"
                  value={clicks}
                  onChange={(e) => setClicks(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">3-Sec Video Hook Rate % (ঐচ্ছিক)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="32"
                  value={videoHookRate}
                  onChange={(e) => setVideoHookRate(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Ad Quality Ranking</label>
                <select
                  value={qualityRanking}
                  onChange={(e) => setQualityRanking(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="above_average">Above Average (শীর্ষ ২০%)</option>
                  <option value="average">Average (গড়পড়তা)</option>
                  <option value="below_average">Below Average (দুর্বল)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Conversions & Revenue */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              ৩. কনভার্সন ও রেভিনিউ (Conversions & ROAS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Conversions / Purchases / Leads</label>
                <input
                  type="number"
                  placeholder="45"
                  value={conversions}
                  onChange={(e) => setConversions(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Total Revenue Generated ($ বা ৳)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="1800"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Super admin optional consulting advice */}
          {isSuperAdmin && (
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                ক্লায়েন্টের জন্য সুপার অ্যাডমিন স্পেশাল নোট বা পরামর্শ (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., এই ক্যাম্পেইনে ক্রিয়েটিভ ঠিক আছে, কিন্তু ল্যান্ডিং পেজে আরও ২টি রিভিউ যোগ করতে হবে।"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          )}

          {/* Live Calculated Stats Preview Bar */}
          <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="block text-[10px] text-zinc-500 font-mono uppercase">Frequency</span>
              <span className={`text-sm font-bold ${Number(liveFreq) > 3.0 ? 'text-rose-400' : 'text-zinc-200'}`}>
                {liveFreq}x
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-500 font-mono uppercase">CTR (Click Rate)</span>
              <span className={`text-sm font-bold ${Number(liveCtr) < 1.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {liveCtr}%
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-500 font-mono uppercase">CPM</span>
              <span className="text-sm font-bold text-zinc-200">${liveCpm}</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-500 font-mono uppercase">ROAS</span>
              <span className={`text-sm font-bold ${Number(liveRoas) >= 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {liveRoas}x
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              {loading ? 'অ্যানালাইজ করা হচ্ছে...' : 'অডিট সম্পন্ন ও সেভ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
