// src/app/(protected)/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/custom/user-menu";
import { CustomSidebarTrigger } from "@/components/custom/custom-sidebar-trigger";

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
          <nav className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-40 shadow-sm">
            <section className="flex items-center">
              <CustomSidebarTrigger />
              <h1 className="ml-4 font-bold text-foreground tracking-wide hidden sm:block">
                ระบบพิจารณาความเหมาะสมโครงการคอมพิวเตอร์
              </h1>
            </section>
            {/* ฝั่งขวา: โปรไฟล์ผู้ใช้งานและเมนูกดออก */}
            <div className="flex items-center gap-4">
              <UserMenu />
            </div>
          </nav>
          {/* ส่วนเนื้อหาของหน้าเพจต่างๆ */}
          <div className="p-4 md:p-8 overflow-y-auto flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
