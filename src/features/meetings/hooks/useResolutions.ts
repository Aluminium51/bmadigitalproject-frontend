"use client";
// src/features/meetings/hooks/useResolutions.ts
// Hook จัดการมติที่ประชุม — Resolution form state, selection, save

import { useState, useMemo, useCallback } from "react";
import { mockAgendas, mockResolutions } from "../data/mock-meetings";
import {
  type Agenda,
  type Resolution,
  AgendaType,
  ResolutionStatus,
} from "../types";

interface UseResolutionsReturn {
  agendas: Agenda[];
  selectedAgendaId: string | null;
  selectedAgenda: Agenda | null;
  selectAgenda: (agendaId: string) => void;
  resolution: Resolution | null;
  updateResolutionStatus: (status: ResolutionStatus | null) => void;
  updateResolutionComment: (comment: string) => void;
  saveResolution: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  getResolutionForAgenda: (agendaId: string) => Resolution | null;
  isConsiderationAgenda: (agenda: Agenda) => boolean;
  meetingId: string;
}

export function useResolutions(meetingId: string): UseResolutionsReturn {
  // ── Agendas for this meeting ──
  const agendas = useMemo<Agenda[]>(
    () =>
      mockAgendas
        .filter((a) => a.meeting_id === meetingId)
        .sort((a, b) => a.agenda_number - b.agenda_number),
    [meetingId]
  );

  // ── Resolutions state (keyed by agenda_id) ──
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>(
    () => {
      const map: Record<string, Resolution> = {};
      mockResolutions
        .filter((r) => agendas.some((a) => a.agenda_id === r.agenda_id))
        .forEach((r) => {
          map[r.agenda_id] = { ...r };
        });
      return map;
    }
  );

  // ── Selection ──
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(
    agendas[0]?.agenda_id ?? null
  );

  const selectedAgenda = useMemo(
    () => agendas.find((a) => a.agenda_id === selectedAgendaId) ?? null,
    [agendas, selectedAgendaId]
  );

  const selectAgenda = useCallback((agendaId: string) => {
    setSelectedAgendaId(agendaId);
  }, []);

  // ── Current resolution for selected agenda ──
  const resolution = useMemo(
    () =>
      selectedAgendaId ? resolutions[selectedAgendaId] ?? null : null,
    [selectedAgendaId, resolutions]
  );

  // ── Track unsaved changes ──
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Mutations ──
  const updateResolutionStatus = useCallback(
    (status: ResolutionStatus | null) => {
      if (!selectedAgendaId) return;

      setResolutions((prev) => {
        const existing = prev[selectedAgendaId];
        return {
          ...prev,
          [selectedAgendaId]: {
            resolution_id: existing?.resolution_id ?? `RES-NEW-${Date.now()}`,
            agenda_id: selectedAgendaId,
            resolution_status: status,
            comment: existing?.comment ?? "",
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [selectedAgendaId]
  );

  const updateResolutionComment = useCallback(
    (comment: string) => {
      if (!selectedAgendaId) return;

      setResolutions((prev) => {
        const existing = prev[selectedAgendaId];
        return {
          ...prev,
          [selectedAgendaId]: {
            resolution_id: existing?.resolution_id ?? `RES-NEW-${Date.now()}`,
            agenda_id: selectedAgendaId,
            resolution_status: existing?.resolution_status ?? null,
            comment,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [selectedAgendaId]
  );

  const saveResolution = useCallback(() => {
    if (!selectedAgendaId) return;
    setIsSaving(true);

    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    }, 600);
  }, [selectedAgendaId]);

  // ── Helpers ──
  const getResolutionForAgenda = useCallback(
    (agendaId: string) => resolutions[agendaId] ?? null,
    [resolutions]
  );

  const isConsiderationAgenda = useCallback(
    (agenda: Agenda) => agenda.agenda_type === AgendaType.FOR_CONSIDERATION,
    []
  );

  return {
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
    meetingId,
  };
}
