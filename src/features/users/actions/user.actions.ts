// src/features/users/actions/user.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { schemas } from "@/types/api-schemas";
import { z } from "zod";

// ใช้ Type ที่ Generate มาจาก Backend Schema[cite: 13]
type UserProfileResponse = z.infer<typeof schemas.UserProfileResponse>;

export async function getUserProfileAction(userId: string): Promise<UserProfileResponse> {
  try {
    // ยิง API ไปที่ Route ดึงข้อมูลรายบุคคล[cite: 12]
    const response = await serverFetch(`/api/v1/users/profile/${userId}`, {
      method: "GET",
    });

    if (response instanceof Response) {
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      }
      return (await response.json()) as UserProfileResponse;
    }

    return response as UserProfileResponse;
  } catch (error: any) {
    throw new Error(error.message || "เกิดข้อผิดพลาดในการติดต่อเซิร์ฟเวอร์");
  }
}
