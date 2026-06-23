// src/app/(protected)/projects/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus,
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  User,
  Users,
  Edit3,
  ArrowRight,
  FileSpreadsheet, 
  FileText         
} from "lucide-react";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { Button } from "@/components/ui/button";

// 📍 นำเข้า Pagination Component จาก shadcn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- Mock Data ---
// 1. เพิ่มจำนวนข้อมูลแบบร่าง (Drafts) ให้มากกว่า 10 รายการเพื่อเทส Pagination
const myDraftProjects = [
  { id: "PRJ-2024-005", name: "โครงการจัดหาระบบคลาวด์", formProgress: "3/5", docProgress: "4/4", lastEdit: "2 ชม. ที่แล้ว" },
  { id: "PRJ-2024-006", name: "พัฒนาระบบ AI ตรวจสอบเอกสาร", formProgress: "1/5", docProgress: "0/4", lastEdit: "เมื่อวาน" },
  { id: "PRJ-2024-007", name: "จัดซื้อเครื่องคอมพิวเตอร์ประจำปี", formProgress: "5/5", docProgress: "2/4", lastEdit: "2 วันที่แล้ว" },
  { id: "PRJ-2024-008", name: "ระบบจองรถยนต์ส่วนกลาง", formProgress: "5/5", docProgress: "4/4", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-009", name: "โครงการพัฒนาแอปพลิเคชัน BMA Mobile", formProgress: "2/5", docProgress: "1/4", lastEdit: "5 วันที่แล้ว" },
  { id: "PRJ-2024-010", name: "อัปเกรดระบบเครือข่ายไร้สาย (Wi-Fi)", formProgress: "4/5", docProgress: "4/4", lastEdit: "1 สัปดาห์ที่แล้ว" },
  { id: "PRJ-2024-011", name: "โครงการ Smart City เฟส 1", formProgress: "3/5", docProgress: "2/4", lastEdit: "1 สัปดาห์ที่แล้ว" },
  { id: "PRJ-2024-012", name: "ระบบฐานข้อมูลบุคลากรกลาง", formProgress: "5/5", docProgress: "3/4", lastEdit: "2 สัปดาห์ที่แล้ว" },
  { id: "PRJ-2024-013", name: "โครงการติดตั้งกล้อง CCTV อัจฉริยะ", formProgress: "1/5", docProgress: "1/4", lastEdit: "2 สัปดาห์ที่แล้ว" },
  { id: "PRJ-2024-014", name: "แพลตฟอร์มร้องเรียนปัญหาเมือง", formProgress: "4/5", docProgress: "2/4", lastEdit: "3 สัปดาห์ที่แล้ว" },
  { id: "PRJ-2024-015", name: "ปรับปรุงเว็บพอร์ทัลหน่วยงาน", formProgress: "2/5", docProgress: "0/4", lastEdit: "1 เดือนที่แล้ว" },
  { id: "PRJ-2024-016", name: "โครงการ Data Center สำรอง", formProgress: "5/5", docProgress: "4/4", lastEdit: "1 เดือนที่แล้ว" },
];

const myActiveProjects = [
  { id: "PRJ-2024-001", name: "ระบบจัดการเอกสารภายในองค์กร", status: "Pending Review", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-002", name: "ปรับปรุงโครงสร้างเครือข่ายศูนย์ข้อมูล", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว" },
];

const teamProjects = [
  { id: "PRJ-2024-003", name: "ระบบจองห้องประชุมออนไลน์", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-004", name: "แอปพลิเคชันให้บริการประชาชน", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว" },
];

type TabType = "drafts" | "active" | "team";

export default function ProjectsDashboard() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<TabType>("drafts");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 📍 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // แสดง 10 รายการต่อหน้า

  // ฟังก์ชันสลับ Tab และรีเซ็ตเลขหน้า
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 📍 Logic ตัดแบ่งข้อมูล (Slice) สำหรับ Pagination
  const getActiveData = () => {
    if (activeTab === "drafts") return myDraftProjects;
    if (activeTab === "active") return myActiveProjects;
    return teamProjects;
  };

  const currentDataset = getActiveData();
  const totalPages = Math.ceil(currentDataset.length / itemsPerPage);
  
  // ข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const paginatedData = currentDataset.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Review": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> รอพิจารณา</span>;
      case "In Analysis": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 w-fit">กำลังวิเคราะห์</span>;
      case "Approved": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00734b]/10 text-[#00734b] flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> อนุมัติแล้ว</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 w-fit">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">
      
      {/* --- ส่วนหัว (Header & Actions) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">รายการโครงการ</h1>
          <p className="text-sm text-[#3f4942] mt-1">จัดการแบบร่างและติดตามสถานะโครงการทั้งหมด</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-[#00734b] hover:bg-[#005838] text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          สร้างโครงการใหม่
        </button>
      </div>

      <CreateProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      {/* --- พื้นที่ตารางหลัก (Unified Table with Tabs) --- */}
      <div className="bg-white rounded-container border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Tab Headers with Count Badges */}
        <div className="flex items-center gap-2 px-6 sm:px-10 border-b border-[#ededf4] bg-[#f9f9ff] overflow-x-auto no-scrollbar shrink-0">
          
          <button 
            onClick={() => handleTabChange("drafts")}
            className={`flex items-center gap-2.5 py-5 px-4 text-sm font-bold border-b-[3px] transition-all whitespace-nowrap
              ${activeTab === "drafts" ? "border-status-orange text-status-orange" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}
            `}
          >
            <Edit3 className="w-4 h-4" /> 
            แบบร่างค้างทำ
            {myDraftProjects.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "drafts" ? "bg-status-orange text-white" : "bg-slate-200 text-slate-500"}`}>
                {myDraftProjects.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => handleTabChange("active")}
            className={`flex items-center gap-2.5 py-5 px-4 text-sm font-bold border-b-[3px] transition-all whitespace-nowrap
              ${activeTab === "active" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}
            `}
          >
            <User className="w-4 h-4" /> 
            ส่งแล้ว (ของฉัน)
            {myActiveProjects.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "active" ? "bg-[#00734b] text-white" : "bg-slate-200 text-slate-500"}`}>
                {myActiveProjects.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => handleTabChange("team")}
            className={`flex items-center gap-2.5 py-5 px-4 text-sm font-bold border-b-[3px] transition-all whitespace-nowrap
              ${activeTab === "team" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}
            `}
          >
            <Users className="w-4 h-4" /> 
            ภาพรวมหน่วยงาน
          </button>
        </div>

        {/* Tools (ค้นหา & ฟิลเตอร์) */}
        <div className="p-6 px-6 sm:px-10 border-b border-[#ededf4] flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโครงการ, รหัส..." 
              className="w-full pl-10 pr-4 h-11 text-sm border border-[#D1CDC7] rounded-full bg-surface focus:outline-none focus:ring-2 focus:ring-[#00734b]/20 focus:border-[#00734b] transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 h-11 text-sm font-bold border border-[#D1CDC7] rounded-full hover:bg-surface-variant transition-colors text-[#191c20]">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>

        {/* --- ตารางข้อมูล --- */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 text-slate-400 font-bold z-10 border-b border-[#ededf4] text-[13px] uppercase tracking-wide">
              <tr>
                <th className="px-6 sm:px-10 py-4">รหัสโครงการ</th>
                <th className="px-6 sm:px-10 py-4 w-full">ชื่อโครงการ</th>
                {activeTab === "team" && <th className="px-6 sm:px-10 py-4">ผู้รับผิดชอบ</th>}
                <th className="px-6 sm:px-10 py-4 min-w-50">{activeTab === "drafts" ? "ความคืบหน้า" : "สถานะ"}</th>
                <th className="px-6 sm:px-10 py-4">อัปเดตล่าสุด</th>
                <th className="px-6 sm:px-10 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ededf4]">
              
              {/* --- 📍 Tab: แบบร่าง (Drafts) ใช้ paginatedData --- */}
              {activeTab === "drafts" && paginatedData.map((project: any) => (
                <tr key={project.id} className="hover:bg-orange-50/30 transition-colors group cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                  <td className="px-6 sm:px-10 py-5 font-mono text-xs text-muted-foreground">{project.id}</td>
                  <td className="px-6 sm:px-10 py-5 font-bold text-[#191c20] group-hover:text-status-orange transition-colors">{project.name}</td>
                  
                  <td className="px-6 sm:px-10 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5
                        ${project.formProgress === "5/5" 
                          ? "text-[#00734b] bg-[#00734b]/10 border-[#00734b]/20" 
                          : "text-status-orange bg-orange-100 border-status-orange/20"
                        }`}
                      >
                        <FileSpreadsheet className="w-3 h-3" />
                        ฟอร์ม {project.formProgress}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5
                        ${project.docProgress === "4/4" 
                          ? "text-[#00734b] bg-[#00734b]/10 border-[#00734b]/20" 
                          : "text-red-600 bg-red-50 border-red-200"
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        เอกสาร {project.docProgress}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 sm:px-10 py-5 text-[#3f4942] text-xs">{project.lastEdit}</td>
                  <td className="px-6 sm:px-10 py-5 text-right">
                    <Button variant="ghost" className="rounded-full text-status-orange font-bold hover:text-status-orange hover:bg-orange-100 h-9 px-4">
                      เขียนต่อ <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}

              {/* --- Tab: Active Projects --- */}
              {activeTab === "active" && paginatedData.map((project: any) => (
                <tr key={project.id} className="hover:bg-surface-variant/40 transition-colors group cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                  <td className="px-6 sm:px-10 py-5 font-mono text-xs text-muted-foreground">{project.id}</td>
                  <td className="px-6 sm:px-10 py-5 font-bold text-[#191c20] group-hover:text-[#00734b] transition-colors">{project.name}</td>
                  <td className="px-6 sm:px-10 py-5">{getStatusBadge(project.status)}</td>
                  <td className="px-6 sm:px-10 py-5 text-[#3f4942] text-xs">{project.lastEdit}</td>
                  <td className="px-6 sm:px-10 py-5 text-right">
                    <button className="p-2 rounded-full text-muted-foreground hover:text-[#191c20] hover:bg-slate-200 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* --- Tab: Team Projects --- */}
              {activeTab === "team" && paginatedData.map((project: any) => (
                <tr key={project.id} className="hover:bg-surface-variant/40 transition-colors group cursor-pointer">
                  <td className="px-6 sm:px-10 py-5 font-mono text-xs text-muted-foreground">{project.id}</td>
                  <td className="px-6 sm:px-10 py-5 font-bold text-[#191c20] group-hover:text-[#00734b] transition-colors">{project.name}</td>
                  <td className="px-6 sm:px-10 py-5 text-[#3f4942]">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#00734b]/10 text-[#00734b] flex items-center justify-center text-xs font-bold border border-[#00734b]/20">
                        {project.owner?.[0]}
                      </div>
                      <span className="font-medium">{project.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-5">{getStatusBadge(project.status)}</td>
                  <td className="px-6 sm:px-10 py-5 text-[#3f4942] text-xs">{project.lastEdit}</td>
                  <td className="px-6 sm:px-10 py-5 text-right">
                    <button className="p-2 rounded-full text-muted-foreground hover:text-[#191c20] hover:bg-slate-200 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty States */}
              {currentDataset.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-16 text-center text-muted-foreground font-medium">
                    {activeTab === "drafts" ? "🎉 ยอดเยี่ยม! คุณไม่มีแบบร่างค้างทำเลย" : "ยังไม่มีข้อมูลโครงการในหมวดหมู่นี้"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- 📍 ส่วนแสดง Pagination ของ shadcn --- */}
        {totalPages > 1 && (
          <div className="border-t border-[#ededf4] p-4 bg-white shrink-0 ">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

      </div>
    </div>
  );
}