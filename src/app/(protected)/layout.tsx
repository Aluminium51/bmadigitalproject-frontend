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

  // 1. เพิ่มรายการ Path ที่เป็นแค่โครงสร้าง ห้ามกดลิงก์
  const unclickableSegments = ["proposal", "tasks"];

  const formatPathName = (segment: string, index: number, segments: string[]) => {
    const segmentLower = segment.toLowerCase();
    const parent = segments[index - 1]?.toLowerCase();

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
      proposal: "เอกสารเสนอโครงการ", // เพิ่มคำแปล proposal
    };

    // 2. จัดการ Action: สร้างใหม่
    if (segmentLower === "create") {
      if (parent === "projects") return "สร้างโครงการใหม่";
      if (parent === "proposal") return "สร้างเอกสารเสนอโครงการ";
      if (parent === "users") return "เพิ่มผู้ใช้งานใหม่";
      if (parent === "meetings") return "สร้างการประชุมใหม่";
      return "สร้างรายการใหม่";
    }

    // 3. จัดการ Action: แก้ไข
    if (segmentLower === "edit") {
      if (parent === "projects") return "แก้ไขโครงการ";
      if (parent === "proposal") return "แก้ไขเอกสารเสนอโครงการ";
      if (parent === "users") return "แก้ไขผู้ใช้งาน";
      if (parent === "meetings") return "แก้ไขการประชุม";
      return "แก้ไขข้อมูล";
    }

    if (names[segmentLower]) return names[segmentLower];

    // ดักจับถ้า segment เป็นตัวเลข ID หรือ UUID
    if (/^\d+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment)) {
      return `รหัส: ${segment.substring(0, 8)}...`;
    }

    // ดักจับรหัสโครงการ เช่น p1, P2 ให้เป็นตัวใหญ่
    if (/^p\d+$/i.test(segment)) {
      return segment.toUpperCase();
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

        // เช็คว่าเป็น path ที่ห้ามกดหรือไม่
        const isUnclickable = unclickableSegments.includes(segment.toLowerCase());

        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* 4. ถ้าเป็นอันสุดท้าย หรือเป็นพาธที่ห้ามกด ให้แสดงเป็น span */}
            {isLast || isUnclickable ? (
              <span className={isLast ? "font-bold text-[#191c20]" : "text-slate-500"}>
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
        <main className="flex h-screen min-h-0 min-w-0 flex-1 flex-col bg-surface-container-low">

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
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-2 md:p-4">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
