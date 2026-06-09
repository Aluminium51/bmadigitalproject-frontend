"use client";

import { useForm, FormProvider, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { projectFormSchema, ProjectFormValues } from "../types";
import { useProjectFormStore } from "../stores/useProjectFormStore";
import { useAutoSaveForm } from "../hooks/useAutoSaveForm";

import { StepperIndicator } from "./StepperIndicator";
import { ProjectStep1 } from "./ProjectStep1";
// TODO: สร้าง ProjectStep2 ถึง ProjectStep5 แยกเป็นไฟล์เหมือน Step 1
import { ProjectStep2 } from "./ProjectStep2";
import { ProjectStep3 } from "./ProjectStep3";
import { ProjectStep4 } from "./ProjectStep4";
import { ProjectStep4tmp } from "./ProjectStep4tmp";
import { ProjectStep5 } from "./ProjectStep5";
import { Button } from "@/components/ui/button";

const AutoSaveWatcher = () => {
  useAutoSaveForm();
  return null;
};

const WizardForm = () => {
  const { currentStep, nextStep, prevStep, formData, resetForm, lastSavedAt } = useProjectFormStore();

  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema as unknown as any) as unknown as Resolver<ProjectFormValues>,
    defaultValues: formData as unknown as ProjectFormValues,
    mode: "onChange",
  });

  const { trigger, handleSubmit, formState: { errors } } = methods;

  // ฟังก์ชันเช็คความถูกต้องก่อนให้ไปหน้าถัดไป (Validation Check)
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // ✅ เพิ่ม "budgetsByYear" เข้าไปเพื่อให้ Zod ตรวจสอบทุกแถวในตาราง
      isValid = await trigger(["projectName", "agencyName", "headOfAgency", "dcioName", "projectManager", "totalBudget", "budgetsByYear"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["background", "objective", "target", "scope", "projectType", "currentSystemStatus", "currentProblems"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["strategicAlignments", "obstacleLaws", "appArchitecture", "dataOwner", "dataExchangePlan"]);
    } else if (currentStep === 4) {
      // ✅ ต้อง Trigger Array ด้วย
      isValid = await trigger(["hardwareCosts", "softwareCosts", "personnelCosts", "otherCosts"]);
    } else if (currentStep === 5) {
      isValid = await trigger(["operationDuration", "expectedBenefits", "submitterName", "submitterAgency", "submitterPhone", "submitterEmail"]);
    }

    if (isValid) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.error(`Validation Failed at Step ${currentStep}! ติด Error ที่:`, errors);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    console.log("🚀 Final Submit to API:", data);
    // TODO: เรียกใช้ API จริงที่นี่
    resetForm();
  };

  return (
    <div className="mx-auto w-full rounded-container border bg-surface p-6 sm:p-10 shadow-level-1">
      <StepperIndicator />

      <FormProvider {...methods}>
        <AutoSaveWatcher />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          
          {/* แสดง Component ย่อยตาม Step ปัจจุบัน */}
          {currentStep === 1 && <ProjectStep1 />}
          {currentStep === 2 && <ProjectStep2 />}
          {currentStep === 3 && <ProjectStep3 />}
          {currentStep === 4 && <ProjectStep4tmp />}
          {currentStep === 5 && <ProjectStep5 />}

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-border gap-4">
            <div className="text-sm text-slate-gray order-2 sm:order-1 w-full">
              {lastSavedAt && `บันทึกร่างล่าสุดเมื่อ: ${new Date(lastSavedAt).toLocaleTimeString()}`}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 order-1 sm:order-2 w-full justify-start sm:justify-end">
              {currentStep > 1 && (
                <Button onClick={prevStep} variant="outline" className="px-6 py-4 w-full sm:w-auto font-medium">ย้อนกลับ</Button>
              )}

              {currentStep < 5 ? (
                <Button onClick={handleNext} variant="default" className="px-6 py-4 w-full sm:w-auto font-medium border-none">ถัดไป</Button>

              ) : (
                <Button type="submit" variant="default" className="px-6 py-4 w-full sm:w-auto font-medium border-none">ส่งโครงการ</Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const CreateProjectWizard = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null; 
  return <WizardForm />;
};