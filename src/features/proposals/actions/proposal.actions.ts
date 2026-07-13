// src/features/proposals/actions/proposal.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

// --- Action สำหรับสร้าง/อัปเดตแบบฟอร์ม Proposal ---
export async function saveProposalAction(projectId: string, payload: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const result = await serverFetch(`/projects/${projectId}/proposals`, {
      method: "POST", // หรืออาจจะเป็น PUT/PATCH ตามที่ Backend ออกแบบไว้
      body: JSON.stringify(payload),
    });

    // สั่งให้โหลดข้อมูลใหม่ในหน้ารายละเอียดของ Project นั้นๆ
    revalidatePath(`/projects/${projectId}`);

    return { success: true, message: "บันทึกเอกสารเสนอโครงการสำเร็จ", data: result };
  } catch (error: any) {
    return { success: false, message: error.message || "ไม่สามารถบันทึกข้อเสนอได้" };
  }
}
