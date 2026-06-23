// src/app/(protected)/layout.tsx
"use client"; // เพิ่ม "use client" เพราะเราใช้ usePathname

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/custom/user-menu";
import { CustomSidebarTrigger } from "@/components/custom/custom-sidebar-trigger";

// --- Helper Component: Breadcrumbs ---
const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // ฟังก์ชันแปลงชื่อ path เป็นภาษาไทย (ปรับแต่งตามโครงสร้างจริงของคุณ)
  const formatPathName = (segment: string) => {
    const names: Record<string, string> = {
      dashboard: "ภาพรวม",
      projects: "โครงการทั้งหมด",
      active: "ติดตามการดำเนินงาน",
      create: "สร้างโครงการใหม่",
      tasks: "งานตรวจสอบ",
      screening: "มอบหมาย",
      analysis: "วิเคราะห์",
      meetings: "การประชุม",
      agendas: "วาระการประชุม",
      resolutions: "บันทึกมติที่ประชุม",
      users: "จัดการผู้ใช้งาน",
      profile: "โปรไฟล์ส่วนตัว",
    };
    // ถ้าเจอชื่อใน Map ให้ใช้ภาษาไทย ถ้าไม่เจอใช้ตัวพิมพ์ใหญ่ตัวแรก
    return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground ml-4 overflow-hidden text-ellipsis whitespace-nowrap">
      <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-bold text-[#191c20]">
                {formatPathName(segment)}
              </span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {formatPathName(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-w-0 flex flex-col bg-surface-container-low min-h-screen">
          
          {/* --- Navbar --- */}
          <nav className="p-4 bg-white border-b border-[#ededf4] flex items-center justify-between sticky top-0 z-40 shadow-sm h-16">
            <section className="flex items-center w-full overflow-hidden pr-4">
              <CustomSidebarTrigger />
              <Breadcrumbs />
              
            </section>
            
            {/* ฝั่งขวา: โปรไฟล์ผู้ใช้งาน */}
            <div className="flex items-center gap-4 shrink-0">
              <UserMenu />
            </div>
          </nav>

          {/* ส่วนเนื้อหาของหน้าเพจต่างๆ */}
          <div className="p-2 md:p-4 overflow-y-auto flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}