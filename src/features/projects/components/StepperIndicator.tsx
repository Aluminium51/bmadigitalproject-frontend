import { Check } from "lucide-react";
import { useProjectFormStore } from "../stores/useProjectFormStore";

export const StepperIndicator = () => {
  const currentStep = useProjectFormStore((state) => state.currentStep);
  
  const steps = [
    "ข้อมูลทั่วไป", 
    "สาระสำคัญ", 
    "สถาปัตยกรรม (EA)", 
    "งบประมาณ", 
    "ความพร้อม"
  ];

  const stepsSm = [
    "ข้อมูลทั่วไป", 
    "สาระสำคัญ", 
    "EA", 
    "งบ", 
    "ความพร้อม"
  ];

  return (
    <div className="mb-12 w-full px-2 sm:px-6">
      <div className="flex w-full items-center justify-between">
        {/* ✅ วนลูปจาก steps ตัวเต็มเป็นหลัก */}
        {steps.map((fullLabel, index) => {
          const shortLabel = stepsSm[index]; // ดึงข้อความแบบสั้นตาม index
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isPast = currentStep > stepNum;
          const isLast = stepNum === steps.length;

          return (
            <div key={fullLabel} className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}>
              
              {/* ส่วนของวงกลม และ ตัวหนังสือ */}
              <div className="relative flex flex-col items-center group">
                
                {/* วงกลม (Step Circle) */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ease-in-out z-10 ${
                    isActive
                      ? "bg-primary-container text-primary shadow-md ring-2 ring-primary scale-110" 
                      : isPast
                      ? "bg-primary text-surface shadow-sm" 
                      : "bg-surface-container border-2 border-border text-slate-gray" 
                  }`}
                >
                  {isPast ? <Check className="h-5 w-5 stroke-3 text-white" /> : stepNum}
                </div>
                
                {/* ตัวหนังสือ (Label) - ถูกจัดให้อยู่ใต้วงกลมเสมอ */}
                <div className="absolute top-14 flex w-24 sm:w-32 justify-center">
                  <span
                    className={`text-xs sm:text-sm text-center transition-all duration-300 ${
                      isActive
                        ? "font-bold text-primary-container"
                        : isPast
                        ? "font-medium text-foreground"
                        : "font-medium text-slate-gray"
                    }`}
                  >
                    {/* ✅ จุดสำคัญ: ใช้ Tailwind สลับการแสดงผลข้อความ */}
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{fullLabel}</span>
                  </span>
                </div>
              </div>

              {/* เส้นเชื่อม (Connecting Line) */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4 flex items-center">
                  <div 
                    className={`h-0.5 w-full rounded-full transition-all duration-500 ease-in-out ${
                      isPast ? "bg-primary" : "bg-border"
                    }`} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* เพิ่มพื้นที่ด้านล่างป้องกันไม่ให้ตัวหนังสือที่โดน Absolute จัดวางไปทับกับ Form ด้านล่าง */}
      <div className="h-6" /> 
    </div>
  );
};