export const PROJECT_STATUS = {
  DRAFT: 1,
  PENDING_SECRETARY: 2,
  RETURNED_SECRETARY: 3,
  REJECTED_SECRETARY: 4,
  PENDING_ASSIGNMENT: 5,
  IN_ANALYSIS: 6,
  RETURNED_ANALYST: 7,
  REJECTED_ANALYST: 8,
  PENDING_SMALL_BOARD: 9,
  RETURNED_SMALL_BOARD: 10,
  REJECTED_SMALL_BOARD: 11,
  PENDING_BIG_BOARD: 12,
  RETURNED_BIG_BOARD: 13,
  REJECTED_BIG_BOARD: 14,
  APPROVED: 15,
} as const;

export const OWNER_EDITABLE_PROJECT_STATUSES = [1, 3, 7, 10, 13] as const;
export const OWNER_LOCKED_PROJECT_STATUSES = [2, 5, 6, 9, 12, 15] as const;

const STATUS_META: Record<number, { label: string; className: string }> = {
  1: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
  2: { label: "Pending Secretary", className: "bg-blue-50 text-blue-700 border-blue-200" },
  3: { label: "Returned by Secretary", className: "bg-orange-50 text-orange-700 border-orange-200" },
  4: { label: "Rejected by Secretary", className: "bg-red-50 text-red-700 border-red-200" },
  5: { label: "Pending Assignment", className: "bg-blue-50 text-blue-700 border-blue-200" },
  6: { label: "In Analysis", className: "bg-blue-50 text-blue-700 border-blue-200" },
  7: { label: "Returned by Analyst", className: "bg-orange-50 text-orange-700 border-orange-200" },
  8: { label: "Rejected by Analyst", className: "bg-red-50 text-red-700 border-red-200" },
  9: { label: "Pending Small Board", className: "bg-blue-50 text-blue-700 border-blue-200" },
  10: { label: "Returned by Small Board", className: "bg-orange-50 text-orange-700 border-orange-200" },
  11: { label: "Rejected by Small Board", className: "bg-red-50 text-red-700 border-red-200" },
  12: { label: "Pending Big Board", className: "bg-blue-50 text-blue-700 border-blue-200" },
  13: { label: "Returned by Big Board", className: "bg-orange-50 text-orange-700 border-orange-200" },
  14: { label: "Rejected by Big Board", className: "bg-red-50 text-red-700 border-red-200" },
  15: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export function getProjectStatusMeta(statusId?: number | null, fallbackName?: string | null) {
  return STATUS_META[statusId ?? -1] ?? {
    label: fallbackName || "Unknown",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };
}
