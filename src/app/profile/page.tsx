import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  CalendarDays,
  Smartphone,
  PhoneCall,
  Fingerprint
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// 1. Type Definition (ตาม Schema)
interface UserProfileData {
  id: number;
  username: string;
  email: string;
  permission: string;
  status: number;
  created_at: string;
  user_inf_nm: string;
  user_inf_srnm: string;
  user_inf_pst_nm: string;
  user_inf_dep_cod: string;
  user_inf_div_cod: string;
  user_inf_ofc_tel_no: string;
  user_inf_ofc_tel_int_no: string;
  user_inf_mobile_no: string;
}

// 2. Mock Data
const mockUserData: UserProfileData = {
  id: 1001,
  username: "somchai.p",
  email: "somchai.p@bangkok.go.th",
  permission: "AD", 
  status: 10, 
  created_at: "2024-01-15T08:30:00Z",
  user_inf_nm: "สมชาย",
  user_inf_srnm: "พัฒนาเมือง",
  user_inf_pst_nm: "ผู้ดูแลระบบ",
  user_inf_dep_cod: "26000000", // หน่วยงาน
  user_inf_div_cod: "26020000", // ส่วนราชการ
  user_inf_ofc_tel_no: "02-222-3333",
  user_inf_ofc_tel_int_no: "4567",
  user_inf_mobile_no: "081-999-8888",
};

export default function UserProfile() {
  const data = mockUserData;

  // ฟังก์ชันแปลง Status
  const getStatusBadge = (status: number) => {
    if (status === 10) return <Badge className="bg-primary/10 text-primary border-none px-3 py-1 text-sm font-medium">Active User</Badge>;
    if (status === 0) return <Badge variant="destructive" className="px-3 py-1 text-sm">Inactive</Badge>;
    return <Badge variant="secondary" className="px-3 py-1 text-sm">Unknown</Badge>;
  };

  // คอมโพเนนต์สำหรับแสดงข้อมูลแต่ละบรรทัด (Clean Style)
  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-4 p-2 transition-colors rounded-lg hover:bg-surface-container-low/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-gray">{label}</span>
        <span className="text-base font-semibold text-foreground mt-0.5">{value || "-"}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section: ชื่อหน้า */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">โปรไฟล์ส่วนตัว</h1>
        <p className="text-slate-gray mt-1">จัดการข้อมูลบัญชีและข้อมูลติดต่อของคุณ</p>
      </div>

      {/* Bento Box Layout: แบ่งเป็น 3 คอลัมน์ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- Left Column: Profile Card (ใช้พื้นที่ 4 ส่วน) --- */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col items-center p-8 rounded-4xl bg-card border border-border shadow-level-1 text-center">
            <Avatar className="w-32 h-32 mb-6 border-4 border-surface shadow-sm">
              <AvatarImage src="" alt={data.user_inf_nm} />
              <AvatarFallback className="text-4xl font-bold bg-primary-container text-surface">
                {data.user_inf_nm.charAt(0)}{data.user_inf_srnm.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {data.user_inf_nm} {data.user_inf_srnm}
            </h2>
            <p className="text-sm font-medium text-slate-gray mb-4 flex items-center justify-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {data.user_inf_pst_nm}
            </p>
            
            <div className="mb-8">
              {getStatusBadge(data.status)}
            </div>

            <Separator className="w-full mb-6 opacity-50" />

            <div className="w-full flex flex-col gap-3">
              <Button variant="default" className="w-full rounded-full h-11 text-base">
                แก้ไขข้อมูลส่วนตัว
              </Button>
              <Button variant="soft" className="w-full rounded-full h-11 text-base">
                เปลี่ยนรหัสผ่าน
              </Button>
            </div>
          </div>
        </div>

        {/* --- Right Column: Details (ใช้พื้นที่ 8 ส่วน) --- */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: ข้อมูลหน่วยงานและการติดต่อ */}
          <div className="p-8 rounded-4xl bg-card border border-border shadow-level-1">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              ข้อมูลสังกัดและการติดต่อ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoRow icon={Building2} label="รหัสหน่วยงาน (Department)" value={data.user_inf_dep_cod} />
              <InfoRow icon={Building2} label="รหัสส่วนราชการ (Division)" value={data.user_inf_div_cod} />
              <InfoRow icon={Smartphone} label="โทรศัพท์มือถือ" value={data.user_inf_mobile_no} />
              <InfoRow icon={Mail} label="อีเมล (e-Mail)" value={data.email} />
              <InfoRow icon={Phone} label="โทรศัพท์สำนักงาน" value={data.user_inf_ofc_tel_no} />
              <InfoRow icon={PhoneCall} label="เบอร์โทรภายใน" value={`ต่อ ${data.user_inf_ofc_tel_int_no}`} />
            </div>
          </div>

          {/* Section 2: ข้อมูลบัญชีผู้ใช้ระบบ */}
          <div className="p-8 rounded-4xl bg-card border border-border shadow-level-1">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              ข้อมูลบัญชีผู้ใช้ระบบ (Account)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoRow icon={User} label="ชื่อผู้ใช้งาน (Username)" value={data.username} />
              <InfoRow icon={Fingerprint} label="รหัสพนักงาน (ID)" value={`USR-${data.id}`} />
              <InfoRow icon={ShieldCheck} label="ระดับสิทธิ์ในระบบ" value={data.permission === 'AD' ? 'ผู้ดูแลระบบ' : data.permission} />
              <InfoRow 
                icon={CalendarDays} 
                label="วันที่สร้างบัญชี" 
                value={new Date(data.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}