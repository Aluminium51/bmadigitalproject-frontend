// src/features/meetings/components/CreateMeetingForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Loader2, MapPin, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMeeting } from "../hooks/useMeetings";

const createMeetingSchema = z.object({
  meetingNo: z.string().trim().min(1, "กรุณาระบุครั้งที่ประชุม").max(100),
  title: z.string().trim().min(5, "กรุณาระบุหัวข้ออย่างน้อย 5 ตัวอักษร").max(500),
  meetingTypeId: z.string().min(1, "กรุณาเลือกประเภทการประชุม"),
  meetingDate: z.string().min(1, "กรุณาระบุวันและเวลา"),
  location: z.string().max(500).optional(),
});

type CreateMeetingValues = z.infer<typeof createMeetingSchema>;

const MEETING_TYPES = [
  { id: 1, label: "คกก. กลั่นกรอง" },
  { id: 2, label: "คกก. นโยบาย" },
];

export function CreateMeetingForm() {
  const router = useRouter();
  const createMeeting = useCreateMeeting();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMeetingValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: { meetingNo: "", title: "", meetingTypeId: "", meetingDate: "", location: "" },
  });

  const onSubmit = async (values: CreateMeetingValues) => {
    try {
      await createMeeting.mutateAsync({
        meetingNo: values.meetingNo,
        title: values.title,
        meetingTypeId: Number(values.meetingTypeId),
        meetingDate: new Date(values.meetingDate).toISOString(),
        location: values.location?.trim() || null,
        meetingStatusId: 1,
      });
      toast.success("สร้างการประชุมสำเร็จ");
      router.push("/meetings");
    } catch (error) {
      toast.error("ไม่สามารถสร้างการประชุมได้", {
        description: error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-md border-[#D1CDC7] shadow-sm">
      <CardHeader className="border-b border-[#ededf4] px-6 py-5 sm:px-8">
        <CardTitle className="text-xl font-extrabold text-[#191c20]">สร้างการประชุมใหม่</CardTitle>
        <p className="text-sm text-[#3f4942]">กำหนดรายละเอียดพื้นฐานก่อนเพิ่มวาระการประชุม</p>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meetingNo">ครั้งที่ประชุม</Label>
              <Input id="meetingNo" {...register("meetingNo")} placeholder="เช่น 1/2569" />
              {errors.meetingNo && <p className="text-xs text-red-600">{errors.meetingNo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTypeId">ประเภทการประชุม</Label>
              <Controller
                name="meetingTypeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="meetingTypeId"><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                    <SelectContent>
                      {MEETING_TYPES.map((type) => <SelectItem key={type.id} value={String(type.id)}>{type.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.meetingTypeId && <p className="text-xs text-red-600">{errors.meetingTypeId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">หัวข้อการประชุม</Label>
            <Textarea id="title" {...register("title")} rows={3} placeholder="ระบุหัวข้อหรือเรื่องที่จะพิจารณา" />
            {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meetingDate" className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />วันและเวลา</Label>
              <Input id="meetingDate" type="datetime-local" {...register("meetingDate")} />
              {errors.meetingDate && <p className="text-xs text-red-600">{errors.meetingDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4" />สถานที่</Label>
              <Input id="location" {...register("location")} placeholder="ระบุสถานที่หรือห้องประชุม" />
              {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#ededf4] pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/meetings")} disabled={createMeeting.isPending}>
              <X className="mr-2 h-4 w-4" />ยกเลิก
            </Button>
            <Button type="submit" disabled={createMeeting.isPending} className="bg-[#00734b] text-white hover:bg-[#005838]">
              {createMeeting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {createMeeting.isPending ? "กำลังบันทึก..." : "บันทึกการประชุม"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
