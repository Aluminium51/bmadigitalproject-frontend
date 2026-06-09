import Link from "next/link";

import { Button } from "@/components/ui/button";

import { AuthShell } from "@/features/auth/components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot Password?"
      description="หน้านี้เตรียมไว้สำหรับกระบวนการรีเซ็ตรหัสผ่านในอนาคต กรุณาติดต่อผู้ดูแลระบบหากต้องการความช่วยเหลือ"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <p className="rounded-[24px] border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground shadow-sm">
          หากบัญชีของคุณต้องการรีเซ็ตรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบหรือเพิ่ม flow สำหรับส่งอีเมลยืนยันในขั้นตอนถัดไป
        </p>
        <Button asChild className="h-12 w-full rounded-full border-none" variant="default">
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </AuthShell>
  );
}