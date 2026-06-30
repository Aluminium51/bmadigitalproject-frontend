"use client";
// src/features/meetings/hooks/useAgendas.ts
// Hook จัดการวาระการประชุม — Agenda ordering, grouping, project linking

import { useState, useMemo, useCallback } from "react";
import { mockAgendas, mockProjects } from "../data/mock-meetings";
import {
  type Agenda,
  type Project,
  type GroupedAgendas,
  AgendaType,
  AGENDA_TYPE_LABELS,
  AGENDA_TYPE_ORDER,
} from "../types";

interface UseAgendasReturn {
  agendas: Agenda[];
  groupedAgendas: GroupedAgendas[];
  availableProjects: Project[];
  moveAgendaUp: (agendaId: string) => void;
  moveAgendaDown: (agendaId: string) => void;
  linkProject: (agendaId: string, projectId: string) => void;
  unlinkProject: (agendaId: string) => void;
  isFirstInGroup: (agendaId: string) => boolean;
  isLastInGroup: (agendaId: string) => boolean;
  meetingId: string;
}

export function useAgendas(meetingId: string): UseAgendasReturn {
  const [agendas, setAgendas] = useState<Agenda[]>(() =>
    mockAgendas
      .filter((a) => a.meeting_id === meetingId)
      .sort((a, b) => a.agenda_number - b.agenda_number)
  );

  // ── Group agendas by type ──
  const groupedAgendas = useMemo<GroupedAgendas[]>(() => {
    return AGENDA_TYPE_ORDER.map((type) => ({
      type,
      label: AGENDA_TYPE_LABELS[type],
      agendas: agendas.filter((a) => a.agenda_type === type),
    })).filter((group) => group.agendas.length > 0);
  }, [agendas]);

  // ── Available projects (not yet linked) ──
  const availableProjects = useMemo(() => {
    const linkedProjectIds = new Set(
      agendas.filter((a) => a.project_id).map((a) => a.project_id)
    );
    return mockProjects.filter((p) => !linkedProjectIds.has(p.project_id));
  }, [agendas]);

  // ── Reorder within a group ──
  const getGroupAgendas = useCallback(
    (agendaId: string): Agenda[] => {
      const agenda = agendas.find((a) => a.agenda_id === agendaId);
      if (!agenda) return [];
      return agendas.filter((a) => a.agenda_type === agenda.agenda_type);
    },
    [agendas]
  );

  const isFirstInGroup = useCallback(
    (agendaId: string): boolean => {
      const group = getGroupAgendas(agendaId);
      return group.length === 0 || group[0].agenda_id === agendaId;
    },
    [getGroupAgendas]
  );

  const isLastInGroup = useCallback(
    (agendaId: string): boolean => {
      const group = getGroupAgendas(agendaId);
      return group.length === 0 || group[group.length - 1].agenda_id === agendaId;
    },
    [getGroupAgendas]
  );

  const moveAgendaUp = useCallback(
    (agendaId: string) => {
      setAgendas((prev) => {
        const target = prev.find((a) => a.agenda_id === agendaId);
        if (!target) return prev;

        const groupItems = prev.filter((a) => a.agenda_type === target.agenda_type);
        const idxInGroup = groupItems.findIndex((a) => a.agenda_id === agendaId);
        if (idxInGroup <= 0) return prev; // Already first — no-op

        // Swap agenda_number with the item above
        const aboveItem = groupItems[idxInGroup - 1];
        return prev.map((a) => {
          if (a.agenda_id === agendaId) {
            return { ...a, agenda_number: aboveItem.agenda_number };
          }
          if (a.agenda_id === aboveItem.agenda_id) {
            return { ...a, agenda_number: target.agenda_number };
          }
          return a;
        }).sort((a, b) => a.agenda_number - b.agenda_number);
      });
    },
    []
  );

  const moveAgendaDown = useCallback(
    (agendaId: string) => {
      setAgendas((prev) => {
        const target = prev.find((a) => a.agenda_id === agendaId);
        if (!target) return prev;

        const groupItems = prev.filter((a) => a.agenda_type === target.agenda_type);
        const idxInGroup = groupItems.findIndex((a) => a.agenda_id === agendaId);
        if (idxInGroup < 0 || idxInGroup >= groupItems.length - 1) return prev; // Already last

        const belowItem = groupItems[idxInGroup + 1];
        return prev.map((a) => {
          if (a.agenda_id === agendaId) {
            return { ...a, agenda_number: belowItem.agenda_number };
          }
          if (a.agenda_id === belowItem.agenda_id) {
            return { ...a, agenda_number: target.agenda_number };
          }
          return a;
        }).sort((a, b) => a.agenda_number - b.agenda_number);
      });
    },
    []
  );

  // ── Project linking ──
  const linkProject = useCallback(
    (agendaId: string, projectId: string) => {
      const project = mockProjects.find((p) => p.project_id === projectId);
      if (!project) return;

      setAgendas((prev) =>
        prev.map((a) =>
          a.agenda_id === agendaId
            ? { ...a, project_id: projectId, project }
            : a
        )
      );
    },
    []
  );

  const unlinkProject = useCallback(
    (agendaId: string) => {
      setAgendas((prev) =>
        prev.map((a) =>
          a.agenda_id === agendaId
            ? { ...a, project_id: null, project: null }
            : a
        )
      );
    },
    []
  );

  return {
    agendas,
    groupedAgendas,
    availableProjects,
    moveAgendaUp,
    moveAgendaDown,
    linkProject,
    unlinkProject,
    isFirstInGroup,
    isLastInGroup,
    meetingId,
  };
}
