"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { AuthShell } from "./auth-shell";
import { department_with_subdepartment } from "@/data/lookup";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { registerUserAction } from "@/app/actions/auth.actions";
import { RegisterValues, RegisterFieldProps, registerSchema } from "../type";


function RegisterField({ label, error, className, children }: RegisterFieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-base font-medium text-foreground">{label}</Label>
      {children}
      {error ? <p className="text-sm font-medium text-status-orange animate-in fade-in-50 duration-200">{error}</p> : null}
    </div>
  );
}

// ==============================================================
// Component ย่อยสำหรับ Combobox แบบใช้ซ้ำได้
// ==============================================================
interface FormComboboxProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

const FormCombobox = ({
  options,
  value,
  onChange,
  placeholder = "ค้นหาหรือเลือก...",
  error,
  className,
}: FormComboboxProps) => {
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option?.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Combobox
      value={value || null}
      onValueChange={(val) => onChange(val || "")}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxInput
        placeholder={placeholder}
        error={error}
        className={cn("w-full bg-surface", className)}
        showTrigger={true}
        showClear={!!value}
      />
      <ComboboxContent align="start" className="w-full p-0 shadow-level-2 border-border">
        <ComboboxList>
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              กรุณาเลือกข้อมูลก่อนหน้า
            </div>
          ) : (
            <>
              {filteredOptions.map((option, id) => (
                <ComboboxItem key={option} value={option}>
                  {option}
                </ComboboxItem>
              ))}
              {/* ถ้าไม่มีข้อมูลที่ตรงกับการค้นหา */}
              {filteredOptions.length === 0 && (
                <ComboboxEmpty>ไม่พบข้อมูลที่คุณค้นหา</ComboboxEmpty>
              )}
            </>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

// ==============================================================
// Component หลักของหน้าจอ
// ==============================================================
export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,   // นำ control มาใช้สำหรับ Combobox (Controller)
    watch,     // นำ watch มาใช้ตรวจสอบการเปลี่ยนค่า
    setValue,  // นำ setValue มาใช้เคลียร์ค่าเมื่อสังกัดหลักเปลี่ยน
    reset,
    setError,  // นำ setError มาใช้สำหรับแสดง error จาก Server
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

  // --- Logic สำหรับ Cascading Dropdown (กรองข้อมูลส่วนราชการตามหน่วยงาน) ---
  const selectedDepartment = watch("department");

  // 1. ดึงชื่อหน่วยงานทั้งหมด (ตัดค่าที่ซ้ำกันออก)
  const uniqueDepartments = Array.from(
    new Set(department_with_subdepartment.map((item) => item.department))
  ).filter(Boolean); // กรองค่า null/undefined ทิ้ง

  // 2. ดึงชื่อส่วนราชการ เฉพาะที่ตรงกับหน่วยงานที่เลือกด้านบน
  const availableDivisions = Array.from(
    new Set(
      department_with_subdepartment
        .filter((item) => item.department === selectedDepartment)
        .map((item) => item.subdepartment)
      )
    ).filter(Boolean);

  const onSubmit = async (values: RegisterValues) => {
    setStatusMessage(null); 
    const { confirmPassword, ...dataToSend } = values;

    const response = await registerUserAction(dataToSend);

    if (response.success) {
      setStatusMessage({ type: 'success', text: response.message + " ระบบกำลังพาท่านไปหน้าเข้าสู่ระบบ..." });
      reset(); 

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      // 🟢 2. เช็คว่ามี field ระบุมาไหมว่าช่องไหนผิด
      if (response.field) {
        // โยน Error กลับไปที่ Input ช่องนั้นๆ
        setError(response.field as keyof RegisterValues, {
          type: "server",
          message: response.message,
        });
      } else {
        // ถ้าเป็น Error ทั่วไป (ไม่มีระบุช่อง) ให้โชว์แถบแดงด้านบน
        setStatusMessage({ type: 'error', text: response.message });
      }
    }
  };

  return (
    <AuthShell
      title="สร้างบัญชีผู้ใช้งานใหม่ (Register)"
      description="กรอกข้อมูลผู้ใช้งานและข้อมูลติดต่อเพื่อสร้างบัญชีใหม่ในระบบ"
      maxWidth="max-w-5xl"
    >
      {/* Status Message */}
      {statusMessage && (
        <div className={`p-4 mb-6 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
          statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}
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
            <RegisterField label="ชื่อจริง" error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="ชื่อภาษาไทย (ไม่ต้องมีคำนำหน้า)"
                {...register("firstName")}
                error={!!errors.firstName}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="นามสกุล" error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="นามสกุลภาษาไทย"
                {...register("lastName")}
                error={!!errors.lastName}
                className="h-12 rounded-full border bg-surface px-4 text-foreground focus-visible:ring-primary-light text-base transition-all"
              />
            </RegisterField>

            <RegisterField label="ตำแหน่ง" error={errors.position?.message} className="md:col-span-2">
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
              <Controller
                control={control}
                name="department"
                render={({ field }) => (
                  <FormCombobox
                    options={uniqueDepartments}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("division", ""); // ล้างค่าส่วนราชการเมื่อเปลี่ยนหน่วยงาน
                    }}
                    placeholder="ค้นหาหรือเลือกหน่วยงาน..."
                    error={!!errors.department}
                    className="h-12 rounded-full px-1.5 text-base"
                  />
                )}
              />
            </RegisterField>

            <RegisterField label="ส่วนราชการ (Division)" error={errors.division?.message}>
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <FormCombobox
                    options={availableDivisions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      selectedDepartment 
                        ? "ค้นหาหรือเลือกส่วนราชการ..." 
                        : "กรุณาเลือกหน่วยงานก่อน"
                    }
                    error={!!errors.division}
                    className="h-12 rounded-full px-1.5 text-base"
                  />
                )}
              />
            </RegisterField>

            <RegisterField label="Email" error={errors.email?.message} className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-2">
                Email นี้จะถูกใช้สำหรับการเข้าสู่ระบบและรับข้อมูลสำคัญ
              </p>
              <Input
                id="email"
                autoComplete="email"
                type="email"
                placeholder="example@gmail.com"
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
                error={!!errors.officePhone}
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
            {isSubmitting ? "กำลังส่งข้อมูล..." : "ลงทะเบียน (Register)"}
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