import { useFormContext, useFieldArray } from "react-hook-form";
import { ProjectStep1Values } from "../types";

export const ProjectStep1 = () => {
  const { register, control, formState: { errors } } = useFormContext<ProjectStep1Values>();
  
  // จัดการตารางงบประมาณรายปี
  const { fields, append, remove } = useFieldArray({
    control,
    name: "budgetsByYear",
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground">1. ข้อมูลทั่วไป</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">ชื่อโครงการ</label>
          <input {...register("projectName")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.projectName && <p className="mt-1 text-sm text-status-orange">{errors.projectName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">ชื่อหน่วยงาน</label>
          <input {...register("agencyName")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.agencyName && <p className="mt-1 text-sm text-status-orange">{errors.agencyName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">หัวหน้าส่วนราชการ</label>
          <input {...register("headOfAgency")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.headOfAgency && <p className="mt-1 text-sm text-status-orange">{errors.headOfAgency.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">DCIO</label>
          <input {...register("dcioName")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.dcioName && <p className="mt-1 text-sm text-status-orange">{errors.dcioName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">ผู้รับผิดชอบโครงการ</label>
          <input {...register("projectManager")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.projectManager && <p className="mt-1 text-sm text-status-orange">{errors.projectManager.message}</p>}
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-2">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-foreground">งบประมาณรายปี</label>
          <button 
            type="button" 
            onClick={() => append({ year: "", amount: 0, budgetType: "งบประมาณรายจ่ายประจำปี" })}
            className="text-sm text-primary-container font-medium hover:underline"
          >
            + เพิ่มปีงบประมาณ
          </button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start mb-4 bg-surface-container p-4 rounded-md">
            <div className="flex-1">
              <input {...register(`budgetsByYear.${index}.year`)} placeholder="พ.ศ." className="w-full rounded-md border border-border px-3 py-1.5" />
            </div>
            <div className="flex-1">
              <input type="number" {...register(`budgetsByYear.${index}.amount`, { valueAsNumber: true })} placeholder="จำนวนเงิน" className="w-full rounded-md border border-border px-3 py-1.5" />
            </div>
            <div className="flex-1">
              <select {...register(`budgetsByYear.${index}.budgetType`)} className="w-full rounded-md border border-border px-3 py-1.5 bg-surface">
                <option value="งบประมาณรายจ่ายประจำปี">งบประมาณรายจ่ายประจำปี</option>
                <option value="งบกลาง">งบกลาง</option>
              </select>
            </div>
            <button type="button" onClick={() => remove(index)} className="text-status-orange font-bold px-2 py-1">X</button>
          </div>
        ))}
        
        <div className="mt-4">
          <label className="text-sm font-medium text-foreground">รวมงบประมาณทั้งโครงการ (บาท)</label>
          <input type="number" {...register("totalBudget", { valueAsNumber: true })} className="mt-1 w-full sm:w-1/3 rounded-md border border-border bg-surface px-4 py-2 focus:border-primary-container focus:ring-2 focus:ring-primary-light outline-none" />
          {errors.totalBudget && <p className="mt-1 text-sm text-status-orange">{errors.totalBudget.message}</p>}
        </div>
      </div>
    </div>
  );
};