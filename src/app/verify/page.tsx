// src/app/verify/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("กำลังตรวจสอบข้อมูล...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("ลิงก์ไม่ถูกต้อง หรือไม่มีรหัสยืนยัน");
      return;
    }

    // ยิง API ไปให้ Backend ตรวจสอบ Token
    const verifyToken = async () => {
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify?token=${token}`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("ยืนยันอีเมลสำเร็จ! บัญชีของคุณพร้อมใช้งานแล้ว");
        } else {
          setStatus("error");
          setMessage(data.error || "ไม่สามารถยืนยันตัวตนได้");
        }
      } catch (error) {
        setStatus("error");
        setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-sm border border-border text-center flex flex-col items-center">
        
        {status === "loading" && <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />}
        {status === "success" && <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />}
        {status === "error" && <XCircle className="w-16 h-16 text-status-orange mb-4" />}

        <h1 className="text-2xl font-bold text-foreground mb-2">การยืนยันอีเมล</h1>
        <p className="text-muted-foreground mb-8">{message}</p>

        {status === "success" && (
          <Button onClick={() => router.push("/login")} className="w-full">
            เข้าสู่ระบบเลย
          </Button>
        )}
        {status === "error" && (
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            กลับสู่หน้าหลัก
          </Button>
        )}
      </div>
    </div>
  );
}

// ใน Next.js กฎคือถ้ามีการอ่าน SearchParams ควรครอบด้วย Suspense เสมอครับ
export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
      <VerifyContent />
    </Suspense>
  );
}