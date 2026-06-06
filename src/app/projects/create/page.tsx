import { Metadata } from "next";
import { CreateProjectWizard } from "@/features/projects/components/CreateProjectWizard";
// หมายเหตุ: ปรับ Path การ import ให้ตรงกับ alias (เช่น @/) ที่คุณตั้งไว้ใน tsconfig.json

// 1. ตั้งค่า Metadata สำหรับ SEO และ Title Bar (ทำได้เฉพาะใน Server Component)
export const metadata: Metadata = {
  title: "สร้างโครงการใหม่ | ระบบจัดการโครงการดิจิทัล กทม.",
  description: "เพิ่มข้อมูลโครงการใหม่ กำหนดผู้รับผิดชอบ และแนบไฟล์เอกสาร",
};

export default function CreateProjectPage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* 2. Page Header: ส่วนหัวของหน้าจอ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            สร้างโครงการใหม่
          </h1>
          <p className="mt-2 text-slate-gray text-sm sm:text-base">
            กรุณากรอกข้อมูลโครงการตามลำดับขั้นตอน ระบบจะทำการบันทึกร่าง (Auto-save) ให้โดยอัตโนมัติ
          </p>
        </div>

        {/* 3. เรียกใช้งาน Wizard Component ที่เราสร้างไว้ */}
        <CreateProjectWizard />
        
      </div>
    </main>
  );
}