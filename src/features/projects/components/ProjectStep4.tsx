import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ProjectStep4Values } from "../types";

export const ProjectStep4 = () => {
  const { register, control, formState: { errors } } = useFormContext<ProjectStep4Values>();
  
  // 1. ตารางบุคลากร
  const { fields: personnelFields, append: appendPersonnel, remove: removePersonnel } = useFieldArray({
    control, name: "personnelCosts",
  });
  const watchedPersonnel = useWatch({ control, name: "personnelCosts" }) || [];

  // 2. ตารางค่าใช้จ่ายอื่นๆ
  const { fields: otherFields, append: appendOther, remove: removeOther } = useFieldArray({
    control, name: "otherCosts",
  });
  const watchedOther = useWatch({ control, name: "otherCosts" }) || [];

  // คำนวณยอดรวมทั้งหมด
  const totalPersonnelCost = watchedPersonnel.reduce((acc, row) => acc + ((row.baseSalary || 0) * (row.multiplier || 1) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalOtherCost = watchedOther.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);
  const grandTotal = totalPersonnelCost + totalOtherCost; // ถ้ารวม Hardware/Software ก็บวกเพิ่มที่นี่

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">4. รายละเอียดค่าใช้จ่ายตามโครงการ</h2>

      {/* --- ตารางที่ 1: บุคลากร --- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-bold text-foreground">ค่าใช้จ่ายบุคลากรที่ใช้ในการพัฒนาระบบ <span className="text-status-orange">*</span></h3>
          <button type="button" onClick={() => appendPersonnel({ roleLevel: "บุคลากรหลัก", position: "", baseSalary: 0, multiplier: 1.76, personCount: 1, durationMonths: 1 })} className="text-sm text-white bg-primary px-3 py-1.5 rounded-md hover:bg-primary-container transition-colors">+ เพิ่มบุคลากร</button>
        </div>
        
        {errors.personnelCosts?.root && <p className="text-sm text-status-orange mb-2">{errors.personnelCosts.root.message}</p>}

        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full text-left min-w-200">
            <thead className="bg-surface-container-low text-sm">
              <tr>
                <th className="p-2 w-1/6">ระดับ</th>
                <th className="p-2 w-1/5">ตำแหน่ง</th>
                <th className="p-2">เงินเดือนฐาน</th>
                <th className="p-2 w-16">คน</th>
                <th className="p-2 w-16">เดือน</th>
                <th className="p-2 text-right">รวม (บาท)</th>
                <th className="p-2 text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {personnelFields.map((field, index) => {
                const row = watchedPersonnel[index];
                const rowTotal = (row?.baseSalary || 0) * (row?.multiplier || 1) * (row?.personCount || 0) * (row?.durationMonths || 0);
                return (
                  <tr key={field.id} className="border-t border-surface-variant">
                    <td className="p-2"><select {...register(`personnelCosts.${index}.roleLevel`)} className="w-full text-sm border border-border rounded p-1.5 outline-none"><option value="บุคลากรหลัก">หลัก</option><option value="บุคลากรผู้ช่วย">ผู้ช่วย</option><option value="บุคลากรสนับสนุน">สนับสนุน</option></select></td>
                    <td className="p-2"><input {...register(`personnelCosts.${index}.position`)} placeholder="ระบุตำแหน่ง" className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2 flex items-center gap-1"><input type="number" {...register(`personnelCosts.${index}.baseSalary`, { valueAsNumber: true })} className="w-full text-sm border border-border rounded p-1.5 outline-none" /><span className="text-xs text-slate-gray whitespace-nowrap">x {row?.multiplier}</span></td>
                    <td className="p-2"><input type="number" {...register(`personnelCosts.${index}.personCount`, { valueAsNumber: true })} className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2"><input type="number" {...register(`personnelCosts.${index}.durationMonths`, { valueAsNumber: true })} className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2 text-right font-medium text-sm">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="p-2 text-center"><button type="button" onClick={() => removePersonnel(index)} className="text-status-orange font-bold hover:bg-error-container rounded-full w-6 h-6">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right font-bold text-sm text-primary">รวมหมวดบุคลากร: {totalPersonnelCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
      </div>

      {/* --- ตารางที่ 2: ค่าใช้จ่ายอื่นๆ (ครอบคลุมฝึกอบรม, ประชาสัมพันธ์) --- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-bold text-foreground">ค่าใช้จ่ายอื่นๆ (เช่น ฝึกอบรม, สื่อประชาสัมพันธ์)</h3>
          <button type="button" onClick={() => appendOther({ itemName: "", quantity: 1, unitPrice: 0, remark: "" })} className="text-sm text-white bg-primary px-3 py-1.5 rounded-md hover:bg-primary-container transition-colors">+ เพิ่มรายการ</button>
        </div>

        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full text-left min-w-175">
            <thead className="bg-surface-container-low text-sm">
              <tr>
                <th className="p-2 w-2/5">รายการ</th>
                <th className="p-2 w-20">จำนวน</th>
                <th className="p-2">ราคา/หน่วย (บาท)</th>
                <th className="p-2 text-right">รวม (บาท)</th>
                <th className="p-2 text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {otherFields.map((field, index) => {
                const row = watchedOther[index];
                const rowTotal = (row?.quantity || 0) * (row?.unitPrice || 0);
                return (
                  <tr key={field.id} className="border-t border-surface-variant">
                    <td className="p-2"><input {...register(`otherCosts.${index}.itemName`)} placeholder="เช่น จัดทำสื่อประชาสัมพันธ์" className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2"><input type="number" {...register(`otherCosts.${index}.quantity`, { valueAsNumber: true })} className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2"><input type="number" {...register(`otherCosts.${index}.unitPrice`, { valueAsNumber: true })} className="w-full text-sm border border-border rounded p-1.5 outline-none" /></td>
                    <td className="p-2 text-right font-medium text-sm">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="p-2 text-center"><button type="button" onClick={() => removeOther(index)} className="text-status-orange font-bold hover:bg-error-container rounded-full w-6 h-6">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right font-bold text-sm text-primary">รวมหมวดอื่นๆ: {totalOtherCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
      </div>

      {/* สรุปรวม Grand Total */}
      <div className="bg-primary-container text-surface p-4 rounded-md text-right mt-4">
        <h3 className="text-lg font-bold">รวมงบประมาณด้าน IT ทั้งสิ้น: {grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</h3>
      </div>
    </div>
  );
};