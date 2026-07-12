// src/app/(protected)/layout.tsx
"use client";

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

  const formatPathName = (segment: string, index: number, segments: string[]) => {
    const names: Record<string, string> = {
      dashboard: "ภาพรวม",
      projects: "โครงการทั้งหมด",
      active: "ติดตามการดำเนินงาน",
      tasks: "งานตรวจสอบ",
      screening: "มอบหมาย",
      analysis: "วิเคราะห์",
      meetings: "การประชุม",
      agendas: "วาระการประชุม",
      resolutions: "บันทึกมติที่ประชุม",
      users: "จัดการผู้ใช้งาน",
      profile: "ข้อมูลส่วนตัว",
    };

    if (segment === "create") {
      const parent = segments[index - 1]; // ดูว่า path ก่อนหน้าคืออะไร
      if (parent === "projects") return "สร้างโครงการใหม่";
      if (parent === "users") return "เพิ่มผู้ใช้งานใหม่";
      if (parent === "meetings") return "สร้างการประชุมใหม่";
      return "สร้างใหม่"; // Default ถ้าหา parent ไม่เจอ
    }

    if (names[segment]) return names[segment];
    
    // ดักจับถ้า segment เป็นตัวเลข ID (ปรับให้เป็นกลาง เพราะอาจจะเป็น ID ของโครงการ หรือ ผู้ใช้งาน ก็ได้)
    if (/^\d+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment)) { // รองรับทั้งตัวเลขและ UUID
      return `รหัส: ${segment.substring(0, 8)}...`; // ตัดโชว์แค่ 8 ตัวแรกถ้าเป็น UUID
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1);
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
                {formatPathName(segment, index, pathSegments)}
              </span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {formatPathName(segment, index, pathSegments)}
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