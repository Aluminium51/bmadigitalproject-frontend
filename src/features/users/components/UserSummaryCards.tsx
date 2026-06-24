// src/features/users/components/UserSummaryCards.tsx
import { Users, UserCheck, ShieldCheck } from "lucide-react";

interface UserSummaryCardsProps {
  stats: {
    total: number;
    active: number;
    admins: number;
  };
}

export function UserSummaryCards({ stats }: UserSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-5 rounded-2xl border border-[#D1CDC7] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">ผู้ใช้งานทั้งหมด</p>
          <p className="text-2xl font-black text-[#191c20]">{stats.total} <span className="text-sm font-medium text-slate-400">คน</span></p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#D1CDC7] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#00734b]/10 text-[#00734b] flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">ใช้งานปกติ (Active)</p>
          <p className="text-2xl font-black text-[#191c20]">{stats.active} <span className="text-sm font-medium text-slate-400">คน</span></p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#D1CDC7] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">ผู้ดูแลระบบ (Admin)</p>
          <p className="text-2xl font-black text-[#191c20]">{stats.admins} <span className="text-sm font-medium text-slate-400">คน</span></p>
        </div>
      </div>
    </div>
  );
}