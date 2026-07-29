"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CLIENT_API_BASE } from "@/lib/client-api";

export type MeetingFile = {
  id: string;
  meetingId: string;
  documentType: "MEETING_DOCUMENT" | "MEETING_MINUTES";
  originalFileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

async function parse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(payload.message ?? "ไม่สามารถจัดการเอกสารการประชุมได้"), {
      status: response.status,
    });
  }
  return payload;
}

export function useMeetingFiles(meetingId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["meetings", meetingId, "files"];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${CLIENT_API_BASE}/meetings/${meetingId}/files`, {
        credentials: "include",
      });
      return (await parse(response)).data as MeetingFile[];
    },
  });
  const upload = useMutation({
    mutationFn: async ({ file, documentType }: {
      file: File;
      documentType: MeetingFile["documentType"];
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      return parse(await fetch(`${CLIENT_API_BASE}/meetings/${meetingId}/files`, {
        method: "POST",
        credentials: "include",
        body: formData,
      }));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
  const remove = useMutation({
    mutationFn: (fileId: string) => fetch(
      `${CLIENT_API_BASE}/meetings/${meetingId}/files/${fileId}`,
      { method: "DELETE", credentials: "include" },
    ).then(parse),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
  return {
    ...query,
    files: query.data ?? [],
    uploadFile: upload.mutateAsync,
    deleteFile: remove.mutateAsync,
    isUploading: upload.isPending,
    isDeleting: remove.isPending,
  };
}
