import { useGetDraft, useGetProposal } from "./useProposalDraftQuery";

export type ProposalState =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "empty" }
  | { status: "draft"; data: Record<string, unknown> }
  | { status: "submitted"; data: Record<string, unknown> };

export function useProposalState(projectId: string | undefined): ProposalState {
  const draftQuery = useGetDraft(projectId);
  const proposalQuery = useGetProposal(projectId);

  if (draftQuery.isLoading || proposalQuery.isLoading) return { status: "loading" };
  if (draftQuery.isError) return { status: "error", error: draftQuery.error };
  if (proposalQuery.isError) return { status: "error", error: proposalQuery.error };
  if (proposalQuery.data) return { status: "submitted", data: proposalQuery.data };
  if (draftQuery.data) return { status: "draft", data: draftQuery.data };
  return { status: "empty" };
}
