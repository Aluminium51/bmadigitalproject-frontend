// src/features/proposals/hooks/useAutoSaveForm.ts
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ProposalDraftValues } from "../types";
import { useProposalFormStore } from "../stores/useProposalFormStore";
import { useAutoSaveDraft } from "./useProposalMutations";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api/v1";
const DEBOUNCE_MS = 1000;

function serializeFormValue(value: unknown): unknown {
  if (typeof File !== "undefined" && value instanceof File) return undefined;
  if (typeof Blob !== "undefined" && value instanceof Blob) return undefined;
  if (Array.isArray(value)) return value.map(serializeFormValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, serializeFormValue(child)]),
  );
}

function toDraftRequest(formPayload: Record<string, unknown>) {
  const request: Record<string, unknown> = { draftPayload: formPayload };
  for (const key of ["projectName", "objective", "totalBudget"]) {
    if (formPayload[key] !== undefined) request[key] = formPayload[key];
  }
  return request;
}

export const useAutoSaveForm = (projectId: string | undefined, disabled = false) => {
  const { watch } = useFormContext<ProposalDraftValues>();
  const { setLastSavedAt } = useProposalFormStore();
  const { mutate: saveDraft } = useAutoSaveDraft(projectId);
  const lastPayloadRef = useRef("");
  const latestPayloadRef = useRef<Record<string, unknown> | null>(null);
  const latestSerializedRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disabled) return;

    const saveLatestWithMutation = () => {
      const payload = latestPayloadRef.current;
      const serialized = latestSerializedRef.current;
      if (!projectId || !payload || !serialized || serialized === lastPayloadRef.current) return;

      lastPayloadRef.current = serialized;
      latestPayloadRef.current = null;
      saveDraft(toDraftRequest(payload), {
        onSuccess: () => setLastSavedAt(new Date().toISOString()),
      });
    };

    const saveLatestForUnload = () => {
      const payload = latestPayloadRef.current;
      const serialized = latestSerializedRef.current;
      if (!projectId || !payload || !serialized || serialized === lastPayloadRef.current) return;

      lastPayloadRef.current = serialized;
      latestPayloadRef.current = null;
      void fetch(`${API_BASE}/proposals/projects/${projectId}/draft`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDraftRequest(payload)),
        keepalive: true,
      });
    };

    const subscription = watch((value) => {
      const payload = serializeFormValue(value) as Record<string, unknown>;
      latestPayloadRef.current = payload;
      latestSerializedRef.current = JSON.stringify(payload);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(saveLatestWithMutation, DEBOUNCE_MS);
    });

    window.addEventListener("pagehide", saveLatestForUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("pagehide", saveLatestForUnload);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Route changes do not always emit pagehide. Flush the latest values
      // before the wizard unmounts so navigation cannot discard recent edits.
      saveLatestWithMutation();
    };
  }, [disabled, projectId, saveDraft, setLastSavedAt, watch]);
};
