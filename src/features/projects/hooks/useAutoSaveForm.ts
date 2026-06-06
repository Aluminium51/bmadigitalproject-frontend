import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useProjectFormStore } from "../stores/useProjectFormStore";
import { ProjectDraftValues } from "../types";

export const useAutoSaveForm = () => {
  // ดึงค่า watch จาก FormProvider ของหน้าแม่
  const { watch } = useFormContext<ProjectDraftValues>();

  const updateFormData = useProjectFormStore((state) => state.updateFormData);
  const setLastSavedAt = useProjectFormStore((state) => state.setLastSavedAt);

  useEffect(() => {
    // RHF watch จะทำงานทุกครั้งที่มีการเปลี่ยนค่าในฟอร์ม
    const subscription = watch((value) => {
      // ทำ Debounce 1 วินาที (1000ms) ก่อนเซฟลง Store
      const handler = setTimeout(() => {
        updateFormData(value as Partial<ProjectDraftValues>);
        setLastSavedAt(new Date().toISOString());

        // TODO: ตรงนี้สามารถแทรกโค้ด React Query (useMutation)
        // เพื่อยิง API บันทึก Draft ไปที่ Backend แบบเงียบๆ ได้
        console.log("Auto-saved to local storage:", value);
      }, 1000);

      return () => clearTimeout(handler);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, setLastSavedAt]);
};
