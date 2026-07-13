"use server";

import { serverFetch } from "@/lib/server-fetch";
import { schemas } from "@/types/api-schemas";

export async function getFourQuadrantsAction() {
  // สมมติว่า Route ฝั่ง Backend คือ /api/v1/lookups/four-quadrants
  return await serverFetch<any>("/api/v1/lookups/four-quadrants");
}

export async function getDeputyGovernorsAction() {
  // สมมติว่า Route ฝั่ง Backend คือ /api/v1/lookups/deputy-governors
  return await serverFetch<any>("/api/v1/lookups/deputy-governors");
}
