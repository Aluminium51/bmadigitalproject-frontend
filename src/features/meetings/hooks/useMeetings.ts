"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Meeting, MeetingStatus } from "../types";
import { CLIENT_API_BASE } from "@/lib/client-api";

const API_BASE = CLIENT_API_BASE;

type ApiMeeting = {
  id: string;
  meetingNo: string;
  title: string;
  meetingTypeId: number;
  meetingDate: string;
  location?: string | null;
  meetingStatusId: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string | null;
  unresolvedResolutionCount?: number;
  creator?: { userId: string; firstName: string; lastName: string } | null;
  meetingStatus?: { id: number; code?: string | null; name: string } | null;
  meetingType?: { id: number; code?: string | null; name: string } | null;
};

export type CreateMeetingPayload = {
  meetingNo: string;
  title: string;
  meetingTypeId: number;
  meetingDate: string;
  location?: string | null;
  description?: string | null;
  startTime?: string;
  endTime?: string | null;
  meetingStatusId?: number;
};

export type UpdateMeetingPayload = Partial<CreateMeetingPayload>;
export type MeetingFilterStatus = MeetingStatus | "ALL";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(payload.message ?? payload.error ?? "Meeting request failed"), {
      status: response.status,
      data: payload,
    });
  }
  return payload as T;
}

function statusFromId(id: number): MeetingStatus {
  switch (id) {
    case 1: return MeetingStatus.SCHEDULED;
    case 2: return MeetingStatus.IN_PROGRESS;
    case 3: return MeetingStatus.COMPLETED;
    case 4: return MeetingStatus.CANCELLED;
    default: return MeetingStatus.DRAFT;
  }
}

function statusFromApi(meeting: ApiMeeting): MeetingStatus {
  const code = meeting.meetingStatus?.code;
  return code && Object.values(MeetingStatus).includes(code as MeetingStatus)
    ? code as MeetingStatus
    : statusFromId(meeting.meetingStatusId ?? 5);
}

export function normalizeMeeting(meeting: ApiMeeting): Meeting {
  const creatorName = meeting.creator
    ? `${meeting.creator.firstName} ${meeting.creator.lastName}`.trim()
    : "-";

  return {
    meeting_id: meeting.id,
    meeting_no: meeting.meetingNo,
    title: meeting.title,
    meeting_date: meeting.meetingDate,
    location: meeting.location ?? "-",
    chairman: creatorName || "-",
    meeting_status: statusFromApi(meeting),
    meeting_status_id: meeting.meetingStatusId,
    meeting_type_id: meeting.meetingTypeId,
    meeting_type: meeting.meetingType?.code === "BIG_BOARD" ? "BIG_BOARD" : "SMALL_BOARD",
    unresolved_resolution_count: meeting.unresolvedResolutionCount ?? 0,
    created_by: meeting.createdBy,
  };
}

async function fetchMeetings() {
  const response = await request<{ data: ApiMeeting[] }>("/meetings");
  return response.data.map(normalizeMeeting);
}

async function fetchMeeting(id: string) {
  const response = await request<{ data: ApiMeeting }>(`/meetings/${id}`);
  return normalizeMeeting(response.data);
}

export function useMeetings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<MeetingFilterStatus>("ALL");
  const query = useQuery({
    queryKey: ["meetings"],
    queryFn: fetchMeetings,
    staleTime: 30_000,
    refetchOnMount: "always",
  });

  const filteredMeetings = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return (query.data ?? []).filter((meeting) => {
      const matchesStatus = filterStatus === "ALL" || meeting.meeting_status === filterStatus;
      const matchesSearch = !search || [meeting.title, meeting.meeting_no, meeting.chairman]
        .some((value) => value.toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, query.data, searchQuery]);

  const getMeetingById = useCallback(
    (id: string) => (query.data ?? []).find((meeting) => meeting.meeting_id === id),
    [query.data],
  );

  return {
    meetings: query.data ?? [],
    filteredMeetings,
    searchQuery,
    filterStatus,
    setSearchQuery,
    setFilterStatus,
    getMeetingById,
    ...query,
  };
}

export function useMeeting(id: string | undefined) {
  return useQuery({
    queryKey: ["meetings", id],
    queryFn: () => fetchMeeting(id!),
    enabled: !!id,
    staleTime: 30_000,
    refetchOnMount: "always",
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMeetingPayload) =>
      request<{ data: ApiMeeting }>("/meetings", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

export function useUpdateMeeting(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateMeetingPayload) =>
      request<{ data: ApiMeeting }>(`/meetings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: async (response) => {
      queryClient.setQueryData(["meetings", id], normalizeMeeting(response.data));
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

export function useDeleteMeeting(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => request(`/meetings/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetings"] }),
        queryClient.removeQueries({ queryKey: ["meetings", id] }),
        queryClient.removeQueries({ queryKey: ["meetings", id, "agendas"] }),
      ]);
    },
  });
}

export function useTransitionMeeting(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED") =>
      request<{ data: ApiMeeting }>(`/meetings/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }),
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetings"] }),
        queryClient.invalidateQueries({ queryKey: ["meetings", id] }),
      ]);
    },
  });
}

export function useCancelMeeting(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => request<{ data: ApiMeeting }>(`/meetings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetings"] }),
        queryClient.invalidateQueries({ queryKey: ["meetings", id] }),
        queryClient.invalidateQueries({ queryKey: ["meetings", id, "agendas"] }),
      ]);
    },
  });
}
