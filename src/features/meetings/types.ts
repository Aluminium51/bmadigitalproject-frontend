// src/features/meetings/types.ts
// ระบบจัดการการประชุมและมติ — TypeScript Interfaces & Enums

// ─── Enums ──────────────────────────────────────────────

export enum MeetingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AgendaType {
  FOR_INFORMATION = "FOR_INFORMATION",       // วาระที่ 1: แจ้งเพื่อทราบ
  APPROVE_MINUTES = "APPROVE_MINUTES",       // วาระที่ 2: รับรองรายงานการประชุม
  FOR_CONSIDERATION = "FOR_CONSIDERATION",   // วาระที่ 3: เพื่อพิจารณา
  OTHER = "OTHER",                           // วาระที่ 4: เรื่องอื่นๆ
}

export enum ResolutionStatus {
  APPROVED = "APPROVED",           // เห็นชอบ
  ACKNOWLEDGED = "ACKNOWLEDGED",   // รับทราบ
  NEED_REVISION = "NEED_REVISION", // ให้ทบทวน
  REJECTED = "REJECTED",           // ไม่เห็นชอบ
}

// ─── Thai Label Maps ────────────────────────────────────

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  [MeetingStatus.DRAFT]: "ร่าง",
  [MeetingStatus.SCHEDULED]: "นัดหมายแล้ว",
  [MeetingStatus.IN_PROGRESS]: "กำลังประชุม",
  [MeetingStatus.COMPLETED]: "เสร็จสิ้น",
  [MeetingStatus.CANCELLED]: "ยกเลิก",
};

export const MEETING_STATUS_COLORS: Record<
  MeetingStatus,
  { bg: string; text: string; border: string }
> = {
  [MeetingStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [MeetingStatus.SCHEDULED]: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [MeetingStatus.IN_PROGRESS]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [MeetingStatus.COMPLETED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [MeetingStatus.CANCELLED]: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

export const AGENDA_TYPE_LABELS: Record<AgendaType, string> = {
  [AgendaType.FOR_INFORMATION]: "วาระที่ 1: แจ้งเพื่อทราบ",
  [AgendaType.APPROVE_MINUTES]: "วาระที่ 2: รับรองรายงานการประชุม",
  [AgendaType.FOR_CONSIDERATION]: "วาระที่ 3: เพื่อพิจารณา",
  [AgendaType.OTHER]: "วาระที่ 4: เรื่องอื่นๆ",
};

export const AGENDA_TYPE_ORDER: AgendaType[] = [
  AgendaType.FOR_INFORMATION,
  AgendaType.APPROVE_MINUTES,
  AgendaType.FOR_CONSIDERATION,
  AgendaType.OTHER,
];

export const RESOLUTION_STATUS_LABELS: Record<ResolutionStatus, string> = {
  [ResolutionStatus.APPROVED]: "เห็นชอบ",
  [ResolutionStatus.ACKNOWLEDGED]: "รับทราบ",
  [ResolutionStatus.NEED_REVISION]: "ให้ทบทวน",
  [ResolutionStatus.REJECTED]: "ไม่เห็นชอบ",
};

export const RESOLUTION_STATUS_COLORS: Record<
  ResolutionStatus,
  { bg: string; text: string; border: string }
> = {
  [ResolutionStatus.APPROVED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ResolutionStatus.ACKNOWLEDGED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ResolutionStatus.NEED_REVISION]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [ResolutionStatus.REJECTED]: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

// ─── Data Interfaces ────────────────────────────────────

export interface Project {
  project_id: string;
  project_code: string;
  name: string;
  agency: string;
  budget: number;
  description: string;
  objective: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface Resolution {
  resolution_id: string;
  agenda_id: string;
  resolution_status: ResolutionStatus | null;
  comment: string;
}

export interface Agenda {
  agenda_id: string;
  meeting_id: string;
  project_id: string | null;
  agenda_number: number;
  agenda_type: AgendaType;
  title: string;
  description: string;
  project?: Project | null;
  resolution?: Resolution | null;
}

export interface Meeting {
  meeting_id: string;
  meeting_no: string;
  title: string;
  meeting_date: string;
  location: string;
  chairman: string;
  meeting_status: MeetingStatus;
  agendas?: Agenda[];
}

// ─── Grouped Agendas Helper ─────────────────────────────

export interface GroupedAgendas {
  type: AgendaType;
  label: string;
  agendas: Agenda[];
}
