"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  FileEdit, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  User,
  Users
} from "lucide-react";

// --- Mock Data ---
const myProjects = [
  { id: "PROJ-2024-001", name: "ระบบจัดการเอกสารภายในองค์กร", owner: "คุณสมชาย ใจดี", status: "Draft", lastEdit: "2 ชม. ที่แล้ว" },
  { id: "PROJ-2024-002", name: "ปรับปรุงโครงสร้างเครือข่ายศูนย์ข้อมูล", owner: "คุณสมชาย ใจดี", status: "Pending Review", lastEdit: "เมื่อวาน 14:30" },
];

const teamProjects = [
  { id: "PROJ-2024-003", name: "ระบบจองห้องประชุมออนไลน์", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "3 วันที่แล้ว" },
  { id: "PROJ-2024-004", name: "แอปพลิเคชันให้บริการประชาชน", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว" },
];

export default function ProjectsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my" | "team">("my");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ฟังก์ชันจัดการตอนกดสร้างโครงการ
  const handleCreateNew = (optionType: "A" | "B") => {
    setIsDropdownOpen(false);
    // Redirect ไปหน้าสร้างโครงการ พร้อมแนบ Parameter เพื่อบอกว่าเป็น Option ไหน
    router.push(`/projects/create?type=${optionType}`);
  };

  // Helper สำหรับป้ายสีบอกสถานะ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">ฉบับร่าง</span>;
      case "Pending Review": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1"><Clock className="w-3 h-3"/> รอเลขาตรวจสอบ</span>;
      case "In Analysis": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">กำลังวิเคราะห์</span>;
      case "Approved": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ผ่านการอนุมัติ</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">
      
      {/* --- ส่วนหัว (Header & Actions) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">โครงการทั้งหมด</h1>
          <p className="text-sm text-muted-foreground mt-1">จัดการแบบเสนอโครงการและติดตามสถานะการดำเนินงาน</p>
        </div>

        {/* 🟢 ปุ่มสร้างโครงการแบบมี Dropdown (Option A / B) */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            สร้างโครงการใหม่
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in">
              <div className="p-1">
                <button 
                  onClick={() => handleCreateNew("A")}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-surface-variant rounded-md transition-colors flex items-center gap-2"
                >
                  <FileEdit className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">รูปแบบ Option A</div>
                    <div className="text-xs text-muted-foreground">คำอธิบายสั้นๆ สำหรับ A</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleCreateNew("B")}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-surface-variant rounded-md transition-colors flex items-center gap-2"
                >
                  <FileEdit className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">รูปแบบ Option B</div>
                    <div className="text-xs text-muted-foreground">คำอธิบายสั้นๆ สำหรับ B</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ส่วน Tabs (แยกงานฉัน / งานหน่วยงาน) --- */}
      <div className="bg-surface rounded-xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-6 px-6 border-b border-border bg-surface-container-low/30">
          <button 
            onClick={() => setActiveTab("my")}
            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === "my" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}
            `}
          >
            <User className="w-4 h-4" /> โครงการของฉัน
          </button>
          <button 
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === "team" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}
            `}
          >
            <Users className="w-4 h-4" /> โครงการในหน่วยงาน
          </button>
        </div>

        {/* Tools (ค้นหา & ฟิลเตอร์) */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโครงการ, รหัส..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-input rounded-md hover:bg-surface-variant transition-colors text-foreground">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>

        {/* --- ตารางข้อมูล (Table Content) --- */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container-low sticky top-0 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3">รหัสโครงการ</th>
                <th className="px-6 py-3 w-full">ชื่อโครงการ</th>
                {activeTab === "team" && <th className="px-6 py-3">ผู้รับผิดชอบ</th>}
                <th className="px-6 py-3">สถานะ</th>
                <th className="px-6 py-3">แก้ไขล่าสุด</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === "my" ? myProjects : teamProjects).map((project) => (
                <tr key={project.id} className="hover:bg-surface-variant/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{project.id}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{project.name}</td>
                  
                  {activeTab === "team" && (
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {project.owner?.[0]}
                        </div>
                        {project.owner}
                      </div>
                    </td>
                  )}
                  
                  <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{project.lastEdit}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-variant opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}