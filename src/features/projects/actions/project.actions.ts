// src/features/projects/actions/project.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

// --- Action สำหรับสร้างโครงการ ---
export async function createProjectAction(payload: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const result = await serverFetch("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Revalidate เพื่อสั่งให้ Next.js เคลียร์ Cache และโหลดข้อมูลใหม่ในหน้า Projects List
    revalidatePath("/projects");

    return { success: true, message: "สร้างโครงการสำเร็จ", data: result };
  } catch (error: any) {
    return { success: false, message: error.message || "ไม่สามารถสร้างโครงการได้" };
  }
}

// --- Action สำหรับดึงข้อมูลโครงการทั้งหมด ---
export async function getProjectsAction(status?: string) {
  try {
    const params = status ? { status } : undefined;
    const result = await serverFetch("/api/v1/projects", {
      method: "GET",
      params,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
