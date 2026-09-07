'use client';

import React from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Megaphone,
} from 'lucide-react';

const TYPE_CONFIG = {
  urgent: {
    label: 'জরুরি নোটিশ (Urgent Notice)',
    tag: 'URGENT',
    icon: AlertCircle,
    borderGlow: 'border-rose-500/70 shadow-[0_0_25px_rgba(244,63,94,0.25)]',
    bgGradient: 'from-rose-950/80 via-zinc-950 to-zinc-900',
    pulseBg: 'bg-rose-500',
    badgeClass: 'bg-rose-500/25 text-rose-300 border-rose-500/40',
    btnClass: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30',
  },
  warning: {
    label: 'সতর্কবার্তা (Warning)',
    tag: 'WARNING',
    icon: AlertTriangle,
    borderGlow: 'border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    bgGradient: 'from-amber-950/80 via-zinc-950 to-zinc-900',
    pulseBg: 'bg-amber-500',
    badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/40',
    btnClass: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30',
  },
  important: {
    label: 'গুরুত্বপূর্ণ নোটিশ (Important Update)',
    tag: 'IMPORTANT',
    icon: Megaphone,
    borderGlow: 'border-violet-500/70 shadow-[0_0_25px_rgba(139,92,246,0.25)]',
    bgGradient: 'from-violet-950/80 via-zinc-950 to-zinc-900',
    pulseBg: 'bg-violet-500',
    badgeClass: 'bg-violet-500/25 text-violet-300 border-violet-500/40',
    btnClass: 'bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/30',
  },
  info: {
    label: 'প্রশাসনিক নোটিশ (Information)',
    tag: 'NOTICE',
    icon: Info,
    borderGlow: 'border-sky-500/70 shadow-[0_0_25px_rgba(14,165,233,0.25)]',
    bgGradient: 'from-sky-950/80 via-zinc-950 to-zinc-900',
    pulseBg: 'bg-sky-500',
    badgeClass: 'bg-sky-500/25 text-sky-300 border-sky-500/40',
    btnClass: 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30',
  },
  success: {
    label: 'সুসংবাদ ও অফার (Special Update)',
    tag: 'OFFER',
    icon: Sparkles,
    borderGlow: 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    bgGradient: 'from-emerald-950/80 via-zinc-950 to-zinc-900',
    pulseBg: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    btnClass: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30',
  },
};

export default function ClientNoticeBanner({ notice, onDismiss, onActionClick }) {
  if (!notice || !notice.isActive) return null;

  const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.important;
  const IconComponent = config.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-r ${config.bgGradient} ${config.borderGlow} p-5 sm:p-6 transition-all animate-fadeIn`}
    >
      {/* Decorative ambient background blur */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${config.pulseBg}/10 blur-3xl pointer-events-none`} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Animated Pulsing Icon */}
          <div className="relative shrink-0 mt-0.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${config.badgeClass} border shadow-md relative z-10`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className={`absolute inset-0 rounded-2xl ${config.pulseBg} animate-ping opacity-30 pointer-events-none`} />
          </div>

          {/* Notice Content */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${config.badgeClass}`}>
                {config.label}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                সুপার এডমিন অফিসিয়াল নোটিশ
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line max-w-3xl">
              {notice.message}
            </p>
          </div>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          {notice.actionBtnText && (
            <button
              onClick={() => onActionClick && onActionClick(notice.actionBtnLink || '/dashboard?tab=chat')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${config.btnClass}`}
            >
              <span>{notice.actionBtnText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="নোটিশটি বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
