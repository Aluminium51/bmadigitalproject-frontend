"use client";

import { ChangeEvent, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENT_API_BASE } from "@/lib/client-api";
import { useMeetingFiles, type MeetingFile } from "../hooks/useMeetingFiles";
import { useHasRole } from "@/features/auth/RoleContext";

export function MeetingFilesPanel({ meetingId }: { meetingId: string }) {
  const isSecretary = useHasRole("secretary");
  if (!isSecretary) return null;
  return <SecretaryMeetingFilesPanel meetingId={meetingId} />;
}

function SecretaryMeetingFilesPanel({ meetingId }: { meetingId: string }) {
  const files = useMeetingFiles(meetingId);
  const [documentType, setDocumentType] = useState<MeetingFile["documentType"]>("MEETING_DOCUMENT");

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await files.uploadFile({ file, documentType });
      toast.success("อัปโหลดเอกสารสำเร็จ");
    } catch (error) {
      toast.error("อัปโหลดเอกสารไม่สำเร็จ", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div className="min-w-0">
          <CardTitle className="text-base">เอกสารการประชุม</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">เฉพาะเลขานุการเท่านั้นที่เข้าถึงเอกสารส่วนนี้ได้</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Select value={documentType} onValueChange={(value) => setDocumentType(value as MeetingFile["documentType"])}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MEETING_DOCUMENT">เอกสารประกอบ</SelectItem>
              <SelectItem value="MEETING_MINUTES">รายงานการประชุม</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild disabled={files.isUploading} className="text-white">
            <label className="cursor-pointer">
              {files.isUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
              อัปโหลด
              <input type="file" className="sr-only" onChange={upload} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
            </label>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {files.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">กำลังโหลดเอกสาร...</p>
        ) : files.files.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">ยังไม่มีเอกสารการประชุม</p>
        ) : (
          <ul className="divide-y">
            {files.files.map((file) => (
              <li key={file.id} className="flex min-w-0 items-center gap-3 px-5 py-4">
                <FileText className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" title={file.originalFileName ?? ""}>
                    {file.originalFileName ?? "เอกสารไม่มีชื่อ"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file.documentType === "MEETING_MINUTES" ? "รายงานการประชุม" : "เอกสารประกอบ"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`${CLIENT_API_BASE}/meetings/${meetingId}/files/${file.id}/download`} title="ดาวน์โหลด">
                    <Download className="size-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={files.isDeleting}
                  title="ลบเอกสาร"
                  onClick={() => files.deleteFile(file.id).catch((error) => toast.error(error.message))}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
