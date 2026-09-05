'use client';

import { useState } from 'react';
import { Building, Users, ArrowRight, Activity, DollarSign, FileSpreadsheet, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SuperAdminBar({
  clients,
  selectedClientId,
  onSelectClient,
  totalCampaigns,
  totalSpend,
  onClientUpdated,
}) {
  const [verifying, setVerifying] = useState(false);
  const activeClient = clients?.find((c) => c._id === selectedClientId);

  const handleVerifyClient = async (clientId, currentStatus) => {
    setVerifying(true);
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
          isVerified: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success && onClientUpdated) {
        onClientUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border-b border-zinc-800 p-4 sm:p-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Super Admin Multi-Company Control
                </span>
                <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                  ক্লায়েন্ট কোম্পানি: {clients?.length || 0}টি
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                যেকোনো ক্লায়েন্ট কোম্পানিতে ক্লিক করে তাদের ডেটাবেস রিপোর্ট দেখুন ও ভেরিফাই করুন:
              </p>
            </div>
          </div>

          {/* Quick Aggregate Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">মোট স্পেন্ড:</span>
              <span className="text-white font-semibold">${totalSpend?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-zinc-400">অডিট রেকর্ড:</span>
              <span className="text-white font-semibold">{totalCampaigns || 0}</span>
            </div>
          </div>
        </div>

        {/* Company Quick-Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {/* Option: View All */}
          <button
            onClick={() => onSelectClient(null)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedClientId === null
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border-zinc-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            সকল কোম্পানি একসাথে (All Companies View)
          </button>

          {/* Client Pills */}
          {clients?.map((client) => {
            const isSelected = selectedClientId === client._id;
            return (
              <button
                key={client._id}
                onClick={() => onSelectClient(client._id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 border-zinc-800'
                }`}
              >
                <Building className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-emerald-400'}`} />
                <span>{client.companyName}</span>

                {/* Verification dot */}
                <span
                  title={client.isVerified ? 'Verified Account' : 'Pending Verification'}
                  className={`w-2 h-2 rounded-full ${client.isVerified ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}
                ></span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-black/20 text-black font-semibold'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {client.campaignCount} অডিট
                </span>
                {client.avgScore > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-black/20 text-black font-bold'
                        : client.avgScore >= 75
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    স্কোর: {client.avgScore}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notice of Active Selected Client with Verification Controls */}
        {activeClient && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-400">বর্তমানে ফিল্টারকৃত কোম্পানি:</span>
              <span className="font-black text-white text-sm">{activeClient.companyName}</span>
              <span className="text-zinc-400">({activeClient.name} • {activeClient.email})</span>

              {/* Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  activeClient.isVerified
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}
              >
                {activeClient.isVerified ? '✅ Verified Client' : '⏳ Pending Verification'}
              </span>

              {/* Verify / Unverify Toggle button */}
              <button
                onClick={() => handleVerifyClient(activeClient._id, activeClient.isVerified)}
                disabled={verifying}
                className="ml-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {verifying
                  ? 'আপডেট হচ্ছে...'
                  : activeClient.isVerified
                  ? 'আন-ভেরিফাই করুন'
                  : 'ক্লায়েন্ট ভেরিফাই করুন (Approve)'}
              </button>
            </div>

            <button
              onClick={() => onSelectClient(null)}
              className="text-xs text-emerald-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>সব কোম্পানি ভিউতে ফিরুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
