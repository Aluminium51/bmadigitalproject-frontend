import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ProposalDraftValues } from "../types";
import { useProposalFormStore } from "../stores/useProposalFormStore";
import { useAutoSaveDraft } from "./useProposalMutations";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ?? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081"}/api/v1`;
const DEBOUNCE_MS = 1800;

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

export type AutoSaveHandle = {
  flush: () => Promise<boolean>;
};

export const useAutoSaveForm = (projectId: string | undefined, disabled = false): AutoSaveHandle => {
  const { watch } = useFormContext<ProposalDraftValues>();
  const { setLastSavedAt } = useProposalFormStore();
  const { mutateAsync: saveDraftAsync } = useAutoSaveDraft(projectId);
  const latestSaveDraftRef = useRef(saveDraftAsync);
  const latestPayloadRef = useRef<Record<string, unknown> | null>(null);
  const latestSerializedRef = useRef("");
  const lastSavedSerializedRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<boolean> | null>(null);
  const flushRef = useRef<() => Promise<boolean>>(async () => true);

  latestSaveDraftRef.current = saveDraftAsync;

  const flush = useCallback(() => flushRef.current(), []);

  useEffect(() => {
    if (disabled || !projectId) {
      flushRef.current = async () => true;
      return;
    }

    let mounted = true;

    const saveLatest = async (): Promise<boolean> => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const payload = latestPayloadRef.current;
      const serialized = latestSerializedRef.current;
      if (!payload || !serialized || serialized === lastSavedSerializedRef.current) return true;

      // If a request is already running, wait for it and then save the latest
      // snapshot. This prevents older requests from racing newer form values.
      if (inFlightRef.current) {
        const running = inFlightRef.current;
        return running.then(async (result) => {
          if (latestSerializedRef.current !== lastSavedSerializedRef.current) {
            return saveLatest();
          }
          return result;
        });
      }

      const request = (async () => {
        try {
          await latestSaveDraftRef.current(toDraftRequest(payload));
          // Mark the payload only after the server confirms success. Failed
          // payloads remain eligible for retry instead of being lost.
          lastSavedSerializedRef.current = serialized;
          setLastSavedAt(new Date().toISOString());
          return true;
        } catch (error) {
          if (mounted) {
            toast.error("Draft save failed", {
              description: error instanceof Error
                ? error.message
                : "Your changes could not be saved. Please try again.",
            });
          }
          return false;
        } finally {
          inFlightRef.current = null;
        }
      })();

      inFlightRef.current = request;
      return request;
    };

    const scheduleSave = (delay = DEBOUNCE_MS) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void saveLatest();
      }, delay);
    };

    const saveLatestForUnload = () => {
      const payload = latestPayloadRef.current;
      const serialized = latestSerializedRef.current;
      if (!payload || !serialized || serialized === lastSavedSerializedRef.current) return;

      void fetch(`${API_BASE}/proposals/projects/${projectId}/draft`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDraftRequest(payload)),
        keepalive: true,
      }).catch(() => undefined);
    };

    const subscription = watch((value) => {
      const payload = serializeFormValue(value) as Record<string, unknown>;
      latestPayloadRef.current = payload;
      latestSerializedRef.current = JSON.stringify(payload);
      scheduleSave();
    });

    flushRef.current = saveLatest;
    window.addEventListener("pagehide", saveLatestForUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("pagehide", saveLatestForUnload);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Flush on route changes/unmount so Save Draft does not depend solely on
      // pagehide firing. The mutation is allowed to finish after unmount.
      void saveLatest();

      if (flushRef.current === saveLatest) flushRef.current = async () => true;
      mounted = false;
    };
  }, [disabled, projectId, setLastSavedAt, watch]);

  return { flush };
};
