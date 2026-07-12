// src/app/(protected)/tasks/screening/page.tsx
"use client";

import { useState } from "react";
import { Search, Filter, Eye, CheckCircle2, Clock, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

// --- Mock Data ---
// จำลองข้อมูลโครงการที่ถูกส่งมาแล้ว (Submitted)
const MOCK_PROJECTS = [
  { id: "550e8400-e29b-41d4-a716-446655440001", code: "BMA-67-0042", name: "โครงการพัฒนาระบบ AI ตรวจจับน้ำท่วม", agency: "สำนักการระบายน้ำ", submittedDate: "12 ก.ค. 2567", typeId: "", status: "Pending Review" },
  { id: "550e8400-e29b-41d4-a716-446655440002", code: "BMA-67-0045", name: "ระบบจัดการคิวออนไลน์สำหรับโรงพยาบาล", agency: "สำนักการแพทย์", submittedDate: "11 ก.ค. 2567", typeId: "2", status: "Classified" },
  { id: "550e8400-e29b-41d4-a716-446655440003", code: "BMA-67-0048", name: "แพลตฟอร์มรับเรื่องร้องเรียน (Traffy Fondue v2)", agency: "สำนักยุทธศาสตร์และประเมินผล", submittedDate: "10 ก.ค. 2567", typeId: "", status: "Pending Review" },
];

const PROJECT_TYPES = [
  { id: "1", name: "Hardware (ฮาร์ดแวร์)" },
  { id: "2", name: "Software (ซอฟต์แวร์)" },
  { id: "3", name: "Network (เครือข่าย)" },
  { id: "4", name: "Maintenance (บำรุงรักษา)" },
];

export default function ScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  // State สำหรับจัดการ Sheet (Slide-over)
  const [selectedProject, setSelectedProject] = useState<typeof MOCK_PROJECTS[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- Handlers ---
  const handleTypeChange = (projectId: string, newTypeId: string) => {
    // TODO: เรียกใช้ API (Mutation) เพื่ออัปเดตประเภทโครงการ PATCH /projects/{id}/type
    console.log(`Update Project ${projectId} to Type ${newTypeId}`);

    // อัปเดต UI ชั่วคราว
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, typeId: newTypeId } : p));
  };

  const handleApprove = (projectId: string) => {
    // TODO: เรียกใช้ API (Mutation) เพื่ออัปเดตสถานะโครงการ PATCH /projects/{id}/status
    console.log(`Approve Project ${projectId}`);

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: "Approved" } : p));
    setIsSheetOpen(false); // ปิดหน้าต่าง
  };

  const openProjectDetails = (project: typeof MOCK_PROJECTS[0]) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  // --- Render ---
  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">

      {/* 1. Header & Summary Cards */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">ตรวจสอบและจำแนกโครงการ</h1>
        <p className="text-sm text-[#3f4942] mt-1">คัดกรองความถูกต้องและกำหนดประเภทโครงการก่อนเข้าสู่กระบวนการวิเคราะห์</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-md border border-[#ededf4] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">รอตรวจสอบ</p>
            <p className="text-2xl font-bold text-orange-600">2 <span className="text-sm font-normal text-slate-400">รายการ</span></p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-500"><Clock className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-md border border-[#ededf4] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">จำแนกแล้ววันนี้</p>
            <p className="text-2xl font-bold text-[#00734b]">1 <span className="text-sm font-normal text-slate-400">รายการ</span></p>
          </div>
          <div className="p-3 bg-[#00734b]/10 rounded-full text-[#00734b]"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
      </div>

      {/* 2. Main Content & Table */}
      <div className="bg-white rounded-md border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden">

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

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 text-slate-400 font-bold z-10 border-b border-[#ededf4] text-[12px] uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">รหัสโครงการ</th>
                <th className="px-6 py-4 w-full">ชื่อโครงการ</th>
                <th className="px-6 py-4">วันที่ส่ง</th>
                <th className="px-6 py-4 min-w-[200px]">ประเภทโครงการ <span className="text-red-500">*</span></th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ededf4]">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{project.code}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#191c20]">{project.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{project.agency}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{project.submittedDate}</td>

                  {/* Inline Edit Dropdown */}
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <Select value={project.typeId} onValueChange={(val) => handleTypeChange(project.id, val)}>
                      <SelectTrigger className={`h-9 bg-white ${!project.typeId ? 'border-orange-300 ring-1 ring-orange-100' : ''}`}>
                        <SelectValue placeholder="-- กำหนดประเภท --" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => openProjectDetails(project)}
                      className="rounded-full text-[#00734b] font-semibold hover:bg-[#00734b]/10"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> ตรวจสอบ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Project Details Sheet (Slide-over) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto flex flex-col p-0">

          <div className="p-6 border-b border-border bg-slate-50">
            <SheetHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 uppercase">
                  {selectedProject?.code}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                  รอตรวจสอบ
                </span>
              </div>
              <SheetTitle className="text-xl font-bold leading-tight text-[#191c20]">
                {selectedProject?.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4" /> {selectedProject?.agency}
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* พื้นที่สำหรับใส่เนื้อหาโครงการจริงๆ */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500"/> หลักการและเหตุผล
                </h4>
                <p className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200 leading-relaxed">
                  (จำลองข้อมูล) โครงการนี้จัดทำขึ้นเพื่อแก้ไขปัญหาน้ำท่วมขังในพื้นที่กรุงเทพมหานคร โดยใช้เทคโนโลยี AI เข้ามาช่วยวิเคราะห์และแจ้งเตือนภัย...
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">งบประมาณที่ขอ</p>
                  <p className="text-lg font-bold text-slate-800">5,000,000 บาท</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">ประเภท (ปัจจุบัน)</p>
                  <p className="text-sm font-bold text-[#00734b]">
                    {PROJECT_TYPES.find(t => t.id === selectedProject?.typeId)?.name || "ยังไม่ระบุ"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-border bg-white mt-auto sticky bottom-0">
            <div className="flex w-full justify-between items-center gap-4">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="rounded-full w-full">
                ปิด
              </Button>
              <Button
                onClick={() => selectedProject && handleApprove(selectedProject.id)}
                disabled={!selectedProject?.typeId} // บังคับให้เลือกประเภทก่อนถึงจะกดยืนยันได้
                className="bg-[#00734b] hover:bg-primary-dark text-white rounded-full w-full font-bold shadow-md"
              >
                ยืนยันความถูกต้อง
              </Button>
            </div>
          </SheetFooter>

        </SheetContent>
      </Sheet>

    </div>
  );
}
