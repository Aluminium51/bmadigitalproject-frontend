import { useFormContext } from "react-hook-form";
import { ProjectStep2Values } from "../types";

export const ProjectStep2 = () => {
  const { register, formState: { errors } } = useFormContext<ProjectStep2Values>();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground">2. สาระสำคัญและขอบเขต</h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">ความเป็นมา <span className="text-status-orange">*</span></label>
          <textarea {...register("background")} rows={3} placeholder="พิมพ์อย่างน้อย 10 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-container" />
          {errors.background && <p className="mt-1 text-sm text-status-orange">{errors.background.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">วัตถุประสงค์ <span className="text-status-orange">*</span></label>
          <textarea {...register("objective")} rows={3} placeholder="พิมพ์อย่างน้อย 10 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-container" />
          {errors.objective && <p className="mt-1 text-sm text-status-orange">{errors.objective.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">เป้าหมาย <span className="text-status-orange">*</span></label>
          <textarea {...register("target")} rows={3} placeholder="พิมพ์อย่างน้อย 10 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-container" />
          {errors.target && <p className="mt-1 text-sm text-status-orange">{errors.target.message}</p>}
        </div>

        {/* ✅ เพิ่มช่อง "ขอบเขตการดำเนินงาน" (scope) ที่ขาดหายไปตรงนี้ครับ */}
        <div>
          <label className="text-sm font-medium text-foreground">ขอบเขตการดำเนินงาน <span className="text-status-orange">*</span></label>
          <textarea {...register("scope")} rows={3} placeholder="พิมพ์อย่างน้อย 10 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-container" />
          {errors.scope && <p className="mt-1 text-sm text-status-orange">{errors.scope.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">ลักษณะโครงการ <span className="text-status-orange">*</span></label>
          <div className="mt-2 flex flex-col sm:flex-row gap-4">
            {["จัดหาใหม่", "ทดแทนระบบเดิม", "โครงการต่อเนื่อง"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={type} {...register("projectType")} className="accent-primary-container w-4 h-4" />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
          {errors.projectType && <p className="mt-1 text-sm text-status-orange">{errors.projectType.message}</p>}
        </div>
        
        <div className="border-t border-border pt-6 mt-2">
          <label className="text-sm font-medium text-foreground">สถานภาพระบบงานคอมพิวเตอร์ปัจจุบัน <span className="text-status-orange">*</span></label>
          <textarea {...register("currentSystemStatus")} rows={3} placeholder="พิมพ์อย่างน้อย 5 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
          {errors.currentSystemStatus && <p className="mt-1 text-sm text-status-orange">{errors.currentSystemStatus.message}</p>}
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground">สภาพปัญหาของผู้รับบริการ / เหตุผลความจำเป็น <span className="text-status-orange">*</span></label>
          <textarea {...register("currentProblems")} rows={3} placeholder="พิมพ์อย่างน้อย 5 ตัวอักษร" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
          {errors.currentProblems && <p className="mt-1 text-sm text-status-orange">{errors.currentProblems.message}</p>}
        </div>
      </div>
    </div>
  );
};