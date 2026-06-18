"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ProjectStep4Values } from "../../types";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
    
const PersonnelTable = ({ title, nameArray, control, register, watchFields, isSupport = false, errors }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name: nameArray });
  const tableErrors = errors[nameArray] || [];

  const totalCost = watchFields.reduce((acc: number, row: any) => {
    const salary = isSupport ? (row.baseSalary || 0) : ((row.baseSalary || 0) * (row.multiplier || 1));
    return acc + (salary * (row.personCount || 0) * (row.durationMonths || 0));
  }, 0);

  return (
    <div className="mt-6 border border-border rounded-lg p-4 bg-surface-container-lowest overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-sm text-foreground">{title}</h4>
        <Button type="button" variant="soft" size="sm" className="rounded-full gap-2 text-xs h-8"
          onClick={() => append({ position: "", degree: "", fieldOfStudy: "", experienceYears: "", baseSalary: "", multiplier: isSupport ? undefined : 1.0, personCount: 1, durationMonths: 1 })}
        >
          <Plus className="w-3 h-3" /> เพิ่ม{title}
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-md">
        <table className="w-full text-left min-w-300 text-xs">
          <thead className="bg-surface-container-low text-slate-gray">
            <tr>
              <th className="p-2 w-[15%]">ตำแหน่ง</th>
              <th className="p-2 w-[10%]">วุฒิ</th>
              {!isSupport && <th className="p-2 w-[10%]">สาขา</th>}
              <th className="p-2 w-4">อายุงานไม่น้อยกว่า(ปี)</th>
              <th className="p-2 w-20">{isSupport ? 'เงินเดือน(บาท)' : 'ฐาน(บาท)'}</th>
              {!isSupport && <th className="p-2 w-16">ตัวคูณ</th>}
              {!isSupport && <th className="p-2 w-20 text-right">เงินเดือน(บาท)</th>}
              <th className="p-2 w-16">คน</th>
              <th className="p-2 w-12">เดือน</th>
              <th className="p-2 w-24 text-right">รวม(บาท)</th>
              <th className="p-2 w-10 text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && <tr><td colSpan={isSupport ? 9 : 11} className="p-4 text-center text-muted-foreground">ไม่มีข้อมูล</td></tr>}
            {fields.map((field, index) => {
              const row = watchFields[index] || {};
              const rowErrors = tableErrors[index] || {};
              const calcSalary = isSupport ? (row.baseSalary || 0) : ((row.baseSalary || 0) * (row.multiplier || 1));
              const rowTotal = calcSalary * (row.personCount || 0) * (row.durationMonths || 0);

              return (
                <tr key={field.id} className="border-t border-surface-variant">
                  <td className="p-1"><Input {...register(`${nameArray}.${index}.position`)} className={`h-8 text-xs bg-surface ${rowErrors.position ? 'border-status-orange' : ''}`} placeholder={rowErrors.position ? rowErrors.position.message : ""} /></td>
                  <td className="p-1"><Input {...register(`${nameArray}.${index}.degree`)} className={`h-8 text-xs bg-surface ${rowErrors.degree ? 'border-status-orange' : ''}`} /></td>
                  {!isSupport && (
                    <td className="p-1"><Input {...register(`${nameArray}.${index}.fieldOfStudy`)} className={`h-8 text-xs bg-surface ${rowErrors.fieldOfStudy ? 'border-status-orange' : ''}`} /></td>
                  )}
                  <td className="p-1"><Input type="number" {...register(`${nameArray}.${index}.experienceYears`, { valueAsNumber: true })} className={`h-8 text-xs bg-surface ${rowErrors.experienceYears ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-1"><Input type="number" {...register(`${nameArray}.${index}.baseSalary`, { valueAsNumber: true })} className={`h-8 text-xs bg-surface ${rowErrors.baseSalary ? 'border-status-orange' : ''}`} /></td>
                  {!isSupport && (
                    <>
                      <td className="p-1"><Input type="number" step="0.01" {...register(`${nameArray}.${index}.multiplier`, { valueAsNumber: true })} className={`h-8 text-xs bg-surface ${rowErrors.multiplier ? 'border-status-orange' : ''}`} /></td>
                      <td className="p-1 text-right font-medium text-primary/80">{calcSalary.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    </>
                  )}
                  <td className="p-1"><Input type="number" {...register(`${nameArray}.${index}.personCount`, { valueAsNumber: true })} className={`h-8 text-xs bg-surface ${rowErrors.personCount ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-1"><Input type="number" {...register(`${nameArray}.${index}.durationMonths`, { valueAsNumber: true })} className={`h-8 text-xs bg-surface ${rowErrors.durationMonths ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-1 text-right font-bold text-primary">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  <td className="p-1 text-center"><Button type="button" onClick={() => remove(index)} variant="ghost" size="icon" className="h-7 w-7 text-status-orange hover:bg-red-100 hover:text-red-600 rounded-full"><Trash2 className="w-3 h-3" /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right font-bold text-sm text-foreground">รวมหมวด {title}: {totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
    </div>
  );
};

export const PersonnelCostSection = () => {
  const { control, register, formState: { errors } } = useFormContext<ProjectStep4Values>();
  
  const watchedCore = useWatch({ control, name: "personnelCoreCosts" }) || [];
  const watchedAsst = useWatch({ control, name: "personnelAsstCosts" }) || [];
  const watchedSupp = useWatch({ control, name: "personnelSuppCosts" }) || [];

  const { fields: respFields, replace: replaceResp } = useFieldArray({ control, name: "personnelResponsibilities" });
  const watchedResp = useWatch({ control, name: "personnelResponsibilities" }) || [];

  useEffect(() => {
    const allPositions = [...watchedCore.map(p => p.position), ...watchedAsst.map(p => p.position), ...watchedSupp.map(p => p.position)];
    const uniquePositions = Array.from(new Set(allPositions.filter(p => p && p.trim() !== "")));
    const currentPositionsInTable = respFields.map(f => f.position);
    
    const isSame = uniquePositions.length === currentPositionsInTable.length && uniquePositions.every((pos, index) => pos === currentPositionsInTable[index]);

    if (!isSame) {
      const newResponsibilities = uniquePositions.map(pos => {
        const existingRecord = watchedResp.find(r => r.position === pos);
        return { position: pos, responsibility: existingRecord ? existingRecord.responsibility : "" };
      });
      replaceResp(newResponsibilities);
    }
  }, [watchedCore, watchedAsst, watchedSupp, replaceResp, respFields, watchedResp]);

  return (
    <div>
      <Label className="text-md font-bold text-foreground block mb-2">3. ค่าใช้จ่ายบุคลากรที่ใช้ในการพัฒนาระบบ</Label>
      <PersonnelTable title="บุคลากรหลัก" nameArray="personnelCoreCosts" control={control} register={register} watchFields={watchedCore} errors={errors} />
      <PersonnelTable title="บุคลากรผู้ช่วย" nameArray="personnelAsstCosts" control={control} register={register} watchFields={watchedAsst} errors={errors} />
      <PersonnelTable title="บุคลากรสนับสนุน" nameArray="personnelSuppCosts" control={control} register={register} watchFields={watchedSupp} isSupport={true} errors={errors} />

      {respFields.length > 0 && (
        <div className="mt-4 border border-border rounded-lg p-4 bg-surface-container-lowest overflow-hidden">
          <Label className="text-md font-bold text-foreground block mb-3">หน้าที่ความรับผิดชอบของบุคลากรในแต่ละตำแหน่ง (ในกรณีมีค่าใช้จ่ายบุคลากร)</Label>
          <div className="overflow-x-auto border border-border rounded-md shadow-sm">
            <table className="w-full text-left min-w-150 text-sm">
              <thead className="bg-surface-container-low text-slate-gray">
                <tr>
                  <th className="p-3 w-16 text-center">ลำดับ</th>
                  <th className="p-3 w-1/3">ตำแหน่ง</th>
                  <th className="p-3">หน้าที่ความรับผิดชอบ</th>
                </tr>
              </thead>
              <tbody>
                {respFields.map((field, index) => {
                  const rowErrors = errors?.personnelResponsibilities?.[index] || {} as any;
                  return (
                    <tr key={field.id} className="border-t border-surface-variant">
                      <td className="p-3 text-center text-muted-foreground">{index + 1}</td>
                      <td className="p-3 font-medium text-foreground">
                        {field.position}
                        <input type="hidden" {...register(`personnelResponsibilities.${index}.position`)} value={field.position} />
                      </td>
                      <td className="p-3">
                        <Textarea {...register(`personnelResponsibilities.${index}.responsibility`)} placeholder="อธิบายหน้าที่ความรับผิดชอบอย่างละเอียด..." className={`min-h-20 bg-surface resize-y ${rowErrors.responsibility ? 'border-status-orange' : ''}`} />
                        {rowErrors.responsibility && <p className="text-status-orange text-xs mt-1">{rowErrors.responsibility.message}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};