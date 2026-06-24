"use client";

import { useForm, FormProvider, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import { 
  proposalFormSchema, 
  proposalStep1Schema, 
  proposalStep2Schema, 
  proposalStep3Schema, 
  proposalStep4Schema,
  proposalStep5Schema,
  ProposalFormValues 
} from "../types";

import { useProposalFormStore } from "../stores/useProposalFormStore";
import { useAutoSaveForm } from "../hooks/useAutoSaveForm";

import { StepperIndicator } from "./StepperIndicator";
import { ProposalStep1 } from "./ProposalStep1";
import { ProposalStep2 } from "./ProposalStep2";
import { ProposalStep3 } from "./ProposalStep3";
import { ProposalStep4 } from "./ProposalStep4";
import { ProposalStep5 } from "./ProposalStep5";
import { Button } from "@/components/ui/button";

const AutoSaveWatcher = () => {
  useAutoSaveForm();
  return null;
};

const WizardForm = ({ projectId }: { projectId: string }) => {
  const { currentStep, nextStep, prevStep, formData, resetForm, lastSavedAt, addStepError, removeStepError } = useProposalFormStore();

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

  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema as any) as unknown as Resolver<ProposalFormValues>,
    defaultValues: formData as unknown as ProposalFormValues,
    mode: "all",
  });

  const { handleSubmit, formState: { errors } } = methods;

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
    await validateCurrentStep(); 
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = async () => {
    await validateCurrentStep();
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit: SubmitHandler<ProposalFormValues> = async (data) => {
    const result = proposalFormSchema.safeParse(data);
    if (!result.success) {
       console.error("มีข้อผิดพลาดบางหน้าที่ยังกรอกไม่ครบ");
       return; 
    }

    const payload = {
      projectId: projectId,
      ...data
    };

    console.log("🚀 Final Submit to API:", payload);
    resetForm();
    // ตรงนี้อาจจะเพิ่ม router.push(`/projects/${projectId}`) กลับไปหน้า Workspace
  };

  return (
    <div className="mx-auto w-full rounded-container border border-[#D1CDC7] bg-white p-6 sm:p-10 shadow-sm overflow-hidden">
      
      <StepperIndicator validateCurrentStep={validateCurrentStep} />

      <FormProvider {...methods}>
        <AutoSaveWatcher />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          
          <div className="min-h-100"> {/* กันการกระตุกเวลาเปลี่ยนหน้า */}
            {currentStep === 1 && <ProposalStep1 />}
            {currentStep === 2 && <ProposalStep2 />}
            {currentStep === 3 && <ProposalStep3 />}
            {currentStep === 4 && <ProposalStep4 />}
            {currentStep === 5 && <ProposalStep5 />}
          </div>

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-[#ededf4] gap-4">
            
            <div className="text-xs font-medium text-slate-400 order-2 sm:order-1 w-full flex items-center">
              {lastSavedAt && `บันทึกร่างล่าสุดเมื่อ: ${new Date(lastSavedAt).toLocaleTimeString()}`}
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
                  type="submit" 
                  // ปรับปุ่ม Submit ท้ายสุด ให้สีโดดเด่น
                  className="px-8 h-12 w-full sm:w-auto font-bold rounded-full bg-status-orange hover:bg-[#d65f00] text-white shadow-sm transition-transform active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 mr-2" /> ยื่นเสนอโครงการ
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

// ให้ Wrapper รับ projectId ด้วย
export const CreateProposalWizard = ({ projectId }: { projectId: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null; 
  return <WizardForm projectId={projectId} />;
};