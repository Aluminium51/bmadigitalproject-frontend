"use client";

import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import {
  proposalFormSchema,
  proposalStep1Schema,
  proposalStep2Schema,
  proposalStep3Schema,
  proposalStep4Schema,
  proposalStep5Schema,
  ProposalFormValues,
} from "../types";

import { useProposalFormStore } from "../stores/useProposalFormStore";
import { useAutoSaveForm } from "../hooks/useAutoSaveForm";
import { useGetDraft } from "../hooks/useProposalDraftQuery";
import { useInitializeDraft } from "../hooks/useProposalMutations";

import { StepperIndicator } from "./StepperIndicator";
import { ProposalStep1 } from "./ProposalStep1";
import { ProposalStep2 } from "./ProposalStep2";
import { ProposalStep3 } from "./ProposalStep3";
import { ProposalStep4 } from "./ProposalStep4";
import { ProposalStep5 } from "./ProposalStep5";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// AutoSaveWatcher — renders null, just triggers the auto-save side-effect
// ---------------------------------------------------------------------------
const AutoSaveWatcher = ({ projectId }: { projectId: string }) => {
  useAutoSaveForm(projectId);
  return null;
};

// ---------------------------------------------------------------------------
// WizardForm — the core multi-step form
// ---------------------------------------------------------------------------
const WizardForm = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    addStepError,
    removeStepError,
  } = useProposalFormStore();

  // ── React Query: fetch existing draft ─────────────────────────────────────
  const { data: existingDraft, isLoading: isDraftLoading } = useGetDraft(projectId);
  const { mutate: initDraft } = useInitializeDraft(projectId);

  // ── RHF setup ─────────────────────────────────────────────────────────────
  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema as any) as unknown as Resolver<ProposalFormValues>,
    defaultValues: {} as ProposalFormValues,
    mode: "all",
  });

  const { reset } = methods;

  // ── On mount: hydrate form from draft or initialize a blank draft ──────────
  useEffect(() => {
    if (isDraftLoading) return;

    if (existingDraft && Object.keys(existingDraft).length > 0) {
      const hydratedDraft = { ...existingDraft } as Record<string, any>;
      const fileFields = [
        "systemDiagram",
        "networkDiagram",
        "useCaseDiagram",
        "securityDiagram",
      ];

      // Recreate the small UI descriptor from the server URL so the diagram
      // controls can render an already-uploaded attachment after refresh.
      for (const field of fileFields) {
        const fileKey = `${field}File`;
        const urlKey = `${field}Url`;
        const current = hydratedDraft[fileKey];
        const url = hydratedDraft[urlKey] ??
          (typeof current === "string" ? current : undefined) ??
          current?.url ??
          (typeof current?.file === "string" ? current.file : undefined);
        if (url && !current?.file) {
          hydratedDraft[fileKey] = {
            id: `${field}-server`,
            file: url,
            url,
            description: "",
          };
        }
      }

      reset(hydratedDraft as Partial<ProposalFormValues>);
    } else {
      // No draft yet — create one so we have a record to PATCH against
      initDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraftLoading]);

  // ── Step validation helper ─────────────────────────────────────────────────
  const getCurrentSchema = (step: number) => {
    switch (step) {
      case 1: return proposalStep1Schema;
      case 2: return proposalStep2Schema;
      case 3: return proposalStep3Schema;
      case 4: return proposalStep4Schema;
      case 5: return proposalStep5Schema;
      default: return proposalStep1Schema;
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentSchema = getCurrentSchema(currentStep);
    const fieldsInStep = Object.keys(currentSchema.shape) as any;
    const isValid = await methods.trigger(fieldsInStep);
    if (isValid) {
      removeStepError(currentStep);
      return true;
    } else {
      addStepError(currentStep);
      return false;
    }
  };

  const handleNext = async () => {
    void validateCurrentStep();
    nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = async () => {
    void validateCurrentStep();
    prevStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Completing the wizard only leaves the draft intact. The project workspace
  // owns the explicit final-submission action.
  const handleFinishDraft = () => {
    router.push(`/projects/${projectId}`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full rounded-container border border-[#D1CDC7] bg-white p-6 sm:p-10 shadow-sm overflow-hidden">

      <StepperIndicator validateCurrentStep={validateCurrentStep} />

      <FormProvider {...methods}>
        <AutoSaveWatcher projectId={projectId} />

        <form onSubmit={(event) => event.preventDefault()} className="mt-8">

          <div className="min-h-100">
            {currentStep === 1 && <ProposalStep1 />}
            {currentStep === 2 && <ProposalStep2 />}
            {currentStep === 3 && <ProposalStep3 />}
            {currentStep === 4 && <ProposalStep4 />}
            {currentStep === 5 && <ProposalStep5 />}
          </div>

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-[#ededf4] gap-4">

            {/* Save status indicator replaces the raw timestamp text */}
            <div className="order-2 sm:order-1 w-full flex items-center">
              <SaveStatusIndicator />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 w-full justify-start sm:justify-end">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrev}
                  variant="outline"
                  className="px-6 h-12 w-full sm:w-auto font-bold rounded-full border-[1.5px] border-[#D1CDC7] text-[#3f4942] hover:bg-surface-variant hover:text-[#191c20]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                </Button>
              )}

              {currentStep < 5 ? (
                <Button
                  key="next-btn"
                  type="button"
                  onClick={handleNext}
                  className="px-8 h-12 w-full sm:w-auto font-bold rounded-full bg-[#00734b] hover:bg-primary-dark text-white shadow-sm transition-transform active:scale-[0.99]"
                >
                  ถัดไป <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  key="submit-btn"
                  type="button"
                  onClick={handleFinishDraft}
                  className="px-8 h-12 w-full sm:w-auto font-bold rounded-full bg-status-orange hover:bg-[#d65f00] text-white shadow-sm transition-transform active:scale-[0.99]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกฉบับร่าง
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CreateProposalWizard — public export with hydration guard
// ---------------------------------------------------------------------------
export const CreateProposalWizard = ({ projectId }: { projectId: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;
  return <WizardForm projectId={projectId} />;
};
