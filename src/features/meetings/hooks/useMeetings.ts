"use client";
// src/features/meetings/hooks/useMeetings.ts
// Hook จัดการข้อมูลการประชุม — Meeting list state, filtering, sorting

import { useState, useMemo, useCallback } from "react";
import { mockMeetings } from "../data/mock-meetings";
import { type Meeting, MeetingStatus } from "../types";

export type MeetingFilterStatus = MeetingStatus | "ALL";

interface UseMeetingsReturn {
  meetings: Meeting[];
  filteredMeetings: Meeting[];
  searchQuery: string;
  filterStatus: MeetingFilterStatus;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: MeetingFilterStatus) => void;
  getMeetingById: (id: string) => Meeting | undefined;
}

export function useMeetings(): UseMeetingsReturn {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<MeetingFilterStatus>("ALL");

  // ── Filter & Search ──
  const filteredMeetings = useMemo(() => {
    let result = [...meetings];

    // Filter by status
    if (filterStatus !== "ALL") {
      result = result.filter((m) => m.meeting_status === filterStatus);
    }

    // Search by title or meeting number
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.meeting_no.toLowerCase().includes(q) ||
          m.chairman.toLowerCase().includes(q)
      );
    }

    // Sort: newest first by date
    result.sort((a, b) => b.meeting_date.localeCompare(a.meeting_date));

    return result;
  }, [meetings, searchQuery, filterStatus]);

  // ── Lookup ──
  const getMeetingById = useCallback(
    (id: string) => meetings.find((m) => m.meeting_id === id),
    [meetings]
  );

  return {
    meetings,
    filteredMeetings,
    searchQuery,
    filterStatus,
    setSearchQuery,
    setFilterStatus,
    getMeetingById,
  };
}
