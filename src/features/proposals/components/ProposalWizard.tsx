"use client";

import { useForm, FormProvider, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { 
  proposalFormSchema, 
  proposalStep1Schema, 
  proposalStep2Schema, 
  proposalStep3Schema, 
  proposalStep4Schema,
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

const WizardForm = () => {
  const { currentStep, nextStep, prevStep, formData, resetForm, lastSavedAt, addStepError, removeStepError } = useProposalFormStore();

  const getCurrentSchema = (step: number) => { // 📍 รับค่า step เพื่อให้เช็คได้ตรงกับหน้า
    switch (step) {
      case 1: return proposalStep1Schema;
      case 2: return proposalStep2Schema;
      case 3: return proposalStep3Schema;
      case 4: return proposalStep4Schema;
      // case 5: return proposalStep5Schema; (ถ้ามี)
      default: return proposalStep1Schema;
    }
  };

  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema as any) as unknown as Resolver<ProposalFormValues>,
    defaultValues: formData as unknown as ProposalFormValues,
    mode: "all",
  });

  const { handleSubmit, formState: { errors } } = methods;

  // ฟังก์ชันสำหรับการเช็ค Validation โดยไม่บังคับย้ายหน้า (ใช้ตอนกด Stepper)
  const validateCurrentStep = async (): Promise<boolean> => {
    // 1. ดึงรายชื่อ Field ทั้งหมดที่อยู่ใน Schema ของหน้าปัจจุบัน
    const currentSchema = getCurrentSchema(currentStep);
    const fieldsInStep = Object.keys(currentSchema.shape) as any;

    // 2. สั่งให้ React Hook Form ตรวจสอบ Field เหล่านั้น "ทันที"
    // คำสั่ง trigger นี้จะไประบายขอบสีแดงให้ใน UI อัตโนมัติ (และจะจำสีแดงไว้ให้ด้วย)
    const isValid = await methods.trigger(fieldsInStep);

    // 3. จัดการสถานะ Error ที่ Stepper (ไอคอน X ด้านบน)
    if (isValid) {
      removeStepError(currentStep);
      return true;
    } else {
      addStepError(currentStep);
      return false;
    }
  };

  // Validation Check สำหรับปุ่ม "ถัดไป" (Next)
    const handleNext = async () => {
    // 1. เรียก validateCurrentStep() เพื่อตรวจข้อมูลปัจจุบัน
    await validateCurrentStep(); 
    
    // 2. ขยับไปหน้าถัดไปเลย โดยไม่สนว่าผลลัพธ์ของ isValid จะเป็น true หรือ false
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = async () => {
    await validateCurrentStep(); // เช็คแล้วเก็บ Error ไว้ก่อนกดย้อนกลับด้วย
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit: SubmitHandler<ProposalFormValues> = async (data) => {
    // 📍 เช็ค Validation ของทุกสเต็ปพร้อมกันตอนกดปุ่มสุดท้าย
    const result = proposalFormSchema.safeParse(data);
    if (!result.success) {
       console.error("มีข้อผิดพลาดบางหน้าที่ยังกรอกไม่ครบ");
       // คุณอาจจะเพิ่ม logic เด้งกลับไปหน้าที่ error หน้าแรกตรงนี้ได้
       return; 
    }

    console.log("🚀 Final Submit to API:", data);
    resetForm();
  };

  return (
    <div className="mx-auto w-full rounded-container border bg-surface p-6 sm:p-10 shadow-level-1">
      {/* 📍 โยนฟังก์ชัน validate เข้าไปให้ Stepper ใช้ */}
      <StepperIndicator validateCurrentStep={validateCurrentStep} />

      <FormProvider {...methods}>
        <AutoSaveWatcher />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          
          {currentStep === 1 && <ProposalStep1 />}
          {currentStep === 2 && <ProposalStep2 />}
          {currentStep === 3 && <ProposalStep3 />}
          {currentStep === 4 && <ProposalStep4 />}
          {currentStep === 5 && <ProposalStep5 />}

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t border-border gap-4">
            <div className="text-sm text-slate-gray order-2 sm:order-1 w-full">
              {lastSavedAt && `บันทึกร่างล่าสุดเมื่อ: ${new Date(lastSavedAt).toLocaleTimeString()}`}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 order-1 sm:order-2 w-full justify-start sm:justify-end">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  onClick={handlePrev} // 📍 ใช้ handlePrev เพื่อบันทึก Error ก่อนถอย
                  variant="outline" 
                  className="px-6 py-4 w-full sm:w-auto font-medium"
                >
                  ย้อนกลับ
                </Button>
              )}

              {currentStep < 5 ? (
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

export const CreateProposalWizard = () => {
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