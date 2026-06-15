// src/components/custom/app-sidebar.tsx
"use client"

import { Home, FileText, FolderOpen, Settings, Users } from "lucide-react"
import Link from "next/link"

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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-primary mb-2 mt-2">
            BMA Digital Project
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 mt-6">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* 🟢 2. กลับมาใช้ asChild คู่กับ Link เปล่าๆ ไม่มี legacyBehavior */}
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