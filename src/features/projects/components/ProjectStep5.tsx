import { useFormContext, useFieldArray } from "react-hook-form";
import { ProjectStep5Values } from "../types";

export const ProjectStep5 = () => {
  const { register, control, formState: { errors } } = useFormContext<ProjectStep5Values>();

  const { fields, append, remove } = useFieldArray({
    control, name: "currentIctStaff",
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">5. ความพร้อมและข้อมูลผู้เสนอ</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">ระยะเวลาดำเนินงาน (วัน) <span className="text-status-orange">*</span></label>
          <input type="number" {...register("operationDuration", { valueAsNumber: true })} placeholder="เช่น 210" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
          {errors.operationDuration && <p className="mt-1 text-sm text-status-orange">{errors.operationDuration.message}</p>}
        </div>
      </div>

      {/* ตารางความพร้อมบุคลากร ICT */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-foreground">ความพร้อมบุคลากร ICT ที่มีอยู่ในปัจจุบัน</label>
          <button type="button" onClick={() => append({ position: "นักวิชาการคอมพิวเตอร์", level: "ชำนาญการ", count: 1 })} className="text-xs text-primary-container font-medium hover:underline">+ เพิ่มบุคลากร</button>
        </div>
        <div className="border border-border rounded-md overflow-hidden">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 p-2 border-b border-surface-variant last:border-0 bg-surface-container-low items-center">
              <input {...register(`currentIctStaff.${index}.position`)} placeholder="ตำแหน่ง" className="flex-1 text-sm border border-border rounded px-2 py-1" />
              <input {...register(`currentIctStaff.${index}.level`)} placeholder="ระดับ" className="w-1/4 text-sm border border-border rounded px-2 py-1" />
              <input type="number" {...register(`currentIctStaff.${index}.count`, { valueAsNumber: true })} placeholder="จำนวนคน" className="w-20 text-sm border border-border rounded px-2 py-1 text-center" />
              <button type="button" onClick={() => remove(index)} className="text-status-orange px-2 text-sm font-bold">X</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">ประโยชน์ที่คาดว่าจะได้รับ <span className="text-status-orange">*</span></label>
        <textarea {...register("expectedBenefits")} rows={4} placeholder="อธิบายประโยชน์ที่จะเกิดขึ้นกับ กทม. และประชาชน" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
        {errors.expectedBenefits && <p className="mt-1 text-sm text-status-orange">{errors.expectedBenefits.message}</p>}
      </div>

      <div className="bg-surface-container-low p-6 rounded-lg border border-border mt-4">
        <h3 className="text-lg font-bold text-foreground mb-4">ลงชื่อผู้เสนอโครงการ (หัวหน้าส่วนราชการ)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-foreground">ชื่อ-นามสกุล <span className="text-status-orange">*</span></label>
            <input {...register("submitterName")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
            {errors.submitterName && <p className="mt-1 text-sm text-status-orange">{errors.submitterName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">หน่วยงาน <span className="text-status-orange">*</span></label>
            <input {...register("submitterAgency")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
            {errors.submitterAgency && <p className="mt-1 text-sm text-status-orange">{errors.submitterAgency.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">โทรศัพท์ติดต่อ <span className="text-status-orange">*</span></label>
            <input type="tel" {...register("submitterPhone")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
            {errors.submitterPhone && <p className="mt-1 text-sm text-status-orange">{errors.submitterPhone.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">อีเมล (e-Mail) <span className="text-status-orange">*</span></label>
            <input type="email" {...register("submitterEmail")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
            {errors.submitterEmail && <p className="mt-1 text-sm text-status-orange">{errors.submitterEmail.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};