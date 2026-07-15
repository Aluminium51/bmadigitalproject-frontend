// src/features/projects/types/workspace.ts
import { z } from "zod";
import { schemas } from "@/types/api-schemas";

// 1. ดึง Type โครงสร้าง Project จาก Backend โดยตรง
export type ProjectResponse = z.infer<typeof schemas.Project>;

// 2. ขยาย Type เพื่อเพิ่มสถานะที่ใช้เฉพาะระบบหน้าบ้าน (UI State)
export interface ProjectDetail extends ProjectResponse {
  hasProposal: boolean;
}

export type DocumentFile = {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "other";
  size?: string;
  url?: string;
};

export type WorkspaceTab = "tab-proposal" | "tab-documents" | "tab-timeline";