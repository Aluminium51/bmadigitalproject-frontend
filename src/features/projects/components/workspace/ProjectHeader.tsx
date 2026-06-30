import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "../../types/workspace";

interface ProjectHeaderProps {
  project: ProjectDetail;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 mb-6">
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00734b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้ารวมโครงการ
      </button>

      <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-status-orange border-orange-200 font-bold text-[11px] px-2.5 py-0.5 rounded-md"
                >
                  แบบร่าง (Draft)
                </Badge>
                <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {project.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight leading-snug break-words">
                {project.name}
              </h1>

              <div className="flex flex-col sm:flex-row flex-wrap gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    หน่วยงานที่รับผิดชอบ
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                      <Building2 className="w-4 h-4 text-[#00734b]" />
                    </div>
                    {project.agency}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    ปีงบประมาณ
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                      <CalendarDays className="w-4 h-4 text-[#00734b]" />
                    </div>
                    พ.ศ. {project.fiscalYear}
                  </div>
                </div>
              </div>
            </div>

            <Button className="gap-2 bg-[#00734b] hover:bg-[#005838] text-white rounded-md px-6 h-11 font-bold shadow-sm shrink-0 self-start transition-all active:scale-95">
              <Send className="w-4 h-4" />
              ส่งข้อเสนอโครงการ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
