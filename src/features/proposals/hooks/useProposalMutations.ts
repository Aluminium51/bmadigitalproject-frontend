// src/features/proposals/hooks/useProposalMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProposalFormStore } from "../stores/useProposalFormStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ?? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081"}/api/v1`;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
async function apiFetch(url: string, options: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(
      new Error(formatApiError(json)),
      { status: res.status, data: json },
    );
  }
  return json;
}

function formatApiError(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "API error";

  const body = payload as Record<string, unknown>;
  const nestedError = body.error && typeof body.error === "object"
    ? body.error as Record<string, unknown>
    : undefined;
  const rawMessage = body.message ?? nestedError?.message ?? body.error;

  if (typeof rawMessage !== "string") return "API error";

  try {
    const issues = JSON.parse(rawMessage) as Array<{
      path?: unknown;
      message?: unknown;
    }>;

    if (Array.isArray(issues)) {
      const details = issues
        .map((issue) => {
          const path = Array.isArray(issue.path) ? issue.path.join(".") : "form";
          return `${path}: ${String(issue.message ?? "Invalid value")}`;
        })
        .join("; ");

      if (details) return `Submission validation failed: ${details}`;
    }
  } catch {
    // The API may return a normal, non-JSON error message.
  }

  return rawMessage;
}

function requireProjectId(projectId: string | undefined) {
  if (!projectId) throw new Error("projectId is required");
  return projectId;
}

const projectTypeMap: Record<string, string> = {
  "จัดหาใหม่": "NEW",
  "ทดแทนระบบเดิม": "REPLACEMENT",
  "โครงการต่อเนื่อง": "CONTINUOUS",
};

const locationTypeMap: Record<string, string> = {
  "สถานที่ราชการ": "GOVERNMENT",
  "สถานที่เอกชน": "PRIVATE",
};

const foodItemMap: Record<string, string> = {
  "ค่าอาหาร (ไม่ครบมื้อ)": "PARTIAL_MEAL",
  "ค่าอาหารและเครื่องดื่ม": "FULL_MEAL",
  "ค่าอาหารว่าง": "SNACK",
};

const personnelTypeByField = {
  personnelCoreCosts: "CORE",
  personnelAsstCosts: "ASST",
  personnelSuppCosts: "SUPP",
} as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stripClientOnlyIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripClientOnlyIds);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) => {
      // React Hook Form's useFieldArray adds local IDs such as "abc123".
      // The submit API only accepts persisted UUIDs for relational rows.
      if (key === "id" && (typeof child !== "string" || !UUID_PATTERN.test(child))) {
        return [];
      }
      return [[key, stripClientOnlyIds(child)]];
    }),
  );
}

export function normalizeProposalSubmissionPayload(payload: Record<string, unknown>) {
  // Draft data can be incomplete and is persisted in the backend JSON shape.
  // Do not run it through the frontend's strict form schema here; the submit
  // endpoint owns final validation and strips unknown fields.
  const normalized = stripClientOnlyIds(payload) as Record<string, unknown>;

  if (typeof normalized.projectType === "string") {
    normalized.projectType = projectTypeMap[normalized.projectType] ?? normalized.projectType;
  }

  if (Array.isArray(normalized.trainingCourses)) {
    normalized.trainingCourses = normalized.trainingCourses.map((course) => {
      if (!course || typeof course !== "object") return course;
      const normalizedCourse = { ...(course as Record<string, unknown>) };

      if (typeof normalizedCourse.locationType === "string") {
        normalizedCourse.locationType =
          locationTypeMap[normalizedCourse.locationType] ?? normalizedCourse.locationType;
      }

      if (Array.isArray(normalizedCourse.foodCosts)) {
        normalizedCourse.foodCosts = normalizedCourse.foodCosts.map((food) => {
          if (!food || typeof food !== "object") return food;
          const normalizedFood = { ...(food as Record<string, unknown>) };
          if (typeof normalizedFood.itemName === "string") {
            normalizedFood.itemName = foodItemMap[normalizedFood.itemName] ?? normalizedFood.itemName;
          }
          return normalizedFood;
        });
      }

      return normalizedCourse;
    });
  }

  for (const [field, personnelType] of Object.entries(personnelTypeByField)) {
    if (!Array.isArray(normalized[field])) continue;
    normalized[field] = normalized[field].map((personnel) => {
      if (!personnel || typeof personnel !== "object") return personnel;
      return {
        ...(personnel as Record<string, unknown>),
        personnelType,
      };
    });
  }

  return normalized;
}

// ---------------------------------------------------------------------------
// 1. Initialize Draft (POST)
//    Creates empty draft if not already present — idempotent.
// ---------------------------------------------------------------------------
export function useInitializeDraft(projectId: string | undefined) {
  return useMutation({
    mutationFn: () =>
      apiFetch(`${API_BASE}/proposals/projects/${requireProjectId(projectId)}/draft`, {
        method: "POST",
        body: "{}",
      }),
    onError: (error) => {
      console.error("[useInitializeDraft] Failed to initialize draft:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// 2. Auto-Save Draft (PATCH)
//    Called by useAutoSaveForm after debounce.
// ---------------------------------------------------------------------------
export function useAutoSaveDraft(projectId: string | undefined) {
  const { setSaveStatus } = useProposalFormStore();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch(`${API_BASE}/proposals/projects/${requireProjectId(projectId)}/draft`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onMutate: () => {
      setSaveStatus("saving");
    },
    onSuccess: () => {
      setSaveStatus("saved");
    },
    onError: (error) => {
      console.warn("[useAutoSaveDraft] Auto-save failed:", error);
      setSaveStatus("error");
    },
  });
}

// ---------------------------------------------------------------------------
// 3. Submit Proposal (POST)
//    Final submission with strict validation on the backend.
// ---------------------------------------------------------------------------
export function useSubmitProposal(projectId: string | undefined) {
  const { resetForm } = useProposalFormStore();
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch(`${API_BASE}/proposals/projects/${requireProjectId(projectId)}/submit`, {
        method: "POST",
        body: JSON.stringify(normalizeProposalSubmissionPayload(payload)),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proposals", "draft", projectId] });
      qc.invalidateQueries({ queryKey: ["proposals", "submitted", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId] });
      qc.invalidateQueries({ queryKey: ["proposals"] });

      resetForm();
      if (projectId) router.push(`/projects/${projectId}`);
    },
    onError: (error) => {
      console.error("[useSubmitProposal] Submission failed:", error);
      console.error("[useSubmitProposal] Backend response:", (error as Error & { data?: unknown }).data);
    },
  });
}
