'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuditReportView from '@/components/AuditReportView';
import AuditFormModal from '@/components/AuditFormModal';
import ConsultationModal from '@/components/agency/ConsultationModal';
import ClientAdBanner from '@/components/ClientAdBanner';
import {
  Building2,
  Plus,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  BarChart3,
  ShoppingBag,
  User,
  Settings,
  Globe,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  Wand2,
  LifeBuoy,
  MessageSquare,
  Send,
  Edit3,
  X,
  FileText,
  Clock,
  ClipboardList,
  FileSpreadsheet,
  CheckSquare,
  Link2,
  Video,
  LayoutDashboard,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';

const VALID_TABS = ['overview', 'audits', 'orders', 'credentials', 'support', 'tasks', 'ai-copy', 'profile'];

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Active Tab: 'overview' | 'audits' | 'orders' | 'credentials' | 'support' | 'tasks' | 'ai-copy' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Handle Tab Switch with browser URL sync
  const handleTabChange = useCallback((newTab) => {
    if (!VALID_TABS.includes(newTab)) return;
    setActiveTab(newTab);
    setMobileSidebarOpen(false);
    const url = newTab === 'overview' ? '/dashboard' : `/dashboard?tab=${newTab}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: newTab }, '', url);
    }
  }, []);

  // Listen to popstate and initial URL parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');

      // Also check subroute like /dashboard/orders
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const pathTab = pathParts[0] === 'dashboard' && pathParts[1] ? pathParts[1] : null;

      const targetTab = tabParam || pathTab;
      if (targetTab && VALID_TABS.includes(targetTab)) {
        setActiveTab(targetTab);
      } else {
        setActiveTab('overview');
      }
    };

    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, []);

  // 1. Campaign Audit state
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // 2. Orders / Consultation state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // 3. Credential Share Vault state
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [editingCredId, setEditingCredId] = useState(null);
  const [credPlatform, setCredPlatform] = useState('facebook_bm');
  const [credTitle, setCredTitle] = useState('');
  const [credUrl, setCredUrl] = useState('');
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [cred2FA, setCred2FA] = useState('');
  const [credNotes, setCredNotes] = useState('');
  const [savingCred, setSavingCred] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  // 4. Support Tickets state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // 5. AI Ad Copy Generator state
  const [aiProduct, setAiProduct] = useState('');
  const [aiAudience, setAiAudience] = useState('');
  const [aiOffer, setAiOffer] = useState('');
  const [aiTone, setAiTone] = useState('persuasive');
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [copiedAiKey, setCopiedAiKey] = useState(null);

  // 6. Profile Edit state
  const [profileName, setProfileName] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileIndustry, setProfileIndustry] = useState('E-commerce & Retail');
  const [profileLogo, setProfileLogo] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // 7. Task for Admin state
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskSubTab, setTaskSubTab] = useState('ads'); // 'ads' | 'web'
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);
  // Ads task form fields
  const [taskWebLink, setTaskWebLink] = useState('');
  const [taskPostLink, setTaskPostLink] = useState('');
  const [taskVarLink, setTaskVarLink] = useState('');
  const [taskVideoDuration, setTaskVideoDuration] = useState('');
  const [taskComment, setTaskComment] = useState('');
  // Web task form fields
  const [taskWebTitle, setTaskWebTitle] = useState('');
  const [taskWebDesc, setTaskWebDesc] = useState('');
  const [taskWebPriority, setTaskWebPriority] = useState('normal');

  // 1. Authenticate user
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
        } else {
          setCurrentUser(data.user);
          setProfileName(data.user.name || '');
          setProfileCompany(data.user.companyName || '');
          setProfilePhone(data.user.phone || '');
          setProfileIndustry(data.user.industry || 'E-commerce & Retail');
          setProfileLogo(data.user.logoUrl || '');
          setProfileWebsite(data.user.website || '');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoadingUser(false));
  }, [router]);

  // 2. Fetch campaigns
  const refreshCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/campaigns', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
        if (data.campaigns?.length > 0) {
          setActiveCampaignId((prev) =>
            data.campaigns.some((c) => c._id === prev) ? prev : data.campaigns[0]._id
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  // 3. Fetch orders
  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/consultations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.consultations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // 4. Fetch credentials
  const refreshCredentials = useCallback(async () => {
    setLoadingCredentials(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/credentials', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCredentials(false);
    }
  }, []);

  // 5. Fetch tickets
  const refreshTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tickets', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
        // update selectedTicket if open
        setSelectedTicket((prev) => {
          if (!prev) return null;
          return data.tickets?.find((t) => t._id === prev._id) || null;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // 6. Fetch tasks
  const refreshTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tasks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    let ignore = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch('/api/campaigns', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setCampaigns(data.campaigns || []);
          if (data.campaigns?.length > 0) {
            setActiveCampaignId((prev) =>
              data.campaigns.some((c) => c._id === prev) ? prev : data.campaigns[0]._id
            );
          }
        }
      })
      .catch(console.error);

    fetch('/api/consultations', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) setOrders(data.consultations || []);
      })
      .catch(console.error);

    fetch('/api/credentials', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) setCredentials(data.credentials || []);
      })
      .catch(console.error);

    fetch('/api/tickets', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) setTickets(data.tickets || []);
      })
      .catch(console.error);

    fetch('/api/tasks', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) setTasks(data.tasks || []);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('databaj_token');
      }
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id, e) => {
    e.stopPropagation();
    if (!confirm('আপনি কি নিশ্চিত যে এই অডিট রিপোর্টটি মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/campaigns?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        const remaining = campaigns.filter((c) => c._id !== id);
        setCampaigns(remaining);
        if (activeCampaignId === id) {
          setActiveCampaignId(remaining[0]?._id || null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Profile update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: profileName,
          companyName: profileCompany,
          phone: profilePhone,
          industry: profileIndustry,
          logoUrl: profileLogo,
          website: profileWebsite,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setProfileSuccessMsg(data.message || 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
        setNewPassword('');
      } else {
        setProfileErrorMsg(data.message || 'আপডেট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      setProfileErrorMsg(err.message || 'সার্ভারে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।');
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Credential Modal open/close & submit
  const handleOpenCredModal = (cred = null) => {
    if (cred) {
      setEditingCredId(cred._id);
      setCredPlatform(cred.platform || 'facebook_bm');
      setCredTitle(cred.title || '');
      setCredUrl(cred.accountUrl || '');
      setCredUsername(cred.username || '');
      setCredPassword(cred.password || '');
      setCred2FA(cred.twoFactorInstructions || '');
      setCredNotes(cred.notes || '');
    } else {
      setEditingCredId(null);
      setCredPlatform('facebook_bm');
      setCredTitle('');
      setCredUrl('');
      setCredUsername('');
      setCredPassword('');
      setCred2FA('');
      setCredNotes('');
    }
    setIsCredModalOpen(true);
  };

  const handleSaveCredential = async (e) => {
    e.preventDefault();
    if (!credTitle || !credUsername || !credPassword) return;
    setSavingCred(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const method = editingCredId ? 'PUT' : 'POST';
      const body = {
        id: editingCredId,
        platform: credPlatform,
        title: credTitle,
        accountUrl: credUrl,
        username: credUsername,
        password: credPassword,
        twoFactorInstructions: cred2FA,
        notes: credNotes,
      };

      const res = await fetch('/api/credentials', {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setIsCredModalOpen(false);
        refreshCredentials();
      } else {
        alert(data.message || 'ক্রেডেনশিয়াল সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCred(false);
    }
  };

  const handleDeleteCredential = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ক্রেডেনশিয়ালটি মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/credentials?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        refreshCredentials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text, key) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Ticket create & reply handlers
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject?.trim() || !ticketMessage?.trim()) return;
    setCreatingTicket(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          priority: ticketPriority,
          message: ticketMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsTicketModalOpen(false);
        setTicketSubject('');
        setTicketMessage('');
        refreshTickets();
      } else {
        alert(data.message || 'টিকেট তৈরি ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!replyMessage?.trim() || !selectedTicket) return;
    setSendingReply(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: 'reply',
          id: selectedTicket._id,
          message: replyMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyMessage('');
        setSelectedTicket(data.ticket);
        refreshTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  // AI Copy Generator handler
  const handleGenerateAiCopy = async (e) => {
    e.preventDefault();
    if (!aiProduct?.trim()) return;
    setGeneratingCopy(true);
    try {
      const res = await fetch('/api/ai-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: aiProduct,
          targetAudience: aiAudience,
          offer: aiOffer,
          tone: aiTone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCopy(false);
    }
  };

  const copyAiText = (text, key) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedAiKey(key);
      setTimeout(() => setCopiedAiKey(null), 2000);
    }
  };

  const activeCampaign = campaigns.find((c) => c._id === activeCampaignId) || campaigns[0] || null;

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        লোড হচ্ছে...
      </div>
    );
  }

  // Order status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewing':
        return { label: 'পর্যালোচনা চলছে', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400' };
      case 'contacted':
        return { label: 'যোগাযোগ সম্পন্ন', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400' };
      case 'converted':
        return { label: 'অর্ডার কনফার্মড / চলমান', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
      case 'rejected':
        return { label: 'বাতিল', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };
      case 'pending':
      default:
        return { label: 'অপেক্ষমাণ (Pending)', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
    }
  };

  // Platform badges helper
  const getPlatformInfo = (plat) => {
    switch (plat) {
      case 'facebook_bm':
        return { label: 'Facebook / Meta BM', color: 'bg-blue-600/15 text-blue-400 border-blue-500/30' };
      case 'google_ads':
        return { label: 'Google Ads / Analytics', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'website_admin':
        return { label: 'Website (Shopify/WP)', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'cpanel_hosting':
        return { label: 'cPanel / Hosting / Server', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' };
      case 'gtm_analytics':
        return { label: 'GTM / Cloud CAPI', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Other Access', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  // Task Status badge helper (Client view)
  const getTaskStatusBadge = (status) => {
    switch (status) {
      case 'in_review':
        return {
          label: 'In Review (পর্যালোচনা / চলমান)',
          bg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400',
        };
      case 'done':
        return {
          label: 'Done (কাজ সম্পন্ন)',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
        };
      case 'pending':
      default:
        return {
          label: 'Pending (অপেক্ষমাণ)',
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
        };
    }
  };

  // Create Task Handler
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const payload =
        taskSubTab === 'ads'
          ? {
              taskType: 'ads',
              webLink: taskWebLink,
              postLink: taskPostLink,
              variationPostLink: taskVarLink,
              videoDuration: taskVideoDuration,
              comment: taskComment,
            }
          : {
              taskType: 'web',
              title: taskWebTitle,
              webLink: taskWebLink,
              description: taskWebDesc,
              priority: taskWebPriority,
            };

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsTaskModalOpen(false);
        setTaskWebLink('');
        setTaskPostLink('');
        setTaskVarLink('');
        setTaskVideoDuration('');
        setTaskComment('');
        setTaskWebTitle('');
        setTaskWebDesc('');
        setTaskWebPriority('normal');
        refreshTasks();
      } else {
        alert(data.message || 'টাস্ক সাবমিট ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার এরর');
    } finally {
      setTaskSaving(false);
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই টাস্কটি মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert(data.message || 'টাস্ক মোছা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="মেন্যু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            title={sidebarCollapsed ? 'সাইডবার খুলুন' : 'সাইডবার বন্ধ করুন'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
              DATA<span className="text-emerald-400">BAJ</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Company Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white max-w-[150px] truncate">
              {currentUser?.companyName || 'My Brand'}
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <span>ওয়েবসাইট</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition"
            title="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-fadeIn"
          />
        )}

        {/* Responsive Left Sidebar (Drawer on mobile, collapsible on desktop) */}
        <aside
          className={`border-r border-zinc-800 bg-zinc-950 transition-all duration-300 flex flex-col justify-between shrink-0 overflow-y-auto ${
            /* Mobile drawer position */
            mobileSidebarOpen
              ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl translate-x-0'
              : 'fixed -translate-x-full md:relative md:translate-x-0'
          } ${
            /* Desktop collapsed/expanded */
            sidebarCollapsed ? 'md:w-20' : 'md:w-64 sm:w-72'
          }`}
        >
          {/* Top of Sidebar */}
          <div className="p-4 space-y-4">
            {/* Mobile Header with close button */}
            <div className="flex items-center justify-between md:hidden pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">
                  DATA<span className="text-emerald-400">BAJ</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Client Menu
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User card in sidebar */}
            <div className={`p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3 ${sidebarCollapsed ? 'md:justify-center md:p-2' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 overflow-hidden relative">
                {currentUser?.logoUrl ? (
                  <Image
                    src={currentUser.logoUrl}
                    alt={currentUser.companyName || 'Company'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  (currentUser?.name || 'C').charAt(0).toUpperCase()
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">{currentUser?.name}</div>
                  <div className="text-xs text-zinc-400 truncate">{currentUser?.companyName}</div>
                </div>
              )}
            </div>

            {/* Quick action button: New Audit */}
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition group ${
                sidebarCollapsed ? 'p-3' : ''
              }`}
              title="নতুন অ্যাড ক্যাম্পেইন অডিট"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
              {!sidebarCollapsed && <span>নতুন ক্যাম্পেইন অডিট</span>}
            </button>

            {/* Sidebar Navigation */}
            <nav className="space-y-1.5">
              {/* Tab 0: Dashboard Overview */}
              <button
                onClick={() => handleTabChange('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="ড্যাশবোর্ড ওভারভিউ"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!sidebarCollapsed && <span>ড্যাশবোর্ড ওভারভিউ</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                    Live
                  </span>
                )}
              </button>

              {/* Tab 1: Campaign Audits */}
              <button
                onClick={() => handleTabChange('audits')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'audits'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="ক্যাম্পেইন অডিট সমূহ"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>ক্যাম্পেইন অডিট সমূহ</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                    {campaigns.length}
                  </span>
                )}
              </button>

              {/* Tab 2: My Orders & Status */}
              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="আমার অর্ডার ও স্ট্যাটাস"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>আমার অর্ডার ও স্ট্যাটাস</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    orders.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Tab 3: Credential Share Vault */}
              <button
                onClick={() => handleTabChange('credentials')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'credentials'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="লগইন ও ক্রেডেনশিয়াল শেয়ার"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 shrink-0 text-amber-400" />
                  {!sidebarCollapsed && <span>ক্রেডেনশিয়াল শেয়ার (ভল্ট)</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-amber-400 font-mono">
                    {credentials.length}
                  </span>
                )}
              </button>

              {/* Tab 4: Support Tickets & Inbox */}
              <button
                onClick={() => handleTabChange('support')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'support'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="সাপোর্ট টিকিট ও ইনবক্স"
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-4 h-4 shrink-0 text-blue-400" />
                  {!sidebarCollapsed && <span>সাপোর্ট টিকিট ও ইনবক্স</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    tickets.filter((t) => t.status === 'open').length > 0
                      ? 'bg-blue-500/20 text-blue-400 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tickets.length}
                  </span>
                )}
              </button>

              {/* Tab 5: AI Ad Copy & Hook Generator */}
              <button
                onClick={() => handleTabChange('ai-copy')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'ai-copy'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="এআই অ্যাড কপি ও হুক জেনারেটর"
              >
                <div className="flex items-center gap-3">
                  <Wand2 className="w-4 h-4 shrink-0 text-pink-400" />
                  {!sidebarCollapsed && <span>এআই অ্যাড কপি ও হুক</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-[9px] font-extrabold text-pink-300 border border-pink-500/30">
                    AI
                  </span>
                )}
              </button>

              {/* Tab 6: Task for Admin */}
              <button
                onClick={() => handleTabChange('tasks')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'tasks'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                title="Task for Admin (অ্যাডমিন টাস্ক)"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 shrink-0 text-teal-400" />
                  {!sidebarCollapsed && <span>Task for Admin</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    tasks.filter((t) => t.status !== 'done').length > 0
                      ? 'bg-teal-500/20 text-teal-400 font-bold'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tasks.length}
                  </span>
                )}
              </button>

              {/* Tab 7: Profile Settings */}
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                title="প্রোফাইল সেটিংস"
              >
                <User className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>প্রোফাইল সেটিংস</span>}
              </button>
            </nav>
          </div>

          {/* Bottom of Sidebar */}
          <div className="p-4 border-t border-zinc-800/80 space-y-2">
            {!sidebarCollapsed && (
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-center">
                <p className="text-[11px] text-zinc-400 mb-2">নতুন কোনো আইটি বা ট্র্যাকিং সার্ভিস দরকার?</p>
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold transition cursor-pointer"
                >
                  সার্ভিস রিকোয়েস্ট দিন
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-black overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          {/* TAB 0: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
              {/* Top Eye-Catching Promotional Ad Banner (Visible only in Dashboard Overview) */}
              <ClientAdBanner currentUser={currentUser} />

              {/* Welcome Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        লাইভ পোর্টাল সক্রিয়
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-mono">
                        {currentUser?.companyName || 'ক্লায়েন্ট পোর্টাল'}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                      স্বাগতম, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-emerald-400">{currentUser?.name || 'ক্লায়েন্ট'}</span>! 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      এটি আপনার সেন্ট্রাল কন্ট্রোল ড্যাশবোর্ড। এখান থেকে ক্যাম্পেইন অডিট রিপোর্ট, লাইভ সার্ভিস অর্ডার স্ট্যাটাস, ক্রেডেনশিয়াল ভল্ট, সাপোর্ট টিকিট এবং অ্যাডমিন টাস্কের সার্বিক তথ্য মনিটর ও পরিচালনা করুন।
                    </p>
                  </div>

                  {/* Quick Action Buttons on Hero */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => setIsAuditModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন অডিট</span>
                    </button>
                    <button
                      onClick={() => setIsOrderModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 font-bold text-xs transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>সার্ভিস বুক করুন</span>
                    </button>
                    <button
                      onClick={() => setIsTicketModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-zinc-800 hover:border-blue-500/40 font-bold text-xs transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <LifeBuoy className="w-4 h-4" />
                      <span>সাপোর্ট টিকিট</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Feature Cards Grid - 6 Key Sidebar Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Campaign Audits Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        মেটা ও ফেসবুক
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-semibold text-zinc-400">ক্যাম্পেইন অডিট সমূহ</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{campaigns.length}</span>
                        <span className="text-xs text-zinc-500">টি অডিট রেকর্ড</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900 text-xs">
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">ভালো স্কোর (৮০+)</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {campaigns.filter((c) => (c.overallScore || 0) >= 80).length} টি
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">অপটিমাইজেশন দরকার</span>
                        <span className="text-amber-400 font-bold font-mono">
                          {campaigns.filter((c) => (c.overallScore || 0) < 80).length} টি
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('audits')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>অডিট রিপোর্টস দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsAuditModalOpen(true)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-black text-zinc-400 border border-zinc-800 transition cursor-pointer"
                      title="নতুন অডিট করুন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. My Orders & Status Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        সার্ভিস ও অর্ডার
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-semibold text-zinc-400">আমার অর্ডার ও স্ট্যাটাস</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{orders.length}</span>
                        <span className="text-xs text-zinc-500">টি সার্ভিস অর্ডার</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900 text-xs">
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">অপেক্ষমাণ (Pending)</span>
                        <span className="text-amber-400 font-bold font-mono">
                          {orders.filter((o) => !o.status || o.status === 'pending').length} টি
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">চলমান / অনুমোদিত</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {orders.filter((o) => o.status === 'reviewing' || o.status === 'converted' || o.status === 'contacted').length} টি
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('orders')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>অর্ডার হিস্ট্রি দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsOrderModalOpen(true)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-blue-500 hover:text-white text-zinc-400 border border-zinc-800 transition cursor-pointer"
                      title="নতুন সার্ভিস বুক করুন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Credential Share Vault Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        AES-256 ভল্ট
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-semibold text-zinc-400">ক্রেডেনশিয়াল শেয়ার (ভল্ট)</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{credentials.length}</span>
                        <span className="text-xs text-zinc-500">টি সুরক্ষিত অ্যাক্সেস</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-zinc-900 text-[11px]">
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">ফেসবুক BM</span>
                        <span className="text-blue-400 font-bold font-mono">
                          {credentials.filter((c) => c.platform === 'facebook_bm').length}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">ওয়েবসাইট</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {credentials.filter((c) => c.platform === 'website_admin').length}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">অন্যান্য</span>
                        <span className="text-amber-400 font-bold font-mono">
                          {credentials.filter((c) => c.platform !== 'facebook_bm' && c.platform !== 'website_admin').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('credentials')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>ভল্ট ম্যানেজ করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenCredModal()}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black text-zinc-400 border border-zinc-800 transition cursor-pointer"
                      title="নতুন ক্রেডেনশিয়াল যোগ করুন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. Support Tickets & Inbox Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <LifeBuoy className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        হেল্পডেস্ক ও ইনবক্স
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-semibold text-zinc-400">সাপোর্ট টিকিট ও ইনবক্স</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{tickets.length}</span>
                        <span className="text-xs text-zinc-500">টি কনভারসেশন</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900 text-xs">
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">ওপেন / জরুরি টিকিট</span>
                        <span className={`font-bold font-mono ${
                          tickets.filter((t) => t.status === 'open').length > 0 ? 'text-cyan-400 animate-pulse' : 'text-zinc-400'
                        }`}>
                          {tickets.filter((t) => t.status === 'open').length} টি
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850">
                        <span className="text-zinc-500 block text-[10px]">সমাধানকৃত</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length} টি
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('support')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>ইনবক্স ওপেন করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsTicketModalOpen(true)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-cyan-500 hover:text-black text-zinc-400 border border-zinc-800 transition cursor-pointer"
                      title="নতুন টিকিট খুলুন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Task for Admin Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-teal-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        প্রজেক্ট বোর্ড
                      </span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-semibold text-zinc-400">Task for Admin (টাস্ক)</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{tasks.length}</span>
                        <span className="text-xs text-zinc-500">টি টাস্ক তালিকাভুক্ত</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-zinc-900 text-[11px]">
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">পেন্ডিং</span>
                        <span className="text-amber-400 font-bold font-mono">
                          {tasks.filter((t) => t.status === 'pending').length}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">ইন-রিভিউ</span>
                        <span className="text-teal-400 font-bold font-mono">
                          {tasks.filter((t) => t.status === 'in_review').length}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 text-center">
                        <span className="text-zinc-500 block text-[9px]">সম্পন্ন (Done)</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {tasks.filter((t) => t.status === 'done').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('tasks')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>টাস্ক বোর্ড দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-teal-500 hover:text-black text-zinc-400 border border-zinc-800 transition cursor-pointer"
                      title="নতুন টাস্ক দিন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 6. AI Ad Copy & Hook Generator Card */}
                <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-pink-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                        <Wand2 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30">
                        ✨ AI POWERED
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="text-xs font-semibold text-zinc-400">এআই অ্যাড কপি ও হুক জেনারেটর</div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        হাই-কনভার্টিং বিজ্ঞাপন টেক্সট ও সেলস হুক
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      ফেসবুক ও সোশ্যাল ক্যাম্পেইনের জন্য প্ররোচনামূলক প্রাইমারি টেক্সট, ক্লিক-ড্রাইভিং হেডলাইন ও আকর্ষণীয় অ্যাঙ্গেল নিমেষেই তৈরি করুন।
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTabChange('ai-copy')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>এআই জেনারেটর শুরু করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-zinc-500 font-mono">তাত্ক্ষণিক অ্যাকশন</span>
                  </div>
                </div>
              </div>

              {/* Bottom Snapshot: Recent Campaign Audits & Live Order Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Recent Audits Snapshot */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">সাম্প্রতিক ক্যাম্পেইন অডিট রিপোর্টস</h3>
                    </div>
                    <button
                      onClick={() => handleTabChange('audits')}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      সব দেখুন ({campaigns.length})
                    </button>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-zinc-500">এখনো কোনো ক্যাম্পেইন অডিট ডাটা যুক্ত করা হয়নি</p>
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>প্রথম অডিট করুন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {campaigns.slice(0, 3).map((c) => (
                        <div
                          key={c._id}
                          onClick={() => {
                            setActiveCampaignId(c._id);
                            handleTabChange('audits');
                          }}
                          className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate">
                              {c.campaignName}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                              <span>${Number(c.adSpend || 0).toLocaleString()} স্পেন্ড</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">{c.roas || '0'}x ROAS</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                              (c.overallScore || 0) >= 80
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : (c.overallScore || 0) >= 60
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}>
                              {c.overallScore || 0}/১০০
                            </span>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Live Orders & Direct Agency Support */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Recent Orders Mini Card */}
                  <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">লাইভ সার্ভিস রিকোয়েস্ট</h3>
                      </div>
                      <button
                        onClick={() => handleTabChange('orders')}
                        className="text-xs text-blue-400 hover:underline font-semibold"
                      >
                        সব দেখুন ({orders.length})
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-6">কোনো চলমান অর্ডার নেই</p>
                    ) : (
                      <div className="space-y-2.5">
                        {orders.slice(0, 2).map((ord) => {
                          const badge = getStatusBadge(ord.status);
                          return (
                            <div key={ord._id} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[10px] font-mono text-zinc-400 block">{ord.serviceSlug}</span>
                                <h5 className="text-xs font-bold text-white truncate">{ord.serviceName}</h5>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badge.bg}`}>
                                {badge.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Direct Agency Assistance Box */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        DB
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">DataBaj স্পেশালিস্ট সাপোর্ট</h4>
                        <p className="text-[10px] text-zinc-400">জরুরি ক্যাম্পেইন বা ওয়েবসাইট ইস্যুতে সরাসরি যোগাযোগ করুন</p>
                      </div>
                    </div>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setIsTicketModalOpen(true)}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition text-center cursor-pointer"
                      >
                        সাপোর্ট টিকিট খুলুন
                      </button>
                      <button
                        onClick={() => handleTabChange('tasks')}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-xs font-bold transition text-center cursor-pointer"
                      >
                        অ্যাডমিন টাস্ক দিন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CAMPAIGN AUDITS */}
          {activeTab === 'audits' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    ফেসবুক অ্যাড ক্যাম্পেইন অডিট রিপোর্টস
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    আপনার বিজ্ঞাপনের পারফরম্যান্স স্কোর, অপচয় শনাক্তকরণ ও এআই অ্যাকশন রোডম্যাপ
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshCampaigns}
                    disabled={loadingCampaigns}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingCampaigns ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ক্যাম্পেইন অডিট করুন</span>
                  </button>
                </div>
              </div>

              {campaigns.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-8 max-w-2xl mx-auto space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">কোনো ক্যাম্পেইন অডিট পাওয়া যায়নি</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      আপনার মেটা অ্যাড ক্যাম্পেইনের মেট্রিক্স (Ad Spend, ROAS, CTR, CPM, Frequency) ইনপুট দিয়ে তাৎক্ষণিক ঘাটতি ও সমাধান বের করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>প্রথম অডিট ইনপুট দিন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-3">
                    <div className="text-xs font-mono uppercase font-bold text-zinc-500 px-1">
                      ক্যাম্পেইন অডিট রেকর্ডস ({campaigns.length})
                    </div>
                    <div className="space-y-2.5">
                      {campaigns.map((c) => {
                        const isSelected = c._id === activeCampaignId;
                        return (
                          <div
                            key={c._id}
                            onClick={() => setActiveCampaignId(c._id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                              isSelected
                                ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                                : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition truncate">
                                {c.campaignName}
                              </h4>
                              <button
                                onClick={(e) => handleDeleteCampaign(c._id, e)}
                                title="মুছে ফেলুন"
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400 font-mono">
                                  ${c.adSpend?.toLocaleString()} স্পেন্ড
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-emerald-400 font-bold font-mono">
                                  {c.roas}x ROAS
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                c.overallScore >= 80
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : c.overallScore >= 60
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}>
                                {c.overallScore}/১০০
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    {activeCampaign ? (
                      <AuditReportView campaign={activeCampaign} />
                    ) : (
                      <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-center text-zinc-500">
                        যেকোনো অডিটে ক্লিক করে বিস্তারিত বিশ্লেষণ দেখুন
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY ORDERS & CONSULTATION STATUS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-emerald-400" />
                    আমার অর্ডার ও সার্ভিস স্ট্যাটাস
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    আপনার রিকোয়েস্টকৃত ওয়েব ডেভেলপমেন্ট, মেটা অ্যাডস ও ট্র্যাকিং প্রজেক্টের লাইভ স্ট্যাটাস
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshOrders}
                    disabled={loadingOrders}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন সার্ভিস বুক করুন</span>
                  </button>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">কোনো সক্রিয় অর্ডার পাওয়া যায়নি</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      আমাদের ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং বা CAPI সার্ভিসের জন্য অর্ডার ও কনসালটেশন বুক করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>সার্ভিস রিকোয়েস্ট পাঠান</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((ord) => {
                    const badge = getStatusBadge(ord.status);
                    return (
                      <div
                        key={ord._id}
                        className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4 relative group hover:border-zinc-750 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block mb-0.5">
                              {ord.serviceSlug || 'Custom Service'}
                            </span>
                            <h3 className="text-base font-bold text-white">{ord.serviceName}</h3>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        {ord.message && (
                          <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                            {ord.message}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-900 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>রিকোয়েস্ট তারিখ: {new Date(ord.createdAt).toLocaleDateString('bn-BD')}</span>
                          </div>
                          <span className="font-mono text-zinc-400">{ord.phone || currentUser?.phone || 'ফোন রেকর্ড নেই'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREDENTIAL SHARE VAULT */}
          {activeTab === 'credentials' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <KeyRound className="w-6 h-6 text-amber-400" />
                    সুরক্ষিত ক্রেডেনশিয়াল ও এক্সেস ভল্ট
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    ফেসবুক বিজনেস ম্যানেজার, গুগল অ্যাডস, ওয়েবসাইট বা সিপ্যানেল লগইন শেয়ার করুন যাতে টিম DataBaj দ্রুত কাজ শুরু করতে পারে।
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshCredentials}
                    disabled={loadingCredentials}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingCredentials ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleOpenCredModal()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ক্রেডেনশিয়াল যোগ করুন</span>
                  </button>
                </div>
              </div>

              {credentials.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                    <KeyRound className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">কোনো ক্রেডেনশিয়াল সেভ করা নেই</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      আপনার ফেসবুক অ্যাড অ্যাকাউন্ট, শপিফাই/ওয়ার্ডপ্রেস স্টোর অ্যাডমিন বা হোস্টিং তথ্য নিরাপদে যুক্ত করুন। এটি শুধুমাত্র আপনি ও DataBaj সুপার অ্যাডমিন দেখতে পাবেন।
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenCredModal()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ক্রেডেনশিয়াল যুক্ত করুন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {credentials.map((cred) => {
                    const platInfo = getPlatformInfo(cred.platform);
                    const isPasswordShown = !!showPasswordMap[cred._id];
                    return (
                      <div
                        key={cred._id}
                        className="bg-zinc-950 border border-zinc-850 hover:border-zinc-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition shadow-md"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${platInfo.color}`}>
                              {platInfo.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenCredModal(cred)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCredential(cred._id)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white">{cred.title}</h3>
                            {cred.accountUrl && (
                              <a
                                href={cred.accountUrl.startsWith('http') ? cred.accountUrl : `https://${cred.accountUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>{cred.accountUrl}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          {/* Username field */}
                          <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                              ইউজারনেম / ইমেইল / ID:
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono text-zinc-200 truncate font-semibold">
                                {cred.username}
                              </span>
                              <button
                                onClick={() => copyToClipboard(cred.username, `user-${cred._id}`)}
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

                          {/* Password field */}
                          <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                              পাসওয়ার্ড / সিক্রেট কি:
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono text-zinc-200 truncate font-semibold">
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
                                  onClick={() => copyToClipboard(cred.password, `pass-${cred._id}`)}
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

                          {/* 2FA or Notes */}
                          {(cred.twoFactorInstructions || cred.notes) && (
                            <div className="space-y-1.5 pt-1 text-[11px] text-zinc-400">
                              {cred.twoFactorInstructions && (
                                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-300">
                                  <strong>2FA নির্দেশিকা:</strong> {cred.twoFactorInstructions}
                                </div>
                              )}
                              {cred.notes && (
                                <p className="text-zinc-500 italic bg-zinc-900/40 p-2 rounded-lg">
                                  নোট: {cred.notes}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-zinc-600 border-t border-zinc-900 pt-2 text-right">
                          আপডেট: {new Date(cred.updatedAt).toLocaleDateString('bn-BD')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS & DIRECT INBOX */}
          {activeTab === 'support' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6 text-blue-400" />
                    সাপোর্ট টিকিট ও ডিরেক্ট ইনবক্স
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    ক্যাম্পেইন ইস্যু, ট্র্যাকিং এরর বা কারিগরি যেকোনো সমস্যায় সুপার অ্যাডমিনের সাথে সরাসরি যোগাযোগ করুন
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshTickets}
                    disabled={loadingTickets}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin text-blue-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন টিকিট খুলুন</span>
                  </button>
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <LifeBuoy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">কোনো সাপোর্ট টিকিট নেই</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      কোনো প্রশ্ন বা সাহায্যের প্রয়োজন হলে নতুন টিকিট তৈরি করুন। আমাদের সুপার অ্যাডমিন দ্রুততম সময়ে উত্তর দেবেন।
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>প্রথম টিকিট তৈরি করুন</span>
                  </button>
                </div>
              ) : selectedTicket ? (
                /* Thread View */
                <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-5 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
                          title="তালিকায় ফিরুন"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          {selectedTicket.ticketId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          selectedTicket.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : selectedTicket.status === 'in_progress'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {selectedTicket.status}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                    </div>

                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-xs text-zinc-400 hover:text-white underline self-start sm:self-auto cursor-pointer"
                    >
                      সকল টিকিটে ফিরুন
                    </button>
                  </div>

                  {/* Message Stream */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto p-1 pr-2">
                    {selectedTicket.messages?.map((msg, idx) => {
                      const isClient = msg.senderRole === 'client';
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1 px-1 font-mono">
                            <span className="font-bold text-zinc-300">{msg.senderName}</span>
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                              isClient
                                ? 'bg-blue-600/20 border-blue-500/30 text-zinc-100 rounded-br-sm'
                                : 'bg-emerald-500/15 border-emerald-500/30 text-zinc-100 rounded-bl-sm'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendTicketReply} className="pt-4 border-t border-zinc-850 space-y-3">
                    <textarea
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="এখানে আপনার উত্তর বা নতুন মেসেজ লিখুন..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingReply || !replyMessage.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                      >
                        {sendingReply ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>পাঠানো হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>রিপ্লাই পাঠান</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Ticket List View */
                <div className="grid grid-cols-1 gap-3">
                  {tickets.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => setSelectedTicket(t)}
                      className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                            {t.ticketId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : t.status === 'in_progress'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {t.status}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            ক্যাটাগরি: {t.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{t.subject}</h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {t.messages?.[t.messages.length - 1]?.message || 'কোনো মেসেজ নেই'}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-zinc-500 shrink-0">
                        <div className="flex items-center gap-1 text-zinc-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t.messages?.length || 0} টি মেসেজ</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 mt-1">
                          {new Date(t.updatedAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI AD COPY & HOOK GENERATOR */}
          {activeTab === 'ai-copy' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="border-b border-zinc-800 pb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DataBaj Growth Engine</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-pink-400" />
                  এআই অ্যাড কপি ও ৩-সেকেন্ড ভিডিও হুক জেনারেটর
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  আপনার প্রোডাক্টের নাম ও অফার দিন — মুহূর্তেই তৈরি হয়ে যাবে স্ক্রল-স্টপিং ভিডিও হুক ও উচ্চ কনভার্সন রেটের ফেসবুক অ্যাড কপি।
                </p>
              </div>

              {/* Generator Form */}
              <form
                onSubmit={handleGenerateAiCopy}
                className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      প্রোডাক্ট / সার্ভিসের নাম <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={aiProduct}
                      onChange={(e) => setAiProduct(e.target.value)}
                      placeholder="যেমন: Organic Honey, Men's Premium Sneaker, Custom Next.js SaaS"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      টার্গেট অডিয়েন্স (Target Audience)
                    </label>
                    <input
                      type="text"
                      value={aiAudience}
                      onChange={(e) => setAiAudience(e.target.value)}
                      placeholder="যেমন: ই-কমার্স উদ্যোক্তা, ফিটনেস সচেতন তরুণ, চাকরিজীবী"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      স্পেশাল অফার / ডিসকাউন্ট
                    </label>
                    <input
                      type="text"
                      value={aiOffer}
                      onChange={(e) => setAiOffer(e.target.value)}
                      placeholder="যেমন: ফ্রি ডেলিভারি + ৩০% ডিসকাউন্ট, ৭ দিনের মানিব্যাক গ্যারান্টি"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      টোন অব ভয়েস (Tone)
                    </label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="persuasive">পেশাদার ও বিশ্বাসযোগ্য (High Converting)</option>
                      <option value="urgent">জরুরি ও সীমিত সময় (FOMO / Urgency)</option>
                      <option value="story">গল্প বলা ও আবেগঘন (Storytelling)</option>
                      <option value="casual">বন্ধুত্বপূর্ণ ও ক্যাজুয়াল (Social Casual)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={generatingCopy || !aiProduct.trim()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    {generatingCopy ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>এআই তৈরি করছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>ম্যাজিকাল অ্যাড কপি ও হুক তৈরি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* AI Output Results */}
              {aiResults && (
                <div className="space-y-8 animate-fadeIn">
                  {/* 1. Video Hooks */}
                  <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>৩-সেকেন্ড স্ক্রল-স্টপিং ভিডিও হুকস (Reels / TikTok / Shorts)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aiResults.hooks?.map((hook, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-3 group hover:border-pink-500/40 transition"
                        >
                          <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                            {hook}
                          </p>
                          <button
                            onClick={() => copyAiText(hook, `hook-${idx}`)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                            title="কপি করুন"
                          >
                            {copiedAiKey === `hook-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Primary Texts */}
                  <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <FileText className="w-4 h-4" />
                      <span>সম্পূর্ণ ফেসবুক অ্যাড প্রাইমারি কপি (Primary Ad Copies)</span>
                    </div>

                    <div className="space-y-4">
                      {aiResults.copies?.map((cp, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="text-[11px] font-bold text-emerald-400 font-mono uppercase">
                              {cp.type}
                            </span>
                            <button
                              onClick={() => copyAiText(cp.text, `copy-${idx}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
                            >
                              {copiedAiKey === `copy-${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">কপি হয়েছে</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>কপি করুন</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                            {cp.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Headlines & Targeting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Headlines */}
                    <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                        <Wand2 className="w-4 h-4" />
                        <span>ক্লিকের জন্য আকর্ষণীয় হেডলাইনস</span>
                      </div>
                      <div className="space-y-2.5">
                        {aiResults.headlines?.map((hl, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-2"
                          >
                            <span className="text-xs text-zinc-200 font-medium">{hl}</span>
                            <button
                              onClick={() => copyAiText(hl, `hl-${idx}`)}
                              className="p-1 rounded-md text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                            >
                              {copiedAiKey === `hl-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Targeting Recommendations */}
                    <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <Settings className="w-4 h-4" />
                        <span>ক্যাম্পেইন স্ট্র্যাটেজি ও টার্গেটিং পরামর্শ</span>
                      </div>
                      <div className="space-y-2.5">
                        {aiResults.targeting?.map((tg, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 leading-relaxed"
                          >
                            {tg}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-zinc-800 pb-5">
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-400" />
                  প্রোফাইল সেটিংস ও অ্যাকাউন্ট
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  আপনার কোম্পানি তথ্য ও অ্যাকাউন্ট সিকিউরিটি আপডেট করুন
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <form
                onSubmit={handleProfileSubmit}
                className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">কোম্পানি / ব্র্যান্ডের নাম</label>
                    <input
                      type="text"
                      required
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ফোন নম্বর</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ইন্ডাস্ট্রি / ব্যবসা ধরণ</label>
                    <select
                      value={profileIndustry}
                      onChange={(e) => setProfileIndustry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="E-commerce & Retail">E-commerce & Retail</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                      <option value="Software & SaaS">Software & SaaS</option>
                      <option value="Real Estate & Agency">Real Estate & Agency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">কোম্পানি লোগো লিঙ্ক (Image URL)</label>
                    <input
                      type="url"
                      value={profileLogo}
                      onChange={(e) => setProfileLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ওয়েবসাইট লিঙ্ক (Website)</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={profileWebsite}
                        onChange={(e) => setProfileWebsite(e.target.value)}
                        placeholder="https://mybrand.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-850 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    পাসওয়ার্ড পরিবর্তন (Password Update)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    পাসওয়ার্ড পরিবর্তন না করতে চাইলে নিচের ঘরটি ফাঁকা রাখুন
                  </p>
                  <div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    {savingProfile ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: TASK FOR ADMIN (WEB & ADS CAMPAIGN TRACKER) */}
          {activeTab === 'tasks' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <ClipboardList className="w-6 h-6 text-teal-400" />
                    Task for Admin (অ্যাডমিন টাস্ক ও ওয়ার্ক রিকোয়েস্ট)
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    আপনার মেটা অ্যাড ক্যাম্পেইন ও ওয়েবসাইট ডেভেলপমেন্টের কাজের রিকোয়ারমেন্ট এবং লাইভ আপডেট
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshTasks}
                    disabled={loadingTasks}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingTasks ? 'animate-spin text-teal-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন টাস্ক দিন (New Task)</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab Switcher: Ads Campaign vs Web */}
              <div className="flex flex-wrap items-center gap-2 border-b border-zinc-850 pb-3">
                <button
                  onClick={() => setTaskSubTab('ads')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    taskSubTab === 'ads'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Ads Campaign (গুগল শিট ভিউ)</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono">
                    {tasks.filter((t) => t.taskType === 'ads').length}
                  </span>
                </button>

                <button
                  onClick={() => setTaskSubTab('web')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    taskSubTab === 'web'
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Web Development (ওয়েবসাইট রিকোয়ারমেন্ট)</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono">
                    {tasks.filter((t) => t.taskType === 'web').length}
                  </span>
                </button>
              </div>

              {/* SUB-VIEW 1: ADS CAMPAIGN - GOOGLE SHEET STYLE SPREADSHEET */}
              {taskSubTab === 'ads' && (
                <div className="space-y-4">
                  {/* Sheets Header Banner */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">Ads Campaign Live Tracker (Spreadsheet View)</h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                            Auto Sync
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          🔒 স্ট্যাটাস কলামটি সুপার অ্যাডমিন পরিবর্তন করেন। আপনার নির্দেশনা Comment কলামে প্রদান করুন।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-400 font-mono">
                        মোট: <strong className="text-white">{tasks.filter((t) => t.taskType === 'ads').length}</strong>
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-amber-400 font-mono">
                        পেন্ডিং:{' '}
                        <strong>
                          {tasks.filter((t) => t.taskType === 'ads' && t.status === 'pending').length}
                        </strong>
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-blue-400 font-mono">
                        চলমান:{' '}
                        <strong>
                          {tasks.filter((t) => t.taskType === 'ads' && t.status === 'in_review').length}
                        </strong>
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-emerald-400 font-mono">
                        সম্পন্ন:{' '}
                        <strong>
                          {tasks.filter((t) => t.taskType === 'ads' && t.status === 'done').length}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Google Sheets Table UI */}
                  <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/80 shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 font-mono text-[11px] tracking-wider uppercase">
                            <th className="py-3 px-3.5 border-r border-zinc-800/80 w-12 text-center text-zinc-500">
                              #
                            </th>
                            <th className="py-3 px-4 border-r border-zinc-800/80 min-w-[180px]">
                              Web Link (ওয়েব লিংক)
                            </th>
                            <th className="py-3 px-4 border-r border-zinc-800/80 min-w-[180px]">
                              Post Link (পোস্ট লিংক)
                            </th>
                            <th className="py-3 px-4 border-r border-zinc-800/80 min-w-[200px]">
                              Variation Post Link (ভ্যারিয়েশন)
                            </th>
                            <th className="py-3 px-3.5 border-r border-zinc-800/80 min-w-[130px]">
                              Video Duration
                            </th>
                            <th className="py-3 px-3.5 border-r border-zinc-800/80 min-w-[160px]">
                              Status (স্ট্যাটাস)
                            </th>
                            <th className="py-3 px-4 min-w-[220px]">
                              Comment (ক্লায়েন্ট মেসেজ)
                            </th>
                            <th className="py-3 px-3 w-16 text-center text-zinc-500">
                              একশন
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850/80">
                          {tasks.filter((t) => t.taskType === 'ads').length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-14 text-center text-zinc-500">
                                <FileSpreadsheet className="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-40" />
                                <p className="text-sm font-semibold text-zinc-300">কোনো অ্যাড ক্যাম্পেইন টাস্ক নেই</p>
                                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                                  আপনার নতুন ফেসবুক/মেটা বিজ্ঞাপনের ওয়েব লিংক, পোস্ট লিংক ও ভিডিও ডিউরেশন জমা দিন।
                                </p>
                                <button
                                  onClick={() => {
                                    setTaskSubTab('ads');
                                    setIsTaskModalOpen(true);
                                  }}
                                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition cursor-pointer"
                                >
                                  + প্রথম অ্যাড টাস্ক যোগ করুন
                                </button>
                              </td>
                            </tr>
                          ) : (
                            tasks
                              .filter((t) => t.taskType === 'ads')
                              .map((task, idx) => {
                                const statusBadge = getTaskStatusBadge(task.status);
                                return (
                                  <tr
                                    key={task._id}
                                    className="hover:bg-zinc-900/40 transition group font-sans"
                                  >
                                    {/* Serial */}
                                    <td className="py-3 px-3.5 border-r border-zinc-850/80 text-center font-mono text-zinc-500 text-[11px]">
                                      {idx + 1}
                                    </td>

                                    {/* Web Link */}
                                    <td className="py-3 px-4 border-r border-zinc-850/80">
                                      {task.webLink ? (
                                        <a
                                          href={task.webLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-xs hover:underline max-w-[200px] truncate"
                                          title={task.webLink}
                                        >
                                          <Link2 className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{task.webLink}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                                        </a>
                                      ) : (
                                        <span className="text-zinc-600 italic">-</span>
                                      )}
                                    </td>

                                    {/* Post Link */}
                                    <td className="py-3 px-4 border-r border-zinc-850/80">
                                      {task.postLink ? (
                                        <a
                                          href={task.postLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono text-xs hover:underline max-w-[200px] truncate"
                                          title={task.postLink}
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{task.postLink}</span>
                                        </a>
                                      ) : (
                                        <span className="text-zinc-600 italic">দেওয়া হয়নি</span>
                                      )}
                                    </td>

                                    {/* Variation Post Link */}
                                    <td className="py-3 px-4 border-r border-zinc-850/80">
                                      {task.variationPostLink ? (
                                        <a
                                          href={task.variationPostLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-mono text-xs hover:underline max-w-[200px] truncate"
                                          title={task.variationPostLink}
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{task.variationPostLink}</span>
                                        </a>
                                      ) : (
                                        <span className="text-zinc-600 italic">কোনো ভ্যারিয়েশন নেই</span>
                                      )}
                                    </td>

                                    {/* Video Duration */}
                                    <td className="py-3 px-3.5 border-r border-zinc-850/80 font-mono text-zinc-300">
                                      {task.videoDuration ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                                          <Video className="w-3 h-3 text-pink-400" />
                                          {task.videoDuration}
                                        </span>
                                      ) : (
                                        <span className="text-zinc-600 italic">-</span>
                                      )}
                                    </td>

                                    {/* Status (Strictly locked for Super Admin, live badges for Client) */}
                                    <td className="py-3 px-3.5 border-r border-zinc-850/80">
                                      <div className="flex flex-col gap-1">
                                        <span
                                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${statusBadge.bg}`}
                                        >
                                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                                          {statusBadge.label}
                                        </span>
                                        <span className="text-[9px] text-zinc-500 font-sans flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5" /> সুপার অ্যাডমিন কন্ট্রোলড
                                        </span>
                                      </div>
                                    </td>

                                    {/* Comment */}
                                    <td className="py-3 px-4 text-zinc-300 text-xs leading-relaxed">
                                      {task.comment ? (
                                        <div className="bg-zinc-900/50 p-2 rounded-xl border border-zinc-850 text-zinc-200">
                                          {task.comment}
                                        </div>
                                      ) : (
                                        <span className="text-zinc-600 italic">কোনো মন্তব্য নেই</span>
                                      )}
                                      {task.adminFeedback && (
                                        <div className="mt-1.5 p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-300">
                                          <strong>অ্যাডমিন নোট:</strong> {task.adminFeedback}
                                        </div>
                                      )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3 px-3 text-center">
                                      <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                        title="টাস্কটি মুছুন"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: WEB DEVELOPMENT REQUIREMENTS */}
              {taskSubTab === 'web' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-teal-400" />
                        ওয়েবসাইট ডেভেলপমেন্ট ও আইটি রিকোয়ারমেন্ট
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        নতুন কোনো ওয়েব পেজ ডিজাইন, স্পিড অপটিমাইজেশন বা বাগ ফিক্সিংয়ের রিকোয়ারমেন্ট জমা দিন
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setTaskSubTab('web');
                        setIsTaskModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন রিকোয়ারমেন্ট দিন</span>
                    </button>
                  </div>

                  {tasks.filter((t) => t.taskType === 'web').length === 0 ? (
                    <div className="py-16 text-center bg-zinc-950 border border-zinc-850 rounded-3xl p-6 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto">
                        <Globe className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">কোনো ওয়েবসাইট রিকোয়ারমেন্ট সাবমিট করা নেই</h4>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">
                          আপনার ই-কমার্স স্টোর বা ওয়েবসাইট রিলেটেড যেকোনো কাজ বা বাগ ফিক্সিং রিকোয়েস্ট সাবমিট করুন।
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTaskSubTab('web');
                          setIsTaskModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>রিকোয়ারমেন্ট যুক্ত করুন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tasks
                        .filter((t) => t.taskType === 'web')
                        .map((task) => {
                          const statusBadge = getTaskStatusBadge(task.status);
                          return (
                            <div
                              key={task._id}
                              className="p-5 rounded-3xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition flex flex-col justify-between space-y-4 relative group"
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${statusBadge.bg}`}
                                    >
                                      {statusBadge.label}
                                    </span>
                                    {task.priority === 'urgent' && (
                                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                                        Urgent
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <h4 className="text-sm font-bold text-white leading-snug">
                                  {task.title || 'ওয়েব ডেভেলপমেন্ট রিকোয়ারমেন্ট'}
                                </h4>

                                {task.webLink && (
                                  <a
                                    href={task.webLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:underline font-mono"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[220px]">{task.webLink}</span>
                                  </a>
                                )}

                                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900/40 p-3 rounded-2xl border border-zinc-850">
                                  {task.description || task.comment || 'কোনো বিবরণ দেওয়া হয়নি'}
                                </p>
                              </div>

                              {task.adminFeedback && (
                                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-1">
                                  <strong className="block text-[11px] text-teal-400">অ্যাডমিন ফিডব্যাক:</strong>
                                  <p>{task.adminFeedback}</p>
                                </div>
                              )}

                              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                                <span>সাবমিট: {new Date(task.createdAt).toLocaleDateString('bn-BD')}</span>
                                <span className="flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> অ্যাডমিন দ্বারা যাচাইকৃত
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Credential Add / Edit Modal */}
      {isCredModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingCredId ? 'ক্রেডেনশিয়াল এডিট করুন' : 'নতুন ক্রেডেনশিয়াল যুক্ত করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsCredModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">প্ল্যাটফর্ম সিলেক্ট করুন</label>
                <select
                  value={credPlatform}
                  onChange={(e) => setCredPlatform(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
                  value={credTitle}
                  onChange={(e) => setCredTitle(e.target.value)}
                  placeholder="যেমন: Main Shopify Store Admin, Meta BM Partner Access"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">লগইন ইউআরএল (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={credUrl}
                  onChange={(e) => setCredUrl(e.target.value)}
                  placeholder="যেমন: mystore.myshopify.com/admin, business.facebook.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ইউজারনেম / ইমেইল / ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={credUsername}
                    onChange={(e) => setCredUsername(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    পাসওয়ার্ড / এপিআই কি <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">2FA ভেরিফিকেশন নির্দেশিকা (যদি থাকে)</label>
                <input
                  type="text"
                  value={cred2FA}
                  onChange={(e) => setCred2FA(e.target.value)}
                  placeholder="যেমন: WhatsApp-এ কোড যাবে, বা Authenticator অ্যাপ ব্যাকআপ কী"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">অতিরিক্ত নোট বা নির্দেশনা</label>
                <textarea
                  rows={2}
                  value={credNotes}
                  onChange={(e) => setCredNotes(e.target.value)}
                  placeholder="টিমকে জানানোর মতো কোনো স্পেশাল নির্দেশ থাকলে লিখুন..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCredModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingCred}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {savingCred ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">নতুন সাপোর্ট টিকিট তৈরি করুন</h3>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  টিকিটের বিষয় (Subject) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="যেমন: ফেসবুক CAPI ইভেন্ট ম্যাচ কোয়ালিটি ড্রপ করেছে"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ক্যাটাগরি</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ad_campaign">অ্যাড ক্যাম্পেইন অপ্টিমাইজেশন</option>
                    <option value="ecommerce_tracking">ই-কমার্স ও CAPI ট্র্যাকিং</option>
                    <option value="web_development">ওয়েব ডেভেলপমেন্ট / বাগ</option>
                    <option value="billing_order">অর্ডার ও বিলিং</option>
                    <option value="general">সাধারণ জিজ্ঞাসা (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">অগ্রাধিকার (Priority)</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low (সাধারণ)</option>
                    <option value="medium">Medium (মাঝারি)</option>
                    <option value="high">High (জরুরি)</option>
                    <option value="urgent">Urgent (অতি জরুরি)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  বিস্তারিত বিবরণ ও মেসেজ <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="আপনার সমস্যার বিস্তারিত বিবরণ দিন যাতে টিম সহজে সমাধান করতে পারে..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={creatingTicket}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {creatingTicket ? 'তৈরি হচ্ছে...' : 'টিকিট সাবমিট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Form Modal */}
      <AuditFormModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onCreated={refreshCampaigns}
      />

      {/* Task for Admin Create Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">নতুন টাস্ক সাবমিট করুন (Task for Admin)</h3>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector inside modal */}
            <div className="px-6 pt-4 pb-2 border-b border-zinc-850 flex gap-2">
              <button
                type="button"
                onClick={() => setTaskSubTab('ads')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  taskSubTab === 'ads'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Ads Campaign (শিট রো)</span>
              </button>
              <button
                type="button"
                onClick={() => setTaskSubTab('web')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  taskSubTab === 'web'
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Web Development</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              {taskSubTab === 'ads' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      ওয়েব লিংক (Web Link) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={taskWebLink}
                      onChange={(e) => setTaskWebLink(e.target.value)}
                      placeholder="https://mybrand.com/products/item-1"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        পোস্ট লিংক (Post Link)
                      </label>
                      <input
                        type="url"
                        value={taskPostLink}
                        onChange={(e) => setTaskPostLink(e.target.value)}
                        placeholder="https://fb.com/page/posts/101"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        ভ্যারিয়েশন লিংক (Variation Post)
                      </label>
                      <input
                        type="url"
                        value={taskVarLink}
                        onChange={(e) => setTaskVarLink(e.target.value)}
                        placeholder="https://fb.com/page/posts/102"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      ভিডিও ডিউরেশন (Video Duration)
                    </label>
                    <input
                      type="text"
                      value={taskVideoDuration}
                      onChange={(e) => setTaskVideoDuration(e.target.value)}
                      placeholder="e.g. 0:45 min বা 30s"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      কমেন্ট / নির্দেশাবলী (Comment)
                    </label>
                    <textarea
                      rows={2}
                      value={taskComment}
                      onChange={(e) => setTaskComment(e.target.value)}
                      placeholder="e.g. ৩-সেকেন্ড হুক টেস্ট এবং মেসেজ ক্যাম্পেইনের জন্য প্রস্তুত করা হোক"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      রিকোয়ারমেন্ট টাইটেল <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={taskWebTitle}
                      onChange={(e) => setTaskWebTitle(e.target.value)}
                      placeholder="e.g. নতুন প্রোডাক্ট ল্যান্ডিং পেজ তৈরি বা স্পিড ফিক্স"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        ওয়েবসাইট / রেফারেন্স লিংক
                      </label>
                      <input
                        type="url"
                        value={taskWebLink}
                        onChange={(e) => setTaskWebLink(e.target.value)}
                        placeholder="https://mybrand.com/page"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">অগ্রাধিকার (Priority)</label>
                      <select
                        value={taskWebPriority}
                        onChange={(e) => setTaskWebPriority(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="normal">সাধারণ (Normal)</option>
                        <option value="high">উচ্চ অগ্রাধিকার (High)</option>
                        <option value="urgent">জরুরি (Urgent)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      বিস্তারিত বিবরণ (Requirements Description) <span className="text-teal-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={taskWebDesc}
                      onChange={(e) => setTaskWebDesc(e.target.value)}
                      placeholder="কি কি কাজ করতে হবে বিস্তারিত লিখুন..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 resize-none font-sans"
                    />
                  </div>
                </>
              )}

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-center gap-2 text-[11px] text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>টাস্কটি সাবমিট হলে সুপার অ্যাডমিনের প্যানেলে স্বয়ংক্রিয়ভাবে জমা হবে।</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={taskSaving}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  {taskSaving ? 'সাবমিট হচ্ছে...' : 'টাস্ক সাবমিট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation / Order Modal */}
      <ConsultationModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          refreshOrders();
        }}
        currentUser={currentUser}
      />
    </div>
  );
}
