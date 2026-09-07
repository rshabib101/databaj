'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  Save,
  Power,
  Eye,
  ArrowRight,
  Send,
  Radio,
  ExternalLink,
} from 'lucide-react';

const NOTICE_TYPES = [
  {
    id: 'urgent',
    label: '🚨 জরুরি নোটিশ (Urgent Alert)',
    color: 'rose',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderClass: 'border-rose-500/50 shadow-rose-500/20',
    bgClass: 'from-rose-950/40 via-zinc-900/90 to-zinc-950',
    pulseColor: 'bg-rose-500',
  },
  {
    id: 'warning',
    label: '⚠️ সতর্কবার্তা (Warning Notice)',
    color: 'amber',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderClass: 'border-amber-500/50 shadow-amber-500/20',
    bgClass: 'from-amber-950/40 via-zinc-900/90 to-zinc-950',
    pulseColor: 'bg-amber-500',
  },
  {
    id: 'important',
    label: '⭐ গুরুত্বপূর্ণ আপডেট (Important Notice)',
    color: 'violet',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    borderClass: 'border-violet-500/50 shadow-violet-500/20',
    bgClass: 'from-violet-950/40 via-zinc-900/90 to-zinc-950',
    pulseColor: 'bg-violet-500',
  },
  {
    id: 'info',
    label: 'ℹ️ সাধারণ নোটিশ (Informational)',
    color: 'sky',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderClass: 'border-sky-500/50 shadow-sky-500/20',
    bgClass: 'from-sky-950/40 via-zinc-900/90 to-zinc-950',
    pulseColor: 'bg-sky-500',
  },
  {
    id: 'success',
    label: '🎉 সুসংবাদ / স্পেশাল অফার (Special Offer)',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderClass: 'border-emerald-500/50 shadow-emerald-500/20',
    bgClass: 'from-emerald-950/40 via-zinc-900/90 to-zinc-950',
    pulseColor: 'bg-emerald-500',
  },
];

