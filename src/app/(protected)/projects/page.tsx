// src/app/(protected)/projects/page.tsx
"use client";

import Link from "next/link"; // เพิ่ม Import Link จาก next/link
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useProjects } from "@/features/projects/hooks/useProjects";
import { ProjectTabs } from "@/features/projects/components/ProjectTabs";
import { ProjectTable } from "@/features/projects/components/ProjectTable";
import { ProjectPagination } from "@/features/projects/components/ProjectPagination";

export default function ProjectsDashboard() {
  // Custom Hook
  const { 
    activeTab, handleTabChange, 
    searchQuery, setSearchQuery, 
    paginatedData, currentPage, setCurrentPage, totalPages,
    draftsCount, activeCount
  } = useProjects();

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">
      
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">รายการโครงการ</h1>
          <p className="text-sm text-[#3f4942] mt-1">จัดการแบบร่างและติดตามสถานะโครงการทั้งหมด</p>
        </div>
        {/* เปลี่ยนจาก <button> เป็น <Link> และระบุ href ไปที่หน้า create */}
        <Link 
          href="/projects/create"
          className="flex items-center gap-2 bg-[#00734b] hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5 text-white" /> <span className="text-white">สร้างโครงการใหม่</span>
        </Link>
      </div>

      {/* --- พื้นที่ตารางหลัก --- */}
      <div className="bg-white rounded-md border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden">
        
        <ProjectTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          draftsCount={draftsCount}
          activeCount={activeCount}
        />

        {/* Tools */}
        <div className="p-6 px-6 sm:px-10 border-b border-[#ededf4] flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโครงการ, รหัส..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 text-sm border border-[#D1CDC7] rounded-full bg-surface focus:outline-none focus:ring-2 focus:ring-[#00734b]/20 focus:border-[#00734b] transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 h-11 text-sm font-bold border border-[#D1CDC7] rounded-full hover:bg-surface-variant transition-colors text-[#191c20]">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>

        <ProjectTable data={paginatedData} activeTab={activeTab} />

        <ProjectPagination 
           currentPage={currentPage} 
           totalPages={totalPages} 
           onPageChange={setCurrentPage} 
        />
        
      </div>
    </div>
  );
}