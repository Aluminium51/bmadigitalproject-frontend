"use client";

import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProjectWorkspace } from "@/features/projects/hooks/useProjectWorkspace";
import { OWNER_LOCKED_PROJECT_STATUSES } from "@/features/projects/utils/projectStatus";

// ---------------------------------------------------------------------------
// AutoSaveWatcher — renders null, just triggers the auto-save side-effect
// ---------------------------------------------------------------------------
const AutoSaveWatcher = ({
  projectId,
  disabled,
  flushRef,
}: {
  projectId: string;
  disabled: boolean;
  flushRef: { current: (() => Promise<boolean>) | null };
}) => {
  const { flush } = useAutoSaveForm(projectId, disabled);

  useEffect(() => {
    flushRef.current = flush;
    return () => {
      if (flushRef.current === flush) flushRef.current = null;
    };
  }, [flush, flushRef]);

  return null;
};

// ---------------------------------------------------------------------------
// WizardForm — the core multi-step form
// ---------------------------------------------------------------------------
const WizardForm = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const flushDraftRef = useRef<(() => Promise<boolean>) | null>(null);
  const { projectDetail, isLoading: isProjectLoading } = useProjectWorkspace(projectId);
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
  const isReadOnly = isProjectLoading || !projectDetail || OWNER_LOCKED_PROJECT_STATUSES.includes(
    projectDetail.projectStatusId as typeof OWNER_LOCKED_PROJECT_STATUSES[number],
  );

  // ── RHF setup ─────────────────────────────────────────────────────────────
  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema as any) as unknown as Resolver<ProposalFormValues>,
    defaultValues: {} as ProposalFormValues,
    mode: "all",
  });

  const { reset } = methods;
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  useEffect(() => {
    if (!methods.formState.isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [methods.formState.isDirty]);

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
        if (url) {
          const matchingAttachment = projectDetail?.attachments?.find((attachment) => attachment.fileUrl === url);
          hydratedDraft[fileKey] = {
            ...(current && typeof current === "object" ? current : {}),
            id: matchingAttachment?.id ?? `${field}-server`,
            file: url,
            url,
            description: current?.description ?? matchingAttachment?.description ?? "",
            uploader: matchingAttachment?.uploader ?? null,
          };
        }
      }

      reset(hydratedDraft as Partial<ProposalFormValues>);
    } else if (!isReadOnly) {
      // No draft yet — create one so we have a record to PATCH against
      initDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraftLoading, isReadOnly]);

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
  const handleFinishDraft = async () => {
    const saved = await flushDraftRef.current?.() ?? true;
    if (saved) {
      reset(methods.getValues());
      router.push(`/projects/${projectId}`);
      router.refresh();
    }
  };

  const handleSaveDraft = async () => {
    if (isSavingDraft || isReadOnly) return;
    setIsSavingDraft(true);
    const saved = await flushDraftRef.current?.() ?? true;
    if (saved) {
      reset(methods.getValues());
      toast.success("บันทึกข้อมูลแล้ว");
    }
    setIsSavingDraft(false);
  };

  const requestExit = () => {
    if (methods.formState.isDirty) {
      setExitConfirmOpen(true);
      return;
    }
    router.push(`/projects/${projectId}`);
  };

  const saveAndExit = async () => {
    setIsSavingDraft(true);
    const saved = await flushDraftRef.current?.() ?? true;
    setIsSavingDraft(false);
    if (saved) {
      reset(methods.getValues());
      setExitConfirmOpen(false);
      router.push(`/projects/${projectId}`);
      router.refresh();
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full rounded-container border border-[#D1CDC7] bg-white p-6 sm:p-10 shadow-sm overflow-hidden">

      <div className="mb-5 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={requestExit} className="-ml-2 text-slate-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปยังโครงการ
        </Button>
        {!isReadOnly && <SaveStatusIndicator />}
      </div>

      <StepperIndicator validateCurrentStep={validateCurrentStep} />

      <FormProvider {...methods}>
        <AutoSaveWatcher projectId={projectId} disabled={isReadOnly} flushRef={flushDraftRef} />

        {isReadOnly && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
            This proposal is read-only while the project is being reviewed.
          </div>
        )}

        <form onSubmit={(event) => event.preventDefault()} className="mt-8">

          <fieldset disabled={isReadOnly} className="min-h-100">
            {currentStep === 1 && <ProposalStep1 />}
            {currentStep === 2 && <ProposalStep2 />}
            {currentStep === 3 && <ProposalStep3 projectId={projectId} />}
            {currentStep === 4 && <ProposalStep4 />}
            {currentStep === 5 && <ProposalStep5 />}
          </fieldset>

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-[#ededf4] gap-4">

            {/* Save status indicator replaces the raw timestamp text */}
            <div className="order-2 sm:order-1 w-full flex items-center">
              <SaveStatusIndicator />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 w-full justify-start sm:justify-end">
              {currentStep > 1 && !isReadOnly && (
                <Button
                  type="button"
                  onClick={handlePrev}
                  variant="outline"
                  className="px-6 h-12 w-full sm:w-auto font-bold rounded-full border-[1.5px] border-[#D1CDC7] text-[#3f4942] hover:bg-surface-variant hover:text-[#191c20]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                </Button>
              )}

              {!isReadOnly && (currentStep < 5 ? (
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
                  onClick={() => void handleFinishDraft()}
                  className="px-8 h-12 w-full sm:w-auto font-bold rounded-full bg-status-orange hover:bg-[#d65f00] text-white shadow-sm transition-transform active:scale-[0.99]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกฉบับร่าง
                </Button>
              ))}
            </div>
          </div>
        </form>

        {!isReadOnly && (
          <Button
            type="button"
            onClick={() => void handleSaveDraft()}
            disabled={isSavingDraft}
            className="fixed bottom-5 right-5 z-40 h-11 rounded-full bg-[#00734b] px-5 font-bold text-white shadow-lg hover:bg-primary-dark"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSavingDraft ? "กำลังบันทึก..." : "Save"}
          </Button>
        )}

        <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave proposal form?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Choose whether to save them before leaving, discard them, or continue editing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSavingDraft}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isSavingDraft}
                onClick={() => {
                  reset();
                  router.push(`/projects/${projectId}`);
                }}
              >
                Discard Changes
              </AlertDialogAction>
              <Button type="button" onClick={() => void saveAndExit()} disabled={isSavingDraft}>
                {isSavingDraft ? "Saving..." : "Save and Exit"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
