'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  TrendingUp,
  Activity,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ConsultationModal from '@/components/agency/ConsultationModal';

const iconMap = {
  Code,
  TrendingUp,
  Activity,
  BarChart3,
  ShieldCheck,
};

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Fetch current user if logged in
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
  }, []);

  // Fetch services
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.services) {
          setServices(data.services);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenConsultation = (svc, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedService(svc);
    setIsConsultationOpen(true);
  };

  return (
    <section id="services" className="py-20 bg-zinc-950 border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic Agency Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            আমরা যেসকল সার্ভিস প্রদান করি
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            ওয়েব ডেভেলপমেন্ট থেকে শুরু করে ডিজিটাল মার্কেটিং ও সার্ভার-সাইড ট্র্যাকিং — আপনার ব্যবসার জন্য প্রয়োজনীয় সকল আধুনিক আইটি সলিউশন এক ছাতার নিচে। যেকোনো সার্ভিসের কার্ডে ক্লিক করে বিস্তারিত ও অর্ডার দেখুন:
          </p>
        </div>

        {/* Services Grid (All Cards Are 100% Fully Clickable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && services.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
              সার্ভিসগুলো লোড হচ্ছে...
            </div>
          ) : (
            services.map((svc) => {
              const IconComp = iconMap[svc.icon] || Code;

              return (
                <Link
                  key={svc._id || svc.slug}
                  href={`/services/${svc.slug}`}
                  className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl hover:shadow-emerald-500/10 relative overflow-hidden cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                        <IconComp className="w-6 h-6" />
                      </div>
                      {svc.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {svc.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                        <span>{svc.title}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                      </h3>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {svc.shortDescription}
                      </p>
                    </div>

                    {/* Features checklist */}
                    {svc.features && svc.features.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        {svc.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Area */}
                  <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                      <span>বিস্তারিত দেখুন</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleOpenConsultation(svc, e)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>অর্ডার / কনসালটেশন</span>
                    </button>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Direct Consultation / Order Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        service={selectedService}
        currentUser={currentUser}
      />
    </section>
  );
}
