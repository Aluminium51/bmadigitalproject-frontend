// src/features/users/templates/UserProfileTemplate.tsx
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
  Fingerprint,
  CheckCircle2,
  Clock,
  History,
  // 1. เพิ่ม Import Type LucideIcon สำหรับไอคอน
  type LucideIcon
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ==========================================
// 1. Type Definitions (ตาม Drizzle Schema)
// ==========================================

interface UserProfileData {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  divisionName: string;
  mobilePhone: string;
  officePhone: string;
  internalExtension: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

// 2. เพิ่ม Type สำหรับ InfoRow Props
interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
  isVerified?: boolean;
}

// ==========================================
// 2. Mock Data (จำลองข้อมูลที่ผ่านการ Join แล้ว)
// ==========================================

const mockUserData: UserProfileData = {
  userId: "018f-72e30011-9914-41a4-ab7f",
  username: "somchai.p",
  firstName: "สมชาย",
  lastName: "พัฒนาเมือง",
  email: "somchai.p@bangkok.go.th",
  position: "นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ",
  divisionName: "กองยุทธศาสตร์ดิจิทัล (สำนักดิจิทัล)",
  mobilePhone: "081-999-8888",
  officePhone: "02-222-3333",
  internalExtension: "4567",
  isActive: true,
  isVerified: true,
  lastLogin: "2024-07-03T10:15:00Z",
  createdAt: "2024-01-15T08:30:00Z",
  updatedAt: "2024-07-01T14:20:00Z",
  roles: ["ADMIN", "ANALYST"],
};

// ==========================================
// 3. Sub-Components
// ==========================================

// 3. เปลี่ยนจาก : any เป็น : InfoRowProps
const InfoRow = ({ icon: Icon, label, value, isVerified = false }: InfoRowProps) => (
  <div className="flex items-start gap-4 p-3 transition-all rounded-2xl hover:bg-muted/50">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-base font-semibold text-foreground">{value || "-"}</span>
        {isVerified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
      </div>
    </div>
  </div>
);

// ==========================================
// 4. Main Component
// ==========================================

export function UserProfileTemplate() {
  const data = mockUserData;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">โปรไฟล์ส่วนตัว</h1>
          <p className="text-muted-foreground mt-1">ข้อมูลบัญชีและการตั้งค่าความปลอดภัยของระบบ</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1.5">
                <History className="w-3.5 h-3.5" /> อัปเดตล่าสุด: {new Date(data.updatedAt).toLocaleString('th-TH')}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- Left Column: Identity Card --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-card border shadow-xl p-8 text-center">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent -z-10" />

            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-background shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {data.firstName.charAt(0)}{data.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold">{data.firstName} {data.lastName}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 mb-4">{data.position}</p>

            {/* Badges Stack */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant={data.isActive ? "default" : "destructive"} className="rounded-md">
                {data.isActive ? "Active" : "Inactive"}
              </Badge>
              {data.roles.map((role) => (
                <Badge key={role} variant="secondary" className="rounded-md font-mono text-[10px]">
                  {role}
                </Badge>
              ))}
            </div>

            <Separator className="mb-6" />

            <div className="grid gap-3">
              <Button className="w-full rounded-xl h-11">แก้ไขโปรไฟล์</Button>
              <Button variant="outline" className="w-full rounded-xl h-11">เปลี่ยนรหัสผ่าน</Button>
            </div>

            {/* Security Log */}
            <div className="mt-8 pt-6 border-t">
               <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 uppercase tracking-tighter">
                  <Clock className="w-3 h-3" /> เข้าสู่ระบบล่าสุด: {data.lastLogin ? new Date(data.lastLogin).toLocaleString('th-TH') : 'ไม่พบข้อมูล'}
               </p>
            </div>
          </div>
        </div>

        {/* --- Right Column: Details Group --- */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section: Contact & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-6">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <Mail className="w-4 h-4" /> ข้อมูลการติดต่อ
                </h3>
                <div className="space-y-1">
                    <InfoRow icon={Mail} label="อีเมลหน่วยงาน" value={data.email} isVerified={data.isVerified} />
                    <InfoRow icon={Smartphone} label="เบอร์โทรศัพท์มือถือ" value={data.mobilePhone} />
                    <InfoRow icon={Phone} label="โทรศัพท์สำนักงาน" value={data.officePhone} />
                    <InfoRow icon={PhoneCall} label="เบอร์ภายใน" value={`${data.internalExtension}`} />
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-6">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <Building2 className="w-4 h-4" /> ข้อมูลสังกัด
                </h3>
                <div className="space-y-1">
                    <InfoRow icon={Building2} label="ฝ่าย/กอง (Division)" value={data.divisionName} />
                    <InfoRow icon={Briefcase} label="ตำแหน่งงาน" value={data.position} />
                </div>
            </div>
          </div>

          {/* Section: Account Information */}
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 font-bold text-primary">
                <ShieldCheck className="w-4 h-4" /> ข้อมูลบัญชีผู้ใช้ระบบ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <InfoRow icon={User} label="ชื่อผู้ใช้งาน (Username)" value={data.username} />
                <InfoRow icon={Fingerprint} label="User UUID" value={data.userId} />
                <InfoRow
                    icon={CalendarDays}
                    label="วันที่ลงทะเบียน"
                    value={new Date(data.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                />
                <InfoRow icon={ShieldCheck} label="ระดับการเข้าถึง" value={data.roles.join(", ")} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
