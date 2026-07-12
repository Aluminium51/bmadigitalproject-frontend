// src/features/meetings/components/CreateMeetingForm.tsx
"use client";
import { useForm, Controller } from "react-hook-form";
import { AlertCircle, Save, X, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- 1. Zod Schema ---
// อ้างอิงจาก CreateMeetingSchema ฝั่ง Backend
const createMeetingSchema = z.object({
  meetingNo: z.string().min(1, { message: "กรุณาระบุครั้งที่การประชุม" }).max(100),
  title: z.string().min(5, { message: "กรุณาระบุหัวข้อการประชุมอย่างน้อย 5 ตัวอักษร" }).max(500),
  meetingTypeId: z.string({ message: "กรุณาเลือกประเภทการประชุม" }).min(1, { message: "กรุณาเลือกประเภทการประชุม" }),
  meetingDate: z.string({ message: "กรุณาระบุวันที่และเวลา" }).min(1, { message: "กรุณาระบุวันที่และเวลา" }),
  location: z.string().max(500).optional(),
});

type CreateMeetingValues = z.infer<typeof createMeetingSchema>;

// --- 2. Mock Data สำหรับ Dropdown ---
const MEETING_TYPES = [
  { id: 1, name: "Type 1" },
  { id: 2, name: "Type 2" },
  { id: 3, name: "Type 3" },
];

export const CreateMeetingForm = () => {
  // --- 3. Mock Context (เตรียมไว้ส่งเป็นคนสร้าง - createdBy) ---
  const mockContext = {
    userId: "018f3a3b-1b2c-7d3e-8f4g-5h6i7j8k9l0m",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMeetingValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      meetingNo: "",
      title: "",
      meetingTypeId: "",
      meetingDate: "",
      location: "",
    },
  });

  const onSubmit = async (data: CreateMeetingValues) => {
    // แปลง String เป็น Number และจัดการ Payload ส่ง Backend
    const payload = {
      ...data,
      meetingTypeId: Number(data.meetingTypeId),
      // สมมติว่าสร้างใหม่ สถานะคือ 1 (เช่น รอการประชุม / ร่าง)
      meetingStatusId: 1,
      createdBy: mockContext.userId,
      // แปลง ISO String จาก datetime-local ให้มีวินาทีและ Timezone
      meetingDate: new Date(data.meetingDate).toISOString(),
    };

    console.log("Submitting Meeting Payload:", payload);
    // TODO: ส่ง payload นี้ไปที่ API / Controller

    // จำลองการโหลด
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("สร้างการประชุมสำเร็จ! ดู Payload ได้ใน Console");
  };

  return (
    <div className="mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          สร้างการประชุมใหม่
        </h2>
        <p className="text-sm text-slate-gray mt-2">
          กรอกข้อมูลเพื่อกำหนดวาระและตารางการประชุม
        </p>
      </div>

      {/* Form เนื้อหาหลัก */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* หัวข้อการประชุม (Title) */}
        <div className="w-full">
          <Label htmlFor="title" className="text-sm font-medium text-foreground mb-1.5 block">
            หัวข้อการประชุม <span className="text-status-orange">*</span>
          </Label>
          <Textarea
            id="title"
            {...register("title")}
            rows={2}
            placeholder="ระบุหัวข้อหรือเรื่องที่จะพิจารณา..."
            className={cn(
              "resize-none bg-surface text-base",
              errors.title && "border-status-orange focus-visible:ring-status-orange bg-orange-50/50"
            )}
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.title.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ครั้งที่การประชุม */}
          <div className="w-full">
            <Label htmlFor="meetingNo" className="text-sm font-medium text-foreground mb-1.5 block">
              ครั้งที่การประชุม <span className="text-status-orange">*</span>
            </Label>
            <Input
              id="meetingNo"
              {...register("meetingNo")}
              placeholder="เช่น 1/2567"
              className={cn(
                "bg-surface",
                errors.meetingNo && "border-status-orange focus-visible:ring-status-orange bg-orange-50/50"
              )}
            />
            {errors.meetingNo && (
              <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.meetingNo.message}
              </p>
            )}
          </div>

          {/* ประเภทการประชุม */}
          <div className="w-full">
            <Label className="text-sm font-medium text-foreground mb-1.5 block">
              ประเภทการประชุม <span className="text-status-orange">*</span>
            </Label>
            <Controller
              control={control}
              name="meetingTypeId"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger className={cn("bg-surface", errors.meetingTypeId && "border-status-orange ring-1 ring-status-orange bg-orange-50/50")}>
                    <SelectValue placeholder="เลือกประเภท..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MEETING_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.meetingTypeId && (
              <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.meetingTypeId.message}
              </p>
            )}
          </div>

          {/* วันที่และเวลา */}
          <div className="w-full">
            <Label htmlFor="meetingDate" className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              <CalendarIcon className="w-4 h-4 text-slate-gray" />
              วันที่และเวลา <span className="text-status-orange">*</span>
            </Label>
            <Input
              id="meetingDate"
              type="datetime-local"
              {...register("meetingDate")}
              className={cn(
                "bg-surface",
                errors.meetingDate && "border-status-orange focus-visible:ring-status-orange bg-orange-50/50"
              )}
            />
            {errors.meetingDate && (
              <p className="mt-1.5 text-sm text-status-orange flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.meetingDate.message}
              </p>
            )}
          </div>

          {/* สถานที่ */}
          <div className="w-full">
            <Label htmlFor="location" className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              <MapPin className="w-4 h-4 text-slate-gray" />
              สถานที่ <span className="text-slate-gray font-normal">(ถ้ามี)</span>
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="เช่น ห้องประชุม 1 ศาลาว่าการ กทม. หรือ Link Zoom"
              className="bg-surface"
            />
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
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกและสร้างการประชุม"}
          </Button>
        </div>

      </form>
    </div>
  );
};
