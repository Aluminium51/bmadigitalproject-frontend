"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, FileText, Download } from "lucide-react";

import { ProjectStep5Values } from "../types";
import { useProjectFormStore } from "../stores/useProjectFormStore";
import { generateProjectDocx } from "@/lib/documentGenerator"; // 👈 ฟังก์ชันที่เราวางแผนไว้ก่อนหน้านี้

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ProjectStep5 = () => {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<ProjectStep5Values>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "currentIctStaff",
  });

  // 🟢 ดึงข้อมูลจาก Store สำหรับเอาไปสร้างเอกสาร
  const formDataStore = useProjectFormStore((state) => state.formData);
  const [isGenerating, setIsGenerating] = useState(false);

  // ฟังก์ชันจัดการการโหลดไฟล์ Word
  const handleDownloadWord = async () => {
    setIsGenerating(true);
    try {
      // 💡 นำข้อมูลที่ผู้ใช้เพิ่งกรอกใน Step นี้ (แต่ยังไม่ได้กด Next/Save) มารวมกับข้อมูลใน Store
      const currentStepValues = getValues();
      const mergedData = { ...formDataStore, ...currentStepValues };
      
      await generateProjectDocx(mergedData as any);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสร้างเอกสาร");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 🟢 Header พร้อมปุ่มดาวน์โหลด Word */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          5. ความพร้อมและข้อมูลผู้เสนอ
        </h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleDownloadWord}
          disabled={isGenerating}
          className="gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
        >
          {isGenerating ? (
            "กำลังสร้างเอกสาร..."
          ) : (
            <>
              <FileText className="w-4 h-4" />
              ดาวน์โหลดแบบร่าง (Word)
              <Download className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* 🟢 ระยะเวลาดำเนินงาน */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="operationDuration">
            ระยะเวลาดำเนินงาน (วัน) <span className="text-status-orange">*</span>
          </Label>
          <Input
            id="operationDuration"
            type="number"
            {...register("operationDuration", { valueAsNumber: true })}
            placeholder="เช่น 210"
          />
          {errors.operationDuration && (
            <p className="text-sm text-status-orange font-medium">
              {errors.operationDuration.message}
            </p>
          )}
        </div>
      </div>

      {/* 🟢 ตารางความพร้อมบุคลากร ICT */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>ความพร้อมบุคลากร ICT ที่มีอยู่ในปัจจุบัน</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              append({
                position: "นักวิชาการคอมพิวเตอร์",
                level: "ชำนาญการ",
                count: 1,
              })
            }
            className="text-primary gap-1 h-8"
          >
            <Plus className="w-4 h-4" />
            เพิ่มบุคลากร
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-3 p-3 border border-border rounded-lg bg-surface-container-low items-start sm:items-center"
            >
              <Input
                {...register(`currentIctStaff.${index}.position`)}
                placeholder="ตำแหน่ง (เช่น นักวิชาการคอมพิวเตอร์)"
                className="flex-1"
              />
              <Input
                {...register(`currentIctStaff.${index}.level`)}
                placeholder="ระดับ (เช่น ชำนาญการ)"
                className="w-full sm:w-1/3"
              />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Input
                  type="number"
                  {...register(`currentIctStaff.${index}.count`, {
                    valueAsNumber: true,
                  })}
                  placeholder="จำนวน"
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-status-orange hover:text-status-orange hover:bg-red-50 shrink-0"
                  aria-label="ลบบุคลากร"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              ยังไม่มีข้อมูลบุคลากร กดปุ่ม + เพิ่มบุคลากร เพื่อเพิ่มข้อมูล
            </div>
          )}
        </div>
      </div>

      {/* 🟢 ประโยชน์ที่คาดว่าจะได้รับ */}
      <div className="space-y-2">
        <Label htmlFor="expectedBenefits">
          ประโยชน์ที่คาดว่าจะได้รับ <span className="text-status-orange">*</span>
        </Label>
        <Textarea
          id="expectedBenefits"
          {...register("expectedBenefits")}
          rows={4}
          placeholder="อธิบายประโยชน์ที่จะเกิดขึ้นกับ กทม. และประชาชน"
          className="resize-none"
        />
        {errors.expectedBenefits && (
          <p className="text-sm text-status-orange font-medium">
            {errors.expectedBenefits.message}
          </p>
        )}
      </div>

      {/* 🟢 ข้อมูลผู้เสนอโครงการ */}
      <div className="bg-surface-container-low p-6 rounded-lg border border-border mt-4 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            ลงชื่อผู้เสนอโครงการ
          </h3>
          <p className="text-sm text-muted-foreground">
            (หัวหน้าส่วนราชการ หรือผู้ที่ได้รับมอบหมาย)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="submitterName">
              ชื่อ-นามสกุล <span className="text-status-orange">*</span>
            </Label>
            <Input id="submitterName" {...register("submitterName")} />
            {errors.submitterName && (
              <p className="text-sm text-status-orange font-medium">
                {errors.submitterName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="submitterAgency">
              หน่วยงาน <span className="text-status-orange">*</span>
            </Label>
            <Input id="submitterAgency" {...register("submitterAgency")} />
            {errors.submitterAgency && (
              <p className="text-sm text-status-orange font-medium">
                {errors.submitterAgency.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="submitterPhone">
              โทรศัพท์ติดต่อ <span className="text-status-orange">*</span>
            </Label>
            <Input
              id="submitterPhone"
              type="tel"
              {...register("submitterPhone")}
            />
            {errors.submitterPhone && (
              <p className="text-sm text-status-orange font-medium">
                {errors.submitterPhone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="submitterEmail">
              อีเมล (e-Mail) <span className="text-status-orange">*</span>
            </Label>
            <Input
              id="submitterEmail"
              type="email"
              {...register("submitterEmail")}
            />
            {errors.submitterEmail && (
              <p className="text-sm text-status-orange font-medium">
                {errors.submitterEmail.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};