import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProposalDraftValues } from "../types";

// ----------------------------------------------------------------------
// 1. กำหนดโครงสร้างของ Store (Interfaces)
// ----------------------------------------------------------------------
interface ProposalFormState {
  // State
  currentStep: number;
  formData: ProposalDraftValues;
  lastSavedAt: string | null;
  stepErrors: number[]; // เก็บหมายเลข Step ที่มี Error (เช่น [1, 3])

  // Actions - การนำทางและข้อมูล
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ProposalDraftValues>) => void;
  setLastSavedAt: (timestamp: string) => void;
  resetForm: () => void;

  // Actions - จัดการ Validation Errors
  setStepErrors: (errors: number[]) => void;
  addStepError: (step: number) => void;
  removeStepError: (step: number) => void;
}

// ----------------------------------------------------------------------
// 2. ค่าเริ่มต้นของ State (Initial State)
// ----------------------------------------------------------------------
const initialState = {
  currentStep: 1,
  formData: {} as ProposalDraftValues, // ระบุ Type ป้องกัน TypeScript บ่นตอนเริ่มต้น
  lastSavedAt: null,
  stepErrors: [], // เริ่มต้นมาจะยังไม่มี Error ใดๆ
};

// ----------------------------------------------------------------------
// 3. สร้าง Zustand Store พร้อม Persist Middleware
// ----------------------------------------------------------------------
export const useProposalFormStore = create<ProposalFormState>()(
  persist(
    (set) => ({
      ...initialState,

      // --- จัดการการนำทาง (Navigation) ---
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => 
        set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () =>
        set((state) => ({
          currentStep: state.currentStep > 1 ? state.currentStep - 1 : 1,
        })),

      // --- จัดการข้อมูลฟอร์ม (Form Data) ---
      updateFormData: (newData) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...newData,
          },
        })),

      setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),

      // --- จัดการสถานะ Error ของแต่ละสเต็ป (Error Management) ---
      setStepErrors: (errors) => set({ stepErrors: errors }),

      // เพิ่มเลข Step ที่มีปัญหาเข้าไปใน Array
      addStepError: (step) =>
        set((state) => ({
          // เช็คก่อนว่ามีเลขนี้อยู่แล้วหรือยัง เพื่อป้องกันการเก็บค่าซ้ำซ้อน
          stepErrors: state.stepErrors.includes(step)
            ? state.stepErrors
            : [...state.stepErrors, step],
        })),

      // ลบเลข Step ออกจาก Array เมื่อผู้ใช้กรอกข้อมูลถูกต้องแล้ว
      removeStepError: (step) =>
        set((state) => ({
          stepErrors: state.stepErrors.filter((s) => s !== step),
        })),

      // --- ล้างข้อมูลทั้งหมด ---
      // ใช้เมื่อกด Submit สำเร็จ หรือต้องการเริ่มสร้างโครงการใหม่
      resetForm: () => set(initialState),
    }),
    {
      name: "bma-project-form-draft", // ชื่อ Key ที่เก็บใน LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);