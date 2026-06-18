// src/components/custom/app-sidebar.tsx
"use client"

// 🟢 1. นำเข้า icon X และ useSidebar
import { Home, FileText, FolderOpen, Settings, Users, X } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "หน้าหลัก (Dashboard)", url: "/dashboard", icon: Home },
  { title: "เสนอโครงการใหม่", url: "/projects/create", icon: FileText },
  { title: "โครงการของฉัน", url: "/projects", icon: FolderOpen },
  { title: "จัดการผู้ใช้งาน", url: "/users", icon: Users },
  { title: "ตั้งค่าโปรไฟล์", url: "/profile", icon: Settings },
]

export function AppSidebar() {
  // 🟢 2. เรียกใช้งาน hook เพื่อเอาฟังก์ชันเปิด/ปิดมาใช้
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* 🟢 3. จัด Layout ส่วนหัวใหม่ให้มีปุ่มปิด (แสดงเฉพาะจอเล็ก) */}
          <div className="flex items-center justify-between pr-2 mt-2 mb-2">
            <SidebarGroupLabel className="text-xl font-bold text-primary">
              BMA Digital Project
            </SidebarGroupLabel>
            <button 
              onClick={toggleSidebar} 
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-variant rounded-md transition-colors"
              aria-label="ปิดเมนู"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 mt-6">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}