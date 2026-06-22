// src/components/custom/app-sidebar.tsx
"use client"

import { 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardCheck,
  CalendarDays,
  Settings, 
  Users, 
  X,
  ChevronRight,
  ListTodo,
  LucideIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// ----------------------------------------------------------------------
// 1. Types & Data Definition
// ----------------------------------------------------------------------
type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  icon: LucideIcon;
  url?: string;       
  isActive?: boolean;
  subItems?: SubItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "ภาพรวม",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "โครงการ (Projects)",
    items: [
      { title: "จัดการโครงการ", url: "/projects", icon: FolderOpen },
      { title: "ติดตามการดำเนินงาน", url: "/projects/active", icon: ListTodo }, 
    ]
  },
  {
    title: "งานตรวจสอบ (Tasks)",
    items: [
      {
        title: "ตรวจสอบและประเมิน",
        icon: ClipboardCheck,
        subItems: [
          { title: "มอบหมาย", url: "/tasks/screening" },
          { title: "วิเคราะห์", url: "/tasks/analysis" },
        ]
      }
    ]
  },
  {
    title: "การประชุม (Meetings)",
    items: [
      {
        title: "จัดการการประชุม",
        icon: CalendarDays,
        subItems: [
          { title: "วาระการประชุม", url: "/meetings/agendas" },
          { title: "บันทึกมติที่ประชุม", url: "/meetings/resolutions" },
        ]
      }
    ]
  },
  {
    title: "ตั้งค่าระบบ",
    items: [
      { title: "จัดการผู้ใช้งาน", url: "/users", icon: Users },
      { title: "โปรไฟล์ส่วนตัว", url: "/profile", icon: Settings },
    ]
  }
];

// ----------------------------------------------------------------------
// 2. Component: AppSidebar
// ----------------------------------------------------------------------
export function AppSidebar() {
  const { toggleSidebar, state, isMobile } = useSidebar()
  const pathname = usePathname()

  // ตรวจสอบว่า Sidebar ถูกพับ (Collapsed) อยู่หรือไม่
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-border/50 shadow-sm">
      <SidebarContent className="bg-surface">
        
        {/* --- ส่วนที่ 1: Header & Logo --- */}
        {/* เมื่อพับ Sidebar (group-data-[collapsible=icon]) จะลด padding และจัดกลาง */}
        <div className="flex items-center px-4 py-4 mb-2 border-border/50 transition-all group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
          
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden w-full">
            
            {/* โลโก้ กทม. (แสดงตลอดเวลา) */}
            <div className="shrink-0 flex items-center justify-center w-8 h-8 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 transition-all duration-300">
              <Image 
                src="/pics/logo.png" 
                alt="Bangkok Logo" 
                width={40} 
                height={40} 
                className="object-contain w-full h-full"
                priority
              />
            </div>

            {/* ข้อความโลโก้ (ซ่อนเมื่อ Sidebar พับ) */}
            <div className={`flex flex-col whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              <span className="text-lg font-black text-primary leading-tight">
                BMA Digital
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                Project Management
              </span>
            </div>
          </Link>

          {/* ปุ่มปิด Sidebar สำหรับ Mobile */}
          {isMobile && (
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 ml-auto text-muted-foreground hover:text-foreground hover:bg-surface-variant rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* --- ส่วนที่ 2: เมนูนำทาง (Navigation Menu) --- */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} className="mt-1 px-2 group-data-[collapsible=icon]:px-1">
            
            {/* ซ่อนชื่อกลุ่ม (Group Label) เมื่อ Sidebar พับ */}
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  
                  // -- แบบที่ 2.1: เมนูแบบมีลูก (Dropdown / Collapsible) --
                  if (item.subItems) {
                    const isGroupActive = item.subItems.some((sub) => pathname.startsWith(sub.url));
                    return (
                      <Collapsible key={item.title} asChild defaultOpen={isGroupActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              tooltip={item.title} 
                              className={`hover:bg-primary/5 transition-colors group-data-[collapsible=icon]:justify-center! ${isGroupActive ? 'bg-primary/5 text-primary' : ''}`}
                            >
                              {item.icon && <item.icon className={`w-5 h-5 shrink-0 ${isGroupActive ? 'text-primary' : 'text-slate-500 group-data-[state=open]/collapsible:text-primary'}`} />}
                              <span className={`text-sm ${isGroupActive ? 'font-bold' : 'font-medium'}`}>{item.title}</span>
                              <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-slate-400 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          
                          {/* เนื้อหา Sub-menu */}
                          <CollapsibleContent className="animate-in slide-in-from-top-1 fade-in-0 mt-1">
                            <SidebarMenuSub className="border-l-primary/20 mr-0 pr-0">
                              {item.subItems.map((subItem) => {
                                const isActive = pathname === subItem.url
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isActive} className="hover:bg-primary/5 rounded-md">
                                      <Link href={subItem.url} className={`text-sm transition-colors ${isActive ? 'font-bold text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  }

                  // -- แบบที่ 2.2: เมนูเดี่ยว (Single Link) --
                  const isSingleActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title} 
                        isActive={isSingleActive} 
                        // 📍 [แก้ไข]: จัดไอคอนชิดกลางตอนพับ
                        className={`hover:bg-primary/5 transition-colors group-data-[collapsible=icon]:justify-center! ${isSingleActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 font-medium'}`}
                      >
                        {/* 📍 [แก้ไข]: คลุมด้วย div (หรือจัดการ flex ใน Link) เพื่อให้เรียงเลย์เอาต์เป๊ะ */}
                        <Link href={item.url || "#"} className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center">
                           {/* 📍 [แก้ไข]: shrink-0 ไอคอน */}
                          {item.icon && <item.icon className={`w-5 h-5 shrink-0 ${isSingleActive ? 'text-primary' : 'text-slate-500'}`} />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

      </SidebarContent>
    </Sidebar>
  )
}