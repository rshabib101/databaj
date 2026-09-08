'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  Building,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Sparkles,
  AlertCircle,
  Globe,
  Lock,
  User,
  FileText,
  Smartphone,
} from 'lucide-react';

const PLATFORM_MAP = {
  facebook_bm: {
    label: 'Facebook / Meta BM',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  google_ads: {
    label: 'Google Ads / GA4',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  website_admin: {
    label: 'Website Admin (WP/Shopify)',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  cpanel_hosting: {
    label: 'cPanel / Server Hosting',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  gtm_analytics: {
    label: 'GTM / Cloud CAPI',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  other: {
    label: 'অন্যান্য এক্সেস (Other)',
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
};

export default function ClientCredentialModal({ isOpen, onClose, client }) {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Copy and Password Visibility
  const [copiedKey, setCopiedKey] = useState(null);
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Add / Edit Modal Sub-state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState(null);
  const [formData, setFormData] = useState({
    platform: 'website_admin',
    title: '',
    accountUrl: '',
    username: '',
    password: '',
    twoFactorInstructions: '',
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCredentials = useCallback(async () => {
    if (!client?._id) return;
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/credentials?clientId=${client._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error('Failed to fetch client credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [client?._id]);

  useEffect(() => {
    if (isOpen && client?._id) {
      fetchCredentials();
      setSearchQuery('');
      setPlatformFilter('all');
      setIsFormModalOpen(false);
      setEditingCred(null);
    }
  }, [isOpen, client?._id, fetchCredentials]);

  if (!isOpen || !client) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingCred(null);
    setFormData({
      platform: 'website_admin',
      title: '',
      accountUrl: '',
      username: '',
      password: '',
      twoFactorInstructions: '',
      notes: '',
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cred) => {
    setEditingCred(cred);
    setFormData({
      platform: cred.platform || 'website_admin',
      title: cred.title || '',
      accountUrl: cred.accountUrl || '',
      username: cred.username || '',
      password: cred.password || '',
      twoFactorInstructions: cred.twoFactorInstructions || '',
      notes: cred.notes || '',
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleSaveCredential = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const isEdit = !!editingCred;
      const url = '/api/credentials';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = isEdit
        ? { id: editingCred._id, ...formData }
        : { clientId: client._id, ...formData };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsFormModalOpen(false);
        setEditingCred(null);
        fetchCredentials();
      } else {
        setFormError(data.message || 'সেভ করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error(err);
      setFormError('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCredential = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ক্রেডেনশিয়ালটি মুছে ফেলতে চান?')) return;
    setDeletingId(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/credentials?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        fetchCredentials();
      } else {
        alert(data.message || 'ডিলিট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার এরর হয়েছে');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCredentials = credentials.filter((cred) => {
    const matchPlatform = platformFilter === 'all' || cred.platform === platformFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      cred.title?.toLowerCase().includes(query) ||
      cred.username?.toLowerCase().includes(query) ||
      cred.accountUrl?.toLowerCase().includes(query) ||
      cred.companyName?.toLowerCase().includes(query);
    return matchPlatform && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-black shadow-lg shadow-amber-500/20 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {client.companyName || 'ক্লায়েন্ট'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                  {credentials.length} টি ক্রেডেনশিয়াল
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                ক্লায়েন্ট: {client.name} • {client.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ক্রেডেনশিয়াল যোগ করুন</span>
            </button>

            <button
              onClick={fetchCredentials}
              disabled={loading}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 border-b border-zinc-850 bg-zinc-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="টাইটেল, ইউজারনেম অথবা ইউআরএল দিয়ে খুঁজুন..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">সকল প্ল্যাটফর্ম ({credentials.length})</option>
              <option value="facebook_bm">Facebook / Meta BM</option>
              <option value="google_ads">Google Ads / GA4</option>
              <option value="website_admin">Website Admin (WP/Shopify)</option>
              <option value="cpanel_hosting">cPanel / Server Hosting</option>
              <option value="gtm_analytics">GTM / Cloud CAPI</option>
              <option value="other">অন্যান্য (Other)</option>
            </select>
          </div>
        </div>

        {/* Credentials Grid Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading && credentials.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">ক্রেডেনশিয়াল লোড হচ্ছে...</p>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950/60 border border-zinc-850 rounded-3xl p-8 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {searchQuery || platformFilter !== 'all'
                    ? 'কোনো তথ্য মিলছে না'
                    : 'এই ক্লায়েন্টের কোনো ক্রেডেনশিয়াল নেই'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {searchQuery || platformFilter !== 'all'
                    ? 'সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
                    : 'আপনি চাইলে এখনই এই ক্লায়েন্টের জন্য নতুন ফেসবুক বিএম, গুগল অ্যাডস বা ওয়েবসাইট ক্রেডেনশিয়াল যোগ করতে পারেন।'}
                </p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ক্রেডেনশিয়াল যোগ করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials.map((cred) => {
                const platInfo = PLATFORM_MAP[cred.platform] || PLATFORM_MAP.other;
                const isPasswordShown = !!showPasswordMap[cred._id];
                const isAdminAdded = cred.addedBy === 'admin';

                return (
                  <div
                    key={cred._id}
                    className="bg-zinc-950 border border-zinc-850 hover:border-zinc-750 rounded-2xl p-4 sm:p-5 space-y-4 flex flex-col justify-between transition shadow-md group"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Platform Pill & Creator Badge (Admin vs Company Name) */}
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase font-mono ${platInfo.color}`}>
                          {platInfo.label}
                        </span>

                        {isAdminAdded ? (
                          <span
                            className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono shadow-sm"
                            title="সুপার অ্যাডমিন কর্তৃক যুক্তকৃত"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span
                            className="text-xs font-bold text-white truncate flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800"
                            title={`ক্লায়েন্ট কর্তৃক যুক্তকৃত (${cred.companyName || client.companyName})`}
                          >
                            <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[130px]">
                              {cred.companyName || client.companyName || 'Client'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Title & Account URL */}
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{cred.title}</h3>
                        {cred.accountUrl && (
                          <a
                            href={cred.accountUrl.startsWith('http') ? cred.accountUrl : `https://${cred.accountUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1 font-mono"
                          >
                            <span className="truncate max-w-[220px]">{cred.accountUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        )}
                      </div>

                      {/* Username Box */}
                      <div className="p-2.5 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                          ইউজারনেম / ইমেইল / ID:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-zinc-200 truncate font-semibold select-all">
                            {cred.username}
                          </span>
                          <button
                            onClick={() => handleCopy(cred.username, `user-${cred._id}`)}
                            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                            title="কপি করুন"
                          >
                            {copiedKey === `user-${cred._id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password Box */}
                      <div className="p-2.5 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                          পাসওয়ার্ড / সিক্রেট কি:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-zinc-200 truncate font-semibold select-all">
                            {isPasswordShown ? cred.password : '••••••••••••'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() =>
                                setShowPasswordMap((prev) => ({
                                  ...prev,
                                  [cred._id]: !prev[cred._id],
                                }))
                              }
                              className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                              title={isPasswordShown ? 'লুকান' : 'দেখুন'}
                            >
                              {isPasswordShown ? (
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(cred.password, `pass-${cred._id}`)}
                              className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                              title="কপি করুন"
                            >
                              {copiedKey === `pass-${cred._id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 2FA Instructions & Notes */}
                      {(cred.twoFactorInstructions || cred.notes) && (
                        <div className="space-y-1.5 pt-1 text-[11px] text-zinc-400">
                          {cred.twoFactorInstructions && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-300">
                              <strong className="block text-[10px] text-amber-400 uppercase font-mono">2FA নির্দেশিকা:</strong>
                              <span>{cred.twoFactorInstructions}</span>
                            </div>
                          )}
                          {cred.notes && (
                            <p className="text-zinc-500 italic bg-zinc-900/40 border border-zinc-850 p-2 rounded-lg">
                              নোট: {cred.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Row: Date & Action buttons */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900 pt-3">
                      <span>যোগ: {new Date(cred.createdAt).toLocaleDateString('bn-BD')}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(cred)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCredential(cred._id)}
                          disabled={deletingId === cred._id}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${deletingId === cred._id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sub-modal: Add / Edit Credential Form */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-5 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {editingCred ? 'ক্রেডেনশিয়াল এডিট করুন' : `নতুন ক্রেডেনশিয়াল যোগ করুন (${client.companyName})`}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">প্ল্যাটফর্ম সিলেক্ট করুন</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="facebook_bm">Facebook / Meta Business Manager</option>
                  <option value="google_ads">Google Ads / Google Analytics 4</option>
                  <option value="website_admin">Website Admin (Shopify / WordPress / Custom)</option>
                  <option value="cpanel_hosting">cPanel / Server / Cloud Hosting</option>
                  <option value="gtm_analytics">Google Tag Manager (GTM) / Cloud CAPI</option>
                  <option value="other">অন্যান্য এক্সেস (Other Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  অ্যাকাউন্ট টাইটেল <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: Meta BM Partner Access, Main Shopify Admin"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">লগইন ইউআরএল (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.accountUrl}
                  onChange={(e) => setFormData({ ...formData, accountUrl: e.target.value })}
                  placeholder="যেমন: business.facebook.com, mystore.myshopify.com/admin"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ইউজারনেম / ইমেইল / ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    পাসওয়ার্ড / সিক্রেট কি <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">2FA ভেরিফিকেশন নির্দেশিকা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.twoFactorInstructions}
                  onChange={(e) => setFormData({ ...formData, twoFactorInstructions: e.target.value })}
                  placeholder="যেমন: WhatsApp-এ কোড যাবে, বা Google Authenticator"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">নোট বা অভ্যন্তরীণ নির্দেশনা (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="অতিরিক্ত কোনো নির্দেশ থাকলে লিখুন..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {formLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCred ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
