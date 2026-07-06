// src/features/proposals/hooks/useProposalDraftQuery.ts
import { useQuery } from "@tanstack/react-query";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api/v1";

async function fetchDraft(projectId: string) {
  const res = await fetch(`${API_BASE}/proposals/projects/${projectId}/draft`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch draft: ${res.status}`);
  return res.json() as Promise<{ data: Record<string, unknown> | null; message?: string }>;
}

/**
 * useGetDraft — fetches the current draft for a given project.
 *
 * Returns { draft, isLoading, isError }.
 * `draft` will be null if no draft exists yet.
 */
export function useGetDraft(projectId: string | undefined) {
  return useQuery({
    queryKey: ["proposals", "draft", projectId],
    queryFn: () => fetchDraft(projectId!),
    enabled: !!projectId,
    select: (res) => res.data,  // unwrap the { data } envelope
  });
}
