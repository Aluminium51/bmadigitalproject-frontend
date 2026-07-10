// src/features/projects/components/ProjectTabs.tsx
import { Edit3, User, Users, ShieldAlert } from "lucide-react";
import { TabType } from "../hooks/useProjects";

interface ProjectTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  draftsCount: number;
  activeCount: number;
}

export function ProjectTabs({ activeTab, onTabChange, draftsCount, activeCount }: ProjectTabsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 lg:px-10 border-b border-[#ededf4] bg-[#f9f9ff] overflow-x-auto no-scrollbar shrink-0">
      
      <button 
        onClick={() => onTabChange("drafts")}
        className={`flex items-center gap-1.5 sm:gap-2.5 py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-sm font-bold border-b-[3px] transition-all whitespace-nowrap ${activeTab === "drafts" ? "border-status-orange text-status-orange" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}`}
      >
        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> แบบร่างค้างทำ
        {draftsCount > 0 && (
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black ${activeTab === "drafts" ? "bg-status-orange text-white" : "bg-slate-200 text-slate-500"}`}>
            {draftsCount}
          </span>
        )}
      </button>

      <button 
        onClick={() => onTabChange("active")}
        className={`flex items-center gap-1.5 sm:gap-2.5 py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-sm font-bold border-b-[3px] transition-all whitespace-nowrap ${activeTab === "active" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}`}
      >
        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> ส่งแล้ว (ของฉัน)
        {activeCount > 0 && (
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black ${activeTab === "active" ? "bg-[#00734b] text-white" : "bg-slate-200 text-slate-500"}`}>
            {activeCount}
          </span>
        )}
      </button>

      <button 
        onClick={() => onTabChange("team")}
        className={`flex items-center gap-1.5 sm:gap-2.5 py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-sm font-bold border-b-[3px] transition-all whitespace-nowrap ${activeTab === "team" ? "border-[#00734b] text-[#00734b]" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}`}
      >
        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> ส่งแล้ว (หน่วยงาน)
      </button>

      <button 
        onClick={() => onTabChange("all")}
        className={`flex items-center gap-1.5 sm:gap-2.5 py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-sm font-bold border-b-[3px] transition-all whitespace-nowrap ${activeTab === "all" ? "border-purple-600 text-purple-600" : "border-transparent text-[#3f4942] hover:text-[#191c20]"}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> โครงการทั้งหมด (Admin)
      </button>
      
    </div>
  );
}