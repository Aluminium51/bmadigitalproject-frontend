// src/features/projects/components/ProjectTable.tsx
import { useRouter } from "next/navigation";
import { MoreVertical, ArrowRight, FileSpreadsheet, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabType } from "../hooks/useProjects";

interface ProjectTableProps {
  data: any[];
  activeTab: TabType;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Review": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> รอตรวจสอบ</span>;
    case "In Analysis": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 w-fit">กำลังวิเคราะห์</span>;
    case "Approved": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00734b]/10 text-[#00734b] flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> อนุมัติแล้ว</span>;
    case "Need Revision": return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 flex items-center gap-1 w-fit border border-red-200 shadow-sm"><AlertCircle className="w-3 h-3"/> ต้องแก้ไข</span>;
    default: return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 w-fit">{status}</span>;
  }
};

export function ProjectTable({ data, activeTab }: ProjectTableProps) {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="p-16 text-center text-muted-foreground font-medium">
        {activeTab === "drafts" ? "🎉 ยอดเยี่ยม! คุณไม่มีแบบร่างค้างทำเลย" : "ยังไม่มีข้อมูลโครงการในหมวดหมู่นี้"}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white sticky top-0 text-slate-400 font-bold z-10 border-b border-[#ededf4] text-[13px] uppercase tracking-wide">
          <tr>
            <th className="px-6 sm:px-10 py-4">รหัสโครงการ</th>
            <th className="px-6 sm:px-10 py-4 w-full">ชื่อโครงการ</th>
            {activeTab === "all" && <th className="px-6 sm:px-10 py-4">หน่วยงาน</th>}
            {(activeTab === "team" || activeTab === "all") && <th className="px-6 sm:px-10 py-4">ผู้รับผิดชอบ</th>}
            <th className="px-6 sm:px-10 py-4 min-w-50">{activeTab === "drafts" ? "ความคืบหน้า" : "สถานะ"}</th>
            <th className="px-6 sm:px-10 py-4">อัปเดตล่าสุด</th>
            <th className="px-6 sm:px-10 py-4 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ededf4]">
          {data.map((project) => {
            const isReturned = project.status === "Need Revision";
            const rowClass = isReturned && activeTab !== "drafts" 
              ? "bg-red-50/40 hover:bg-red-50/70 cursor-pointer transition-colors group" 
              : "hover:bg-surface-variant/40 cursor-pointer transition-colors group";

            return (
              <tr key={project.id} className={rowClass} onClick={() => router.push(`/projects/${project.id}`)}>
                <td className="px-6 sm:px-10 py-5 font-mono text-xs text-muted-foreground">
                   {isReturned && activeTab !== "drafts" && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
                   {project.id}
                </td>
                <td className={`px-6 sm:px-10 py-5 font-bold ${isReturned && activeTab !== "drafts" ? "text-red-700" : "text-[#191c20] group-hover:text-[#00734b]"}`}>
                  {project.name}
                </td>
                
                {activeTab === "all" && <td className="px-6 sm:px-10 py-5 text-[#3f4942] font-semibold">{project.agency}</td>}
                
                {(activeTab === "team" || activeTab === "all") && (
                  <td className="px-6 sm:px-10 py-5 text-[#3f4942]">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#00734b]/10 text-[#00734b] flex items-center justify-center text-xs font-bold border border-[#00734b]/20">
                        {project.owner?.[0] || "ธ"}
                      </div>
                      <span className="font-medium">{project.owner || "คุณธนาธร (คุณ)"}</span>
                    </div>
                  </td>
                )}

                <td className="px-6 sm:px-10 py-5">
                  {activeTab === "drafts" ? (
                     <div className="flex items-center gap-2">
                       <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${project.formProgress === "5/5" ? "text-[#00734b] bg-[#00734b]/10 border-[#00734b]/20" : "text-status-orange bg-orange-100 border-status-orange/20"}`}>
                         <FileSpreadsheet className="w-3 h-3" /> ฟอร์ม {project.formProgress}
                       </span>
                       <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${project.docProgress === "4/4" ? "text-[#00734b] bg-[#00734b]/10 border-[#00734b]/20" : "text-red-600 bg-red-50 border-red-200"}`}>
                         <FileText className="w-3 h-3" /> เอกสาร {project.docProgress}
                       </span>
                     </div>
                  ) : getStatusBadge(project.status)}
                </td>

                <td className="px-6 sm:px-10 py-5 text-[#3f4942] text-xs">{project.lastEdit}</td>
                
                <td className="px-6 sm:px-10 py-5 text-right">
                  {activeTab === "drafts" ? (
                    <Button variant="ghost" className="rounded-full text-status-orange font-bold hover:text-status-orange hover:bg-orange-100 h-9 px-4">
                      เขียนต่อ <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  ) : isReturned ? (
                    <Button variant="ghost" className="rounded-full text-red-600 bg-red-100 font-bold hover:bg-red-200 h-9 px-4 shadow-sm border border-red-200">
                      แก้ไขด่วน <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  ) : (
                    <button className="p-2 rounded-full text-muted-foreground hover:text-[#191c20] hover:bg-slate-200 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}