"use client";

import React from "react";
import { useForm, FormProvider, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Save,
  X
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// 1. โครงสร้าง Schema สำหรับตรวจสอบความถูกต้องของข้อมูล
const editProfileSchema = z.object({
  user_inf_nm: z.string().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร"),
  user_inf_srnm: z.string().min(2, "กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร"),
  user_inf_pst_nm: z.string().min(2, "กรุณากรอกตำแหน่ง"),
  user_inf_dep_cod: z.string().min(2, "กรุณากรอกรหัสหน่วยงาน"),
  user_inf_div_cod: z.string().min(2, "กรุณากรอกรหัสส่วนราชการ"),
  user_inf_mobile_no: z.string().min(9, "กรุณากรอกเบอร์โทรศัพท์มือถือให้ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  user_inf_ofc_tel_no: z.string().min(9, "กรุณากรอกเบอร์โทรศัพท์หน่วยงาน"),
  user_inf_ofc_tel_int_no: z.string().min(4, "กรุณากรอกเบอร์ภายใน 4 หลัก"),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

// 2. ข้อมูลผู้ใช้งานตั้งต้นระบบจำลอง
const initialUserData = {
  id: 1001,
  username: "somchai.p",
  email: "somchai.p@bangkok.go.th",
  permission: "AD",
  status: 10,
  created_at: "2024-01-15T08:30:00Z",
  user_inf_nm: "สมชาย",
  user_inf_srnm: "พัฒนาเมือง",
  user_inf_pst_nm: "นักวิชาการคอมพิวเตอร์ชำนาญการ",
  user_inf_dep_cod: "DEP001",
  user_inf_div_cod: "DIV005",
  user_inf_ofc_tel_no: "02-222-3333",
  user_inf_ofc_tel_int_no: "4567",
  user_inf_mobile_no: "081-999-8888",
};

interface FormInputRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  name: keyof EditProfileValues;
  type?: string;
  placeholder?: string;
}

// ส่วนประกอบฟอร์มอินพุตย่อยแยกภายนอกลดการเรนเดอร์ซ้ำ
const FormInputRow = ({ 
  icon: Icon, 
  label, 
  name, 
  type = "text",
  placeholder = ""
}: FormInputRowProps) => {
  // ดึงข้อมูลฟอร์มจากคลาสแม่ผ่าน Context
  const { register, formState: { errors } } = useFormContext<EditProfileValues>();
  
  return (
    <div className="flex items-start gap-4 p-2 rounded-lg transition-colors hover:bg-surface-container-low/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary mt-6">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium text-slate-gray mb-1.5">{label}</span>
        <Input 
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className="h-10 rounded-md border border-border bg-surface px-4 py-2 focus-visible:ring-primary-light focus-visible:border-primary-container outline-none font-medium"
        />
        {errors[name] && (
          <p className="mt-1 text-xs font-medium text-status-orange">
            {errors[name]?.message}
          </p>
        )}
      </div>
    </div>
  );
};

interface ReadOnlyRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

// ส่วนประกอบแสดงข้อมูลแบบอ่านอย่างเดียว
const ReadOnlyRow = ({ icon: Icon, label, value }: ReadOnlyRowProps) => (
  <div className="flex items-start gap-4 p-2 rounded-lg bg-surface-container-low/40 opacity-75">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-gray/10 text-slate-gray mt-1">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-gray">{label}</span>
      <span className="text-base font-semibold text-foreground mt-1">{value || "-"}</span>
    </div>
  </div>
);

export default function EditUserProfile() {
  const methods = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      user_inf_nm: initialUserData.user_inf_nm,
      user_inf_srnm: initialUserData.user_inf_srnm,
      user_inf_pst_nm: initialUserData.user_inf_pst_nm,
      user_inf_dep_cod: initialUserData.user_inf_dep_cod,
      user_inf_div_cod: initialUserData.user_inf_div_cod,
      user_inf_mobile_no: initialUserData.user_inf_mobile_no,
      email: initialUserData.email,
      user_inf_ofc_tel_no: initialUserData.user_inf_ofc_tel_no,
      user_inf_ofc_tel_int_no: initialUserData.user_inf_ofc_tel_int_no,
    },
    mode: "onChange",
  });

  const { handleSubmit, control, formState: { isDirty } } = methods;

  // ติดตามค่าฟอร์มด้วย useWatch เพื่อรองรับมาตรฐานของ React Compiler
  const watchedName = useWatch({ control, name: "user_inf_nm" });
  const watchedSurname = useWatch({ control, name: "user_inf_srnm" });
  const watchedPosition = useWatch({ control, name: "user_inf_pst_nm" });

  // ส่งคำขอไปยังเซิร์ฟเวอร์เพื่อบันทึกข้อมูล
  const onSubmit = async (data: EditProfileValues) => {
    console.log("🚀 ส่งข้อมูลการแก้ไขไปที่ API:", data);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ส่วนหัวแสดงชื่อหน้าจอ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">แก้ไขข้อมูลส่วนตัว</h1>
        <p className="text-slate-gray mt-1">ปรับปรุงรายละเอียดประวัติ ข้อมูลการทำงาน และช่องทางการติดต่อของคุณให้เป็นปัจจุบัน</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* คอลัมน์ซ้าย: แสดงข้อมูลโปรไฟล์และปุ่มจัดการ */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col items-center p-8 rounded-4xl bg-card border border-border shadow-level-1 text-center sticky top-6">
              <div className="relative group mb-6">
                <Avatar className="w-32 h-32 border-4 border-surface shadow-sm">
                  <AvatarImage src="" alt={watchedName} />
                  <AvatarFallback className="text-4xl font-bold bg-primary-container text-surface">
                    {watchedName?.charAt(0)}{watchedSurname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs text-white font-medium">เปลี่ยนรูปภาพ</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-1 break-all px-2">
                {watchedName} {watchedSurname}
              </h2>
              <p className="text-sm font-medium text-slate-gray mb-4 flex items-center justify-center gap-1.5 px-2 break-all">
                <Briefcase className="w-4 h-4 shrink-0" />
                {watchedPosition}
              </p>
              
              <div className="mb-8">
                <Badge className="bg-primary/10 text-primary border-none px-3 py-1 text-sm font-medium">
                  Active User
                </Badge>
              </div>

              <Separator className="w-full mb-6 opacity-50" />

              <div className="w-full flex flex-col gap-3">
                <Button 
                  type="submit" 
                  variant="default" 
                  disabled={!isDirty} 
                  className="w-full rounded-full h-11 text-base gap-2"
                >
                  <Save className="w-5 h-5" />
                  บันทึกข้อมูล
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => methods.reset()} 
                  className="w-full rounded-full h-11 text-base gap-2"
                >
                  <X className="w-5 h-5" />
                  ยกเลิก
                </Button>
              </div>
            </div>
          </div>

          {/* คอลัมน์ขวา: ฟอร์มแก้ไขข้อมูลหลัก */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="p-8 rounded-4xl bg-card border border-border shadow-level-1">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                ข้อมูลสังกัดและการติดต่อ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormInputRow icon={User} label="ชื่อ (First Name)" name="user_inf_nm" />
                <FormInputRow icon={User} label="นามสกุล (Last Name)" name="user_inf_srnm" />
                <FormInputRow icon={Briefcase} label="ตำแหน่งงาน (Position)" name="user_inf_pst_nm" />
                <FormInputRow icon={Mail} label="อีเมลติดต่อ (e-Mail)" name="email" type="email" />
                <FormInputRow icon={Building2} label="รหัสหน่วยงาน (Department Code)" name="user_inf_dep_cod" />
                <FormInputRow icon={Building2} label="รหัสส่วนราชการ (Division Code)" name="user_inf_div_cod" />
                <FormInputRow icon={Smartphone} label="โทรศัพท์มือถือ" name="user_inf_mobile_no" type="tel" />
                <FormInputRow icon={Phone} label="โทรศัพท์สำนักงาน" name="user_inf_ofc_tel_no" type="tel" />
                <FormInputRow icon={PhoneCall} label="เบอร์โทรภายใน (4 หลัก)" name="user_inf_ofc_tel_int_no" type="number" />
              </div>
            </div>

            <div className="p-8 rounded-4xl bg-card border border-border shadow-level-1">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                ข้อมูลบัญชีผู้ใช้ระบบ (Account)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <ReadOnlyRow icon={User} label="ชื่อผู้ใช้งาน (Username)" value={initialUserData.username} />
                <ReadOnlyRow icon={Fingerprint} label="รหัสพนักงานระบบ (ID)" value={`USR-${initialUserData.id}`} />
                <ReadOnlyRow icon={ShieldCheck} label="ระดับสิทธิ์ผู้ใช้งาน" value={initialUserData.permission === 'AD' ? 'Administrator' : initialUserData.permission} />
                <ReadOnlyRow 
                  icon={CalendarDays} 
                  label="วันที่สร้างบัญชีระบบ" 
                  value={new Date(initialUserData.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })} 
                />
              </div>
            </div>

          </div>
        </form>
      </FormProvider>
    </div>
  );
}