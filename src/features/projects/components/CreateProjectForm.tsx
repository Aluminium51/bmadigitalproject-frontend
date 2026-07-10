// src/features/projects/components/CreateProjectForm.tsx
"use client";
import { useForm, Controller } from "react-hook-form";
import { AlertCircle, Save, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- 1. Zod Schema ---
// แก้ไข: ใช้ z.string() เพื่อให้รับค่าจาก Select ได้อย่างราบรื่น ไม่มีปัญหา Type ตีกัน
const createProjectSchema = z.object({
  projectName: z.string().min(5, { message: "กรุณาระบุชื่อโครงการอย่างน้อย 5 ตัวอักษร" }),
  fourQuadrantsId: z.string({ message: "กรุณาเลือกมิติการพัฒนา" }).min(1, { message: "กรุณาเลือกมิติการพัฒนา" }),
  deputyGovernorId: z.string({ message: "กรุณาเลือกรองผู้ว่าฯ ที่กำกับดูแล" }).min(1, { message: "กรุณาเลือกรองผู้ว่าฯ ที่กำกับดูแล" }),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

// --- 2. Mock Data สำหรับ Dropdown ---
const FOUR_QUADRANTS = [
  { id: 1, name: "Q1: เพิ่มประสิทธิภาพ" },
  { id: 2, name: "Q2: งานประจำที่บริการประชาชน" },
  { id: 3, name: "Q3: งานหลังบ้านที่เป็นงานใหม่" },
  { id: 4, name: "Q4: ยุทธศาสตร์ / งานอนาคต" }
];

const DEPUTY_GOVERNORS = [
  { id: 1, name: "รองผู้ว่าฯ ด้านบริหาร" },
  { id: 2, name: "รองผู้ว่าฯ ด้านเศรษฐกิจ" },
  { id: 3, name: "รองผู้ว่าฯ ด้านสังคม" },
  { id: 4, name: "รองผู้ว่าฯ ด้านสิ่งแวดล้อม" }
];

export const CreateProjectForm = () => {
  // --- 3. Mock Context ---
  const mockContext = {
    userId: "018f3a3b-1b2c-7d3e-8f4g-5h6i7j8k9l0m", 
    divisionId: 1, 
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      fourQuadrantsId: "", // กำหนดค่าเริ่มต้นว่างๆ เพื่อให้ UI รู้ว่าเป็น Controlled Input
      deputyGovernorId: "",
    },
  });

  const onSubmit = async (data: CreateProjectValues) => {
    // แปลง String เป็น Number
    const payload = {
      ...data,
      fourQuadrantsId: Number(data.fourQuadrantsId),
      deputyGovernorId: Number(data.deputyGovernorId),
      projectStatusId: 1, // 1 = Draft
      userId: mockContext.userId,
      divisionId: mockContext.divisionId,
      createdAt: new Date().toISOString(), 
    };

    console.log("Submitting Project Payload:", payload);
    // TODO: ส่ง payload นี้ไปที่ API / Controller
    
    // จำลองการโหลด
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("ร่างโครงการถูกสร้างสำเร็จ! ดู Payload ได้ใน Console");
  };

  return (
    <div className="mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          สร้างโครงการใหม่
        </h2>
        <p className="text-sm text-slate-gray mt-2">
          กรอกข้อมูลเบื้องต้นเพื่อเริ่มต้นร่างข้อเสนอโครงการ
        </p>
      </div>

      {/* Form เนื้อหาหลัก */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* ชื่อโครงการ (Textarea) */}
        <div className="w-full">
          <Label htmlFor="projectName" className="text-sm font-medium text-foreground mb-1.5 block">
            ชื่อโครงการ <span className="text-status-orange">*</span>
          </Label>
          <Textarea 
            id="projectName"
            {...register("projectName")}
            rows={3}
            placeholder="ระบุชื่อโครงการ..."
            className={cn(
              "resize-none bg-surface text-base", 
              errors.projectName && "border-status-orange focus-visible:ring-status-orange bg-orange-50/50"
            )}
          />
          {errors.projectName && (
            <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.projectName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 4 Quadrants Model */}
          <div className="w-full">
            <Label className="text-sm font-medium text-foreground mb-1.5 block">
              4 Quadrants Model <span className="text-status-orange">*</span>
            </Label>
            <Controller
              control={control}
              name="fourQuadrantsId"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger className={cn("bg-surface", errors.fourQuadrantsId && "border-status-orange ring-1 ring-status-orange bg-orange-50/50")}>
                    <SelectValue placeholder="เลือกมิติการพัฒนา..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FOUR_QUADRANTS.map((q) => (
                      <SelectItem key={q.id} value={q.id.toString()}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fourQuadrantsId && (
              <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.fourQuadrantsId.message}
              </p>
            )}
          </div>

          {/* รองผู้ว่าฯ ที่ดูแล */}
          <div className="w-full">
            <Label className="text-sm font-medium text-foreground mb-1.5 block">
              รองผู้ว่าฯ ที่กำกับดูแล <span className="text-status-orange">*</span>
            </Label>
            <Controller
              control={control}
              name="deputyGovernorId"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger className={cn("bg-surface", errors.deputyGovernorId && "border-status-orange ring-1 ring-status-orange bg-orange-50/50")}>
                    <SelectValue placeholder="เลือกรองผู้ว่าฯ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPUTY_GOVERNORS.map((gov) => (
                      <SelectItem key={gov.id} value={gov.id.toString()}>
                        {gov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.deputyGovernorId && (
              <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.deputyGovernorId.message}
              </p>
            )}
          </div>

        </div>

        <div className="border-t border-border mt-2" />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => window.history.back()}>
            <X className="w-4 h-4 mr-2" />
            ยกเลิก
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary hover:bg-primary/90 text-white">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกและสร้างโครงการ"}
          </Button>
        </div>

      </form>
    </div>
  );
};