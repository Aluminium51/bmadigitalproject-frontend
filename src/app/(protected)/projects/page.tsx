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
  ArrowRight
} from "lucide-react";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";

// --- Mock Data ---
// 1. แยก Mock Data: โครงการที่เป็นแบบร่าง (ยังไม่ส่ง)
const draftProjects = [
  { id: "PRJ-2024-005", name: "โครงการจัดหาระบบคลาวด์", progress: "Step 3/5", lastEdit: "2 ชม. ที่แล้ว" },
  { id: "PRJ-2024-006", name: "พัฒนาระบบ AI ตรวจสอบเอกสาร", progress: "Step 1/5", lastEdit: "เมื่อวาน" },
];

// 2. โครงการของฉัน (ที่ส่งแล้ว/Active)
const myActiveProjects = [
  { id: "PRJ-2024-001", name: "ระบบจัดการเอกสารภายในองค์กร", owner: "คุณสมชาย ใจดี", status: "Pending Review", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-002", name: "ปรับปรุงโครงสร้างเครือข่ายศูนย์ข้อมูล", owner: "คุณสมชาย ใจดี", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว" },
];

const teamProjects = [
  { id: "PRJ-2024-003", name: "ระบบจองห้องประชุมออนไลน์", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-004", name: "แอปพลิเคชันให้บริการประชาชน", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว" },
];

export default function ProjectsDashboard() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<"my" | "team">("my");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Review": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> รอเลขาตรวจสอบ</span>;
      case "In Analysis": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 w-fit">กำลังวิเคราะห์</span>;
      case "Approved": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> อนุมัติแล้ว</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">
      
      {/* --- ส่วนหัว (Header & Actions) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#191c20] tracking-tight">โครงการทั้งหมด</h1>
          <p className="text-sm text-[#3f4942] mt-1">จัดการแบบเสนอโครงการและติดตามสถานะการดำเนินงาน</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-[#00734b] hover:bg-[#005838] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          สร้างโครงการใหม่
        </button>
      </div>

      <CreateProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      {/* 🌟 Section ใหม่: แบบร่างที่ทำค้างไว้ (Recent Drafts) 🌟 */}
      {draftProjects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#191c20] mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-status-orange" />
            แบบร่างที่ทำค้างไว้
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftProjects.map((draft) => (
              <div 
                key={draft.id}
                onClick={() => router.push(`/projects/${draft.id}`)}
                className="bg-white border border-[#D1CDC7] rounded-[24px] p-5 hover:border-status-orange/50 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono text-muted-foreground bg-surface px-2 py-0.5 rounded">{draft.id}</span>
                  <span className="text-xs font-medium text-status-orange bg-orange-50 px-2.5 py-1 rounded-full">
                    {draft.progress}
                  </span>
                </div>
                <h3 className="font-bold text-[#191c20] line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                  {draft.name}
                </h3>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border">
                  <span>แก้ไขล่าสุด: {draft.lastEdit}</span>
                  <span className="flex items-center gap-1 font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    ทำต่อ <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ส่วน Tabs (แยกงานฉัน / งานหน่วยงาน) --- */}
      <div className="bg-white rounded-[32px] border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-6 px-8 border-b border-[#ededf4] bg-[#f9f9ff]">
          <button 
            onClick={() => setActiveTab("my")}
            className={`flex items-center gap-2 py-5 text-sm font-bold border-b-[3px] transition-colors
              ${activeTab === "my" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}
            `}
          >
            <User className="w-4 h-4" /> โครงการของฉัน (ส่งแล้ว)
          </button>
          <button 
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 py-5 text-sm font-bold border-b-[3px] transition-colors
              ${activeTab === "team" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}
            `}
          >
            <Users className="w-4 h-4" /> โครงการในหน่วยงาน
          </button>
        </div>

        {/* Tools (ค้นหา & ฟิลเตอร์) */}
        <div className="p-6 border-b border-[#ededf4] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโครงการ, รหัส..." 
              className="w-full pl-10 pr-4 h-11 text-sm border border-[#D1CDC7] rounded-full bg-surface focus:outline-none focus:ring-2 focus:ring-[#00734b]/20 focus:border-[#00734b] transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 h-11 text-sm font-medium border border-[#D1CDC7] rounded-full hover:bg-surface-variant transition-colors text-[#191c20]">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>

        {/* --- ตารางข้อมูล (Table Content) --- */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9f9ff] sticky top-0 text-[#3f4942] font-semibold z-10 border-b border-[#ededf4]">
              <tr>
                <th className="px-8 py-4">รหัสโครงการ</th>
                <th className="px-8 py-4 w-full">ชื่อโครงการ</th>
                {activeTab === "team" && <th className="px-8 py-4">ผู้รับผิดชอบ</th>}
                <th className="px-8 py-4">สถานะ</th>
                <th className="px-8 py-4">อัปเดตล่าสุด</th>
                <th className="px-8 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ededf4]">
              {(activeTab === "my" ? myActiveProjects : teamProjects).map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-surface-variant/40 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5 font-mono text-xs text-muted-foreground">{project.id}</td>
                  <td className="px-8 py-5 font-bold text-[#191c20] group-hover:text-primary transition-colors">{project.name}</td>
                  
                  {activeTab === "team" && (
                    <td className="px-8 py-5 text-[#3f4942]">
                      <div className="flex items-center gap-2">
                        {/* 🌟 Avatar แบบ Perfect Circle ตาม DESIGN.md */}
                        <div className="size-8 rounded-full bg-[#00734b]/10 text-[#00734b] flex items-center justify-center text-xs font-bold border border-[#00734b]/20">
                          {project.owner?.[0]}
                        </div>
                        {project.owner}
                      </div>
                    </td>
                  )}
                  
                  <td className="px-8 py-5">{getStatusBadge(project.status)}</td>
                  <td className="px-8 py-5 text-[#3f4942] text-xs">{project.lastEdit}</td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-2 rounded-full text-muted-foreground hover:text-[#191c20] hover:bg-surface-variant opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {(activeTab === "my" ? myActiveProjects : teamProjects).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-muted-foreground italic">
                    ไม่มีโครงการในสถานะดำเนินการ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}