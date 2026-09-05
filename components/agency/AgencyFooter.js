import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function AgencyFooter() {
  const [settings, setSettings] = useState({
    phone: '+880 1700-000000',
    whatsapp: '+880 1700-000000',
    email: 'contact@databaj.com',
    address: 'হাউজ #৪২, রোড #১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);
  return (
    <footer className="bg-black border-t border-zinc-900 py-16 text-zinc-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center font-black text-white text-lg">
                DB
              </div>
              <span className="font-black text-lg text-white tracking-tight">DataBaj IT Agency</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              উচ্চ মানের ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট, ডাটা-ড্রিভেন মেটা ও গুগল অ্যাডস মার্কেটিং এবং ১০০% নিখুঁত সার্ভার-সাইড ই-কমার্স ট্র্যাকিং সলিউশন।
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">সার্ভিসেস</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#services" className="hover:text-emerald-400 transition-colors">
                  Web Development & SaaS
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-emerald-400 transition-colors">
                  Digital Marketing & Meta Ads
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-emerald-400 transition-colors">
                  Server-Side GTM & CAPI Tracking
                </Link>
              </li>
              <li>
                <Link href="/#auditor" className="hover:text-emerald-400 transition-colors">
                  Facebook Ads Performance Auditor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">অ্যাক্সেস পোর্টাল</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  ইউনিভার্সাল লগইন (Universal Login)
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">
                  নতুন অ্যাকাউন্ট রেজিস্ট্রেশন
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  ক্লায়েন্ট ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  সুপার অ্যাডমিন প্যানেল
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">যোগাযোগ</h4>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address || 'Dhaka, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition font-mono">
                  {settings.email || 'contact@databaj.com'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-emerald-400 transition font-mono">
                  {settings.phone || '+880 1700-000000'}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${(settings.whatsapp || settings.phone || '8801700000000').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] hover:underline font-mono"
                >
                  WhatsApp: {settings.whatsapp || settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} DataBaj IT Agency. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision & high-performance engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
