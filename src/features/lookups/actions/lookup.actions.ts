// src/modules/lookups/lookup.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getFourQuadrantsAction() {
  return await serverFetch<any>("/api/v1/lookups/four-quadrants", { skipToken: true });
}

export async function getDeputyGovernorsAction() {
  return await serverFetch<any>("/api/v1/lookups/deputy-governors", { skipToken: true });
}

export async function getDepartmentsAction() {
  return await serverFetch<any>("/api/v1/lookups/departments", { skipToken: true });
}

export async function getDivisionsAction(departmentId?: number) {
  const query = departmentId ? `?departmentId=${departmentId}` : "";
  return await serverFetch<any>(`/api/v1/lookups/divisions${query}`, { skipToken: true });
}