export default function ClientNoticeModal({ isOpen, client, onClose, onNoticeUpdated }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('important');
  const [isActive, setIsActive] = useState(true);
  const [actionBtnText, setActionBtnText] = useState('');
  const [actionBtnLink, setActionBtnLink] = useState('');
  const [statusFeedback, setStatusFeedback] = useState(null);

  // Fetch client notice when opened
  useEffect(() => {
    if (!isOpen || !client?._id) return;

    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/client-notice?clientId=${client._id}`);
        const data = await res.json();
        if (data.success && data.notice) {
          setTitle(data.notice.title || '');
          setMessage(data.notice.message || '');
          setType(data.notice.type || 'important');
          setIsActive(data.notice.isActive !== undefined ? data.notice.isActive : true);
          setActionBtnText(data.notice.actionBtnText || '');
          setActionBtnLink(data.notice.actionBtnLink || '');
        } else {
          // Defaults for new notice
          setTitle(`সম্মানিত ${client.companyName || client.name || 'ক্লায়েন্ট'}, জরুরি নোটিশ`);
          setMessage('');
          setType('important');
          setIsActive(true);
          setActionBtnText('লাইভ চ্যাটে কথা বলুন');
          setActionBtnLink('/dashboard?tab=chat');
        }
      } catch (err) {
        console.error('Failed to fetch client notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [isOpen, client]);

  if (!isOpen || !client) return null;

  const handleSave = async (toggleStatus = null) => {
    if (!title.trim() || !message.trim()) {
      alert('দয়া করে নোটিশের শিরোনাম ও বিস্তারিত বার্তা লিখুন।');
      return;
    }

    const newActiveState = toggleStatus !== null ? toggleStatus : isActive;

    try {
      setSaving(true);
      const res = await fetch('/api/admin/client-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client._id,
          title: title.trim(),
          message: message.trim(),
          type,
          isActive: newActiveState,
          actionBtnText: actionBtnText.trim(),
          actionBtnLink: actionBtnLink.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsActive(newActiveState);
        setStatusFeedback(newActiveState ? 'নোটিশ সক্রিয় (ON) করা হয়েছে!' : 'নোটিশ স্থগিত (OFF) করা হয়েছে!');
        setTimeout(() => setStatusFeedback(null), 3000);
        if (onNoticeUpdated) onNoticeUpdated(data.notice);
      } else {
        alert(data.message || 'নোটিশ সংরক্ষণ করা যায়নি');
      }
    } catch (err) {
      console.error('Error saving notice:', err);
      alert('সার্ভার এরর, নোটিশ সংরক্ষণ করা যায়নি।');
    } finally {
      setSaving(false);
    }
  };

  const currentTypeConfig = NOTICE_TYPES.find((t) => t.id === type) || NOTICE_TYPES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-850 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">ক্লায়েন্ট নোটিশ কন্ট্রোল</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  {client.companyName}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {client.name} • {client.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Status Toggle Indicator */}
            <button
              type="button"
              onClick={() => handleSave(!isActive)}
              disabled={saving || loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
              }`}
              title="নোটিশ চালু বা বন্ধ করুন"
            >
              <Power className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{isActive ? 'নোটিশ চালু (ON)' : 'নোটিশ বন্ধ (OFF)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-zinc-300">
          {statusFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
              <span>নোটিশের তথ্য লোড হচ্ছে...</span>
            </div>
          ) : (
            <>
              {/* Notice Type / Severity */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-2">
                  নোটিশের ধরণ ও গুরুত্ব (Notice Type):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {NOTICE_TYPES.map((t) => {
                    const isSelected = type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? `${t.badgeClass} ring-1 ring-white/20 shadow-md`
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                      >
                        <span className="font-semibold text-xs">{t.label}</span>
                        {isSelected && <Radio className="w-3.5 h-3.5 text-current shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notice Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  নোটিশের শিরোনাম (Notice Title) <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: আপনার ফেসবুক অ্যাড একাউন্টের গুরুত্বপূর্ণ আপডেট"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Notice Message */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  নোটিশের বিস্তারিত বিবরণ (Notice Message) <span className="text-rose-400">*</span>:
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="এখানে ক্লায়েন্টকে যা জানাতে চান তা বিস্তারিত লিখুন..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Action Button Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                    অ্যাকশন বাটন টেক্সট (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={actionBtnText}
                    onChange={(e) => setActionBtnText(e.target.value)}
                    placeholder="যেমন: লাইভ চ্যাটে কথা বলুন / অডিট দেখুন"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                    বাটন লিংক / পাথ (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={actionBtnLink}
                    onChange={(e) => setActionBtnLink(e.target.value)}
                    placeholder="যেমন: /dashboard?tab=chat"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="pt-2 border-t border-zinc-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>ক্লায়েন্ট পোর্টালে লাইভ প্রিভিউ (Client Portal Live Preview)</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {isActive ? 'পোর্টালে দৃশ্যমান হবে' : 'পোর্টালে লুকানো থাকবে (OFF)'}
                  </span>
                </div>

                <div
                  className={`relative p-5 rounded-2xl border bg-gradient-to-r ${currentTypeConfig.bgClass} ${currentTypeConfig.borderClass} shadow-xl transition-all overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative mt-0.5">
                        <div className={`w-3 h-3 rounded-full ${currentTypeConfig.pulseColor} animate-ping absolute inset-0 opacity-75`} />
                        <div className={`w-3 h-3 rounded-full ${currentTypeConfig.pulseColor} relative`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${currentTypeConfig.badgeClass}`}>
                            {currentTypeConfig.label.split(' ')[1] || 'NOTICE'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">সুপার এডমিন থেকে প্রেরিত</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {title || 'নোটিশের শিরোনাম এখানে প্রদর্শিত হবে'}
                        </h4>
                        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pt-1">
                          {message || 'নোটিশের বিস্তারিত মেসেজ এখানে সুন্দরভাবে প্রদর্শিত হবে...'}
                        </p>
                      </div>
                    </div>

                    {actionBtnText && (
                      <div className="shrink-0 self-center">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs shadow-lg hover:bg-zinc-200 transition-all">
                          <span>{actionBtnText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-850 bg-zinc-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">স্ট্যাটাস:</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                isActive
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isActive ? 'সক্রিয় (Active ON)' : 'নিষ্ক্রিয় (OFF)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => handleSave()}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>নোটিশ সেভ ও আপডেট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
