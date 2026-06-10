"use client";

import { useForm, FormProvider, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { 
  projectFormSchema, 
  projectStep1Schema, 
  projectStep2Schema, 
  projectStep3Schema, 
  projectStep4Schema,
  ProjectFormValues 
} from "../types";

import { useProjectFormStore } from "../stores/useProjectFormStore";
import { useAutoSaveForm } from "../hooks/useAutoSaveForm";

import { StepperIndicator } from "./StepperIndicator";
import { ProjectStep1 } from "./ProjectStep1";
import { ProjectStep2 } from "./ProjectStep2";
import { ProjectStep3 } from "./ProjectStep3";
import { ProjectStep4 } from "./ProjectStep4";
import { ProjectStep5 } from "./ProjectStep5";
import { Button } from "@/components/ui/button";

const AutoSaveWatcher = () => {
  useAutoSaveForm();
  return null;
};

const WizardForm = () => {
  const { currentStep, nextStep, prevStep, formData, resetForm, lastSavedAt } = useProjectFormStore();

  // ฟังก์ชันจับคู่ Schema ประจำแต่ละสเต็ปสำหรับการทำ Partial Validation
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1: return projectStep1Schema;
      case 2: return projectStep2Schema;
      case 3: return projectStep3Schema;
      case 4: return projectStep4Schema;
      default: return projectStep1Schema;
    }
  };

  const methods = useForm<ProjectFormValues>({
    // ล็อก Resolver หลักให้คงที่ เพื่อป้องกันไม่ให้ฟอร์มสั่งรีเซ็ตตัวเองระหว่างเปลี่ยนหน้า
    resolver: zodResolver(projectFormSchema as any) as unknown as Resolver<ProjectFormValues>,
    defaultValues: formData as unknown as ProjectFormValues,
    mode: "onChange",
  });

  const { handleSubmit, formState: { errors } } = methods;

  // เคลียร์ Error ของหน้าเก่าออกเมื่อเปลี่ยนสเต็ป เพื่อให้กรอกข้อมูลสเต็ปใหม่ได้อย่างสบายตา
  useEffect(() => {
    methods.clearErrors();
  }, [currentStep, methods]);

  // Validation Check ก่อนเปลี่ยนหน้า
  const handleNext = async () => {
    methods.clearErrors();
    
    const currentSchema = getCurrentSchema();
    const currentValues = methods.getValues();

    // ตรวจสอบข้อมูลเฉพาะของหน้าปัจจุบันด้วย safeParse ของ Zod โดยตรง (ไม่เปลี่ยน Reference ของฟอร์ม)
    const result = currentSchema.safeParse(currentValues);

    if (result.success) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // แมปข้อความแจ้งเตือน Error ของ Zod กลับเข้าสู่ระบบ Input เพื่อให้แสดงขอบแดงพ่นข้อความเตือน
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as any;
        methods.setError(path, {
          type: "manual",
          message: issue.message,
        });
      });
      console.error(`Validation Failed at Step ${currentStep}! รายการ Error:`, result.error.format());
    }
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    console.log("🚀 Final Submit to API:", data);
    // TODO: เรียกใช้ API จริงเพื่อบันทึกข้อมูลลง Database ที่นี่
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
          {currentStep === 4 && <ProjectStep4 />}
          {currentStep === 5 && <ProjectStep5 />}

          {/* ส่วนของปุ่มควบคุมด้านล่างฟอร์ม */}
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-border gap-4">
            <div className="text-sm text-slate-gray order-2 sm:order-1 w-full">
              {lastSavedAt && `บันทึกร่างล่าสุดเมื่อ: ${new Date(lastSavedAt).toLocaleTimeString()}`}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 order-1 sm:order-2 w-full justify-start sm:justify-end">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  onClick={prevStep} 
                  variant="outline" 
                  className="px-6 py-4 w-full sm:w-auto font-medium"
                >
                  ย้อนกลับ
                </Button>
              )}

              {currentStep < 5 ? (
                // ระบุคลาส key="next-btn" ป้องกันไม่ให้ React รีไซเคิลธาตุปุ่มไปส่งผลกระทบให้เกิด Submit
                <Button 
                  key="next-btn"
                  type="button" 
                  onClick={handleNext} 
                  variant="default" 
                  className="px-6 py-4 w-full sm:w-auto font-medium border-none"
                >
                  ถัดไป
                </Button>
              ) : (
                // ปุ่มสุดท้ายสำหรับการยืนยันส่งข้อมูลไปหลังบ้านจริง
                <Button 
                  key="submit-btn"
                  type="submit" 
                  variant="default" 
                  className="px-6 py-4 w-full sm:w-auto font-medium border-none"
                >
                  ส่งโครงการ
                </Button>
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