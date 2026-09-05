'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Building2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function RegisteredCompaniesSlider() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.companies) {
          setCompanies(data.companies);
        }
      })
      .catch(console.error);
  }, []);

  if (!companies || companies.length === 0) return null;

  // Double the array for seamless infinite marquee loop
  const marqueeList = [...companies, ...companies];

  return (
    <section className="py-14 bg-zinc-950 border-y border-zinc-900 overflow-hidden relative">
      {/* Background gradient fade on left and right for elegant marquee effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DataBaj প্ল্যাটফর্মে নিবন্ধিত ও বিশ্বস্ত ব্র্যান্ডসমূহ</span>
        </div>
      </div>

      {/* Infinite Horizontal Carousel */}
      <div className="flex w-max space-x-6 animate-marquee hover:[animation-play-state:paused]">
        {marqueeList.map((company, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-emerald-500/40 hover:bg-zinc-850 transition duration-300 shadow-md group cursor-default"
          >
            {/* Logo / Company Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform overflow-hidden relative">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.companyName}
                  fill
                  className="object-cover"
                />
              ) : (
                company.companyName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Company Info */}
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {company.companyName}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>{company.industry || 'E-commerce'}</span>
                {company.growth && (
                  <span className="inline-flex items-center text-emerald-400 font-mono font-medium">
                    • {company.growth}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marquee animation style */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
