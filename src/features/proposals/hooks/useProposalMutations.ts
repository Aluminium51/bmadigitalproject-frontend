// src/features/proposals/hooks/useProposalMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProposalFormStore } from "../stores/useProposalFormStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api/v1";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
async function apiFetch(url: string, options: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const json = await res.json();
  if (!res.ok) throw Object.assign(new Error(json.message ?? "API error"), { status: res.status, data: json });
  return json;
}

// ---------------------------------------------------------------------------
// 1. Initialize Draft (POST)
//    Creates empty draft if not already present — idempotent.
// ---------------------------------------------------------------------------
export function useInitializeDraft(projectId: string | undefined) {
  return useMutation({
    mutationFn: () =>
      apiFetch(`${API_BASE}/proposals/projects/${projectId}/draft`, { method: "POST", body: "{}"}),
    onError: (error) => {
      console.error("[useInitializeDraft] Failed to initialize draft:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// 2. Auto-Save Draft (PATCH)
//    Called by useAutoSaveForm after debounce.
// ---------------------------------------------------------------------------
export function useAutoSaveDraft(projectId: string | undefined) {
  const { setSaveStatus } = useProposalFormStore();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch(`${API_BASE}/proposals/projects/${projectId}/draft`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onMutate: () => {
      setSaveStatus("saving");
    },
    onSuccess: () => {
      setSaveStatus("saved");
    },
    onError: (error) => {
      console.warn("[useAutoSaveDraft] Auto-save failed:", error);
      setSaveStatus("error");
    },
  });
}

// ---------------------------------------------------------------------------
// 3. Submit Proposal (POST)
//    Final submission with strict validation on the backend.
// ---------------------------------------------------------------------------
export function useSubmitProposal() {
  const { resetForm } = useProposalFormStore();
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch(`${API_BASE}/proposals/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data, variables) => {
      // Invalidate draft query so it returns null after deletion
      const projectId = (variables as any).projectId;
      if (projectId) {
        qc.invalidateQueries({ queryKey: ["proposals", "draft", projectId] });
      }
      qc.invalidateQueries({ queryKey: ["proposals"] });

      resetForm();

      // Redirect to the proposal detail or project page
      const proposalId = data?.data?.proposalId;
      if (proposalId) {
        router.push(`/proposals/${proposalId}`);
      } else if (projectId) {
        router.push(`/projects/${projectId}`);
      }
    },
    onError: (error) => {
      console.error("[useSubmitProposal] Submission failed:", error);
    },
  });
}
