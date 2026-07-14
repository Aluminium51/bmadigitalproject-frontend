// src/features/users/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAction } from "../actions/user.actions";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfileAction(userId!),
    enabled: !!userId, // จะยิง API ก็ต่อเมื่อมี userId เท่านั้น
    staleTime: 1000 * 60 * 5, // เก็บ Cache ไว้ 5 นาที
  });
}
