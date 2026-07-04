// src/features/projects/types/workspace.ts

export type DocumentFile = {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "other";
  size?: string;
  url?: string;
};

export type ProjectDetail = {
  // --- Identifiers ---
  id: string;          // UUIDv7 (PK)
  projectCode: string; // รหัสโครงการสำหรับแสดงผล เช่น "BMA-69-0001"
  
  // --- Core Details ---
  name: string;        
  agency: string;      // ชื่อหน่วยงาน (Map มาจากตาราง divisions.divisionName)
  fiscalYear: string | number; // ปีงบประมาณ 
  status: string;      // ชื่อสถานะโครงการ (Map มาจากตาราง projectStatuses.name)
  
  // --- Strategic Info (Newly Added) ---
  deputyGovernorName?: string | null; // ชื่อรองผู้ว่าฯ ที่กำกับดูแล (JOIN มาจาก deputyGovernors)
  fourQuadrantsName?: string | null;  // ชื่อยุทธศาสตร์ 4 Quadrants (JOIN มาจาก fourQuadrants)
  
  // --- UI/Client-side States ---
  hasProposal: boolean; // Flag สำหรับเช็คว่ามีการสร้างข้อเสนอโครงการแล้วหรือยัง

  // --- (Optional) Budget & Other Info ที่อาจจะใช้ใน Tab อื่นๆ ---
  initialRequestedBudget?: string | null; 
  latestApprovedBudget?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type WorkspaceTab = "tab-proposal" | "tab-documents" | "tab-timeline";