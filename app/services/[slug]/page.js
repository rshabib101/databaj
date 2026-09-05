'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AgencyNavbar from '@/components/agency/AgencyNavbar';
import AgencyFooter from '@/components/agency/AgencyFooter';
import ConsultationModal from '@/components/agency/ConsultationModal';
import {
  Code,
  TrendingUp,
  Activity,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Check,
  ChevronRight,
  MessageSquare,
  Phone,
  Layers,
} from 'lucide-react';

const iconMap = {
  Code,
  TrendingUp,
  Activity,
  BarChart3,
  ShieldCheck,
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [settings, setSettings] = useState({
    phone: '+880 1700-000000',
    whatsapp: '+880 1700-000000',
  });

  // 1. Fetch current user & settings
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('databaj_token') : null;
    fetch('/api/auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setCurrentUser(data.user);
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  // 2. Fetch service details & other services
  useEffect(() => {
    if (!slug) return;

    fetch(`/api/services?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.service) {
          setService(data.service);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.services) {
          setAllServices(data.services);
        }
      })
      .catch(console.error);
  }, [slug]);

  const IconComp = iconMap[service?.icon] || Code;

  // Handle Order/Consultation click
  const handleOrderClick = () => {
    setIsConsultationOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <AgencyNavbar />
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
          সার্ভিস সংক্রান্ত তথ্য লোড হচ্ছে...
        </div>
        <AgencyFooter />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <AgencyNavbar />
        <div className="max-w-xl mx-auto py-24 text-center space-y-4 px-4">
          <h2 className="text-2xl font-bold">সার্ভিসটি পাওয়া যায়নি</h2>
          <p className="text-sm text-zinc-400">অনুরোধকৃত সার্ভিস পেজটি খুঁজে পাওয়া যায়নি বা এটি নিষ্ক্রিয় রয়েছে।</p>
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
          >
            <span>সকল সার্ভিস দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <AgencyFooter />
      </div>
    );
  }

  const otherServices = allServices.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      <AgencyNavbar />

      <main className="flex-1">
        {/* Breadcrumb & Top Bar */}
        <div className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                হোম
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <Link href="/#services" className="hover:text-emerald-400 transition-colors">
                সার্ভিসেস
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-zinc-200 font-semibold truncate">{service.title}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-20 border-b border-zinc-850 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
          <div className="absolute top-1/2 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <IconComp className="w-7 h-7" />
                </div>
                {service.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {service.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                {service.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleOrderClick}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>অর্ডার বা ফ্রি কনসালটেশন নিন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {currentUser ? (
                  <Link
                    href={currentUser.role === 'super_admin' ? '/admin' : '/dashboard'}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold text-sm transition-colors"
                  >
                    ক্লায়েন্ট ড্যাশবোর্ডে যান
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold text-sm transition-colors"
                  >
                    লগইন করুন
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Content & Sticky Order Sidebar */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Comprehensive Details */}
              <div className="lg:col-span-8 space-y-10">
                {/* Full Description */}
                <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-850 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>সার্ভিস ওভারভিউ ও স্কোপ</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">সার্ভিসটির বিস্তারিত বিবরণ</h2>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {service.fullDescription || service.shortDescription}
                  </p>
                </div>

                {/* Key Deliverables & Features */}
                {service.features && service.features.length > 0 && (
                  <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-850 space-y-6">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>কী কী ইনক্লুডেড রয়েছে</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      সার্ভিসের অন্তর্ভুক্ত প্রধান বৈশিষ্ট্য ও ডেলিভারেবলস
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs text-zinc-200 font-medium leading-relaxed">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Methodology & Process */}
                <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-850 space-y-6">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>আমাদের ডেলিভারি প্রসেস</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">আমরা যেভাবে কাজ পরিচালনা করি</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-850 space-y-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-xs flex items-center justify-center">
                        ০১
                      </span>
                      <h4 className="text-sm font-bold text-white">অডিট ও রিকোয়ারমেন্টস</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        আপনার বর্তমান প্রজেক্ট বা ক্যাম্পেইন বিশ্লেষণ ও লক্ষ্য নির্ধারণ।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-850 space-y-2">
                      <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 font-black text-xs flex items-center justify-center">
                        ০২
                      </span>
                      <h4 className="text-sm font-bold text-white">বাস্তবায়ন ও সেটআপ</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        সর্বাধুনিক টেকনোলজি ও স্ট্র্যাটেজি অনুযায়ী পারফেক্ট এক্সিকিউশন।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-850 space-y-2">
                      <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 font-black text-xs flex items-center justify-center">
                        ০৩
                      </span>
                      <h4 className="text-sm font-bold text-white">টেস্টিং ও লাইভ সাপোর্ট</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        ১০০% কোয়ালিটি চেক, পারফরম্যান্স ট্র্যাকিং ও ডেডিকেটেড ক্লায়েন্ট সাপোর্ট।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Action Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                        Direct Booking
                      </span>
                      {service.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      অনলাইন কনসালটেশন ও কাস্টম কোটেশন রিকোয়েস্ট করুন।
                    </p>
                  </div>

                  {currentUser && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>
                        লগইন অ্যাকাউন্ট: <strong>{currentUser.companyName}</strong>
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2 border-t border-zinc-900 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>ফ্রি ৩০ মিনিটের টেকনিক্যাল অডিট ও কনসালটেশন</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>কাস্টম প্রজেক্ট এস্টিমেশন ও রোডম্যাপ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>২৪/৭ ডেডিকেটেড ক্লায়েন্ট পোর্টাল এক্সেস</span>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderClick}
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>অর্ডার / কনসালটেশন বুক করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Dynamic Hotline Button */}
                  <a
                    href={`tel:${(settings.phone || '+880 1700-000000').replace(/[^0-9+]/g, '')}`}
                    className="block p-3.5 bg-zinc-900/80 hover:bg-zinc-850 rounded-2xl border border-zinc-800 text-center text-xs text-zinc-400 space-y-1 transition group"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-zinc-300 group-hover:text-white">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-medium">জরুরি আলোচনার জন্য হটলাইন:</span>
                    </div>
                    <p className="font-mono text-emerald-400 font-bold text-sm tracking-wide">
                      {settings.phone || '+880 1700-000000'}
                    </p>
                  </a>

                  {/* Dedicated WhatsApp Chat Button */}
                  <a
                    href={`https://wa.me/${(settings.whatsapp || settings.phone || '8801700000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `হ্যালো DataBaj টিম, আমি আপনার '${service?.title || 'সার্ভিস'}' সার্ভিসটি নিয়ে বিস্তারিত আলোচনা করতে চাই।`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                    <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Recommended Services */}
        {otherServices.length > 0 && (
          <section className="py-16 bg-zinc-950 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">অন্যান্য সংশ্লিষ্ট সার্ভিসেস</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    আপনার ব্যবসার সর্বোচ্চ গ্রোথের জন্য অন্যান্য সমাধানসমূহ দেখুন:
                  </p>
                </div>
                <Link
                  href="/#services"
                  className="text-xs text-emerald-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>সবগুলো দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherServices.slice(0, 3).map((item) => {
                  const SvcIcon = iconMap[item.icon] || Code;
                  return (
                    <Link
                      key={item.slug}
                      href={`/services/${item.slug}`}
                      className="p-6 rounded-3xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 hover:border-emerald-500/40 transition-all group cursor-pointer space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <SvcIcon className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <span>বিস্তারিত দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <AgencyFooter />

      {/* Consultation / Order Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        service={service}
        currentUser={currentUser}
      />
    </div>
  );
}
