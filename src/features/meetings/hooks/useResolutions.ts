"use client";

import { useCallback, useMemo, useState } from "react";
import { useAgendas } from "./useAgendas";
import { Agenda, AgendaType, Resolution, ResolutionStatus } from "../types";

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
  isLoading: boolean;
  isError: boolean;
}

export function useResolutions(meetingId: string): UseResolutionsReturn {
  const { agendas, isLoading, isError } = useAgendas(meetingId);
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>({});
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const effectiveSelectedAgendaId = useMemo(() => {
    if (selectedAgendaId && agendas.some((agenda) => agenda.agenda_id === selectedAgendaId)) return selectedAgendaId;
    return agendas[0]?.agenda_id ?? null;
  }, [agendas, selectedAgendaId]);
  const selectedAgenda = agendas.find((agenda) => agenda.agenda_id === effectiveSelectedAgendaId) ?? null;
  const resolution = effectiveSelectedAgendaId ? resolutions[effectiveSelectedAgendaId] ?? null : null;

  const selectAgenda = useCallback((agendaId: string) => {
    setSelectedAgendaId(agendaId);
  }, []);

  const updateResolutionStatus = useCallback((status: ResolutionStatus | null) => {
    if (!effectiveSelectedAgendaId) return;
    setResolutions((previous) => {
      const existing = previous[effectiveSelectedAgendaId];
      return {
        ...previous,
        [effectiveSelectedAgendaId]: {
          resolution_id: existing?.resolution_id ?? `RES-NEW-${Date.now()}`,
          agenda_id: effectiveSelectedAgendaId,
          resolution_status: status,
          comment: existing?.comment ?? "",
        },
      };
    });
    setHasUnsavedChanges(true);
  }, [effectiveSelectedAgendaId]);

  const updateResolutionComment = useCallback((comment: string) => {
    if (!effectiveSelectedAgendaId) return;
    setResolutions((previous) => {
      const existing = previous[effectiveSelectedAgendaId];
      return {
        ...previous,
        [effectiveSelectedAgendaId]: {
          resolution_id: existing?.resolution_id ?? `RES-NEW-${Date.now()}`,
          agenda_id: effectiveSelectedAgendaId,
          resolution_status: existing?.resolution_status ?? null,
          comment,
        },
      };
    });
    setHasUnsavedChanges(true);
  }, [effectiveSelectedAgendaId]);

  const saveResolution = useCallback(() => {
    if (!effectiveSelectedAgendaId) return;
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    }, 600);
  }, [effectiveSelectedAgendaId]);

  const getResolutionForAgenda = useCallback(
    (agendaId: string) => resolutions[agendaId] ?? null,
    [resolutions],
  );

  const isConsiderationAgenda = useCallback(
    (agenda: Agenda) => agenda.agenda_type === AgendaType.FOLLOW_UP || agenda.agenda_type === AgendaType.FOR_CONSIDERATION,
    [],
  );

  return {
    agendas,
    selectedAgendaId: effectiveSelectedAgendaId,
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
    isLoading,
    isError,
  };
}
