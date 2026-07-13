import { useQuery } from "@tanstack/react-query";
import { getFourQuadrantsAction, getDeputyGovernorsAction } from "../actions/lookup.actions";

// ตั้งค่า Stale Time ฝั่ง Client (เช่น 24 ชั่วโมง ให้สอดคล้องกับ Backend)
const STALE_TIME = 1000 * 60 * 60 * 24;

export function useFourQuadrants() {
  return useQuery({
    queryKey: ["lookups", "fourQuadrants"],
    queryFn: () => getFourQuadrantsAction(),
    staleTime: STALE_TIME,
  });
}

export function useDeputyGovernors() {
  return useQuery({
    queryKey: ["lookups", "deputyGovernors"],
    queryFn: () => getDeputyGovernorsAction(),
    staleTime: STALE_TIME,
  });
}
