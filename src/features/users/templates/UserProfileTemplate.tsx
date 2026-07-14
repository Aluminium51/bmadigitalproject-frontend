// src/features/users/templates/UserProfileTemplate.tsx
"use client";

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
  Loader2,
  type LucideIcon
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "../hooks/useUserProfile"; // นำเข้า Custom Hook

// ==========================================
// Sub-Components
// ==========================================

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
  isVerified?: boolean;
}

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
// Main Component
// ==========================================

// สมมติว่า Template นี้รับ userId มาจาก Page Component (ซึ่งได้จาก Context หรือ Token)
export function UserProfileTemplate({ currentUserId }: { currentUserId: string }) {
  // ดึงข้อมูลจริงจาก Backend ผ่าน React Query
  const { data, isLoading, isError } = useUserProfile(currentUserId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-medium">กำลังโหลดข้อมูลโปรไฟล์...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <ShieldCheck className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">ไม่พบข้อมูลโปรไฟล์</h2>
        <p className="text-muted-foreground">กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ</p>
      </div>
    );
  }

  // จัดรูปแบบข้อมูลให้แสดงผลง่ายขึ้น
  const displayDivision = data.division
    ? `${data.division.divisionName} (${data.division.departmentName})`
    : "-";

  // แปลง roles Array Object ให้เป็น Array ข้อความเพื่อการแสดงผล
  const displayRoles = data.roles?.map(r => r.roleName) || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">โปรไฟล์ส่วนตัว</h1>
          <p className="text-muted-foreground mt-1">ข้อมูลบัญชีและการตั้งค่าความปลอดภัยของระบบ</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1.5">
                <History className="w-3.5 h-3.5" /> อัปเดตล่าสุด: {data.updatedAt ? new Date(data.updatedAt).toLocaleString('th-TH') : '-'}
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
                {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold">{data.firstName} {data.lastName}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 mb-4">{data.position || "-"}</p>

            {/* Badges Stack */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant={data.isActive ? "default" : "destructive"} className="rounded-md">
                {data.isActive ? "Active" : "Inactive"}
              </Badge>
              {displayRoles.map((role) => (
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
                    <InfoRow icon={PhoneCall} label="เบอร์ภายใน" value={data.internalExtension} />
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-6">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <Building2 className="w-4 h-4" /> ข้อมูลสังกัด
                </h3>
                <div className="space-y-1">
                    <InfoRow icon={Building2} label="ฝ่าย/กอง (Division)" value={displayDivision} />
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
                    value={data.createdAt ? new Date(data.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    }) : "-"}
                />
                <InfoRow icon={ShieldCheck} label="ระดับการเข้าถึง" value={displayRoles.join(", ")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
