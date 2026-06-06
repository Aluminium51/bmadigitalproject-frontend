import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProjectDraftValues } from "../types";

// กำหนดโครงสร้างของ Store
interface ProjectFormState {
  // State
  currentStep: number;
  formData: ProjectDraftValues;
  lastSavedAt: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ProjectDraftValues>) => void;
  setLastSavedAt: (timestamp: string) => void;
  resetForm: () => void;
}

const initialState = {
  currentStep: 1,
  formData: {},
  lastSavedAt: null,
};

// สร้าง Zustand Store พร้อม Persist Middleware
export const useProjectFormStore = create<ProjectFormState>()(
  persist(
    (set) => ({
      ...initialState,

      // จัดการ Step แบบเจาะจง
      setStep: (step) => set({ currentStep: step }),

      // เลื่อน Step ไปข้างหน้า
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      // เลื่อน Step ถอยหลัง (ไม่ต่ำกว่า 1)
      prevStep: () =>
        set((state) => ({
          currentStep: state.currentStep > 1 ? state.currentStep - 1 : 1,
        })),

      // อัปเดตข้อมูลฟอร์ม โดยนำของเก่ามา Merge กับของใหม่
      updateFormData: (newData) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...newData,
          },
        })),

      // บันทึกเวลาที่ทำการ Auto-save ล่าสุด
      setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),

      // ล้างข้อมูลทั้งหมด (ใช้เมื่อกด Submit แบบ Final สำเร็จ)
      resetForm: () => set(initialState),
    }),
    {
      name: "bma-project-form-draft", // ชื่อ Key ที่จะเก็บใน LocalStorage
      storage: createJSONStorage(() => localStorage),
      // ทางเลือก: หากไม่ต้องการให้จำ Step ล่าสุดเมื่อ Reload สามารถกำหนด partialize ได้
      // partialize: (state) => ({ formData: state.formData, lastSavedAt: state.lastSavedAt }),
    },
  ),
);
