// src/features/projects/components/ProjectStep5.tsx
"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ProposalStep5Values } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus, AlertCircle, FileDown, Loader2 } from "lucide-react";
import { generateProposalDocx } from "@/features/proposals/utils/documentGenerator";

export const ProposalStep5 = () => {
  const { register, control, setValue, watch, getValues, formState: { errors } } = useFormContext<ProposalStep5Values>();

  const { fields: personnelFields, append: appendPersonnel, remove: removePersonnel } = useFieldArray({
    control,
    name: "ictPersonnel",
  });

  const watchedDurationDays = watch("durationDays");
  const isOverLimit = watchedDurationDays > 270;

  // State สำหรับคุมปุ่ม Loading ตอนกด Generate
  const [isGenerating, setIsGenerating] = useState(false);

  // ฟังก์ชันจัดการการกดปุ่ม Generate Document
  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      // ดึงข้อมูลทั้งหมดจาก Form ปัจจุบัน (รวมทุก Step)
      const allFormData = getValues() as any; 
      
      // เรียกฟังก์ชันสร้างไฟล์ Docx ที่เราทำไว้
      const result = await generateProposalDocx(allFormData);
      
      if (!result.success) {
        alert("เกิดข้อผิดพลาดในการสร้างเอกสาร: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0 pb-10">
      
      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">5. ความพร้อมและประโยชน์ที่คาดว่าจะได้รับ</h2>
      </div>

      {/* --- 1. ระยะเวลาดำเนินงาน (ปรับปรุงใหม่กรอกเป็นวัน) --- */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <Label className="text-lg font-bold text-foreground block mb-2">1. ระยะเวลาดำเนินงาน <span className="text-status-orange">*</span></Label>
        <p className="text-sm text-muted-foreground mb-4">
          (โครงการปีเดียว งบประมาณรายจ่ายประจำปี หรืองบกลาง ระยะเวลาไม่เกิน 270 วัน)
        </p>
        
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Input 
              type="number" 
              {...register("durationDays", { valueAsNumber: true })} 
              className={`bg-surface text-center ${errors.durationDays ? 'border-status-orange' : ''}`}
              placeholder="เช่น 180" 
            />
          </div>
          <span className="text-md font-medium text-foreground">วัน</span>
        </div>
        {errors.durationDays && <p className="text-status-orange text-sm mt-2">{errors.durationDays.message}</p>}
        {isOverLimit && (
          <div className="flex items-center gap-2 text-yellow-700 mt-4 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200 animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span><strong>หมายเหตุ:</strong> ระยะเวลาที่ระบุเกินกว่า 270 วัน โปรดตรวจสอบความถูกต้องของประเภทโครงการอีกครั้ง</span>
          </div>
        )}
      </div>

      {/* --- 2. ความพร้อมของหน่วยงาน --- */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <Label className="text-lg font-bold text-foreground block mb-4">2. ความพร้อมของหน่วยงาน</Label>

        {/* 2.1 ตารางบุคลากร ICT */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-md font-medium text-foreground">บุคลากร ICT ที่มีอยู่ในปัจจุบัน</Label>
            <Button type="button" onClick={() => appendPersonnel({ position: "", level: "", count: "" as any })} size="sm" className="rounded-full gap-2">
              <Plus className="w-4 h-4"/> เพิ่มบุคลากร
            </Button>
          </div>
          
          <div className="overflow-x-auto border border-border rounded-md">
            <table className="w-full text-left min-w-[600px] text-sm">
              <thead className="bg-surface-container-low text-slate-gray">
                <tr>
                  <th className="p-3 w-16 text-center">ลำดับ</th>
                  <th className="p-3 w-[40%]">ตำแหน่ง</th>
                  <th className="p-3 w-[30%]">ระดับ</th>
                  <th className="p-3 w-32 text-center">จำนวน (คน)</th>
                  <th className="p-3 w-16 text-center">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {personnelFields.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">ไม่มีข้อมูลบุคลากร</td></tr>
                )}
                {personnelFields.map((field, index) => {
                  const rowErrors = errors?.ictPersonnel?.[index] || {} as any;
                  return (
                    <tr key={field.id} className="border-t border-surface-variant">
                      <td className="p-2 text-center text-muted-foreground">{index + 1}</td>
                      <td className="p-2"><Input {...register(`ictPersonnel.${index}.position`)} className={`bg-surface ${rowErrors.position ? 'border-status-orange' : ''}`} placeholder="เช่น นักวิชาการคอมพิวเตอร์" /></td>
                      <td className="p-2"><Input {...register(`ictPersonnel.${index}.level`)} className={`bg-surface ${rowErrors.level ? 'border-status-orange' : ''}`} placeholder="เช่น ปฏิบัติการ" /></td>
                      <td className="p-2"><Input type="number" {...register(`ictPersonnel.${index}.count`, { valueAsNumber: true })} className={`bg-surface text-center ${rowErrors.count ? 'border-status-orange' : ''}`} /></td>
                      <td className="p-2 text-center"><Button type="button" onClick={() => removePersonnel(index)} variant="ghost" size="icon" className="text-status-orange hover:bg-red-100 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.2 ประเด็นความพร้อมด้านอื่นๆ */}
        <div>
          <Label className="text-md font-medium text-foreground block mb-2">ประเด็นความพร้อมด้านอื่น ๆ (ถ้ามี)</Label>
          <Textarea 
            {...register("otherReadiness")} 
            placeholder="อธิบายประเด็นความพร้อมด้านอื่นๆ..." 
            className="min-h-[150px] bg-surface resize-y" 
          />
        </div>
      </div>

      {/* --- 3. ประโยชน์ที่คาดว่าจะได้รับ --- */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <Label className="text-lg font-bold text-foreground block mb-2">3. ประโยชน์ที่คาดว่าจะได้รับ <span className="text-status-orange">*</span></Label>
        <Textarea 
          {...register("expectedBenefits")} 
          placeholder="อธิบายประโยชน์ที่คาดว่าจะได้รับจากโครงการนี้อย่างชัดเจน..." 
          className={`min-h-[200px] bg-surface resize-y ${errors.expectedBenefits ? 'border-status-orange' : ''}`} 
        />
        {errors.expectedBenefits && <p className="text-status-orange text-sm mt-2">{errors.expectedBenefits.message}</p>}
      </div>

      {/* --- 4. โครงการนี้อยู่ใน Roadmap ของหน่วยงานหรือไม่ --- */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm mb-4">
        <Label className="text-lg font-bold text-foreground block mb-4">4. โครงการนี้อยู่ใน Roadmap ของหน่วยงานหรือไม่ <span className="text-status-orange">*</span></Label>
        <RadioGroup 
          value={watch("isInRoadmap") !== undefined ? String(watch("isInRoadmap")) : undefined} 
          onValueChange={(val) => setValue("isInRoadmap", val === "true", { shouldValidate: true })}
          className="flex flex-col sm:flex-row gap-8 pl-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="true" id="roadmap-yes" className="w-5 h-5" />
            <Label htmlFor="roadmap-yes" className="text-md cursor-pointer">อยู่</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="false" id="roadmap-no" className="w-5 h-5" />
            <Label htmlFor="roadmap-no" className="text-md cursor-pointer">ไม่อยู่</Label>
          </div>
        </RadioGroup>
        {errors.isInRoadmap && <p className="text-status-orange text-sm mt-3">{errors.isInRoadmap.message}</p>}
      </div>

      {/* 🟢 --- ส่วนเพิ่มปุ่ม Generate Document --- */}
      <div className="flex justify-end mt-4 pt-6 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGenerateDocument}
          disabled={isGenerating}
          className="gap-2 bg-primary-container/20 hover:bg-primary-container/40 text-primary-dark border-primary/30"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          {isGenerating ? "กำลังสร้างเอกสาร..." : "สร้างแบบเสนอโครงการ (Word)"}
        </Button>
      </div>

    </div>
  );
};