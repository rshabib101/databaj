'use client';

import { useState } from 'react';
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  Compass,
  Monitor,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
  Info,
  Cookie,
  History,
  Hash,
} from 'lucide-react';

export default function ClientDetailsModal({
  isOpen,
  onClose,
  client,
  onApprove,
  onSuspend,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'device' | 'session'
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !client) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const regMeta = client.registrationMeta || {};
  const lastLoginMeta = client.lastLoginMeta || {};
  const loginHistory = Array.isArray(client.loginHistory) ? client.loginHistory : [];

  const isPending = !client.isVerified || client.status === 'pending_approval';
  const isSuspended = client.status === 'suspended';
  const isActive = client.status === 'active' && client.isVerified;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'ফাঁকা';
    try {
      return new Date(dateStr).toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  const getDeviceIcon = (deviceType) => {
    const dev = (deviceType || '').toLowerCase();
    if (dev.includes('mobile')) return <Smartphone className="w-4 h-4 text-amber-400" />;
    if (dev.includes('tablet')) return <Tablet className="w-4 h-4 text-purple-400" />;
    return <Laptop className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-500/20 shrink-0">
              {client.companyName?.slice(0, 2).toUpperCase() || 'CL'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {client.companyName || 'নামহীন কোম্পানি'}
                </h2>
                {isPending ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    <span>Pending Approval</span>
                  </span>
                ) : isSuspended ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Suspended</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active & Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                ক্লায়েন্ট: <span className="text-zinc-200 font-semibold">{client.name}</span> • {client.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-850 px-5 sm:px-6 bg-zinc-900/40 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>প্রোফাইল তথ্য</span>
          </button>

          <button
            onClick={() => setActiveTab('device')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'device'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>ডিভাইস, আইপি ও ব্রাউজার</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'session'
                ? 'border-purple-500 text-purple-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>সেশন ও কুকি তথ্য</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-400" /> ক্লায়েন্টের পুরো নাম
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {client.name || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Company Name */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-400" /> কোম্পানি / ব্র্যান্ড
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {client.companyName || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Email Address */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-400" /> ইমেইল অ্যাড্রেস
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-emerald-400 font-semibold truncate">
                      {client.email || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                    </p>
                    {client.email && (
                      <button
                        onClick={() => handleCopy(client.email, 'email')}
                        className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                        title="ইমেইল কপি করুন"
                      >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> ফোন নম্বর (Phone)
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    {client.phone ? (
                      <>
                        <a
                          href={`tel:${client.phone.replace(/[^0-9+]/g, '')}`}
                          className="font-mono text-emerald-400 font-bold hover:underline"
                        >
                          {client.phone}
                        </a>
                        <div className="flex items-center gap-1">
                          <a
                            href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold"
                          >
                            WhatsApp
                          </a>
                          <button
                            onClick={() => handleCopy(client.phone, 'phone')}
                            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                            title="ফোন কপি করুন"
                          >
                            {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-zinc-500 italic">ফাঁকা (প্রদত্ত হয়নি)</span>
                    )}
                  </div>
                </div>

                {/* Industry */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block">ইন্ডাস্ট্রি / বিজনেস ক্যাটাগরি</span>
                  <p className="font-semibold text-white">
                    {client.industry || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Website */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Globe className="w-3 h-3 text-zinc-400" /> ওয়েবসাইট
                  </span>
                  {client.website ? (
                    <a
                      href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{client.website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-zinc-600 font-normal">ফাঁকা</span>
                  )}
                </div>

                {/* Registration Date */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" /> অ্যাকাউন্ট তৈরির তারিখ ও সময়
                  </span>
                  <p className="font-mono text-zinc-300">
                    {formatDate(client.createdAt)}
                  </p>
                </div>

                {/* Campaign Audits & Spend */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block">ক্যাম্পেইন অডিট ও মোট খরচ</span>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      {client.campaignCount || 0} টি অডিট
                    </span>
                    <span className="font-mono text-emerald-400">
                      ${(client.totalSpend || 0).toLocaleString()} Spent
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEVICE, IP & BROWSER */}
          {activeTab === 'device' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  রেজিস্ট্রেশন এবং ক্লায়েন্টের সাম্প্রতিক লগইন সেশন থেকে এই তথ্যগুলো স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়েছে।
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* IP Address (Registration) */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Hash className="w-3 h-3 text-emerald-400" /> আইপি অ্যাড্রেস (Registration IP)
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono font-bold text-white text-sm truncate">
                      {regMeta.ip || lastLoginMeta.ip || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                    </p>
                    {(regMeta.ip || lastLoginMeta.ip) && (
                      <button
                        onClick={() => handleCopy(regMeta.ip || lastLoginMeta.ip, 'ip')}
                        className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                        title="আইপি কপি করুন"
                      >
                        {copiedField === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Last Login IP */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Hash className="w-3 h-3 text-blue-400" /> আইপি অ্যাড্রেস (Last Login IP)
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-zinc-300 text-sm truncate">
                      {lastLoginMeta.ip || <span className="text-zinc-600 font-normal">ফাঁকা (লগইন তথ্য নেই)</span>}
                    </p>
                  </div>
                </div>

                {/* Device Type */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    {getDeviceIcon(regMeta.device || lastLoginMeta.device)} ডিভাইস টাইপ (Device)
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {regMeta.device || lastLoginMeta.device || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Operating System */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-purple-400" /> অপারেটিং সিস্টেম (OS)
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {regMeta.os || lastLoginMeta.os || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Browser & Version */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" /> ব্রাউজার ও ভার্সন (Browser)
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {regMeta.browser || lastLoginMeta.browser || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* Location / City & Country */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" /> লোকেশন ও শহর (City / Country)
                  </span>
                  <p className="font-semibold text-white text-sm">
                    {regMeta.city || regMeta.country || lastLoginMeta.city || lastLoginMeta.country ? (
                      `${regMeta.city || lastLoginMeta.city || ''}${regMeta.city && regMeta.country ? ', ' : ''}${regMeta.country || lastLoginMeta.country || ''}`
                    ) : (
                      <span className="text-zinc-600 font-normal">ফাঁকা</span>
                    )}
                  </p>
                </div>

                {/* Timezone */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" /> টাইমজোন (Timezone)
                  </span>
                  <p className="font-mono text-zinc-300">
                    {regMeta.timezone || lastLoginMeta.timezone || <span className="text-zinc-600 font-normal">ফাঁকা</span>}
                  </p>
                </div>

                {/* System Language & Screen */}
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[11px] text-zinc-500 block">ভাষা ও স্ক্রিন রেজোলিউশন</span>
                  <p className="font-mono text-zinc-300">
                    {regMeta.language || 'ফাঁকা'} • {regMeta.screenResolution || 'ফাঁকা'}
                  </p>
                </div>
              </div>

              {/* Raw User-Agent String */}
              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-semibold block">
                    সম্পূর্ণ ইউজার-এজেন্ট (Raw User Agent)
                  </span>
                  {(regMeta.userAgent || lastLoginMeta.userAgent) && (
                    <button
                      onClick={() => handleCopy(regMeta.userAgent || lastLoginMeta.userAgent, 'ua')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedField === 'ua' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>কপি করুন</span>
                    </button>
                  )}
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 font-mono text-[11px] text-zinc-400 break-all leading-relaxed">
                  {regMeta.userAgent || lastLoginMeta.userAgent || 'ফাঁকা (User Agent রেকর্ড নেই)'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SESSION & COOKIES */}
          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Cookie Support & Token */}
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 space-y-2">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1.5 font-semibold">
                    <Cookie className="w-4 h-4 text-amber-400" /> ব্রাউজার কুকি স্ট্যাটাস
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>কুকি সক্রিয় (Cookies Enabled):</span>
                      <span className="font-bold text-emerald-400">
                        {regMeta.cookies?.cookieEnabled !== false ? 'হ্যাঁ (Enabled)' : 'না'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>অথেনটিকেশন টোকেন কুকি:</span>
                      <span className="font-bold font-mono text-white">
                        {regMeta.cookies?.hasAuthToken ? 'উপস্থিত (Present)' : 'লগইন সেশন'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 space-y-2">
                  <span className="text-[11px] text-zinc-500 block flex items-center gap-1.5 font-semibold">
                    <History className="w-4 h-4 text-blue-400" /> সর্বশেষ লগইন ও সক্রিয়তা
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>সর্বশেষ লগইন সময়:</span>
                      <span className="font-mono text-zinc-300">
                        {lastLoginMeta.capturedAt ? formatDate(lastLoginMeta.capturedAt) : 'রেকর্ড নেই'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>আইপি:</span>
                      <span className="font-mono text-emerald-400">
                        {lastLoginMeta.ip || regMeta.ip || 'ফাঁকা'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login History Timeline */}
              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-400" /> সাম্প্রতিক লগইন ইতিহাস (Login History)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {loginHistory.length} টি রেকর্ড পাওয়া গেছে
                  </span>
                </div>

                {loginHistory.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/40 border border-zinc-900 text-center text-zinc-500 text-xs">
                    কোনো লগইন রেকর্ড এখনো তৈরি হয়নি অথবা ক্লায়েন্ট এখনো লগইন করেনি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-950/80 text-zinc-500 border-b border-zinc-850 text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">সময়</th>
                          <th className="p-2.5">আইপি (IP)</th>
                          <th className="p-2.5">ডিভাইস ও ওএস</th>
                          <th className="p-2.5">ব্রাউজার</th>
                          <th className="p-2.5">লোকেশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850/50">
                        {loginHistory.map((item, idx) => (
                          <tr key={idx} className="hover:bg-zinc-800/30 font-mono text-[11px]">
                            <td className="p-2.5 text-zinc-400">{formatDate(item.timestamp)}</td>
                            <td className="p-2.5 text-emerald-400 font-semibold">{item.ip || '-'}</td>
                            <td className="p-2.5 text-zinc-300">
                              {item.device || '-'} ({item.os || '-'})
                            </td>
                            <td className="p-2.5 text-zinc-300">{item.browser || '-'}</td>
                            <td className="p-2.5 text-zinc-400">{item.city ? `${item.city}, ${item.country || ''}` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-850 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isPending ? (
              <button
                onClick={() => {
                  onApprove(client._id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>অনুমোদন দিন (Approve Client)</span>
              </button>
            ) : isSuspended ? (
              <button
                onClick={() => {
                  onApprove(client._id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>পুনরায় এক্টিভ করুন (Reactivate)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onSuspend(client._id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-zinc-900 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/30 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>স্থগিত করুন (Suspend)</span>
              </button>
            )}

            <button
              onClick={() => {
                onDelete(client._id);
                onClose();
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 cursor-pointer transition-all"
              title="অ্যাকাউন্ট ডিলিট করুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800 cursor-pointer transition-all text-center"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
