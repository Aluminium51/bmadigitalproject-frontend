// src/features/projects/components/step4/OtherCostSection.tsx
"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ProjectStep4Values } from "../../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

export const OtherCostSection = () => {
  const { control, register, formState: { errors } } = useFormContext<ProjectStep4Values>();
  const { fields: otherFields, append: appendOther, remove: removeOther } = useFieldArray({ control, name: "otherCosts" });
  const watchedOther = useWatch({ control, name: "otherCosts" }) || [];
  const totalOtherCost = watchedOther.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label className="text-md font-bold text-foreground">5. ค่าใช้จ่ายอื่น ๆ (เช่น ค่าเอกสารรายงานผลการศึกษา ค่าใช้จ่ายสำนักงาน ฯลฯ)</Label>
        <Button 
          type="button" 
          onClick={() => appendOther({ itemName: "", quantity: 1, unitPrice: "", remark: "" } as any)} 
          size="sm" 
          className="rounded-full gap-2"
        >
          <Plus className="w-4 h-4"/> เพิ่มรายการ
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-md shadow-sm w-full">
        <table className="w-full text-left min-w-[800px] text-sm">
          <thead className="bg-surface-container-low text-slate-gray">
            <tr>
              <th className="p-3 w-12 text-center">ลำดับ</th>
              <th className="p-3 w-[30%]">รายการ</th>
              <th className="p-3 w-20 text-center">จำนวน</th>
              <th className="p-3 w-32 text-right">ราคาต่อหน่วย(บาท)</th>
              <th className="p-3 w-32 text-right">รวม(บาท)</th>
              <th className="p-3 w-[25%]">หมายเหตุ</th>
              <th className="p-3 w-10 text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {otherFields.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">ไม่มีข้อมูลค่าใช้จ่ายอื่นๆ</td></tr>
            )}
            {otherFields.map((field, index) => {
              const row = watchedOther[index] || {};
              const rowErrors = errors?.otherCosts?.[index] || {} as any;
              const rowTotal = (row.quantity || 0) * (row.unitPrice || 0);
              
              return (
                <tr key={field.id} className="border-t border-surface-variant">
                  <td className="p-2 text-center text-muted-foreground">{index + 1}</td>
                  <td className="p-2"><Input {...register(`otherCosts.${index}.itemName`)} className={`bg-surface ${rowErrors.itemName ? 'border-status-orange' : ''}`} placeholder={rowErrors.itemName ? rowErrors.itemName.message : "ระบุรายการ"} /></td>
                  <td className="p-2"><Input type="number" {...register(`otherCosts.${index}.quantity`, { valueAsNumber: true })} className={`bg-surface text-center ${rowErrors.quantity ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-2"><Input type="number" {...register(`otherCosts.${index}.unitPrice`, { valueAsNumber: true })} className={`bg-surface text-right ${rowErrors.unitPrice ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-2 text-right font-bold text-primary">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  <td className="p-2"><Input {...register(`otherCosts.${index}.remark`)} className="bg-surface" placeholder="ระบุหมายเหตุ (ถ้ามี)" /></td>
                  <td className="p-2 text-center"><Button type="button" onClick={() => removeOther(index)} variant="ghost" size="icon" className="text-status-orange hover:bg-red-100 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right font-bold text-sm text-foreground">รวมหมวดค่าใช้จ่ายอื่นๆ: {totalOtherCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
    </div>
  );
};