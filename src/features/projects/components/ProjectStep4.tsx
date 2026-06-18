// src/features/projects/components/ProjectStep4.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form"; // 🟢 เพิ่ม useWatch
import { ProjectStep4Values } from "../types";
import { AlertCircle } from "lucide-react";

// นำเข้า Accordion จาก shadcn
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// นำเข้า Components ย่อยของคุณ
import { HardwareCostSection } from "./step4/HardwareCostSection";
import { SoftwareCostSection } from "./step4/SoftwareCostSection";
import { PersonnelCostSection } from "./step4/PersonnelCostSection";
import { TrainingCostSection } from "./step4/TrainingCostSection";
import { OtherCostSection } from "./step4/OtherCostSection";

export const ProjectStep4 = () => {
  const { control, formState: { errors } } = useFormContext<ProjectStep4Values>();

  // 1. Watch ข้อมูลจากทุก Section เพื่อเอามาคำนวณ Grand Total
  const watchedHw = useWatch({ control, name: "hardwareCosts" }) || [];
  const watchedSw = useWatch({ control, name: "softwareCosts" }) || [];
  const watchedCore = useWatch({ control, name: "personnelCoreCosts" }) || [];
  const watchedAsst = useWatch({ control, name: "personnelAsstCosts" }) || [];
  const watchedSupp = useWatch({ control, name: "personnelSuppCosts" }) || [];
  const watchedCourses = useWatch({ control, name: "trainingCourses" }) || [];
  const watchedOther = useWatch({ control, name: "otherCosts" }) || []; // หมวดที่ 5

  // 2. คำนวณผลรวมแต่ละหมวด
  const totalHwCost = watchedHw.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);
  const totalSwCost = watchedSw.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);
  const totalCore = watchedCore.reduce((acc, row) => acc + (((row.baseSalary || 0) * (row.multiplier || 1)) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalAsst = watchedAsst.reduce((acc, row) => acc + (((row.baseSalary || 0) * (row.multiplier || 1)) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalSupp = watchedSupp.reduce((acc, row) => acc + ((row.baseSalary || 0) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalTrainingCost = watchedCourses.reduce((acc: number, course: any) => {
    const spkCost = (course.speakerCosts || []).reduce((sum: number, r: any) => sum + ((r.hours || 0) * (r.ratePerHour || 0) * (r.days || 0)), 0);
    const foodCost = (course.foodCosts || []).reduce((sum: number, r: any) => sum + ((r.mealsCount || 0) * (r.ratePerMeal || 0) * (r.traineesCount || 0) * (r.days || 0)), 0);
    return acc + spkCost + foodCost;
  }, 0);
  const totalOtherCost = watchedOther.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);

  // 3. คำนวณ Grand Total ของจริง
  const grandTotal = totalHwCost + totalSwCost + totalCore + totalAsst + totalSupp + totalTrainingCost + totalOtherCost;

  // ฟังก์ชันช่วยเช็คว่า Section นี้มี Error ไหม
  const hasHardwareError = !!errors.hardwareCosts;
  const hasSoftwareError = !!errors.softwareCosts;
  const hasPersonnelError = !!errors.personnelCoreCosts || !!errors.personnelAsstCosts || !!errors.personnelSuppCosts || !!errors.personnelResponsibilities;
  const hasTrainingError = !!errors.trainingCourses;
  const hasOtherError = !!errors.otherCosts; // เช็ค Error หมวดที่ 5

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">4. รายการค่าใช้จ่ายตามโครงการ (เฉพาะด้าน IT)</h2>
      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]} className="w-full space-y-4">
        
        {/* --- หมวดที่ 1: ครุภัณฑ์ --- */}
        <AccordionItem value="item-1" className="border border-border rounded-lg bg-surface px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">1. ค่าใช้จ่ายครุภัณฑ์คอมพิวเตอร์</span>
              {hasHardwareError && <AlertCircle className="w-5 h-5 text-status-orange" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 w-full min-w-0 h-auto">
            <HardwareCostSection />
          </AccordionContent>
        </AccordionItem>

        {/* --- หมวดที่ 2: ซอฟต์แวร์ --- */}
        <AccordionItem value="item-2" className="border border-border rounded-lg bg-surface px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">2. ค่าใช้จ่ายซอฟต์แวร์และเครื่องมือ</span>
              {hasSoftwareError && <AlertCircle className="w-5 h-5 text-status-orange" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 w-full min-w-0 h-auto">
            <SoftwareCostSection />
          </AccordionContent>
        </AccordionItem>

        {/* --- หมวดที่ 3: บุคลากร --- */}
        <AccordionItem value="item-3" className="border border-border rounded-lg bg-surface px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">3. ค่าใช้จ่ายบุคลากรที่ใช้ในการพัฒนาระบบ</span>
              {hasPersonnelError && <AlertCircle className="w-5 h-5 text-status-orange" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 w-full min-w-0 h-auto">
            <PersonnelCostSection />
          </AccordionContent>
        </AccordionItem>

        {/* --- หมวดที่ 4: การฝึกอบรม --- */}
        <AccordionItem value="item-4" className="border border-border rounded-lg bg-surface px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">4. ค่าใช้จ่ายการฝึกอบรม</span>
              {hasTrainingError && <AlertCircle className="w-5 h-5 text-status-orange" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 w-full min-w-0 h-auto">
            <TrainingCostSection />
          </AccordionContent>
        </AccordionItem>

        {/* --- หมวดที่ 5: ค่าใช้จ่ายอื่นๆ --- */}
        <AccordionItem value="item-5" className="border border-border rounded-lg bg-surface px-4">
          <AccordionTrigger className="hover:no-underline py-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">5. ค่าใช้จ่ายอื่น ๆ (เช่น ค่าเอกสารรายงานผลการศึกษา ฯลฯ)</span>
              {hasOtherError && <AlertCircle className="w-5 h-5 text-status-orange shrink-0" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 w-full min-w-0 h-auto">
            <OtherCostSection />
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* --- สรุปรวม Grand Total ไว้ล่างสุดนอก Accordion --- */}
      <div className="bg-primary-container text-primary p-6 rounded-xl text-right shadow-md flex justify-between items-center sticky bottom-4 z-10">
        <span className="text-lg font-medium opacity-90">รวมงบประมาณด้าน IT ทั้งสิ้น</span>
        <span className="text-3xl font-black">{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</span>
      </div>

    </div>
  );
};