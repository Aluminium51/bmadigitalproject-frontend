// src/features/projects/components/CreateProjectDialog.tsx
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, X } from "lucide-react"; // 📍 เพิ่ม X icon
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader, // 📍 นำกลับมาใช้เพื่อ Accessibility
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose // 📍 นำเข้า DialogClose ควบคุมการปิด
} from "@/components/ui/dialog";

const createProjectSchema = z.object({
  projectName: z.string()
    .min(5, "กรุณาระบุชื่อโครงการอย่างน้อย 5 ตัวอักษร")
    .max(200, "ชื่อโครงการต้องไม่เกิน 200 ตัวอักษร"),
  fiscalYear: z.coerce
    .number({ message: "ระบุ พ.ศ." })
    .int("จำนวนเต็ม")
    .min(2560, "ปี พ.ศ. ไม่ถูกต้อง")
    .max(2600, "ปี พ.ศ. ไม่ถูกต้อง"),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange }: CreateProjectDialogProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectValues>({
    // 📍 1. แก้ไข Error TS ด้วย as any
    resolver: zodResolver(createProjectSchema as any),
    defaultValues: {
      projectName: "",
      fiscalYear: new Date().getFullYear() + 543,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<CreateProjectValues> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("สร้าง Project Shell ใหม่:", data);
      const fakeProjectId = "PRJ-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      onOpenChange(false);
      reset();
      router.push(`/projects/${fakeProjectId}`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) reset();
    }
  };

  return (
    // 📍 ใช้ hideCloseButton ปกปิดปุ่ม X ดั้งเดิม (ถ้าใช้ shadcn เวอร์ชั่นที่มี)
    // หรือเราจะครอบปุ่ม X ของเราเองแทนการแสดงผลอัตโนมัติ
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ซ่อนปุ่ม X ดั้งเดิมด้วย [&>button]:hidden */}
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-[#D1CDC7] rounded-3xl [&>button]:hidden">
        
        {/* --- Header --- */}
        {/* 📍 ใช้ DialogHeader ตามมาตรฐาน เพื่อให้ SR (Screen Reader) อ่านได้ถูกต้อง */}
        <DialogHeader className="bg-[#f9f9ff] px-8 py-6 border-b border-[#ededf4] flex flex-row items-start justify-between text-left m-0">
          <div>
             {/* 📍 2. ลบ Icon FolderPlus ออก */}
            <DialogTitle className="text-2xl font-bold text-[#191c20]">
              สร้างโครงการใหม่
            </DialogTitle>
            <DialogDescription className="text-[#3f4942] mt-1.5">
              ระบุชื่อและปีงบประมาณเพื่อเปิดพื้นที่ทำงาน
            </DialogDescription>
          </div>
          
          {/* 📍 3. ปุ่ม X แบบ Custom ชัดเจนและใหญ่กว่าเดิม */}
          <DialogClose asChild>
            <button 
              disabled={isSubmitting}
              className="rounded-full p-2 hover:bg-black/5 text-[#3f4942] hover:text-[#191c20] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00734b]/50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-6">
            
            {/* ชื่อโครงการ */}
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-[14px] font-semibold text-[#191c20]">
                ชื่อโครงการ <span className="text-status-orange">*</span>
              </Label>
              <Input
                id="projectName"
                {...register("projectName")}
                placeholder="เช่น โครงการพัฒนาระบบ..."
                error={!!errors.projectName}
                disabled={isSubmitting}
                className="h-11 rounded-xl border-[#D1CDC7] focus-visible:ring-[#00734b]/20 focus-visible:border-[#00734b]"
              />
              {errors.projectName && (
                <p className="text-xs font-medium text-status-orange mt-1">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            {/* ปีงบประมาณ */}
            <div className="space-y-2 w-1/2">
              <Label htmlFor="fiscalYear" className="text-[14px] font-semibold text-[#191c20]">
                ปี พ.ศ. <span className="text-status-orange">*</span>
              </Label>
              <Input
                id="fiscalYear"
                type="number"
                {...register("fiscalYear", { valueAsNumber: true })}
                placeholder="2569"
                error={!!errors.fiscalYear}
                disabled={isSubmitting}
                className="h-11 rounded-xl border-[#D1CDC7] focus-visible:ring-[#00734b]/20 focus-visible:border-[#00734b]"
              />
              {errors.fiscalYear && (
                <p className="text-xs font-medium text-status-orange mt-1">
                  {errors.fiscalYear.message}
                </p>
              )}
            </div>

          </div>

          {/* --- Footer --- */}
          <DialogFooter className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full border-[1.5px] font-medium"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary-dark text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" /> สร้าง...
                </>
              ) : (
                <>
                  สร้างโครงการ <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
};