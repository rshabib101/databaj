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
    <section className="py-16 bg-zinc-950/80 [html.light_&]:bg-slate-50/80 border-y border-zinc-900 [html.light_&]:border-slate-200 overflow-hidden relative">
      {/* Background gradient fade on left and right for seamless infinite marquee effect */}
      <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-44 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent [html.light_&]:from-slate-50 [html.light_&]:via-slate-50/80 z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-44 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent [html.light_&]:from-slate-50 [html.light_&]:via-slate-50/80 z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 [html.light_&]:bg-white border border-zinc-800 [html.light_&]:border-slate-200 text-zinc-400 [html.light_&]:text-slate-700 text-xs font-semibold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 [html.light_&]:text-emerald-600" />
          <span>DataBaj প্ল্যাটফর্মে নিবন্ধিত ও বিশ্বস্ত শীর্ষ ব্র্যান্ডসমূহ</span>
        </div>
      </div>

      {/* Infinite Horizontal Carousel */}
      <div className="flex w-max space-x-6 animate-marquee hover:[animation-play-state:paused]">
        {marqueeList.map((company, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-zinc-900/80 [html.light_&]:bg-white border border-zinc-800/90 [html.light_&]:border-slate-200 hover:border-emerald-500/50 [html.light_&]:hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 group cursor-default"
          >
            {/* Logo / Company Avatar */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 [html.light_&]:from-slate-100 [html.light_&]:to-slate-200 border border-zinc-700/80 [html.light_&]:border-slate-300 flex items-center justify-center text-emerald-400 [html.light_&]:text-emerald-700 font-black text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform overflow-hidden relative">
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
                <span className="text-sm font-bold text-white [html.light_&]:text-slate-900 group-hover:text-emerald-400 [html.light_&]:group-hover:text-emerald-600 transition-colors">
                  {company.companyName}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 [html.light_&]:text-emerald-600 shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 [html.light_&]:text-slate-600">
                <span>{company.industry || 'E-commerce'}</span>
                {company.growth && (
                  <span className="inline-flex items-center text-emerald-400 [html.light_&]:text-emerald-600 font-mono font-medium">
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
