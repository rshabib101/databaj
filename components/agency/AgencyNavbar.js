'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AgencyNavbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-2xl group-hover:scale-105 transition-transform">
            DB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                DataBaj
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                IT Agency
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              Web Development • Marketing • Tracking
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/#services" className="hover:text-emerald-400 transition-colors">
            সার্ভিসেস (Services)
          </Link>
          <Link href="/#auditor" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            মেটা অ্যাডস অডিটর
          </Link>
          <Link href="/#why-us" className="hover:text-emerald-400 transition-colors">
            কেন আমরা?
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
            title={theme === 'dark' ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
          </button>

          {currentUser ? (
            <Link
              href={currentUser.role === 'super_admin' ? '/admin' : '/dashboard'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {currentUser.role === 'super_admin' ? 'সুপার অ্যাডমিন প্যানেল' : 'ক্লায়েন্ট ড্যাশবোর্ড'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800"
              >
                লগইন (Login)
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20"
              >
                <span>অ্যাকাউন্ট খুলুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger + theme toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <Link
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-1.5"
          >
            সার্ভিসেস
          </Link>
          <Link
            href="/#auditor"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-1.5"
          >
            মেটা অ্যাডস অডিটর
          </Link>
          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={currentUser.role === 'super_admin' ? '/admin' : '/dashboard'}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-emerald-500 text-black"
              >
                {currentUser.role === 'super_admin' ? 'সুপার অ্যাডমিন প্যানেল' : 'ক্লায়েন্ট ড্যাশবোর্ড'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-zinc-900 text-zinc-200 border border-zinc-800"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-emerald-500 text-black"
                >
                  অ্যাকাউন্ট খুলুন
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
