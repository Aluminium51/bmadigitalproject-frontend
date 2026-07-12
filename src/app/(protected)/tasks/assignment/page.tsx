// src/app/(protected)/tasks/assignment/page.tsx
"use client";

import { useState } from "react";
import { Search, Filter, Users, UserCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentTable, Analyst, ProjectForAssign } from "@/features/projects/components/AssignmentTable";

// --- Mock Data ---
const MOCK_ANALYSTS: Analyst[] = [
  { id: "a1", name: "นาย ธนาธร (Senior)", workload: 4 },
  { id: "a2", name: "นางสาว สมหญิง (Network)", workload: 1 },
  { id: "a3", name: "นาย สมชาย (Software)", workload: 0 },
];

const MOCK_PROJECTS: ProjectForAssign[] = [
  { id: "p1", code: "BMA-67-0045", name: "ระบบจัดการคิวออนไลน์สำหรับโรงพยาบาล", agency: "สำนักการแพทย์", type: "Software", status: "Classified", analystId: null },
  { id: "p2", code: "BMA-67-0046", name: "จัดซื้อกล้อง CCTV พร้อบระบบ AI", agency: "สำนักจราจรฯ", type: "Hardware", status: "Classified", analystId: null },
  { id: "p3", code: "BMA-67-0047", name: "เช่าใช้บริการ Cloud Server", agency: "สำนักยุทธศาสตร์ฯ", type: "Network", status: "Classified", analystId: "a1" },
];

export default function AssignmentPage() {
  const [projects, setProjects] = useState<ProjectForAssign[]>(MOCK_PROJECTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Handlers ---
  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(projects.map(p => p.id));
    else setSelectedIds([]);
  };

  const handleAssignSingle = (projectId: string, analystId: string) => {
    // TODO: ยิง API PATCH /projects/{id}/assign
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, analystId } : p));
  };

  const handleAssignBulk = (analystId: string) => {
    // TODO: ยิง API แบบ Bulk
    setProjects(prev => prev.map(p =>
      selectedIds.includes(p.id) ? { ...p, analystId } : p
    ));
    setSelectedIds([]); // เคลียร์ค่าที่เลือกหลังมอบหมายเสร็จ
    alert(`มอบหมาย ${selectedIds.length} โครงการสำเร็จ!`);
  };

  const handleOpenDetails = (project: ProjectForAssign) => {
    // TODO: เปิด Sheet ดูรายละเอียด (นำ Component Sheet จากหน้า Screening มาใช้ร่วมกันได้)
    console.log("Open details for:", project.name);
  };

  const unassignedCount = projects.filter(p => !p.analystId).length;

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">

      {/* --- Header & Dashboard --- */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">มอบหมายโครงการ</h1>
        <p className="text-sm text-[#3f4942] mt-1">กระจายงานให้นักวิเคราะห์เพื่อเข้าสู่กระบวนการพิจารณาความเหมาะสม</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-md border border-orange-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">รอการมอบหมาย</p>
            <p className="text-2xl font-bold text-orange-600">{unassignedCount} <span className="text-sm font-normal text-slate-400">โครงการ</span></p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-500"><Inbox className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-md border border-[#ededf4] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">มอบหมายแล้ว (เดือนนี้)</p>
            <p className="text-2xl font-bold text-[#00734b]">12 <span className="text-sm font-normal text-slate-400">โครงการ</span></p>
          </div>
          <div className="p-3 bg-[#00734b]/10 rounded-full text-[#00734b]"><UserCheck className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-md border border-[#ededf4] shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">นักวิเคราะห์ในระบบ</p>
            <p className="text-2xl font-bold text-blue-600">{MOCK_ANALYSTS.length} <span className="text-sm font-normal text-slate-400">ท่าน</span></p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-500"><Users className="w-5 h-5" /></div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="bg-white rounded-md border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden relative">

        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#ededf4] flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, รหัส..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 text-sm border border-[#D1CDC7] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#00734b]/20 focus:border-[#00734b] transition-all"
            />
          </div>
          <Button variant="outline" className="rounded-full h-10 px-6 border-[#D1CDC7] text-[#191c20]">
            <Filter className="w-4 h-4 mr-2" /> ตัวกรอง
          </Button>
        </div>

        {/* Table Component */}
        <AssignmentTable
          projects={projects}
          analysts={MOCK_ANALYSTS}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
          onAssignSingle={handleAssignSingle}
          onAssignBulk={handleAssignBulk}
          onOpenDetails={handleOpenDetails}
        />

      </div>
    </div>
  );
}
