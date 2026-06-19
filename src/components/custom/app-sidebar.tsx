// src/components/custom/app-sidebar.tsx
"use client"

import { 
  LayoutDashboard, 
  FilePlus2, 
  FolderOpen, 
  Activity,
  ClipboardCheck,
  CalendarDays,
  Settings, 
  Users, 
  X,
  ChevronRight,
  ListTodo,
  LucideIcon // 🟢 1. นำเข้า Type ของ Icon เพิ่มเติม
} from "lucide-react"
import Link from "next/link"
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
      { title: "จัดการโครงการ", url: "/projects", icon: FolderOpen }, // 📍 ชี้มาที่หน้า Dashboard ใหม่นี้
      { title: "ติดตามการดำเนินงาน (To-do)", url: "/projects/active", icon: ListTodo }, 
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

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="bg-surface">
        
        {/* ส่วนหัว Sidebar */}
        <div className="flex items-center justify-between px-4 py-4 mt-2 border-b border-border/50">
          <div className="flex flex-col">
            <span className="text-xl font-black text-primary truncate">
              BMA Digital
            </span>
            <span className="text-xs text-muted-foreground font-medium truncate">
              Project Management
            </span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-variant rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* ส่วนรายการเมนู */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} className="mt-2">
            <SidebarGroupLabel className="text-xs font-semibold text-slate-gray/70 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  
                  if (item.subItems) {
                    const isGroupActive = item.subItems.some((sub) => pathname.startsWith(sub.url));
                    return (
                      <Collapsible key={item.title} asChild defaultOpen={isGroupActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title} className="hover:bg-surface-variant">
                              {item.icon && <item.icon className="text-muted-foreground group-data-[state=open]/collapsible:text-primary" />}
                              <span className="text-sm font-medium">{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="animate-in slide-in-from-top-1 fade-in-0">
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => {
                                const isActive = pathname === subItem.url
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                      <Link href={subItem.url} className={`text-sm ${isActive ? 'font-bold text-primary' : 'text-slate-gray'}`}>
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

                  const isSingleActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isSingleActive} className="hover:bg-surface-variant">
                        <Link href={item.url || "#"}>
                          {item.icon && <item.icon className={isSingleActive ? 'text-primary' : 'text-muted-foreground'} />}
                          <span className={`text-sm ${isSingleActive ? 'font-bold text-primary' : 'font-medium'}`}>{item.title}</span>
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