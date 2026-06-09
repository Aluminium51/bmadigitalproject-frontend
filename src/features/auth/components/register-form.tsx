"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AuthShell } from "./auth-shell";

const registerSchema = z
  .object({
    username: z.string().min(3, "กรุณากรอกชื่อผู้ใช้อย่างน้อย 3 ตัวอักษร"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(8, "กรุณายืนยันรหัสผ่าน"),
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    position: z.string().min(1, "กรุณากรอกตำแหน่ง"),
    department: z.string().min(1, "กรุณากรอกหน่วยงาน"),
    division: z.string().min(1, "กรุณากรอกส่วนราชการ"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    mobilePhone: z.string().min(6, "กรุณากรอกเบอร์มือถือให้ถูกต้อง"),
    officePhone: z.string().min(6, "กรุณากรอกเบอร์สำนักงานให้ถูกต้อง"),
    internalExtension: z.string().min(1, "กรุณากรอกเบอร์ภายใน"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

type RegisterFieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

function RegisterField({ label, error, className, children }: RegisterFieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-base font-medium text-foreground">{label}</Label>
      {children}
      {error ? <p className="text-sm font-medium text-status-orange animate-in fade-in-50 duration-200">{error}</p> : null}
    </div>
  );
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      position: "",
      department: "",
      division: "",
      email: "",
      mobilePhone: "",
      officePhone: "",
      internalExtension: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterValues) => {
    console.log("Register submit:", values);
  };

  return (
    <AuthShell
      title="สร้างบัญชีผู้ใช้งานใหม่ (Register)"
      description="กรอกข้อมูลผู้ใช้งานและข้อมูลติดต่อเพื่อสร้างบัญชีใหม่ในระบบ"
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* ============================================================== */}
        {/* --- Section 1: ข้อมูลบัญชี (Account Information) --- */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">ข้อมูลบัญชี (Account Information)</h2>
            <p className="text-base text-muted-foreground">ข้อมูลสำหรับเข้าสู่ระบบ</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <RegisterField label="ชื่อผู้ใช้ (Username)" error={errors.username?.message} className="md:col-span-2">
              <Input
                id="username"
                autoComplete="username"
                placeholder="กรอกชื่อผู้ใช้"
                {...register("username")}
                error={!!errors.username}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="รหัสผ่าน (Password)" error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  {...register("password")}
                  error={!!errors.password}
                  className="h-12 rounded-full border bg-surface px-4 pr-12 text-foreground focus-visible:ring-primary-light text-base transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground size-9 flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="size-4 sm:size-5" /> : <EyeOff className="size-4 sm:size-5" />}
                </Button>
              </div>
            </RegisterField>

            <RegisterField label="ยืนยันรหัสผ่าน (Confirm Password)" error={errors.confirmPassword?.message}>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่านให้ตรงกัน"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  className="h-12 rounded-full border bg-surface px-4 pr-12 text-foreground focus-visible:ring-primary-light text-base transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground size-9 flex items-center justify-center"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <Eye className="size-4 sm:size-5" /> : <EyeOff className="size-4 sm:size-5" />}
                </Button>
              </div>
            </RegisterField>
          </div>
        </section>

        {/* ============================================================== */}
        {/* --- Section 2: ข้อมูลส่วนบุคคล (Personal Information) --- */}
        {/* ============================================================== */}
        <section className="space-y-4 border-t border-border pt-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">ข้อมูลส่วนบุคคล (Personal Information)</h2>
            <p className="text-base text-muted-foreground">ข้อมูลส่วนตัวของผู้ใช้งาน</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <RegisterField label="ชื่อจริง (First Name)" error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="ชื่อภาษาไทย"
                {...register("firstName")}
                error={!!errors.firstName}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="นามสกุล (Last Name)" error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="นามสกุลภาษาไทย"
                {...register("lastName")}
                error={!!errors.lastName}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="ตำแหน่ง (Position)" error={errors.position?.message} className="md:col-span-2">
              <Input
                id="position"
                autoComplete="organization-title"
                placeholder="ระบุตำแหน่งสายงานราชการ"
                {...register("position")}
                error={!!errors.position}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>
          </div>
        </section>

        {/* ============================================================== */}
        {/* --- Section 3: ข้อมูลหน่วยงานและช่องทางติดต่อ (Agency & Contact Information) --- */}
        {/* ============================================================== */}
        <section className="space-y-4 border-t border-border pt-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">ข้อมูลหน่วยงานและช่องทางติดต่อ (Agency & Contact Information)</h2>
            <p className="text-base text-muted-foreground">ข้อมูลต้นสังกัดและช่องทางการติดต่อสื่อสาร</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <RegisterField label="หน่วยงาน (Department)" error={errors.department?.message}>
              <Input
                id="department"
                placeholder="เช่น สำนักดิจิทัลกรุงเทพมหานคร"
                {...register("department")}
                error={!!errors.department}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="ส่วนราชการ (Division)" error={errors.division?.message}>
              <Input
                id="division"
                placeholder="เช่น กองยุทธศาสตร์ดิจิทัล"
                {...register("division")}
                error={!!errors.division}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="Email" error={errors.email?.message} className="md:col-span-2">
              <Input
                id="email"
                autoComplete="email"
                type="email"
                placeholder="name@bangkok.go.th"
                {...register("email")}
                error={!!errors.email}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="เบอร์โทรศัพท์มือถือ (Mobile Phone)" error={errors.mobilePhone?.message}>
              <Input
                id="mobilePhone"
                autoComplete="tel"
                type="tel"
                placeholder="08X-XXX-XXXX"
                {...register("mobilePhone")}
                error={!!errors.mobilePhone}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="เบอร์โทรศัพท์สำนักงาน (Office Phone)" error={errors.officePhone?.message}>
              <Input
                id="officePhone"
                type="tel"
                placeholder="02-XXX-XXXX"
                {...register("officePhone")}
                error={!!errors.officePhone} // แก้ไขเป็นตรวจสอบ errors.officePhone ตรงจุดนี้ตาม Schema
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="เบอร์ภายใน (Internal Extension)" error={errors.internalExtension?.message} className="md:col-span-2">
              <Input
                id="internalExtension"
                inputMode="numeric"
                placeholder="เช่น 1234"
                {...register("internalExtension")}
                error={!!errors.internalExtension}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>
          </div>
        </section>

        {/* --- ปุ่มส่งข้อมูลและลิงก์สลับหน้า --- */}
        <div className="space-y-4 border-t border-border pt-6">
          <Button type="submit" size="lg" className="h-12 w-full rounded-full border-none text-base font-medium shadow-sm active:scale-[0.99] transition-transform" disabled={isSubmitting}>
            ลงทะเบียน (Register)
          </Button>

          <div className="flex flex-row items-center gap-1 mx-auto justify-center pt-2">
            <p className="text-center text-base text-muted-foreground">
              มีบัญชีผู้ใช้งานอยู่แล้ว?
            </p>
            <Link href="/login">
              <p className="text-base font-semibold text-primary transition-colors hover:underline hover:text-primary/80 whitespace-nowrap">
                เข้าสู่ระบบ (Login)
              </p>
            </Link>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}