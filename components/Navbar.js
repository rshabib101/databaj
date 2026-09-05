'use client';

import { ShieldCheck, Building2, LogOut, Sparkles, UserCheck, CheckCircle, AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar({
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenNewAudit,
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
            DB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                DataBaj Ads Auditor
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Meta Ads AI Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              ফেসবুক অ্যাডস পারফরম্যান্স অ্যানালাইসিস ও ল্যাকিং আইডেন্টিফায়ার
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            title={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role & Verification Badge */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                {currentUser.role === 'super_admin' ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Super Admin ({currentUser.name?.split(' ')[0]})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">{currentUser.companyName}</span>
                    {currentUser.isVerified ? (
                      <span title="Verified Account" className="text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span title="Pending Verification" className="text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenNewAudit}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                নতুন অ্যাড অডিট
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                title="লগআউট করুন"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors border border-zinc-800 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <UserCheck className="w-4 h-4" />
              লগইন / রেজিস্টার
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
