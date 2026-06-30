"use client";
// src/app/(protected)/meetings/[id]/resolutions/page.tsx
// หน้าบันทึกมติที่ประชุม — Resolution Recording with Split-View

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  FileSignature,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResolutionSplitView } from "@/features/meetings/components/ResolutionSplitView";
import { useResolutions } from "@/features/meetings/hooks/useResolutions";
import { useMeetings } from "@/features/meetings/hooks/useMeetings";
import {
  MEETING_STATUS_LABELS,
  MEETING_STATUS_COLORS,
} from "@/features/meetings/types";

export default function ResolutionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getMeetingById } = useMeetings();
  const {
    agendas,
    selectedAgendaId,
    selectedAgenda,
    selectAgenda,
    resolution,
    updateResolutionStatus,
    updateResolutionComment,
    saveResolution,
    isSaving,
    hasUnsavedChanges,
    getResolutionForAgenda,
    isConsiderationAgenda,
  } = useResolutions(id);

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
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ── Back + Meeting Header ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#00734b] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปรายการประชุม
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            href={`/meetings/${id}/agendas`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#00734b] transition-colors font-medium"
          >
            <ListChecks className="w-3.5 h-3.5" />
            จัดการวาระ
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-[#ededf4] shadow-[0px_4px_24px_rgba(0,0,0,0.04)] p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <FileSignature className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono">
                    ครั้งที่ {meeting.meeting_no} — บันทึกมติ
                  </p>
                  <h1 className="text-lg font-bold text-[#191c20] leading-snug">
                    {meeting.title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pl-[46px]">
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

      {/* ── Split-View ── */}
      <ResolutionSplitView
        agendas={agendas}
        selectedAgendaId={selectedAgendaId}
        selectedAgenda={selectedAgenda}
        resolution={resolution}
        onSelectAgenda={selectAgenda}
        onUpdateStatus={updateResolutionStatus}
        onUpdateComment={updateResolutionComment}
        onSave={saveResolution}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        getResolutionForAgenda={getResolutionForAgenda}
        isConsiderationAgenda={isConsiderationAgenda}
      />
    </div>
  );
}
