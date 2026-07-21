"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, FileSignature, ListChecks, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Meeting, MEETING_STATUS_COLORS, MEETING_STATUS_LABELS } from "../types";

export function MeetingWorkspaceHeader({ meeting, activeTab }: { meeting: Meeting; activeTab: "agendas" | "resolutions" }) {
  const statusColors = MEETING_STATUS_COLORS[meeting.meeting_status];
  const dateLabel = new Date(meeting.meeting_date).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-4">
      <Link href="/meetings" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[#00734b]">
        <ArrowLeft className="h-4 w-4" />กลับไปรายการประชุม
      </Link>

      <Card className="rounded-md border-[#D1CDC7] bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-[#00734b]/10 p-2 text-[#00734b]"><FileSignature className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">ครั้งที่ {meeting.meeting_no}</p>
                  <h1 className="text-xl font-extrabold leading-snug text-[#191c20]">{meeting.title}</h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pl-11 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{dateLabel}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{meeting.location}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{meeting.chairman}</span>
              </div>
            </div>
            <Badge variant="outline" className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} shrink-0 self-start px-3 py-1 text-[11px] font-bold`}>
              {MEETING_STATUS_LABELS[meeting.meeting_status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <nav className="flex w-fit items-center gap-1 rounded-full border border-[#D1CDC7] bg-white p-1 shadow-sm">
        <Link href={`/meetings/${meeting.meeting_id}/agendas`} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTab === "agendas" ? "bg-[#00734b]" : "text-slate-500"}`}>
          <ListChecks className={`${activeTab === "agendas" ? "text-white" : "text-slate-500"} h-4 w-4`} /><span className={`${activeTab === "agendas" ? "text-white" : "text-slate-500"}`}>วาระการประชุม</span>
        </Link>
        <Link href={`/meetings/${meeting.meeting_id}/resolutions`} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTab === "resolutions" ? "bg-[#00734b] text-white" : "text-slate-500 hover:text-[#00734b]"}`}>
          <FileSignature className={`${activeTab === "resolutions" ? "text-white" : "text-slate-500"} h-4 w-4`} /><span className={`${activeTab === "resolutions" ? "text-white" : "text-slate-500"}`}>บันทึกมติ</span>
        </Link>
      </nav>
    </div>
  );
}
