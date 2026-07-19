"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ?? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081"}/api/v1`;

async function deleteProject(projectId: string) {
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? "Unable to delete project");
  }
  return payload;
}

export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.removeQueries({ queryKey: ["project", projectId] });
      router.push("/projects");
    },
  });
}
