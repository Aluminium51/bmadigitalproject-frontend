// src/features/projects/actions/project.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";
import { schemas } from "@/types/api-schemas";
import { z } from "zod";

type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

// นำเข้า Type ที่ Generate มาจาก Backend เพื่อให้มี Auto-complete ตอนใช้งาน
type PaginatedResponse = z.infer<typeof schemas.PaginatedProjectResponse>;

// --- Action สำหรับสร้างโครงการ ---
// (ส่วนนี้ใช้งานได้ปกติ ไม่ต้องแก้)
export async function createProjectAction(payload: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const result = await serverFetch("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Revalidate เพื่อสั่งให้ Next.js เคลียร์ Cache และโหลดข้อมูลใหม่ในหน้า Projects List ทันที
    revalidatePath("/projects");

    return { success: true, message: "สร้างโครงการสำเร็จ", data: result };
  } catch (error: any) {
    return { success: false, message: error.message || "ไม่สามารถสร้างโครงการได้" };
  }
}

// --- Action สำหรับดึงข้อมูลโครงการทั้งหมด (ปรับปรุงใหม่สำหรับ React Query) ---
export async function getProjectsAction(queryString: string): Promise<PaginatedResponse> {
  try {
    // 1. เรียก API ด้วย serverFetch (ซึ่งจะจัดการเรื่องการแนบ Token / Cookie ให้เราอัตโนมัติ)
    const response = await serverFetch(`/api/v1/projects?${queryString}`, {
      method: "GET",
    });

    // 2. ตรวจสอบว่า serverFetch ของคุณคืนค่ามาเป็นแบบไหน
    // กรณีที่ 1: คืนค่าเป็นตัวแปรประเภท Response (เหมือน fetch ปกติ)
    if (response instanceof Response) {
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
      }
      return (await response.json()) as PaginatedResponse;
    }

    // กรณีที่ 2: serverFetch ของคุณทำ .json() มาให้เรียบร้อยแล้ว
    return response as PaginatedResponse;

  } catch (error: any) {
    // 3. 🚨 หากเกิด Error เราจะ throw กลับไปตรงๆ
    // เพื่อให้ตัวจัดการ State อย่าง TanStack Query (isError) ตรวจจับได้
    throw new Error(error.message || "ไม่สามารถติดต่อฐานข้อมูลโครงการได้");
  }
}
