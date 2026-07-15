"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getFourQuadrantsAction() {
  return await serverFetch<any>("/api/v1/lookups/four-quadrants");
}

export async function getDeputyGovernorsAction() {
  return await serverFetch<any>("/api/v1/lookups/deputy-governors");
}

// ฟังก์ชันดึงข้อมูลหน่วยงานหลัก
export async function getDepartmentsAction() {
  return await serverFetch<any>("/api/v1/lookups/departments");
}

// ฟังก์ชันดึงข้อมูลส่วนราชการย่อย (สามารถส่ง departmentId ไปกรองได้)
export async function getDivisionsAction(departmentId?: number) {
  const query = departmentId ? `?departmentId=${departmentId}` : "";
  return await serverFetch<any>(`/api/v1/lookups/divisions${query}`);
}
