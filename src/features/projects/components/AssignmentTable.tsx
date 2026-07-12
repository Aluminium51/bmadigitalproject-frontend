"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2 } from "lucide-react";

// --- Types ---
export type Analyst = { id: string; name: string; workload: number };
export type ProjectForAssign = {
  id: string; code: string; name: string; agency: string;
  type: string; status: string; analystId: string | null;
};

interface AssignmentTableProps {
  projects: ProjectForAssign[];
  analysts: Analyst[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAssignSingle: (projectId: string, analystId: string) => void;
  onAssignBulk: (analystId: string) => void;
  onOpenDetails: (project: ProjectForAssign) => void;
}

export function AssignmentTable({
  projects, analysts, selectedIds,
  onSelectToggle, onSelectAll, onAssignSingle, onAssignBulk, onOpenDetails
}: AssignmentTableProps) {

  const isAllSelected = projects.length > 0 && selectedIds.length === projects.length;

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">

      {/* --- Bulk Action Floating Bar --- */}
      {selectedIds.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4 fade-in">
          <span className="text-sm font-medium px-2">
            เลือกแล้ว <span className="text-orange-400 font-bold text-lg">{selectedIds.length}</span> รายการ
          </span>
          <div className="h-5 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => onAssignBulk(val)}>
              <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-white min-w-[200px]">
                <SelectValue placeholder="เลือกนักวิเคราะห์ให้ทุกรายการ..." />
              </SelectTrigger>
              <SelectContent>
                {analysts.map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} <span className="text-slate-400 ml-1">(งาน: {a.workload})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* --- Table --- */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white sticky top-0 text-slate-500 font-bold z-10 border-b border-[#ededf4] text-[12px] uppercase tracking-wide">
            <tr>
              <th className="px-4 py-4 w-12 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </th>
              <th className="px-4 py-4">รหัสโครงการ</th>
              <th className="px-4 py-4 w-full">ชื่อโครงการ & หน่วยงาน</th>
              <th className="px-4 py-4">ประเภท</th>
              <th className="px-4 py-4 min-w-55">นักวิเคราะห์ (ผู้รับผิดชอบ)</th>
              <th className="px-4 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ededf4]">
            {projects.map((project) => {
              const isSelected = selectedIds.includes(project.id);
              return (
                <tr key={project.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-4 py-4 text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(project.id)}
                    />
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{project.code}</td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#191c20] truncate max-w-[300px] lg:max-w-md">{project.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{project.agency}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {project.type}
                    </span>
                  </td>

                  {/* Inline Assignment Dropdown */}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={project.analystId || ""}
                      onValueChange={(val) => onAssignSingle(project.id, val)}
                    >
                      <SelectTrigger className={`h-9 bg-white ${project.analystId ? 'border-[#00734b] text-[#00734b] bg-[#00734b]/5' : 'border-orange-300'}`}>
                        <SelectValue placeholder="-- มอบหมายงาน --" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysts.map(a => (
                          <SelectItem key={a.id} value={a.id}>
                            <div className="flex items-center justify-between w-full min-w-[150px]">
                              <span>{a.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-2 ${a.workload > 3 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                ภาระงาน: {a.workload}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => onOpenDetails(project)}
                      className="rounded-full text-slate-500 hover:text-[#00734b] hover:bg-[#00734b]/10 h-8 px-3"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> รายละเอียด
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
