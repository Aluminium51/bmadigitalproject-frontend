import { useFormContext } from "react-hook-form";
import { ProjectStep3Values } from "../types";

export const ProjectStep3 = () => {
  const { register, formState: { errors } } = useFormContext<ProjectStep3Values>();

  const strategyOptions = [
    "บรรจุในแผนปฏิบัติราชการ กทม.",
    "บรรจุในแผนปฏิบัติราชการประจำปีของหน่วยงาน",
    "เป็นโครงการตามนโยบายผู้ว่าฯ กทม."
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">3. สถาปัตยกรรมองค์กร (EA)</h2>

      <div>
        <label className="text-sm font-medium text-foreground">ความสอดคล้องเชิงยุทธศาสตร์ <span className="text-status-orange">*</span></label>
        <div className="mt-3 flex flex-col gap-3">
          {strategyOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" value={opt} {...register("strategicAlignments")} className="w-4 h-4 accent-primary-container rounded border-border" />
              <span className="text-sm text-foreground">{opt}</span>
            </label>
          ))}
        </div>
        {errors.strategicAlignments && <p className="mt-1 text-sm text-status-orange">{errors.strategicAlignments.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">ระเบียบ/กฎหมาย/ข้อบังคับที่เป็นอุปสรรค</label>
          <textarea {...register("obstacleLaws")} placeholder="ระบุระเบียบที่เป็นอุปสรรค หรือพิมพ์ 'ไม่มี'" rows={2} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">สถาปัตยกรรมด้านระบบสารสนเทศ (Application Architecture) <span className="text-status-orange">*</span></label>
          <textarea {...register("appArchitecture")} placeholder="อธิบายการทำงานร่วมกันโดยการแลกเปลี่ยนข้อมูล (เช่น API)" rows={3} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
          {errors.appArchitecture && <p className="mt-1 text-sm text-status-orange">{errors.appArchitecture.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-foreground">หน่วยงานเจ้าของข้อมูล <span className="text-status-orange">*</span></label>
            <input {...register("dataOwner")} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
            {errors.dataOwner && <p className="mt-1 text-sm text-status-orange">{errors.dataOwner.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">แนวทางการแลกเปลี่ยน/เชื่อมโยงข้อมูล <span className="text-status-orange">*</span></label>
          <textarea {...register("dataExchangePlan")} rows={2} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light" />
          {errors.dataExchangePlan && <p className="mt-1 text-sm text-status-orange">{errors.dataExchangePlan.message}</p>}
        </div>
      </div>

      {/* ส่วนแนบไฟล์ Diagram */}
      <div className="border-t border-border pt-6 mt-2">
        <h3 className="text-sm font-bold text-foreground mb-4">แนบไฟล์แผนภาพ (Diagrams)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-dashed border-border rounded-lg bg-surface-container-low text-center">
            <p className="text-sm text-foreground font-medium mb-1">System Diagram</p>
            <input type="file" {...register("systemDiagramFiles")} className="text-xs text-slate-gray w-full" accept="image/*,.pdf" />
          </div>
          <div className="p-4 border border-dashed border-border rounded-lg bg-surface-container-low text-center">
            <p className="text-sm text-foreground font-medium mb-1">Network Diagram</p>
            <input type="file" {...register("networkDiagramFiles")} className="text-xs text-slate-gray w-full" accept="image/*,.pdf" />
          </div>
        </div>
      </div>
    </div>
  );
};