// src/features/users/components/UserTable.tsx
import { MoreVertical, ShieldAlert, User, Shield } from "lucide-react";
import { UserItem, UserRole, UserStatus } from "../data/mock-users";

export function UserTable({ data }: { data: UserItem[] }) {
  
  // Helper functions สร้าง Badge เล็กๆ ไว้ในไฟล์นี้เลย
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "Admin": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 flex items-center gap-1 w-fit"><ShieldAlert className="w-3 h-3"/> แอดมิน</span>;
      case "Manager": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><Shield className="w-3 h-3"/> ผู้บริหาร</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1 w-fit"><User className="w-3 h-3"/> ผู้ใช้ทั่วไป</span>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    if (status === "Active") return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-[#00734b] bg-[#00734b]/10">ใช้งานปกติ</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-red-600 bg-red-50">ระงับการใช้งาน</span>;
  };

  if (data.length === 0) {
    return <div className="p-16 text-center text-muted-foreground font-medium">ไม่พบรายชื่อผู้ใช้งานที่ค้นหา</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white sticky top-0 text-slate-400 font-bold z-10 border-b border-[#ededf4] text-[13px] uppercase tracking-wide">
          <tr>
            <th className="px-6 sm:px-10 py-4 w-[30%]">ชื่อ - นามสกุล</th>
            <th className="px-6 sm:px-10 py-4">ข้อมูลติดต่อ</th>
            <th className="px-6 sm:px-10 py-4">หน่วยงานสังกัด</th>
            <th className="px-6 sm:px-10 py-4">สิทธิ์ / สถานะ</th>
            <th className="px-6 sm:px-10 py-4 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ededf4]">
          {data.map((user) => (
            <tr key={user.id} className="hover:bg-surface-variant/40 transition-colors group">
              {/* ชื่อและตำแหน่ง */}
              <td className="px-6 sm:px-10 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#191c20]">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{user.position}</p>
                  </div>
                </div>
              </td>
              
              {/* ข้อมูลติดต่อ */}
              <td className="px-6 sm:px-10 py-5">
                <p className="font-medium text-[#191c20]">{user.username}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{user.email}</p>
              </td>

              {/* หน่วยงาน */}
              <td className="px-6 sm:px-10 py-5 text-[#3f4942] font-semibold">
                {user.division}
              </td>

              {/* สิทธิ์และสถานะ */}
              <td className="px-6 sm:px-10 py-5">
                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </td>

              {/* ปุ่มจัดการ */}
              <td className="px-6 sm:px-10 py-5 text-right">
                <button className="p-2 rounded-full text-slate-400 hover:text-[#191c20] hover:bg-slate-200 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}