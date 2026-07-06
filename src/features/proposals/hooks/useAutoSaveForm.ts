// src/features/proposals/hooks/useAutoSaveForm.ts
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useProposalFormStore } from "../stores/useProposalFormStore";
import { useAutoSaveDraft } from "./useProposalMutations";
import { ProposalDraftValues } from "../types";

const DEBOUNCE_MS = 2000;

/**
 * useAutoSaveForm
 *
 * Watches RHF form changes, debounces for 2 seconds, then:
 *   1. Updates the local Zustand store
 *   2. Fires the PATCH /api/proposals/projects/:projectId/draft mutation
 *
 * Must be rendered inside a <FormProvider> and receive the projectId.
 */
export const useAutoSaveForm = (projectId: string | undefined) => {
  const { watch } = useFormContext<ProposalDraftValues>();
  const { updateFormData, setLastSavedAt } = useProposalFormStore();
  const { mutate: saveDraft } = useAutoSaveDraft(projectId);

  // Track last saved value to avoid redundant API calls
  const lastPayloadRef = useRef<string>("");

  useEffect(() => {
    const subscription = watch((value) => {
      const handler = setTimeout(() => {
        const payload = value as Partial<ProposalDraftValues>;
        const serialized = JSON.stringify(payload);

        // Skip if nothing changed since last save
        if (serialized === lastPayloadRef.current) return;
        lastPayloadRef.current = serialized;

        // 1. Update local Zustand store
        updateFormData(payload);

        // 2. Fire API mutation
        if (projectId) {
          saveDraft(
            { ...payload, currentStep: undefined } as Record<string, unknown>,
            {
              onSuccess: () => {
                setLastSavedAt(new Date().toISOString());
              },
            }
          );
        }
      }, DEBOUNCE_MS);

      return () => clearTimeout(handler);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, setLastSavedAt, saveDraft, projectId]);
};
