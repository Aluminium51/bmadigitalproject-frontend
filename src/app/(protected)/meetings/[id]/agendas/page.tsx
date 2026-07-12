"use client";
// src/app/(protected)/meetings/[id]/agendas/page.tsx
// หน้าจัดการวาระการประชุม — Agenda Management for a specific meeting

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgendaDragDropList } from "@/features/meetings/components/AgendaDragDropList";
import { useAgendas } from "@/features/meetings/hooks/useAgendas";
import { useMeetings } from "@/features/meetings/hooks/useMeetings";
import {
  MEETING_STATUS_LABELS,
  MEETING_STATUS_COLORS,
} from "@/features/meetings/types";

export default function AgendasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getMeetingById } = useMeetings();
  const {
    groupedAgendas,
    availableProjects,
    moveAgendaUp,
    moveAgendaDown,
    linkProject,
    unlinkProject,
    isFirstInGroup,
    isLastInGroup,
  } = useAgendas(id);

  const meeting = getMeetingById(id);

  if (!meeting) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <CalendarDays className="w-16 h-16 mx-auto mb-4 text-slate-200" />
        <h2 className="text-xl font-bold text-slate-500">
          ไม่พบข้อมูลการประชุม
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          การประชุมที่คุณกำลังค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ
        </p>
        <Link href="/meetings">
          <Button variant="outline" className="mt-6 gap-1.5 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            กลับไปรายการประชุม
          </Button>
        </Link>
      </div>
    );
  }

  const statusColors = MEETING_STATUS_COLORS[meeting.meeting_status];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Back + Meeting Header ── */}
      <div className="space-y-4">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#00734b] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปรายการประชุม
        </Link>

        <div className="bg-white rounded-md border border-[#ededf4] shadow-level-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div>
                  <p className="text-xs text-muted-foreground font-mono">
                    ครั้งที่ {meeting.meeting_no}
                  </p>
                  <h1 className="text-lg font-bold text-[#191c20] leading-snug">
                    {meeting.title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {meeting.meeting_date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {meeting.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {meeting.chairman}
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} font-bold text-[11px] px-3 py-1 shrink-0 self-start`}
            >
              {MEETING_STATUS_LABELS[meeting.meeting_status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Section Title ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#191c20]">
          จัดการวาระการประชุม
        </h2>
        <p className="text-xs text-muted-foreground">
          ใช้ลูกศร ↑ ↓ เพื่อเรียงลำดับวาระภายในกลุ่ม
        </p>
      </div>

      {/* ── Agenda List ── */}
      <AgendaDragDropList
        groupedAgendas={groupedAgendas}
        availableProjects={availableProjects}
        onMoveUp={moveAgendaUp}
        onMoveDown={moveAgendaDown}
        onLinkProject={linkProject}
        onUnlinkProject={unlinkProject}
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
      />
    </div>
  );
}
