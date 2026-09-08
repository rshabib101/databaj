'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SuperAdminBar from '@/components/SuperAdminBar';
import AuditReportView from '@/components/AuditReportView';
import AuditFormModal from '@/components/AuditFormModal';
import ClientDetailsModal from '@/components/admin/ClientDetailsModal';
import ClientNoticeModal from '@/components/admin/ClientNoticeModal';
import ClientCredentialModal from '@/components/admin/ClientCredentialModal';
import {
  ShieldCheck,
  Building,
  Plus,
  Trash2,
  LogOut,
  Layers,
  Edit2,
  X,
  Menu,
  CheckCircle2,
  Sparkles,
  Users,
  FileSpreadsheet,
  UserCheck,
  Bell,
  Megaphone,
  Heart,
  Clock,
  UserX,
  MessageSquare,
  Phone,
  Mail,
  Award,
  Quote,
  Settings,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Sun,
  Moon,
  FileText,
  LifeBuoy,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  ExternalLink,
  ClipboardList,
  RefreshCw,
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Activity,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AdminPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(false);

  const ADMIN_VALID_TABS = ['overview', 'campaigns', 'clients', 'consultations', 'services', 'founder', 'settings', 'tickets', 'credentials', 'tasks', 'client-ad'];

  // Active Tab: 'overview' | 'campaigns' | 'services' | 'clients' | 'consultations' | 'founder' | 'settings' | 'tickets' | 'credentials' | 'tasks'
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = useCallback((newTab) => {
    if (!ADMIN_VALID_TABS.includes(newTab)) return;
    setActiveTab(newTab);
    const url = newTab === 'overview' ? '/admin' : `/admin?tab=${newTab}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: newTab }, '', url);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const pathTab = pathParts[0] === 'admin' && pathParts[1] ? pathParts[1] : null;

      const targetTab = tabParam || pathTab;
      if (targetTab && ADMIN_VALID_TABS.includes(targetTab)) {
        setActiveTab(targetTab);
      } else {
        setActiveTab('overview');
      }
    };

    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, []);

  // Clients & Campaigns state
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [viewClientModal, setViewClientModal] = useState(null);
  const [noticeModalClient, setNoticeModalClient] = useState(null);
  const [adminUnreadChatCount, setAdminUnreadChatCount] = useState(0);

  // Dynamic Services state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  // Consultations & Orders state
  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  // Founder & CEO Profile state
  const [founderProfile, setFounderProfile] = useState({
    founderName: 'রাশেদুল হাবিব',
    founderRole: 'Founder & CEO, DataBaj IT',
    founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    badge: 'LEADERSHIP & VISION',
    founderQuote: '',
    founderBio: '',
    experienceYears: '৭+ বছর',
    stats: [
      { label: 'সন্তুষ্ট ক্লায়েন্ট', value: '১৫০+' },
      { label: 'সফল ক্যাম্পেইন ও প্রজেক্ট', value: '৩৫০+' },
      { label: 'অ্যাভারেজ আরওএএস (ROAS)', value: '৪.৮x' },
      { label: 'ডেটা ট্র্যাকিং অ্যাকুরেসি', value: '৯৯.৪%' },
    ],
    socials: { linkedin: '', facebook: '', email: 'ceo@databaj.com' },
  });
  const [loadingFounder, setLoadingFounder] = useState(false);
  const [savingFounder, setSavingFounder] = useState(false);
  const [founderSuccessMsg, setFounderSuccessMsg] = useState('');

  // Site Settings (Phone, WhatsApp, Email, Address)
  const [siteSettings, setSiteSettings] = useState({
    phone: '+880 1700-000000',
    whatsapp: '+880 1700-000000',
    email: 'contact@databaj.com',
    address: 'হাউজ #৪২, রোড #১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
    workingHours: 'সকাল ৯:০০ - রাত ১০:০০ (শনি - বৃহঃ)',
    facebookUrl: 'https://facebook.com/databaj',
    linkedinUrl: 'https://linkedin.com/company/databaj',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Service form fields
  const [svcTitle, setSvcTitle] = useState('');
  const [svcShortDesc, setSvcShortDesc] = useState('');
  const [svcFullDesc, setSvcFullDesc] = useState('');
  const [svcIcon, setSvcIcon] = useState('Code');
  const [svcBadge, setSvcBadge] = useState('');
  const [svcFeatures, setSvcFeatures] = useState('');
  const [svcOrder, setSvcOrder] = useState('1');
  const [svcIsActive, setSvcIsActive] = useState(true);
  const [svcSaving, setSvcSaving] = useState(false);
  const [svcMsg, setSvcMsg] = useState(null);

  // Client Support Tickets state
  const [adminTickets, setAdminTickets] = useState([]);
  const [loadingAdminTickets, setLoadingAdminTickets] = useState(false);
  const [selectedAdminTicket, setSelectedAdminTicket] = useState(null);
  const [adminTicketReply, setAdminTicketReply] = useState('');
  const [sendingAdminReply, setSendingAdminReply] = useState(false);
  const [adminTicketStatusFilter, setAdminTicketStatusFilter] = useState('all');
  const adminMessagesEndRef = useRef(null);
  const lastAdminTypingSent = useRef(0);

  // Client Credentials Vault state
  const [adminCredentials, setAdminCredentials] = useState([]);
  const [loadingAdminCredentials, setLoadingAdminCredentials] = useState(false);
  const [adminCredSearch, setAdminCredSearch] = useState('');
  const [adminCredPlatformFilter, setAdminCredPlatformFilter] = useState('all');
  const [adminCredClientFilter, setAdminCredClientFilter] = useState('all');
  const [showAdminPasswordMap, setShowAdminPasswordMap] = useState({});
  const [copiedAdminCredKey, setCopiedAdminCredKey] = useState(null);
  const [credentialModalClient, setCredentialModalClient] = useState(null);

  // Client Tasks state (Task from Client)
  const [adminTasks, setAdminTasks] = useState([]);
  const [loadingAdminTasks, setLoadingAdminTasks] = useState(false);
  const [adminTaskTypeFilter, setAdminTaskTypeFilter] = useState('all'); // 'all' | 'ads' | 'web'
  const [adminTaskStatusFilter, setAdminTaskStatusFilter] = useState('all'); // 'all' | 'pending' | 'in_review' | 'done'
  const [adminTaskClientFilter, setAdminTaskClientFilter] = useState('all');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [adminFeedbackInputs, setAdminFeedbackInputs] = useState({});

  // Client Dashboard Ad Banner state (Super Admin Control)
  const [clientAd, setClientAd] = useState({
    isActive: true,
    badge: '🔥 স্পেশাল অফার ও নতুন সার্ভিস',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    headline: 'আপনার বিজনেসের জন্য মেটা কনভার্সন এপিআই (CAPI) ও সার্ভার-সাইড ট্র্যাকিং!',
    subHeadline: 'অ্যাড ব্লকার ও iOS ১৪ আপডেটের পরেও ১০০% নিখুঁত ডেটা ক্যাপচার করুন এবং বিজ্ঞাপনের আরওএএস (ROAS) বাড়ান।',
    offerPoints: [
      '১০০% ইভেন্ট ম্যাচ কোয়ালিটি গ্যারান্টি',
      'ক্লাউড সার্ভার ও স্ট্যাগিং সেটআপ',
      'ফ্রি ৭ দিনের লাইভ মনিটরিং ও অডিট',
      '২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট',
    ],
    orderBtnText: 'অর্ডার করতে ক্লিক করুন',
    orderBtnLink: '/#services',
    interests: [],
  });
  const [offerPointsInput, setOfferPointsInput] = useState('');
  const [loadingClientAd, setLoadingClientAd] = useState(false);
  const [savingClientAd, setSavingClientAd] = useState(false);
  const [clientAdSuccessMsg, setClientAdSuccessMsg] = useState('');

  // Super Admin Security state (Gmail & Password change)
  const [adminSecurityModalOpen, setAdminSecurityModalOpen] = useState(false);
  const [adminEditName, setAdminEditName] = useState('');
  const [adminEditEmail, setAdminEditEmail] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [savingAdminSecurity, setSavingAdminSecurity] = useState(false);
  const [adminSecurityMsg, setAdminSecurityMsg] = useState(null);

  // 1. Authenticate Super Admin
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || data.user?.role !== 'super_admin') {
          router.push('/login');
        } else {
          setCurrentUser(data.user);
          setAdminEditName(data.user.name || '');
          setAdminEditEmail(data.user.email || '');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoadingUser(false));
  }, [router]);

  // 2. Fetch clients
  const refreshClients = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/clients', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/admin/clients', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setClients(data.clients || []);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  // Fetch Consultations
  const refreshConsultations = useCallback(async () => {
    setLoadingConsultations(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/consultations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setConsultations(data.consultations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConsultations(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/consultations', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setConsultations(data.consultations || []);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/consultations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        refreshConsultations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Tickets
  const refreshAdminTickets = useCallback(async (silent = false) => {
    if (!silent) setLoadingAdminTickets(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tickets', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAdminTickets(data.tickets || []);
        setSelectedAdminTicket((prev) => {
          if (!prev) return null;
          return data.tickets?.find((t) => t._id === prev._id) || null;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoadingAdminTickets(false);
    }
  }, []);

  // Fetch Credentials
  const refreshAdminCredentials = useCallback(async () => {
    setLoadingAdminCredentials(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/credentials', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAdminCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdminCredentials(false);
    }
  }, []);

  // Fetch Tasks for Admin
  const refreshAdminTasks = useCallback(async () => {
    setLoadingAdminTasks(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tasks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAdminTasks(data.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdminTasks(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch('/api/tickets', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setAdminTickets(data.tickets || []);
          setSelectedAdminTicket((prev) => {
            if (!prev) return null;
            return data.tickets?.find((t) => t._id === prev._id) || null;
          });
        }
      })
      .catch(console.error);

    fetch('/api/credentials', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setAdminCredentials(data.credentials || []);
        }
      })
      .catch(console.error);

    fetch('/api/tasks', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setAdminTasks(data.tasks || []);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  // Real-time automatic background polling for tickets & live chat (No manual refresh needed)
  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;

    // Poll every 3 seconds if inside tickets tab, or 10 seconds if in overview
    const pollInterval = activeTab === 'tickets' ? 3000 : 10000;
    const interval = setInterval(() => {
      refreshAdminTickets(true);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [currentUser, activeTab, refreshAdminTickets]);

  // Auto-scroll admin chat to latest message
  useEffect(() => {
    if (selectedAdminTicket?.messages?.length) {
      adminMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAdminTicket?.messages?.length]);

  // Real-time automatic background polling for Live Chat Hub unread count
  const refreshAdminChatCount = useCallback(async () => {
    if (currentUser?.role !== 'super_admin') return;
    try {
      const res = await fetch('/api/chat?action=unread_total');
      const data = await res.json();
      if (data.success) {
        setAdminUnreadChatCount(data.unreadCount || 0);
      }
    } catch (e) {
      // silent
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAdminChatCount();
    const interval = setInterval(refreshAdminChatCount, 8000);
    return () => clearInterval(interval);
  }, [refreshAdminChatCount]);

  const handleUpdateTicketStatus = async (id, status) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        refreshAdminTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminTyping = (val) => {
    setAdminTicketReply(val);
    if (!selectedAdminTicket) return;
    const now = Date.now();
    if (now - lastAdminTypingSent.current > 2500) {
      lastAdminTypingSent.current = now;
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: 'typing', id: selectedAdminTicket._id }),
      }).catch(() => {});
    }
  };

  const handleAdminReplyTicket = async (e) => {
    e.preventDefault();
    if (!adminTicketReply?.trim() || !selectedAdminTicket) return;
    setSendingAdminReply(true);
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
          id: selectedAdminTicket._id,
          message: adminTicketReply,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminTicketReply('');
        setSelectedAdminTicket(data.ticket);
        refreshAdminTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingAdminReply(false);
    }
  };

  const handleDeleteAdminCredential = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ক্রেডেনশিয়ালটি মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/credentials?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        refreshAdminCredentials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyAdminCred = (text, key) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedAdminCredKey(key);
      setTimeout(() => setCopiedAdminCredKey(null), 2000);
    }
  };

  // Admin Task status updater
  const handleUpdateTaskStatus = async (id, status) => {
    setUpdatingTaskId(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status } : t))
        );
      } else {
        alert(data.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Admin Task feedback updater
  const handleSaveTaskFeedback = async (id) => {
    const feedback = adminFeedbackInputs[id];
    setUpdatingTaskId(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, adminFeedback: feedback }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, adminFeedback: feedback } : t))
        );
        alert('অ্যাডমিন নোট সফলভাবে সেভ হয়েছে');
      } else {
        alert(data.message || 'সেভ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Delete Task for Admin
  const handleDeleteAdminTask = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই টাস্কটি মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAdminTasks((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert(data.message || 'টাস্ক মোছা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Super Admin Credentials Save Handler
  const handleSaveAdminSecurity = async (e) => {
    e.preventDefault();
    setSavingAdminSecurity(true);
    setAdminSecurityMsg(null);

    if (adminNewPassword && adminNewPassword.trim().length < 6) {
      setAdminSecurityMsg({ type: 'error', text: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      setSavingAdminSecurity(false);
      return;
    }

    if (adminNewPassword && adminNewPassword.trim() !== adminConfirmPassword.trim()) {
      setAdminSecurityMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' });
      setSavingAdminSecurity(false);
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: adminEditName,
          email: adminEditEmail,
          newPassword: adminNewPassword ? adminNewPassword.trim() : undefined,
          confirmPassword: adminConfirmPassword ? adminConfirmPassword.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdminSecurityMsg({ type: 'success', text: data.message });
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('databaj_token', data.token);
        }
        if (data.admin) {
          setCurrentUser(data.admin);
        }
        setAdminNewPassword('');
        setAdminConfirmPassword('');
      } else {
        setAdminSecurityMsg({ type: 'error', text: data.message || 'আপডেট ব্যর্থ হয়েছে' });
      }
    } catch (err) {
      console.error(err);
      setAdminSecurityMsg({ type: 'error', text: 'সার্ভার এরর হয়েছে।' });
    } finally {
      setSavingAdminSecurity(false);
    }
  };

  // 3. Fetch campaigns
  const refreshCampaigns = useCallback(async (clientId = selectedClientId) => {
    setLoadingCampaigns(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const url = clientId ? `/api/campaigns?clientId=${clientId}` : '/api/campaigns';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
        if (data.campaigns?.length > 0) {
          setActiveCampaignId((prev) => {
            return data.campaigns.some((c) => c._id === prev) ? prev : data.campaigns[0]._id;
          });
        } else {
          setActiveCampaignId(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCampaigns(false);
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    const url = selectedClientId ? `/api/campaigns?clientId=${selectedClientId}` : '/api/campaigns';

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setCampaigns(data.campaigns || []);
          if (data.campaigns?.length > 0) {
            setActiveCampaignId((prev) => {
              return data.campaigns.some((c) => c._id === prev) ? prev : data.campaigns[0]._id;
            });
          } else {
            setActiveCampaignId(null);
          }
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser, selectedClientId]);

  // 4. Fetch services
  const refreshServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const res = await fetch('/api/services?all=true');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    fetch('/api/services?all=true')
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success) {
          setServices(data.services || []);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  // Fetch Founder & CEO Profile
  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    fetch('/api/agency/profile')
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success && data.profile) {
          setFounderProfile(data.profile);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  const handleSaveFounder = async (e) => {
    e.preventDefault();
    setSavingFounder(true);
    setFounderSuccessMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/agency/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(founderProfile),
      });
      const data = await res.json();
      if (data.success) {
        setFounderSuccessMsg('ফাউন্ডার ও সিইও প্রোফাইল সফলভাবে আপডেট হয়েছে!');
        setTimeout(() => setFounderSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFounder(false);
    }
  };

  // Fetch Site Settings
  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    let ignore = false;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccessMsg('সাইট সেটিংস ও যোগাযোগের তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => setSettingsSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Fetch Client Ad Banner
  const refreshClientAd = useCallback(async () => {
    setLoadingClientAd(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/client-ad', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && data.ad) {
        setClientAd(data.ad);
        setOfferPointsInput((data.ad.offerPoints || []).join('\n'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClientAd(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    refreshClientAd();
  }, [currentUser, refreshClientAd]);

  // Save Client Ad Banner
  const handleSaveClientAd = async (e) => {
    if (e) e.preventDefault();
    setSavingClientAd(true);
    setClientAdSuccessMsg('');

    try {
      const pointsArray = offerPointsInput
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/client-ad', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...clientAd,
          offerPoints: pointsArray,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClientAd(data.ad);
        setOfferPointsInput((data.ad.offerPoints || []).join('\n'));
        setClientAdSuccessMsg('ক্লায়েন্ট ড্যাশবোর্ড বিজ্ঞাপন সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!');
        setTimeout(() => setClientAdSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার এরর হয়েছে');
    } finally {
      setSavingClientAd(false);
    }
  };

  // Quick Toggle Ad Active/Inactive
  const handleToggleClientAd = async () => {
    const newStatus = !clientAd.isActive;
    setClientAd((prev) => ({ ...prev, isActive: newStatus }));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/client-ad', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...clientAd,
          isActive: newStatus,
          offerPoints: offerPointsInput.split('\n').map((p) => p.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClientAd(data.ad);
        setClientAdSuccessMsg(newStatus ? 'বিজ্ঞাপনটি এখন লাইভ সক্রিয় আছে!' : 'বিজ্ঞাপনটি সাময়িকভাবে বন্ধ (Off) করা হয়েছে।');
        setTimeout(() => setClientAdSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        refreshCampaigns(selectedClientId);
        refreshClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Service Modal for create / edit
  const handleOpenServiceModal = (svc = null) => {
    setSvcMsg(null);
    if (svc) {
      setEditingService(svc);
      setSvcTitle(svc.title);
      setSvcShortDesc(svc.shortDescription);
      setSvcFullDesc(svc.fullDescription || '');
      setSvcIcon(svc.icon || 'Code');
      setSvcBadge(svc.badge || '');
      setSvcFeatures(svc.features ? svc.features.join('\n') : '');
      setSvcOrder(svc.order ? String(svc.order) : '1');
      setSvcIsActive(svc.isActive ?? true);
    } else {
      setEditingService(null);
      setSvcTitle('');
      setSvcShortDesc('');
      setSvcFullDesc('');
      setSvcIcon('Code');
      setSvcBadge('');
      setSvcFeatures('');
      setSvcOrder(String(services.length + 1));
      setSvcIsActive(true);
    }
    setServiceModalOpen(true);
  };

  // Save Service handler
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!svcTitle.trim() || !svcShortDesc.trim()) return;

    setSvcSaving(true);
    setSvcMsg(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const payload = {
        _id: editingService?._id,
        title: svcTitle.trim(),
        shortDescription: svcShortDesc.trim(),
        fullDescription: svcFullDesc.trim(),
        icon: svcIcon,
        badge: svcBadge.trim(),
        features: svcFeatures.split('\n').map((s) => s.trim()).filter(Boolean),
        order: Number(svcOrder) || 0,
        isActive: svcIsActive,
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'সার্ভিস সেভ করতে সমস্যা হয়েছে');
      }

      setSvcMsg({ type: 'success', text: data.message });
      refreshServices();
      setTimeout(() => setServiceModalOpen(false), 800);
    } catch (err) {
      setSvcMsg({ type: 'error', text: err.message });
    } finally {
      setSvcSaving(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই সার্ভিসটি মুছে ফেলতে চান? এটি হোমপেজ থেকে মুছে যাবে।')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        refreshServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client Approval & Management Actions
  const handleApproveClient = async (clientId) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clientId,
          status: 'active',
          isVerified: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        refreshClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspendClient = async (clientId) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clientId,
          status: 'suspended',
          isVerified: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        refreshClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ক্লায়েন্টের অ্যাকাউন্ট এবং সকল অডিট ডেটা মুছে ফেলতে চান?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
      const res = await fetch(`/api/admin/clients?id=${clientId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        refreshClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingClients = clients.filter((c) => !c.isVerified || c.status === 'pending_approval');
  const activeClients = clients.filter((c) => c.isVerified && c.status === 'active');
  const activeCampaign = campaigns.find((c) => c._id === activeCampaignId) || campaigns[0] || null;
  const totalSpendAll = campaigns.reduce((acc, c) => acc + (c.adSpend || 0), 0);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 text-sm">
        সুপার অ্যাডমিন ক্রেডেনশিয়াল যাচাই করা হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex selection:bg-emerald-500 selection:text-black">
      {/* 1. PERMANENT LEFT SIDEBAR FOR SUPER ADMIN */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-zinc-950 border-r border-zinc-850 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
          adminSidebarCollapsed ? 'md:w-20' : 'md:w-72'
        } ${mobileSidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0 w-72'}`}
      >
        {/* Top brand */}
        <div className={`p-4 border-b border-zinc-900 transition-all ${adminSidebarCollapsed ? 'md:p-2 md:py-4' : 'sm:p-6 space-y-4'}`}>
          <div className={`flex items-center justify-between ${adminSidebarCollapsed ? 'md:flex-col md:gap-3 md:justify-center' : ''}`}>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                DB
              </div>
              {!adminSidebarCollapsed && (
                <div>
                  <span className="font-black text-lg text-white tracking-tight block">DataBaj</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block -mt-1">
                    Master Control
                  </span>
                </div>
              )}
            </Link>

            <div className={`flex items-center gap-1.5 ${adminSidebarCollapsed ? 'md:flex-col md:gap-2' : ''}`}>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                title={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              </button>

              {/* Desktop Sidebar Collapse/Expand Toggle */}
              <button
                onClick={() => setAdminSidebarCollapsed(!adminSidebarCollapsed)}
                className="hidden md:flex p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                title={adminSidebarCollapsed ? 'সাইডবার প্রসারিত করুন (Expand)' : 'সাইডবার সংকুচিত করুন (Collapse)'}
              >
                {adminSidebarCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!adminSidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-semibold">সুপার অ্যাডমিন কন্ট্রোল প্যানেল</span>
            </div>
          )}
        </div>

        {/* Navigation Options in Left Sidebar */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {!adminSidebarCollapsed && (
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider px-3 block mb-2">
              মেইন মেন্যু (Main Menu)
            </span>
          )}

          {/* Option 0: Dashboard Overview */}
          <button
            onClick={() => {
              handleTabChange('overview');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ড্যাশবোর্ড ওভারভিউ"
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ড্যাশবোর্ড ওভারভিউ</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'overview' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    Command Center
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'overview'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                Live
              </span>
            )}
          </button>

          {/* Option 1: Client Company & Campaign Audit */}
          <button
            onClick={() => {
              handleTabChange('campaigns');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'campaigns'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ক্লায়েন্ট কোম্পানি ও অডিট"
          >
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ক্লায়েন্ট কোম্পানি ও অডিট</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'campaigns' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    Campaign Diagnostics
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'campaigns'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                }`}
              >
                {clients.length} কোম্পানি
              </span>
            )}
          </button>

          {/* Option 2: Client Approvals & Access Control */}
          <button
            onClick={() => {
              handleTabChange('clients');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'clients'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ক্লায়েন্ট অনুমোদন ও এক্সেস"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ক্লায়েন্ট অনুমোদন ও এক্সেস</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'clients' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    Client Approvals
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              pendingClients.length > 0 ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black animate-pulse shadow-sm">
                  {pendingClients.length} পেন্ডিং
                </span>
              ) : (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    activeTab === 'clients'
                      ? 'bg-black/20 text-black font-bold'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {clients.length} ইউজার
                </span>
              )
            )}
          </button>

          {/* Option: Live Chat Hub */}
          <Link
            href="/admin/chat"
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850 ${
              adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'
            }`}
            title="লাইভ চ্যাট হাব (Live Chat Hub)"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">লাইভ চ্যাট হাব</span>
                  <span className="text-[10px] font-normal block text-zinc-500">
                    Real-time WhatsApp Chat
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              adminUnreadChatCount > 0 ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black animate-pulse shadow-sm">
                  {adminUnreadChatCount} নতুন
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700">
                  Live
                </span>
              )
            )}
          </Link>

          {/* Option 3: Orders & Consultations */}
          <button
            onClick={() => {
              handleTabChange('consultations');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'consultations'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="অর্ডার ও কনসালটেশন"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">অর্ডার ও কনসালটেশন</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'consultations' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    Orders & Bookings
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              consultations.filter((c) => c.status === 'pending').length > 0 ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                  {consultations.filter((c) => c.status === 'pending').length} নতুন
                </span>
              ) : (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    activeTab === 'consultations'
                      ? 'bg-black/20 text-black font-bold'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {consultations.length} রিকোয়েস্ট
                </span>
              )
            )}
          </button>

          {/* Option 4: Dynamic Services Manager */}
          <button
            onClick={() => {
              handleTabChange('services');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'services'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ডাইনামিক সার্ভিস ম্যানেজার"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ডাইনামিক সার্ভিস ম্যানেজার</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'services' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    হোমপেজ সার্ভিস কন্ট্রোল
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'services'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-zinc-800 text-blue-400 border border-zinc-700'
                }`}
              >
                {services.length} সার্ভিস
              </span>
            )}
          </button>

          {/* Option 5: Founder & CEO Profile Manager */}
          <button
            onClick={() => {
              handleTabChange('founder');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'founder'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ফাউন্ডার ও সিইও প্রোফাইল"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ফাউন্ডার ও সিইও প্রোফাইল</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'founder' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    হোমপেজ লিডারশিপ সেকশন
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'founder'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                }`}
              >
                Live
              </span>
            )}
          </button>

          {/* Option 6: Agency Contact & Site Settings */}
          <button
            onClick={() => {
              handleTabChange('settings');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="সাইট ও যোগাযোগ সেটিংস"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 shrink-0" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">সাইট ও যোগাযোগ সেটিংস</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'settings' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    হটলাইন, হোয়াটসঅ্যাপ ও ঠিকানা
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'settings'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                Config
              </span>
            )}
          </button>

          {/* Option 7: Client Support Tickets Inbox */}
          <button
            onClick={() => {
              handleTabChange('tickets');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'tickets'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ক্লায়েন্ট সাপোর্ট টিকিট ইনবক্স"
          >
            <div className="flex items-center gap-2.5">
              <LifeBuoy className="w-4 h-4 shrink-0 text-blue-400" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">সাপোর্ট টিকিট ইনবক্স</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'tickets' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    ক্লায়েন্ট মেসেজ ও রিপ্লাই
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'tickets'
                    ? 'bg-black/20 text-black font-bold'
                    : adminTickets.filter((t) => t.status === 'open').length > 0
                    ? 'bg-blue-500 text-white font-bold animate-pulse'
                    : 'bg-zinc-800 text-blue-400 border border-zinc-700'
                }`}
              >
                {adminTickets.filter((t) => t.status === 'open').length > 0
                  ? `${adminTickets.filter((t) => t.status === 'open').length} ওপেন`
                  : `${adminTickets.length} টিকেট`}
              </span>
            )}
          </button>

          {/* Option 9: Task from Client */}
          <button
            onClick={() => {
              handleTabChange('tasks');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'tasks'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="Task from Client (ক্লায়েন্ট টাস্ক)"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 shrink-0 text-teal-400" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">Task from Client</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'tasks' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    ক্লায়েন্ট টাস্ক ও রিকোয়ারমেন্ট
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'tasks'
                    ? 'bg-black/20 text-black font-bold'
                    : adminTasks.filter((t) => t.status === 'pending').length > 0
                    ? 'bg-amber-500 text-black font-bold animate-pulse'
                    : 'bg-zinc-800 text-teal-400 border border-zinc-700'
                }`}
              >
                {adminTasks.filter((t) => t.status === 'pending').length > 0
                  ? `${adminTasks.filter((t) => t.status === 'pending').length} পেন্ডিং`
                  : `${adminTasks.length} টাস্ক`}
              </span>
            )}
          </button>

          {/* Option 10: Client Dashboard Ad Banner Control */}
          <button
            onClick={() => {
              handleTabChange('client-ad');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'client-ad'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white border-zinc-850'
            } ${adminSidebarCollapsed ? 'md:justify-center md:p-3' : 'justify-between'}`}
            title="ক্লায়েন্ট ড্যাশবোর্ড বিজ্ঞাপন ও অফার ব্যানার"
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 shrink-0 text-pink-400" />
              {!adminSidebarCollapsed && (
                <div className="text-left">
                  <span className="block">ক্লায়েন্ট অফার ও ব্যানার</span>
                  <span className={`text-[10px] font-normal block ${activeTab === 'client-ad' ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                    Promo Ad & Interests
                  </span>
                </div>
              )}
            </div>

            {!adminSidebarCollapsed && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'client-ad'
                    ? 'bg-black/20 text-black font-bold'
                    : clientAd.isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {clientAd.isActive ? 'Active' : 'Off'}
                {clientAd.interests?.length > 0 && ` (${clientAd.interests.length})`}
              </span>
            )}
          </button>
        </div>

        {/* Bottom profile widget */}
        <div className={`p-4 border-t border-zinc-900 transition-all ${adminSidebarCollapsed ? 'md:p-2' : ''}`}>
          <div className={`p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between ${adminSidebarCollapsed ? 'md:justify-center md:p-2' : ''}`}>
            {!adminSidebarCollapsed && (
              <div className="truncate pr-2">
                <span className="text-xs font-bold text-white block truncate">
                  {currentUser?.name || 'Habib'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block truncate">
                  {currentUser?.email}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setAdminEditName(currentUser?.name || '');
                  setAdminEditEmail(currentUser?.email || '');
                  setAdminNewPassword('');
                  setAdminConfirmPassword('');
                  setAdminSecurityMsg(null);
                  setAdminSecurityModalOpen(true);
                }}
                title="লগইন জিমেইল ও পাসওয়ার্ড পরিবর্তন"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                title="লগআউট"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${adminSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Top Header Bar with Sticky Quick-Controls */}
        <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-850 px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Quick Sidebar Collapse / Expand Toggle Button */}
            <button
              onClick={() => setAdminSidebarCollapsed(!adminSidebarCollapsed)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs transition cursor-pointer"
              title={adminSidebarCollapsed ? 'সাইডবার প্রসারিত করুন (Expand)' : 'সাইডবার সংকুচিত করুন (Collapse)'}
            >
              {adminSidebarCollapsed ? (
                <>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">সাইডবার খুলুন</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-400">সাইডবার লুকান</span>
                </>
              )}
            </button>

            {/* Current Active Section Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-white">
                {activeTab === 'overview' && 'সুপার অ্যাডমিন কমান্ড সেন্টার ও সিস্টেম ওভারভিউ'}
                {activeTab === 'campaigns' && 'ক্লায়েন্ট কোম্পানি ও ক্যাম্পেইন অডিট'}
                {activeTab === 'clients' && 'ক্লায়েন্ট অনুমোদন ও এক্সেস কন্ট্রোল'}
                {activeTab === 'consultations' && 'অর্ডার ও কনসালটেশন ম্যানেজমেন্ট'}
                {activeTab === 'services' && 'ডাইনামিক সার্ভিস ম্যানেজার (হোমপেজ)'}
                {activeTab === 'founder' && 'ফাউন্ডার ও সিইও প্রোফাইল কন্ট্রোল'}
                {activeTab === 'settings' && 'সাইট ও যোগাযোগ সেটিংস'}
                {activeTab === 'tickets' && 'ক্লায়েন্ট সাপোর্ট টিকিট ইনবক্স'}
                {activeTab === 'credentials' && 'ক্লায়েন্ট ক্রেডেনশিয়ালস ভল্ট'}
                {activeTab === 'tasks' && 'Task from Client (ক্লায়েন্ট টাস্ক ও ওয়ার্কশিট)'}
                {activeTab === 'client-ad' && 'ক্লায়েন্ট ড্যাশবোর্ড বিজ্ঞাপন ও অফার ব্যানার কন্ট্রোল'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAdminEditName(currentUser?.name || '');
                setAdminEditEmail(currentUser?.email || '');
                setAdminNewPassword('');
                setAdminConfirmPassword('');
                setAdminSecurityMsg(null);
                setAdminSecurityModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition cursor-pointer"
              title="জিমেইল ও পাসওয়ার্ড পরিবর্তন করুন"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>লগইন সিকিউরিটি</span>
            </button>

            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              Super Admin: {currentUser?.name}
            </span>
          </div>
        </div>

        {/* TAB 0: SUPER ADMIN COMMAND CENTER (DASHBOARD OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full animate-fadeIn">
            {/* Top Super Admin Command Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
              {/* Dynamic Animated Ambient Glow */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                      সুপার অ্যাডমিন রুট এক্সেস
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                      সার্ভার লাইভ ও সুরক্ষিত
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-mono">
                      DataBaj Central CMS
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    স্বাগতম, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400">{currentUser?.name || 'Super Admin'}</span>! ⚡
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    এটি আপনার ফুল-সিস্টেম কন্ট্রোল সেন্টার। এখান থেকে সকল ক্লায়েন্ট কোম্পানি, ক্যাম্পেইন অডিট ডায়াগনস্টিকস, লাইভ অর্ডার, সাপোর্ট ইনবক্স, মাস্টার ক্রেডেনশিয়াল ভল্ট এবং হোমপেজ কনটেন্ট এক নজরে পর্যবেক্ষণ ও পরিচালনা করুন।
                  </p>
                </div>

                {/* Hero Quick Command Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন অডিট রিপোর্ট</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setServiceModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Layers className="w-4 h-4" />
                    <span>নতুন সার্ভিস যোগ</span>
                  </button>
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>লাইভ ওয়েবসাইট</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </Link>
                </div>
              </div>
            </div>

            {/* HIGH IMPACT ANIMATED CARDS GRID - 8 CORE FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Clients & Access Control Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40 flex flex-col justify-between">
                {/* Floating ambient orb */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-purple-500/10">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    {pendingClients.length > 0 ? (
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {pendingClients.length} অনুমোদন বাকি
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        সব ভেরিফাইড
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">ক্লায়েন্ট কোম্পানি ও এক্সেস</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{clients.length}</span>
                      <span className="text-xs text-zinc-500">টি কোম্পানি</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>সক্রিয় কোম্পানি</span>
                      <span className="font-bold text-emerald-400 font-mono">{activeClients.length} টি</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>পেন্ডিং অনুমোদন</span>
                      <span className="font-bold text-amber-400 font-mono">{pendingClients.length} টি</span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-emerald-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((activeClients.length || 1) / (clients.length || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('clients')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>ক্লায়েন্ট এক্সেস দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 font-mono">আইডি কন্ট্রোল</span>
                </div>
              </div>

              {/* 2. Campaign Audits & Ad Spend Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-emerald-500/10">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ক্যাম্পেইন অডিট
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">মেটা অডিট রেকর্ডস</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{campaigns.length}</span>
                      <span className="text-xs text-zinc-500">টি রিপোর্ট</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>মোট ট্র্যাকড স্পেন্ড</span>
                      <span className="font-bold text-emerald-400 font-mono">${totalSpendAll.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>হাই-স্কোরিং (৮০+)</span>
                      <span className="font-bold text-zinc-200 font-mono">
                        {campaigns.filter((c) => (c.overallScore || 0) >= 80).length} টি
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((campaigns.filter((c) => (c.overallScore || 0) >= 80).length || 1) / (campaigns.length || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('campaigns')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>অডিট ডাটাবেস দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-emerald-500 hover:text-black text-zinc-400 transition cursor-pointer"
                    title="নতুন অডিট যোগ করুন"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. Orders & Consultations Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/10">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    {consultations.filter((c) => c.status === 'pending').length > 0 ? (
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {consultations.filter((c) => c.status === 'pending').length} নতুন অর্ডার
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
                        অল আপ-টু-ডেট
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">অর্ডার ও কনসালটেশন</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{consultations.length}</span>
                      <span className="text-xs text-zinc-500">টি সার্ভিস অর্ডার</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>পেন্ডিং বুকিং</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {consultations.filter((c) => c.status === 'pending').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>কনভার্টেড / চলমান</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {consultations.filter((c) => c.status === 'converted' || c.status === 'reviewing' || c.status === 'contacted').length} টি
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((consultations.filter((c) => c.status === 'converted').length || 1) / (consultations.length || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('consultations')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>অর্ডার ম্যানেজ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 font-mono">কনসালটেশন</span>
                </div>
              </div>

              {/* 4. Support Tickets Inbox Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-cyan-500/10">
                      <LifeBuoy className="w-6 h-6" />
                    </div>
                    {adminTickets.filter((t) => t.status === 'open').length > 0 ? (
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {adminTickets.filter((t) => t.status === 'open').length} ওপেন টিকিট
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        জিরো পেন্ডিং
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">সাপোর্ট টিকিট ইনবক্স</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{adminTickets.length}</span>
                      <span className="text-xs text-zinc-500">টি কনভারসেশন</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ওপেন / জরুরি টিকিট</span>
                      <span className={`font-bold font-mono ${adminTickets.filter((t) => t.status === 'open').length > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                        {adminTickets.filter((t) => t.status === 'open').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>সমাধানকৃত</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {adminTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length} টি
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((adminTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length || 1) / (adminTickets.length || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('tickets')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>ইনবক্স রিপ্লাই দিন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 font-mono">লাইভ চ্যাট</span>
                </div>
              </div>

              {/* 5. Master Credential Vault Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-amber-500/10">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      AES-256 ভল্ট
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">ক্লায়েন্ট ক্রেডেনশিয়ালস ভল্ট</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{adminCredentials.length}</span>
                      <span className="text-xs text-zinc-500">টি সুরক্ষিত লগইন</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Meta BM লগইন</span>
                      <span className="font-bold text-blue-400 font-mono">
                        {adminCredentials.filter((c) => c.platform === 'facebook_bm').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ওয়েবসাইট / শপিফাই</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {adminCredentials.filter((c) => c.platform === 'website_admin').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>গুগল ও অন্যান্য</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {adminCredentials.filter((c) => c.platform !== 'facebook_bm' && c.platform !== 'website_admin').length} টি
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('clients')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>ক্লায়েন্ট এক্সেস দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 font-mono">এনক্রিপ্টেড</span>
                </div>
              </div>

              {/* 6. Task from Client Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-teal-500/10">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    {adminTasks.filter((t) => t.status === 'pending').length > 0 ? (
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {adminTasks.filter((t) => t.status === 'pending').length} টাস্ক পেন্ডিং
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
                        টাস্ক রানিং
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Task from Client (টাস্ক)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{adminTasks.length}</span>
                      <span className="text-xs text-zinc-500">টি অ্যাক্টিভ টাস্ক</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ইন-রিভিউ / রানিং</span>
                      <span className="font-bold text-teal-400 font-mono">
                        {adminTasks.filter((t) => t.status === 'in_review').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>সম্পন্ন (Done)</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {adminTasks.filter((t) => t.status === 'done').length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                      <span>Ads: {adminTasks.filter((t) => t.taskType === 'ads').length} টি</span>
                      <span>Web: {adminTasks.filter((t) => t.taskType === 'web').length} টি</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('tasks')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>টাস্ক বোর্ড দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 font-mono">ওয়ার্কফ্লো</span>
                </div>
              </div>

              {/* 7. Dynamic Services CMS Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-500/40 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-pink-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-rose-500/10">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      হোমপেজ CMS
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">ডাইনামিক সার্ভিস ম্যানেজার</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">{services.length}</span>
                      <span className="text-xs text-zinc-500">টি কনফিগার করা সার্ভিস</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>সক্রিয় লাইভ কার্ড</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {services.filter((s) => s.isActive).length} টি
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ড্রাফট / নিষ্ক্রিয়</span>
                      <span className="font-bold text-zinc-500 font-mono">
                        {services.filter((s) => !s.isActive).length} টি
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.round(((services.filter((s) => s.isActive).length || 1) / (services.length || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('services')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>সার্ভিস CMS খুলুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setServiceModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500 hover:text-white text-zinc-400 transition cursor-pointer"
                    title="নতুন সার্ভিস তৈরি করুন"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 8. Agency Contact & Founder Settings Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-zinc-800/80 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-500/10 hover:border-zinc-700 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-zinc-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      সিস্টেম সেটিংস
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">সাইট ও ফাউন্ডার কন্ট্রোল</span>
                    <h3 className="text-sm font-bold text-white truncate">
                      {founderProfile.founderName || 'Founder & CEO'}
                    </h3>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>হটলাইন</span>
                      <span className="font-mono text-zinc-300 text-[11px]">{siteSettings.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>হোয়াটসঅ্যাপ</span>
                      <span className="font-mono text-emerald-400 text-[11px]">{siteSettings.whatsapp || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>সাপোর্ট ইমেইল</span>
                      <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[130px]">{siteSettings.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTabChange('settings')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>সাইট সেটিংস</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleTabChange('founder')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>ফাউন্ডার প্রোফাইল</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 7: Client Dashboard Promo Ad & Interests */}
              <div className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-pink-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      clientAd.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}>
                      {clientAd.isActive ? '● Live Active' : '○ Off'}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">ক্লায়েন্ট অফার ও ব্যানার</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        {clientAd.interests?.length || 0}
                      </span>
                      <span className="text-xs text-zinc-500">জন ক্লায়েন্ট আগ্রহী</span>
                    </div>
                  </div>

                  {/* Sub-breakdown */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ব্যানার স্ট্যাটাস</span>
                      <span className={`font-mono font-bold text-[11px] ${clientAd.isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {clientAd.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>অফার পয়েন্ট</span>
                      <span className="font-mono text-zinc-300 text-[11px]">
                        {clientAd.offerPoints?.length || 0} টি রো পয়েন্ট
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>ক্লিক লিঙ্ক</span>
                      <span className="font-mono text-pink-400 text-[11px] truncate max-w-[130px]">
                        {clientAd.orderBtnLink || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => handleTabChange('client-ad')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    <span>অ্যাড ও আগ্রহীদের তালিকা</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleToggleClientAd}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
                  >
                    {clientAd.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & LIVE QUEUES SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Urgent Pending Approvals & Client Queue */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">ক্লায়েন্ট অনুমোদন ও নতুন সাইন-আপ</h3>
                  </div>
                  <button
                    onClick={() => handleTabChange('clients')}
                    className="text-xs text-purple-400 hover:underline font-semibold cursor-pointer"
                  >
                    সব দেখুন ({clients.length})
                  </button>
                </div>

                {pendingClients.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-pulse">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        জরুরি: {pendingClients.length}টি ক্লায়েন্ট অ্যাকাউন্ট অনুমোদনের অপেক্ষায়
                      </span>
                      <button
                        onClick={() => handleTabChange('clients')}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition cursor-pointer"
                      >
                        অনুমোদন দিন
                      </button>
                    </div>
                    <div className="space-y-2">
                      {pendingClients.slice(0, 3).map((cl) => (
                        <div key={cl._id} className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{cl.companyName || cl.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{cl.email}</span>
                          </div>
                          <button
                            onClick={() => setViewClientModal(cl)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition cursor-pointer"
                          >
                            বিস্তারিত
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      সকল ক্লায়েন্ট অ্যাকাউন্ট ভেরিফাইড এবং কোনো পেন্ডিং অনুমোদন নেই
                    </span>
                    <button
                      onClick={() => handleTabChange('clients')}
                      className="text-[11px] font-bold underline cursor-pointer"
                    >
                      লিস্ট দেখুন
                    </button>
                  </div>
                )}

                {/* Recent Verified Clients Snapshot */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase font-semibold block">সাম্প্রতিক ক্লায়েন্ট কোম্পানি</span>
                  {clients.slice(0, 3).map((cl) => (
                    <div
                      key={cl._id}
                      onClick={() => {
                        setSelectedClientId(cl._id);
                        handleTabChange('campaigns');
                      }}
                      className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850 hover:border-emerald-500/40 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-bold text-xs">
                          {(cl.companyName || cl.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate max-w-[180px]">
                            {cl.companyName || cl.name}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono">{cl.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          cl.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {cl.isVerified ? 'Active' : 'Pending'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Orders & Urgent Support Inquiries */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">সাম্প্রতিক অর্ডার ও সাপোর্ট রিকোয়েস্ট</h3>
                  </div>
                  <button
                    onClick={() => handleTabChange('consultations')}
                    className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    সব অর্ডার ({consultations.length})
                  </button>
                </div>

                {/* Orders Queue */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase font-semibold block">নতুন সার্ভিস বুকিং</span>
                  {consultations.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-3">এখনো কোনো সার্ভিস অর্ডার আসেনি</p>
                  ) : (
                    consultations.slice(0, 3).map((ord) => (
                      <div
                        key={ord._id}
                        onClick={() => handleTabChange('consultations')}
                        className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850 hover:border-blue-500/40 transition flex items-center justify-between cursor-pointer group"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block">{ord.serviceSlug || 'Service'}</span>
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate max-w-[220px]">
                            {ord.serviceName}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono">{ord.phone || ord.email || 'যোগাযোগ রেকর্ড'}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                          ord.status === 'pending'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                            : ord.status === 'converted'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}>
                          {ord.status || 'Pending'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Open Tickets Desk */}
                <div className="pt-2 space-y-2.5 border-t border-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase font-semibold">সাপোর্ট টিকিট ইনবক্স</span>
                    <button
                      onClick={() => handleTabChange('tickets')}
                      className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      ইনবক্স খুলুন
                    </button>
                  </div>
                  {adminTickets.filter((t) => t.status === 'open').length > 0 ? (
                    <div className="space-y-2">
                      {adminTickets.filter((t) => t.status === 'open').slice(0, 2).map((tk) => (
                        <div
                          key={tk._id}
                          onClick={() => {
                            setSelectedAdminTicket(tk);
                            handleTabChange('tickets');
                          }}
                          className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-400 transition flex items-center justify-between cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] text-rose-400 font-mono font-bold block">জরুরি মেসেজ</span>
                            <h5 className="text-xs font-bold text-white group-hover:text-rose-300 transition truncate max-w-[220px]">
                              {tk.subject}
                            </h5>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-bold transition">
                            উত্তর দিন
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      কোনো অমীমাংসিত সাপোর্ট টিকিট নেই
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CLIENT COMPANIES & CAMPAIGN AUDITS */}
        {activeTab === 'campaigns' && (
          <div className="flex-1 flex flex-col">
            {/* Super Admin Client Switcher Bar */}
            <SuperAdminBar
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={(id) => setSelectedClientId(id)}
              totalCampaigns={campaigns.length}
              totalSpend={totalSpendAll}
              onClientUpdated={refreshClients}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-4 sm:p-5 rounded-3xl border border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>
                      {selectedClientId
                        ? `${clients.find((c) => c._id === selectedClientId)?.companyName || 'ক্লায়েন্ট'} এর অডিট রিপোর্ট`
                        : 'সকল ক্লায়েন্ট কোম্পানির অডিট রেকর্ড'}
                    </span>
                    <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {campaigns.length} টি অডিট
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    যেকোনো ক্যাম্পেইনে ক্লিক করে স্কোর, ঘাটতি (Lackings) ও অ্যাকশনেবল গাইড দেখুন:
                  </p>
                </div>

                <button
                  onClick={() => setIsAuditModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  নতুন অ্যাড অডিট যোগ করুন
                </button>
              </div>

              {/* Layout: Sidebar list + Detailed report */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 px-1">
                    <span>ক্যাম্পেইন তালিকা ({campaigns.length})</span>
                    {loadingCampaigns && <span className="text-emerald-400">লোড হচ্ছে...</span>}
                  </div>

                  <div className="space-y-2 max-h-[780px] overflow-y-auto pr-1">
                    {campaigns.length === 0 ? (
                      <div className="p-8 text-center bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl text-xs text-zinc-500 space-y-3">
                        <p>কোনো অডিট রেকর্ড পাওয়া যায়নি।</p>
                        <button
                          onClick={() => setIsAuditModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 text-xs font-medium border border-zinc-800 cursor-pointer"
                        >
                          নতুন অডিট যোগ করুন
                        </button>
                      </div>
                    ) : (
                      campaigns.map((camp) => {
                        const isActive = camp._id === activeCampaignId;
                        const scoreColor =
                          camp.overallScore >= 80
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            : camp.overallScore >= 60
                            ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                            : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

                        return (
                          <div
                            key={camp._id}
                            onClick={() => setActiveCampaignId(camp._id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                              isActive
                                ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                                : 'bg-zinc-950/80 hover:bg-zinc-900/60 border-zinc-800/80'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <span className="inline-block text-[10px] font-bold text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mb-1 truncate max-w-[160px]">
                                  {camp.companyName}
                                </span>
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                                  {camp.campaignName}
                                </h4>
                              </div>

                              <div className={`text-xs font-black px-2.5 py-1 rounded-xl border shrink-0 ${scoreColor}`}>
                                {camp.overallScore}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
                              <span>Spend: ${camp.adSpend}</span>
                              <span className="font-semibold text-zinc-300">ROAS: {camp.roas}x</span>
                              <button
                                onClick={(e) => handleDeleteCampaign(camp._id, e)}
                                className="text-zinc-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                title="Delete Audit"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {activeCampaign ? (
                    <AuditReportView
                      campaign={activeCampaign}
                      isSuperAdmin={true}
                      onNotesUpdated={(campId, notes) => {
                        setCampaigns((prev) =>
                          prev.map((c) => (c._id === campId ? { ...c, adminNotes: notes } : c))
                        );
                      }}
                    />
                  ) : (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 text-xs">
                      কোনো ক্যাম্পেইন সিলেক্ট করা নেই।
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        )}

        {/* TAB 2: DYNAMIC SERVICES MANAGER */}
        {activeTab === 'services' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Layers className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
                    Homepage Agency Services
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">ডাইনামিক সার্ভিস ম্যানেজার</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  এখান থেকে সার্ভিস যুক্ত বা পরিবর্তন করলে তা সরাসরি হোমপেজের সার্ভিস সেকশনে প্রদর্শিত হবে।
                </p>
              </div>

              <button
                onClick={() => handleOpenServiceModal()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                নতুন সার্ভিস যুক্ত করুন
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc._id}
                  className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500">Order: #{svc.order}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          svc.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {svc.isActive ? 'Active (Live)' : 'Disabled'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{svc.title}</h3>
                      {svc.badge && (
                        <span className="inline-block text-[10px] font-semibold text-amber-400 mt-0.5">
                          Badge: {svc.badge}
                        </span>
                      )}
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {svc.shortDescription}
                      </p>
                    </div>

                    {svc.features && svc.features.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                        {svc.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                    <span className="text-[10px] font-mono text-zinc-500">Icon: {svc.icon}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenServiceModal(svc)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc._id)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 border border-zinc-800 cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* TAB 3: CLIENT REGISTRATION APPROVAL & ACCESS MANAGEMENT */}
        {activeTab === 'clients' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl font-bold text-white">ক্লায়েন্ট অনুমোদন ও এক্সেস কন্ট্রোল</h2>
                </div>
                <p className="text-xs text-zinc-400">
                  নতুন নিবন্ধিত ক্লায়েন্টদের অ্যাকাউন্ট রিভিউ করুন। সুপার অ্যাডমিনের অনুমোদন ছাড়া কোনো ক্লায়েন্ট লগইন বা পোর্টাল ব্যবহার করতে পারবে না।
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refreshClients}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>রিফ্রেশ করুন</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">মোট নিবন্ধিত ক্লায়েন্ট</span>
                  <span className="text-2xl font-black text-white">{clients.length} টি</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  pendingClients.length > 0
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-zinc-950 border-zinc-850'
                }`}
              >
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">অনুমোদনের অপেক্ষায় (Pending)</span>
                  <span className="text-2xl font-black text-amber-400">{pendingClients.length} টি</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">অনুমোদিত ও সক্রিয় (Active)</span>
                  <span className="text-2xl font-black text-emerald-400">{activeClients.length} টি</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Pending Approvals Spotlight Section */}
            {pendingClients.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-6 rounded-3xl border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>জরুরি: {pendingClients.length}টি নতুন অ্যাকাউন্ট আপনার অনুমোদনের অপেক্ষায় রয়েছে!</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingClients.map((client) => (
                    <div key={client._id} className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">{client.companyName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{client.name} • {client.email}</p>
                        <span className="text-[10px] text-zinc-500 block mt-1">ইন্ডাস্ট্রি: {client.industry || 'General'}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewClientModal(client)}
                          className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          title="ক্লায়েন্টের বিস্তারিত প্রোফাইল, ডিভাইস ও আইপি দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setCredentialModalClient(client)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          title="ক্লায়েন্টের ক্রেডেনশিয়ালস ভল্ট দেখুন ও যোগ করুন"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Credential</span>
                        </button>
                        <button
                          onClick={() => handleApproveClient(client._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                        >
                          অনুমোদন দিন (Approve)
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client._id)}
                          className="p-1.5 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 cursor-pointer"
                          title="রিজেক্ট / মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Clients Table */}
            <div className="bg-zinc-950 rounded-3xl border border-zinc-850 overflow-hidden">
              <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>সকল ক্লায়েন্ট তালিকা ({clients.length})</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/60 text-zinc-400 font-semibold border-b border-zinc-850 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">কোম্পানি ও ক্লায়েন্ট</th>
                      <th className="p-4">ইন্ডাস্ট্রি</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500 text-xs">
                          কোনো ক্লায়েন্ট অ্যাকাউন্ট পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => {
                        const isPending = !client.isVerified || client.status === 'pending_approval';
                        const isSuspended = client.status === 'suspended';

                        return (
                          <tr key={client._id} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white text-xs">
                                  {client.companyName?.slice(0, 2).toUpperCase() || 'CL'}
                                </div>
                                <div>
                                  <span className="font-bold text-white block">{client.companyName}</span>
                                  <span className="text-[11px] text-zinc-400 block">
                                    {client.name} • <span className="font-mono text-zinc-500">{client.email}</span>
                                  </span>
                                  {client.phone && (
                                    <span className="font-mono text-[10px] text-zinc-400 block">{client.phone}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-zinc-400">{client.industry || 'General'}</td>
                            <td className="p-4">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Approval</span>
                                </span>
                              ) : isSuspended ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                  <span>Suspended</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Active & Approved</span>
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewClientModal(client)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                  title="ক্লায়েন্টের বিস্তারিত প্রোফাইল ও ডিভাইস/আইপি দেখুন"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </button>

                                <button
                                  onClick={() => setCredentialModalClient(client)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                  title="ক্লায়েন্টের ক্রেডেনশিয়ালস ভল্ট দেখুন ও যোগ করুন"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                  <span>Credential</span>
                                </button>

                                <button
                                  onClick={() => setNoticeModalClient(client)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                  title="ক্লায়েন্টের জন্য নোটিশ পাঠান বা এডিট করুন"
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                  <span>Notice</span>
                                </button>

                                <button
                                  onClick={() => router.push(`/admin/chat?clientId=${client._id}`)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                  title="ক্লায়েন্টের সাথে রিয়েল-টাইম লাইভ চ্যাট করুন"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Chat</span>
                                </button>

                                {isPending ? (
                                  <button
                                    onClick={() => handleApproveClient(client._id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                                  >
                                    Approve
                                  </button>
                                ) : isSuspended ? (
                                  <button
                                    onClick={() => handleApproveClient(client._id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                                  >
                                    Active
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSuspendClient(client._id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 text-xs font-medium cursor-pointer"
                                    title="ক্লায়েন্ট একাউন্ট স্থগিত করুন"
                                  >
                                    Suspend
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteClient(client._id)}
                                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 cursor-pointer"
                                  title="অ্যাকাউন্ট ডিলিট করুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* TAB 4: CONSULTATIONS & SERVICE ORDERS */}
        {activeTab === 'consultations' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl font-bold text-white">অর্ডার ও কনসালটেশন রিকোয়েস্ট</h2>
                </div>
                <p className="text-xs text-zinc-400">
                  ক্লায়েন্টদের সাবমিট করা সার্ভিস অর্ডার ও ফ্রি কনসালটেশন রিকোয়েস্টসমূহ পর্যালোচনা ও স্ট্যাটাস আপডেট করুন।
                </p>
              </div>

              <button
                onClick={refreshConsultations}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>রিফ্রেশ করুন</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">মোট রিকোয়েস্ট</span>
                  <span className="text-2xl font-black text-white">{consultations.length} টি</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">নতুন / অপেক্ষমাণ</span>
                  <span className="text-2xl font-black text-amber-400">
                    {consultations.filter((c) => c.status === 'pending').length} টি
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">কমপ্লিট / ইন-প্রগ্রেস</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {consultations.filter((c) => c.status === 'completed' || c.status === 'in_progress').length} টি
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Consultations Table */}
            <div className="bg-zinc-950 rounded-3xl border border-zinc-850 overflow-hidden">
              <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>সকল অর্ডার ও কনসালটেশন তালিকা ({consultations.length})</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/60 text-zinc-400 font-semibold border-b border-zinc-850 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">ক্লায়েন্ট ও কোম্পানি</th>
                      <th className="p-4">যোগাযোগ (ইমেইল / ফোন)</th>
                      <th className="p-4">সার্ভিস</th>
                      <th className="p-4">মেসেজ / রিকোয়ারমেন্টস</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {consultations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 text-xs">
                          কোনো অর্ডার বা কনসালটেশন রিকোয়েস্ট পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      consultations.map((c) => (
                        <tr key={c._id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-white block">{c.clientName}</span>
                              <span className="text-[11px] text-zinc-400">{c.companyName}</span>
                            </div>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <span className="font-mono text-zinc-300 block">{c.email}</span>
                            {c.phone && <span className="font-mono text-zinc-500 text-[11px] block">{c.phone}</span>}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 inline-block">
                              {c.serviceTitle}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-zinc-400 truncate" title={c.notes}>
                              {c.notes || 'কোনো মেসেজ নেই'}
                            </p>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">বাজেট: {c.budget}</span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                c.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : c.status === 'in_progress'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : c.status === 'contacted'
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateConsultationStatus(c._id, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* TAB 5: FOUNDER & CEO PROFILE MANAGER */}
        {activeTab === 'founder' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Award className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
                    Executive Leadership Section
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">ফাউন্ডার ও সিইও প্রোফাইল এডিটর</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  হোমপেজের হিরো স্লাইডারের ঠিক পরবর্তী লিডারশিপ সেকশনের নাম, ছবি, বক্তব্য ও স্ট্যাটাস এখান থেকে লাইভ পরিবর্তন করুন।
                </p>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>হোমপেজে লাইভ দেখুন</span>
              </a>
            </div>

            {founderSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{founderSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveFounder} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 cols: Edit Form */}
                <div className="lg:col-span-7 bg-zinc-950 p-6 rounded-3xl border border-zinc-850 space-y-4">
                  <div className="text-sm font-bold text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>ব্যক্তিগত ও পদবী সংক্রান্ত তথ্য</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">নাম (Founder Name) *</label>
                      <input
                        type="text"
                        required
                        value={founderProfile.founderName || ''}
                        onChange={(e) => setFounderProfile({ ...founderProfile, founderName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">পদবী (Designation / Role) *</label>
                      <input
                        type="text"
                        required
                        value={founderProfile.founderRole || ''}
                        onChange={(e) => setFounderProfile({ ...founderProfile, founderRole: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">অভিজ্ঞতা (Experience) *</label>
                      <input
                        type="text"
                        value={founderProfile.experienceYears || ''}
                        onChange={(e) => setFounderProfile({ ...founderProfile, experienceYears: e.target.value })}
                        placeholder="e.g. ৭+ বছর"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">টপ ব্যাজ (Badge Tag)</label>
                      <input
                        type="text"
                        value={founderProfile.badge || ''}
                        onChange={(e) => setFounderProfile({ ...founderProfile, badge: e.target.value })}
                        placeholder="LEADERSHIP & VISION"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ছবির লিঙ্ক (Image URL) *</label>
                    <input
                      type="url"
                      required
                      value={founderProfile.founderImage || ''}
                      onChange={(e) => setFounderProfile({ ...founderProfile, founderImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">উক্তি / শর্ট মেসেজ (Quote / Vision Message) *</label>
                    <textarea
                      required
                      rows={3}
                      value={founderProfile.founderQuote || ''}
                      onChange={(e) => setFounderProfile({ ...founderProfile, founderQuote: e.target.value })}
                      placeholder="আমাদের মূল লক্ষ্য..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">বিস্তারিত বার্তা (Full Bio / Leadership Story)</label>
                    <textarea
                      rows={3}
                      value={founderProfile.founderBio || ''}
                      onChange={(e) => setFounderProfile({ ...founderProfile, founderBio: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-zinc-900">
                    <span className="text-xs font-semibold text-zinc-300 block mb-2">যোগাযোগ ও সোশ্যাল মিডিয়া লিঙ্কস</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={founderProfile.socials?.linkedin || ''}
                        onChange={(e) =>
                          setFounderProfile({
                            ...founderProfile,
                            socials: { ...founderProfile.socials, linkedin: e.target.value },
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <input
                        type="url"
                        placeholder="Facebook Profile URL"
                        value={founderProfile.socials?.facebook || ''}
                        onChange={(e) =>
                          setFounderProfile({
                            ...founderProfile,
                            socials: { ...founderProfile.socials, facebook: e.target.value },
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={founderProfile.socials?.email || ''}
                        onChange={(e) =>
                          setFounderProfile({
                            ...founderProfile,
                            socials: { ...founderProfile.socials, email: e.target.value },
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Key Stats & Live Preview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Stats Editor */}
                  <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-850 space-y-4">
                    <div className="text-sm font-bold text-white border-b border-zinc-900 pb-3 flex items-center justify-between">
                      <span>হাইলাইট পরিসংখ্যান (Key Stats)</span>
                      <span className="text-xs text-zinc-500 font-mono">৪ টি মেট্রিক</span>
                    </div>

                    <div className="space-y-3">
                      {(founderProfile.stats || []).map((stat, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                          <div>
                            <label className="block text-[10px] text-zinc-500 mb-1">লেবেল #{idx + 1}</label>
                            <input
                              type="text"
                              value={stat.label || ''}
                              onChange={(e) => {
                                const newStats = [...founderProfile.stats];
                                newStats[idx] = { ...newStats[idx], label: e.target.value };
                                setFounderProfile({ ...founderProfile, stats: newStats });
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 mb-1">ভ্যালু / সংখ্যা</label>
                            <input
                              type="text"
                              value={stat.value || ''}
                              onChange={(e) => {
                                const newStats = [...founderProfile.stats];
                                newStats[idx] = { ...newStats[idx], value: e.target.value };
                                setFounderProfile({ ...founderProfile, stats: newStats });
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Visual Preview Card */}
                  <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      লাইভ প্রিভিউ (Live Card Preview)
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-700 overflow-hidden shrink-0 relative">
                        {founderProfile.founderImage ? (
                          <Image
                            src={founderProfile.founderImage}
                            alt={founderProfile.founderName || 'Founder'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{founderProfile.founderName || 'Founder Name'}</div>
                        <div className="text-xs text-emerald-400 truncate">{founderProfile.founderRole || 'Role'}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{founderProfile.experienceYears || 'অভিজ্ঞতা'}</div>
                      </div>
                    </div>

                    {founderProfile.founderQuote && (
                      <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 text-xs italic text-zinc-300">
                        &ldquo;{founderProfile.founderQuote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingFounder}
                  className="px-8 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {savingFounder ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ফাউন্ডার তথ্য সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        )}

        {/* TAB 6: AGENCY CONTACT & SITE SETTINGS */}
        {activeTab === 'settings' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Settings className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
                    Global Agency Configuration
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">সাইট ও যোগাযোগ সেটিংস</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  প্ল্যাটফর্মের অফিসিয়াল হটলাইন ফোন নম্বর, হোয়াটসঅ্যাপ নম্বর, সাপোর্ট ইমেইল এবং অফিসের ঠিকানা এখান থেকে লাইভ আপডেট করুন।
                </p>
              </div>

              <a
                href="/services/web-development"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>সার্ভিস পেজে লাইভ দেখুন</span>
              </a>
            </div>

            {/* Super Admin Login Credentials Quick Card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 p-6 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">
                      Super Admin Security
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Active Account
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">সুপার অ্যাডমিন লগইন ক্রেডেনশিয়ালস</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1.5 font-mono">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentUser?.email || 'admin@databaj.com'}</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">রোল: Super Admin</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">নাম: {currentUser?.name || 'Habib'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAdminEditName(currentUser?.name || '');
                  setAdminEditEmail(currentUser?.email || '');
                  setAdminNewPassword('');
                  setAdminConfirmPassword('');
                  setAdminSecurityMsg(null);
                  setAdminSecurityModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <KeyRound className="w-4 h-4" />
                <span>জিমেইল ও পাসওয়ার্ড পরিবর্তন করুন</span>
              </button>
            </div>

            {settingsSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settingsSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Inputs */}
                <div className="lg:col-span-7 bg-zinc-950 p-6 rounded-3xl border border-zinc-850 space-y-5">
                  <div className="text-sm font-bold text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>হটলাইন ও মেসেজিং কনফিগারেশন</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        হটলাইন ফোন নম্বর (Hotline Phone) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={siteSettings.phone || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        সার্ভিস ডিটেইলস পেজের কল বাটনে শো করবে
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        হোয়াটসঅ্যাপ নম্বর (WhatsApp Chat Number) *
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={siteSettings.whatsapp || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-500/80 mt-1 block">
                        সার্ভিস পেজের হোয়াটসঅ্যাপ বাটনে ডিরেক্ট চ্যাট ওপেন করবে
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      অফিসিয়াল ইমেইল এড্রেস (Official Support Email) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={siteSettings.email || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        placeholder="contact@databaj.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      অফিস ঠিকানা (Agency Physical Address) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <textarea
                        required
                        rows={2}
                        value={siteSettings.address || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                        placeholder="হাউজ #৪২, রোড #১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      অফিস সময় / সাপোর্ট সময় (Working Hours)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.workingHours || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, workingHours: e.target.value })}
                      placeholder="সকাল ৯:০০ - রাত ১০:০০ (শনি - বৃহঃ)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-zinc-900">
                    <span className="text-xs font-semibold text-zinc-300 block mb-2">সোশ্যাল মিডিয়া পেজ লিঙ্কস</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="url"
                        placeholder="Facebook Page URL"
                        value={siteSettings.facebookUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn Page URL"
                        value={siteSettings.linkedinUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, linkedinUrl: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Live Preview Widget */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-850 space-y-4">
                    <div className="text-sm font-bold text-white border-b border-zinc-900 pb-3 flex items-center justify-between">
                      <span>লাইভ সার্ভিস কার্ড প্রিভিউ</span>
                      <span className="text-xs text-emerald-400 font-mono">Real-time</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <span className="text-[11px] text-zinc-400 font-medium block">
                        সার্ভিস ডিটেইলস পেজের সাইডবার কার্ডে যেভাবে দেখাবে:
                      </span>

                      {/* Hotline Button Preview */}
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                        <div className="text-[10px] text-zinc-400 font-medium">জরুরি আলোচনার জন্য হটলাইন:</div>
                        <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                          {siteSettings.phone || '+880 1700-000000'}
                        </div>
                      </div>

                      {/* WhatsApp Button Preview */}
                      <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-center">
                        <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {siteSettings.whatsapp || siteSettings.phone || '+880 1700-000000'}
                        </div>
                      </div>

                      {/* Address & Email info */}
                      <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-xs">
                        <div className="flex items-start gap-2 text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px]">{siteSettings.address || 'বনানী, ঢাকা'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[11px] font-mono">{siteSettings.email || 'contact@databaj.com'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {savingSettings ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সেটিংস পরিবর্তন সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        )}

        {/* TAB 7: CLIENT SUPPORT TICKETS INBOX */}
        {activeTab === 'tickets' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-850">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <LifeBuoy className="w-5 h-5 text-blue-400" />
                  <span>ক্লায়েন্ট সাপোর্ট টিকিট ও মেসেজিং ইনবক্স</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {adminTickets.length} টিকেট
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  ক্লায়েন্টদের উত্থাপিত যেকোনো কারিগরি সমস্যা, অ্যাড ক্যাম্পেইন ও ট্র্যাকিং ইস্যুর দ্রুত সমাধান ও রিপ্লাই দিন।
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <select
                  value={adminTicketStatusFilter}
                  onChange={(e) => setAdminTicketStatusFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">সকল টিকিট ({adminTickets.length})</option>
                  <option value="open">ওপেন / নতুন ({adminTickets.filter((t) => t.status === 'open').length})</option>
                  <option value="in_progress">চলমান (In Progress)</option>
                  <option value="resolved">সমাধানকৃত (Resolved)</option>
                </select>

                <button
                  onClick={refreshAdminTickets}
                  disabled={loadingAdminTickets}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="রিফ্রেশ"
                >
                  <Sparkles className={`w-4 h-4 ${loadingAdminTickets ? 'animate-spin text-blue-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content: List + Active Thread View */}
            {adminTickets.length === 0 ? (
              <div className="p-16 bg-zinc-950 border border-zinc-850 rounded-3xl text-center space-y-3">
                <LifeBuoy className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">কোনো সাপোর্ট টিকিট নেই</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  ক্লায়েন্টরা যখন তাদের ড্যাশবোর্ড থেকে সাপোর্ট টিকিট পাঠাবেন, সেগুলো এখানে লাইভ জমা হবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Ticket List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-mono uppercase font-bold text-zinc-500 px-1">
                    টিকিট তালিকা ({adminTickets.filter((t) => adminTicketStatusFilter === 'all' || t.status === adminTicketStatusFilter).length})
                  </div>
                  <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                    {adminTickets
                      .filter((t) => adminTicketStatusFilter === 'all' || t.status === adminTicketStatusFilter)
                      .map((t) => {
                        const isSelected = selectedAdminTicket?._id === t._id;
                        return (
                          <div
                            key={t._id}
                            onClick={() => setSelectedAdminTicket(t)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                              isSelected
                                ? 'bg-zinc-900 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                : 'bg-zinc-950/80 border-zinc-855 hover:border-zinc-700 hover:bg-zinc-900/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
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
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-white truncate">{t.subject}</h4>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                <span className="font-medium truncate">{t.companyName || 'Unknown Client'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                              <span className="font-mono uppercase">{t.category}</span>
                              <span>{new Date(t.updatedAt).toLocaleDateString('bn-BD')}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right Thread View */}
                <div className="lg:col-span-7">
                  {selectedAdminTicket ? (
                    <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 space-y-6 flex flex-col justify-between h-full">
                      {/* Thread Header */}
                      <div className="space-y-3 border-b border-zinc-850 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                {selectedAdminTicket.ticketId}
                              </span>
                              <span className="text-xs text-zinc-400 font-medium">
                                কোম্পানি: <strong className="text-white">{selectedAdminTicket.companyName}</strong>
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{selectedAdminTicket.subject}</h3>
                          </div>

                          {/* Quick Status Updater */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 font-medium">স্ট্যাটাস:</span>
                            <select
                              value={selectedAdminTicket.status}
                              onChange={(e) => handleUpdateTicketStatus(selectedAdminTicket._id, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="open">Open (অপেক্ষমাণ)</option>
                              <option value="in_progress">In Progress (চলমান)</option>
                              <option value="resolved">Resolved (সমাধানকৃত)</option>
                              <option value="closed">Closed (বন্ধ)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                        {selectedAdminTicket.messages?.map((msg, idx) => {
                          const isStaff = msg.senderRole === 'super_admin';
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                            >
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1 px-1 font-mono">
                                <span className="font-bold text-zinc-300">
                                  {isStaff ? 'DataBaj Support (You)' : msg.senderName}
                                </span>
                                <span>•</span>
                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div
                                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                                  isStaff
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-zinc-100 rounded-br-sm'
                                    : 'bg-blue-600/20 border-blue-500/30 text-zinc-100 rounded-bl-sm'
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          );
                        })}

                        {/* Live Typing Indicator from Client */}
                        {selectedAdminTicket.clientTypingUntil && new Date(selectedAdminTicket.clientTypingUntil) > new Date() && (
                          <div className="flex items-center gap-2.5 text-xs text-blue-400 font-mono py-2 px-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit animate-pulse">
                            <span className="flex gap-1 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            <span className="font-medium">{selectedAdminTicket.companyName || 'ক্লায়েন্ট'} টাইপ করছেন...</span>
                          </div>
                        )}

                        <div ref={adminMessagesEndRef} />
                      </div>

                      {/* Admin Reply Form */}
                      <form onSubmit={handleAdminReplyTicket} className="pt-4 border-t border-zinc-850 space-y-3">
                        <textarea
                          rows={3}
                          value={adminTicketReply}
                          onChange={(e) => handleAdminTyping(e.target.value)}
                          placeholder="ক্লায়েন্টের জন্য অফিসিয়াল উত্তর বা সমাধানের নির্দেশিকা লিখুন..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={sendingAdminReply || !adminTicketReply.trim()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                          >
                            {sendingAdminReply ? (
                              <span>পাঠানো হচ্ছে...</span>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>অফিসিয়াল রিপ্লাই পাঠান</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] flex items-center justify-center bg-zinc-950 border border-zinc-850 rounded-3xl p-8 text-center text-zinc-500 text-xs">
                      বাম পাশের তালিকা থেকে যেকোনো টিকিটে ক্লিক করে ক্লায়েন্টের সাথে কথোপকথন ও উত্তর দিন
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        )}

        {/* TAB 8: CLIENT CREDENTIALS VAULT */}
        {activeTab === 'credentials' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-850">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <span>ক্লায়েন্ট ক্রেডেনশিয়ালস ও এক্সেস ভল্ট</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {adminCredentials.length} লগইন এক্সেস
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  ক্লায়েন্টদের শেয়ার করা ফেসবুক বিএম, গুগল অ্যাডস, শপিফাই/ওয়ার্ডপ্রেস অ্যাডমিন ও সার্ভার লগইন তথ্য
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <input
                  type="text"
                  value={adminCredSearch}
                  onChange={(e) => setAdminCredSearch(e.target.value)}
                  placeholder="অ্যাকাউন্ট বা কোম্পানি খুঁজুন..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
                />

                {/* Platform filter */}
                <select
                  value={adminCredPlatformFilter}
                  onChange={(e) => setAdminCredPlatformFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">সকল প্ল্যাটফর্ম</option>
                  <option value="facebook_bm">Facebook / Meta BM</option>
                  <option value="google_ads">Google Ads / GA4</option>
                  <option value="website_admin">Website Admin (Shopify/WP)</option>
                  <option value="cpanel_hosting">cPanel / Server Hosting</option>
                  <option value="gtm_analytics">GTM / Cloud CAPI</option>
                  <option value="other">অন্যান্য (Other)</option>
                </select>

                <button
                  onClick={refreshAdminCredentials}
                  disabled={loadingAdminCredentials}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="রিফ্রেশ"
                >
                  <Sparkles className={`w-4 h-4 ${loadingAdminCredentials ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              </div>
            </div>

            {adminCredentials.length === 0 ? (
              <div className="p-16 bg-zinc-950 border border-zinc-850 rounded-3xl text-center space-y-3">
                <KeyRound className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">কোনো ক্রেডেনশিয়াল পাওয়া যায়নি</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  ক্লায়েন্টরা যখন তাদের ড্যাশবোর্ড থেকে লগইন তথ্য শেয়ার করবেন, সেগুলো এখানে পাওয়া যাবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {adminCredentials
                  .filter((c) => {
                    const matchPlatform = adminCredPlatformFilter === 'all' || c.platform === adminCredPlatformFilter;
                    const matchSearch =
                      !adminCredSearch ||
                      c.title?.toLowerCase().includes(adminCredSearch.toLowerCase()) ||
                      c.companyName?.toLowerCase().includes(adminCredSearch.toLowerCase()) ||
                      c.username?.toLowerCase().includes(adminCredSearch.toLowerCase()) ||
                      c.accountUrl?.toLowerCase().includes(adminCredSearch.toLowerCase());
                    return matchPlatform && matchSearch;
                  })
                  .map((cred) => {
                    const isPasswordShown = !!showAdminPasswordMap[cred._id];
                    return (
                      <div
                        key={cred._id}
                        className="bg-zinc-950 border border-zinc-850 hover:border-zinc-750 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition shadow-md"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20 uppercase font-mono">
                              {cred.platform}
                            </span>
                            <span className="text-xs font-bold text-white truncate flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                              <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="truncate max-w-[130px]">{cred.companyName || 'Client'}</span>
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white">{cred.title}</h3>
                            {cred.accountUrl && (
                              <a
                                href={cred.accountUrl.startsWith('http') ? cred.accountUrl : `https://${cred.accountUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5 font-mono"
                              >
                                <span className="truncate max-w-[200px]">{cred.accountUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            )}
                          </div>

                          {/* Username with 1-click copy */}
                          <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                              ইউজারনেম / ইমেইল / ID:
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono text-zinc-200 truncate font-semibold">
                                {cred.username}
                              </span>
                              <button
                                onClick={() => copyAdminCred(cred.username, `admin-user-${cred._id}`)}
                                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                                title="কপি করুন"
                              >
                                {copiedAdminCredKey === `admin-user-${cred._id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Password with 1-click copy & Show/Hide */}
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
                                    setShowAdminPasswordMap((prev) => ({
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
                                  onClick={() => copyAdminCred(cred.password, `admin-pass-${cred._id}`)}
                                  className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                                  title="কপি করুন"
                                >
                                  {copiedAdminCredKey === `admin-pass-${cred._id}` ? (
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

                        <div className="flex items-center justify-between text-[10px] text-zinc-600 border-t border-zinc-900 pt-2">
                          <span>যোগ করা হয়েছে: {new Date(cred.createdAt).toLocaleDateString('bn-BD')}</span>
                          <button
                            onClick={() => handleDeleteAdminCredential(cred._id)}
                            className="text-zinc-600 hover:text-rose-400 transition cursor-pointer p-1"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </main>
        )}

        {/* TAB 9: TASK FROM CLIENT */}
        {activeTab === 'tasks' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Action & Stats Header */}
            <div className="bg-zinc-950 p-5 sm:p-6 rounded-3xl border border-zinc-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                    <ClipboardList className="w-6 h-6 text-teal-400" />
                    <span>Task from Client (ক্লায়েন্ট টাস্ক ও ওয়ার্কশিট)</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      {adminTasks.length} মোট টাস্ক
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    ক্লায়েন্টদের সাবমিট করা অ্যাড ক্যাম্পেইনের লিংক ট্র্যাকার ও ওয়েবসাইট ডেভেলপমেন্টের রিকোয়ারমেন্টস
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={refreshAdminTasks}
                    disabled={loadingAdminTasks}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="রিফ্রেশ"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingAdminTasks ? 'animate-spin text-teal-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Quick Stat Counter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-zinc-850">
                <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
                  <span className="text-[11px] text-zinc-400 block font-mono">Ads Campaign</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {adminTasks.filter((t) => t.taskType === 'ads').length}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
                  <span className="text-[11px] text-zinc-400 block font-mono">Web Development</span>
                  <span className="text-base font-bold text-teal-400 font-mono">
                    {adminTasks.filter((t) => t.taskType === 'web').length}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
                  <span className="text-[11px] text-zinc-400 block font-mono">Pending (অপেক্ষমাণ)</span>
                  <span className="text-base font-bold text-amber-400 font-mono">
                    {adminTasks.filter((t) => t.status === 'pending').length}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
                  <span className="text-[11px] text-zinc-400 block font-mono">In Review (চলমান)</span>
                  <span className="text-base font-bold text-blue-400 font-mono">
                    {adminTasks.filter((t) => t.status === 'in_review').length}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-zinc-400 block font-mono">Done (সম্পন্ন)</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {adminTasks.filter((t) => t.status === 'done').length}
                  </span>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Type Filter */}
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setAdminTaskTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      adminTaskTypeFilter === 'all'
                        ? 'bg-teal-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    সকল প্রকার
                  </button>
                  <button
                    onClick={() => setAdminTaskTypeFilter('ads')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      adminTaskTypeFilter === 'ads'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Ads Campaign
                  </button>
                  <button
                    onClick={() => setAdminTaskTypeFilter('web')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      adminTaskTypeFilter === 'web'
                        ? 'bg-teal-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Web Development
                  </button>
                </div>

                {/* Status Filter */}
                <select
                  value={adminTaskStatusFilter}
                  onChange={(e) => setAdminTaskStatusFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="pending">Pending (অপেক্ষমাণ)</option>
                  <option value="in_review">In Review (চলমান)</option>
                  <option value="done">Done (সম্পন্ন)</option>
                </select>

                {/* Client Company Filter */}
                <select
                  value={adminTaskClientFilter}
                  onChange={(e) => setAdminTaskClientFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 max-w-[200px]"
                >
                  <option value="all">সকল ক্লায়েন্ট কোম্পানি</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tasks Table / Content */}
            {adminTasks.filter((t) => {
              if (adminTaskTypeFilter !== 'all' && t.taskType !== adminTaskTypeFilter) return false;
              if (adminTaskStatusFilter !== 'all' && t.status !== adminTaskStatusFilter) return false;
              if (
                adminTaskClientFilter !== 'all' &&
                String(t.userId?._id || t.userId) !== adminTaskClientFilter
              )
                return false;
              return true;
            }).length === 0 ? (
              <div className="p-16 text-center bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
                <ClipboardList className="w-12 h-12 text-zinc-600 mx-auto opacity-40" />
                <h4 className="text-base font-bold text-white">কোনো ক্লায়েন্ট টাস্ক পাওয়া যায়নি</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  ক্লায়েন্টরা তাদের ড্যাশবোর্ড থেকে &quot;Task for Admin&quot; সাবমিট করলে এখানে রিয়েল-টাইমে প্রদর্শিত হবে।
                </p>
              </div>
            ) : (
              <div className="border border-zinc-800 rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[170px]">ক্লায়েন্ট কোম্পানি</th>
                        <th className="py-3 px-3.5 border-r border-zinc-850 w-24 text-center">টাইপ</th>
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[180px]">Web Link (ওয়েব লিংক)</th>
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[170px]">Post Link</th>
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[170px]">Variation Post</th>
                        <th className="py-3 px-3.5 border-r border-zinc-850 w-28 text-center">ভিডিও দৈর্ঘ্য</th>
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[200px] bg-teal-500/5">
                          স্ট্যাটাস কন্ট্রোল (Super Admin)
                        </th>
                        <th className="py-3 px-4 border-r border-zinc-850 min-w-[220px]">ক্লায়েন্ট কমেন্ট</th>
                        <th className="py-3 px-4 min-w-[200px]">অ্যাডমিন ফিডব্যাক নোট</th>
                        <th className="py-3 px-3 w-16 text-center text-zinc-500">একশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {adminTasks
                        .filter((t) => {
                          if (adminTaskTypeFilter !== 'all' && t.taskType !== adminTaskTypeFilter) return false;
                          if (adminTaskStatusFilter !== 'all' && t.status !== adminTaskStatusFilter) return false;
                          if (
                            adminTaskClientFilter !== 'all' &&
                            String(t.userId?._id || t.userId) !== adminTaskClientFilter
                          )
                            return false;
                          return true;
                        })
                        .map((task) => {
                          const company =
                            task.companyName ||
                            task.userId?.companyName ||
                            task.userId?.name ||
                            'ক্লায়েন্ট';
                          return (
                            <tr key={task._id} className="hover:bg-zinc-900/40 transition font-sans">
                              {/* Client Company Name */}
                              <td className="py-3.5 px-4 border-r border-zinc-850">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs shrink-0">
                                    {company.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="overflow-hidden">
                                    <span className="font-bold text-white text-xs block truncate max-w-[140px]">
                                      {company}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-mono block truncate max-w-[140px]">
                                      {task.userId?.email || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Task Type */}
                              <td className="py-3.5 px-3.5 border-r border-zinc-850 text-center font-mono">
                                {task.taskType === 'ads' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                    Ads
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] font-bold">
                                    Web
                                  </span>
                                )}
                              </td>

                              {/* Web Link / Title */}
                              <td className="py-3.5 px-4 border-r border-zinc-850">
                                {task.title && (
                                  <div className="text-xs font-bold text-white mb-1">
                                    {task.title}
                                  </div>
                                )}
                                {task.webLink ? (
                                  <a
                                    href={task.webLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-xs hover:underline max-w-[180px] truncate"
                                    title={task.webLink}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{task.webLink}</span>
                                  </a>
                                ) : (
                                  <span className="text-zinc-600 italic">-</span>
                                )}
                              </td>

                              {/* Post Link */}
                              <td className="py-3.5 px-4 border-r border-zinc-850">
                                {task.postLink ? (
                                  <a
                                    href={task.postLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono text-xs hover:underline max-w-[160px] truncate"
                                    title={task.postLink}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{task.postLink}</span>
                                  </a>
                                ) : (
                                  <span className="text-zinc-600 italic">-</span>
                                )}
                              </td>

                              {/* Variation Post Link */}
                              <td className="py-3.5 px-4 border-r border-zinc-850">
                                {task.variationPostLink ? (
                                  <a
                                    href={task.variationPostLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-mono text-xs hover:underline max-w-[160px] truncate"
                                    title={task.variationPostLink}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{task.variationPostLink}</span>
                                  </a>
                                ) : (
                                  <span className="text-zinc-600 italic">-</span>
                                )}
                              </td>

                              {/* Video Duration */}
                              <td className="py-3.5 px-3.5 border-r border-zinc-850 text-center font-mono text-zinc-300 text-xs">
                                {task.videoDuration || '-'}
                              </td>

                              {/* Status Control (1-Click Super Admin Status Switcher) */}
                              <td className="py-3.5 px-4 border-r border-zinc-850 bg-teal-500/5">
                                <div className="space-y-1">
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                    disabled={updatingTaskId === task._id}
                                    className={`w-full text-xs font-bold font-mono rounded-xl px-2.5 py-1.5 border transition cursor-pointer focus:outline-none ${
                                      task.status === 'pending'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                        : task.status === 'in_review'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    }`}
                                  >
                                    <option value="pending" className="bg-zinc-900 text-amber-400">
                                      ⏳ Pending (অপেক্ষমাণ)
                                    </option>
                                    <option value="in_review" className="bg-zinc-900 text-blue-400">
                                      🔄 In Review (চলমান)
                                    </option>
                                    <option value="done" className="bg-zinc-900 text-emerald-400">
                                      ✅ Done (সম্পন্ন)
                                    </option>
                                  </select>
                                  <span className="text-[9px] text-zinc-500 block font-mono">
                                    {updatingTaskId === task._id ? 'আপডেট হচ্ছে...' : 'সরাসরি স্ট্যাটাস পরিবর্তন'}
                                  </span>
                                </div>
                              </td>

                              {/* Comment */}
                              <td className="py-3.5 px-4 border-r border-zinc-850 text-xs text-zinc-300">
                                {task.comment || task.description ? (
                                  <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80 leading-relaxed text-zinc-200 whitespace-pre-line max-w-[240px]">
                                    {task.comment || task.description}
                                  </div>
                                ) : (
                                  <span className="text-zinc-600 italic">-</span>
                                )}
                              </td>

                              {/* Admin Feedback */}
                              <td className="py-3.5 px-4 text-xs">
                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    placeholder="নোট লিখুন..."
                                    defaultValue={task.adminFeedback || ''}
                                    onChange={(e) =>
                                      setAdminFeedbackInputs((prev) => ({
                                        ...prev,
                                        [task._id]: e.target.value,
                                      }))
                                    }
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-teal-500"
                                  />
                                  <button
                                    onClick={() => handleSaveTaskFeedback(task._id)}
                                    className="text-[10px] text-teal-400 hover:text-teal-300 font-semibold cursor-pointer underline"
                                  >
                                    নোট সেভ করুন
                                  </button>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteAdminTask(task._id)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                  title="টাস্ক মুছুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        )}

        {/* TAB 10: CLIENT DASHBOARD AD BANNER & PROMO MANAGER */}
        {activeTab === 'client-ad' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full animate-fadeIn">
            {/* Header row with Status & 1-Click Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-850 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <Megaphone className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-pink-400">
                    Client Dashboard Promotional Banner
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">ক্লায়েন্ট ড্যাশবোর্ড বিজ্ঞাপন ও অফার ব্যানার</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  সমস্ত ক্লায়েন্টের ড্যাশবোর্ডের শুরুতে আই-ক্যাচিং অ্যাড শো হবে। এখান থেকে ইমেজ, অফার পয়েন্ট, লিঙ্ক ও অন/অফ নিয়ন্ত্রণ করুন।
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* 1-Click Live On/Off Switch */}
                <button
                  type="button"
                  onClick={handleToggleClientAd}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
                    clientAd.isActive
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                      : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${clientAd.isActive ? 'bg-black animate-ping' : 'bg-zinc-500'}`} />
                  <span>{clientAd.isActive ? 'বিজ্ঞাপন লাইভ চালু আছে (Active)' : 'বিজ্ঞাপন বন্ধ আছে (Turn On)'}</span>
                </button>
              </div>
            </div>

            {/* Notification alert message */}
            {clientAdSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{clientAdSuccessMsg}</span>
              </div>
            )}

            {/* 2-Column Grid: Left Edit Form + Right Live Preview & Interested Clients */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Cols 1-7): Ad Edit Form */}
              <div className="lg:col-span-7 bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-850 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-emerald-400" />
                    বিজ্ঞাপনের কন্টেন্ট এডিট করুন
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Super Admin CMS</span>
                </div>

                <form onSubmit={handleSaveClientAd} className="space-y-4">
                  {/* Badge Text */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      ট্যাগ / ব্যাজ (Badge Text)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🔥 স্পেশাল অফার ও নতুন সার্ভিস"
                      value={clientAd.badge || ''}
                      onChange={(e) => setClientAd({ ...clientAd, badge: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Banner Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      ব্যানার ইমেজ লিঙ্ক (Image URL) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/... বা আপনার ইমেজ লিঙ্ক"
                      value={clientAd.imageUrl || ''}
                      onChange={(e) => setClientAd({ ...clientAd, imageUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      ছবিটি ক্লায়েন্টের কাছে বড় ও হাইলাইট হয়ে প্রদর্শিত হবে।
                    </p>
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      মূল হেডলাইন (Headline) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. আপনার বিজনেসের জন্য মেটা কনভার্সন এপিআই (CAPI) ট্র্যাকিং!"
                      value={clientAd.headline || ''}
                      onChange={(e) => setClientAd({ ...clientAd, headline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  {/* Sub-headline */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      সাব-হেডলাইন / বিস্তারিত বিবরণ (Sub-headline)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="সংক্ষিপ্ত বিবরণ যা হেডলাইনের নিচে থাকবে..."
                      value={clientAd.subHeadline || ''}
                      onChange={(e) => setClientAd({ ...clientAd, subHeadline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Offer Points (Row by row) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      অফার পয়েন্টসমূহ (প্রতি লাইনে ১টি করে লিখুন, রো আকারে দেখাবে)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="১০০% ইভেন্ট ম্যাচ কোয়ালিটি গ্যারান্টি&#10;ক্লাউড সার্ভার ও স্ট্যাগিং সেটআপ&#10;ফ্রি ৭ দিনের লাইভ মনিটরিং&#10;২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট"
                      value={offerPointsInput}
                      onChange={(e) => setOfferPointsInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      প্রতিটি নতুন লাইনের পয়েন্ট ক্লায়েন্টের ড্যাশবোর্ডে সারিবদ্ধভাবে (Row) টিকচিহ্ন সহ প্রদর্শিত হবে।
                    </p>
                  </div>

                  {/* Order Button Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        অর্ডার বোতামের লেখা (Button Text)
                      </label>
                      <input
                        type="text"
                        value={clientAd.orderBtnText || ''}
                        onChange={(e) => setClientAd({ ...clientAd, orderBtnText: e.target.value })}
                        placeholder="অর্ডার করতে ক্লিক করুন"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        ক্লিকেবল লিঙ্ক (Order Link / URL)
                      </label>
                      <input
                        type="text"
                        value={clientAd.orderBtnLink || ''}
                        onChange={(e) => setClientAd({ ...clientAd, orderBtnLink: e.target.value })}
                        placeholder="/#services বা https://..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={savingClientAd}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {savingClientAd ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>বিজ্ঞাপন সংরক্ষণ ও লাইভ আপডেট করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column (Cols 8-12): Live Preview & Interested Clients Tracker */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Live Client Preview Card */}
                <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-850 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      লাইভ প্রিভিউ (ক্লায়েন্ট যেভাবে দেখবে)
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${clientAd.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {clientAd.isActive ? '● Live Visible' : '○ Disabled'}
                    </span>
                  </div>

                  {/* Preview Box */}
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 space-y-3">
                    {/* Image Preview */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-zinc-800">
                      {clientAd.imageUrl ? (
                        <Image
                          src={clientAd.imageUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                          কোনো ছবি লিঙ্ক দেওয়া হয়নি
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-bold uppercase">
                        {clientAd.badge || 'অফার'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {clientAd.headline || 'বিজ্ঞাপনের হেডলাইন'}
                      </h4>
                      {clientAd.subHeadline && (
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                          {clientAd.subHeadline}
                        </p>
                      )}
                    </div>

                    {/* Offer points preview */}
                    <div className="space-y-1.5 pt-1 border-t border-zinc-800">
                      {offerPointsInput
                        .split('\n')
                        .slice(0, 3)
                        .filter(Boolean)
                        .map((pt, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{pt}</span>
                          </div>
                        ))}
                    </div>

                    {/* Preview Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-[10px]">
                        {clientAd.orderBtnText || 'অর্ডার করুন'}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-[10px] flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" />
                        আগ্রহী
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Interested Clients Realtime Tracker */}
                <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-850 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                        <span>আগ্রহী ক্লায়েন্টদের তালিকা (Interested Clients)</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        যেসব ক্লায়েন্ট "I am Interested" বোতামে ক্লিক করেছেন
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono text-xs font-bold">
                      {clientAd.interests?.length || 0} জন
                    </span>
                  </div>

                  {/* List of interested clients */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {!clientAd.interests || clientAd.interests.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-900">
                        এখনো কোনো ক্লায়েন্ট আগ্রহ প্রকাশ করেননি। নতুন বিজ্ঞাপনটি চালু হলে ক্লায়েন্টরা ক্লিক করবেন।
                      </div>
                    ) : (
                      clientAd.interests.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-850 hover:border-pink-500/30 transition flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 truncate">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white truncate">{item.clientName || 'ক্লায়েন্ট'}</span>
                              <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                {item.companyName || 'কোম্পানি'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                              {item.phone && <span>📞 {item.phone}</span>}
                              {item.email && <span className="truncate">✉️ {item.email}</span>}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono block">
                              🕒 {new Date(item.clickedAt).toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>

                          {/* Quick Action (WhatsApp / Call) */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.phone && (
                              <a
                                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                                title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Service Create/Edit Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setServiceModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingService ? 'সার্ভিস এডিট করুন' : 'নতুন এজেন্সি সার্ভিস যুক্ত করুন'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              এখানে দেওয়া তথ্যগুলো পাবলিক হোমপেজের সার্ভিস সেকশনে প্রদর্শিত হবে।
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  সার্ভিস শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Development & SaaS"
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. হাই-স্পিড Next.js ও React দিয়ে কাস্টম ওয়েব অ্যাপ্লিকেশন।"
                  value={svcShortDesc}
                  onChange={(e) => setSvcShortDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    আইকন (Icon Name)
                  </label>
                  <select
                    value={svcIcon}
                    onChange={(e) => setSvcIcon(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Code">Code (Web Dev)</option>
                    <option value="TrendingUp">TrendingUp (Marketing)</option>
                    <option value="Activity">Activity (Tracking/CAPI)</option>
                    <option value="BarChart3">BarChart3 (Analytics)</option>
                    <option value="ShieldCheck">ShieldCheck (Security)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">ব্যাজ (Badge Tag)</label>
                  <input
                    type="text"
                    placeholder="e.g. High Performance"
                    value={svcBadge}
                    onChange={(e) => setSvcBadge(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ফিচারসমূহ (Features - প্রতি লাইনে একটি করে)
                </label>
                <textarea
                  rows={3}
                  placeholder="Next.js 16 & React 19 Architecture&#10;Sub-second load speed&#10;Custom E-commerce solutions"
                  value={svcFeatures}
                  onChange={(e) => setSvcFeatures(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="text-xs font-medium text-zinc-300">
                  হোমপেজে লাইভ প্রদর্শিত হবে (Active)
                </label>
                <input
                  type="checkbox"
                  checked={svcIsActive}
                  onChange={(e) => setSvcIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {svcMsg && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    svcMsg.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {svcMsg.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={svcSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {svcSaving ? 'সংরক্ষণ হচ্ছে...' : 'সার্ভিস সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Super Admin Security Modal (Change Gmail & Password) */}
      {adminSecurityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">অ্যাডমিন সিকিউরিটি সেটিংস</h3>
                  <p className="text-[11px] text-zinc-400">লগইন জিমেইল ও পাসওয়ার্ড পরিবর্তন করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminSecurityModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Message */}
            {adminSecurityMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
                  adminSecurityMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {adminSecurityMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <X className="w-4 h-4 shrink-0" />
                )}
                <span>{adminSecurityMsg.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveAdminSecurity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  অ্যাডমিনের নাম (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={adminEditName}
                  onChange={(e) => setAdminEditName(e.target.value)}
                  placeholder="Super Admin Name"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  সুপার অ্যাডমিন জিমেইল / ইমেইল (Login Gmail) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEditEmail}
                    onChange={(e) => setAdminEditEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  ভবিষ্যতে এই জিমেইল দিয়ে অ্যাডমিন প্যানেলে লগইন করতে হবে।
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2 font-mono">
                  পাসওয়ার্ড পরিবর্তন (Password Update)
                </span>
                <p className="text-[11px] text-zinc-400 mb-3">
                  পাসওয়ার্ড পরিবর্তন করতে না চাইলে এই ঘরগুলো ফাঁকা রাখুন।
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      নতুন পাসওয়ার্ড (New Password)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={adminNewPassword}
                        onChange={(e) => setAdminNewPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                        minLength={6}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      কনফার্ম নতুন পাসওয়ার্ড (Confirm Password)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={adminConfirmPassword}
                        onChange={(e) => setAdminConfirmPassword(e.target.value)}
                        placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                        minLength={6}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setAdminSecurityModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="submit"
                  disabled={savingAdminSecurity}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {savingAdminSecurity ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>আপডেট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Audit Modal */}
      <AuditFormModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onAuditSaved={() => {
          refreshCampaigns(selectedClientId);
          refreshClients();
        }}
        clients={clients}
        isSuperAdmin={true}
        currentClientId={selectedClientId}
      />

      {/* Client Profile, Device & IP View Details Modal */}
      {viewClientModal && (
        <ClientDetailsModal
          isOpen={!!viewClientModal}
          client={viewClientModal}
          onClose={() => setViewClientModal(null)}
          onApprove={(id) => {
            handleApproveClient(id);
            setViewClientModal((prev) => (prev ? { ...prev, status: 'active', isVerified: true } : null));
          }}
          onSuspend={(id) => {
            handleSuspendClient(id);
            setViewClientModal((prev) => (prev ? { ...prev, status: 'suspended', isVerified: false } : null));
          }}
          onDelete={(id) => {
            handleDeleteClient(id);
            setViewClientModal(null);
          }}
        />
      )}

      {/* Client Notice Control Modal */}
      {noticeModalClient && (
        <ClientNoticeModal
          isOpen={!!noticeModalClient}
          client={noticeModalClient}
          onClose={() => setNoticeModalClient(null)}
          onNoticeUpdated={() => {
            refreshClients();
          }}
        />
      )}

      {/* Client Credentials Vault Modal */}
      {credentialModalClient && (
        <ClientCredentialModal
          isOpen={!!credentialModalClient}
          client={credentialModalClient}
          onClose={() => {
            setCredentialModalClient(null);
            refreshAdminCredentials();
          }}
        />
      )}
    </div>
  );
}
