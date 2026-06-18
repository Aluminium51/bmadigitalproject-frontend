"use client";

import { REFERENCE_OPTIONS } from "./constants";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ProjectStep4Values } from "../../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SoftwareCostSection = () => {
  const { control, register, setValue, formState: { errors } } = useFormContext<ProjectStep4Values>();
  const { fields: swFields, append: appendSw, remove: removeSw } = useFieldArray({ control, name: "softwareCosts" });
  const watchedSw = useWatch({ control, name: "softwareCosts" }) || [];
  const totalSwCost = watchedSw.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label className="text-md font-bold text-foreground">2. ค่าใช้จ่ายซอฟต์แวร์และเครื่องมือที่จัดหาในโครงการ</Label>
        <Button type="button" onClick={() => appendSw({ itemName: "", quantity: 1, unitPrice: "", reference: "" } as any)} size="sm" className="rounded-full gap-2"><Plus className="w-4 h-4"/> เพิ่มรายการ</Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-md shadow-sm">
        <table className="w-full text-left min-w-200 text-sm">
          <thead className="bg-surface-container-low text-slate-gray">
            <tr>
              <th className="p-3 w-[40%]">ชื่อซอฟต์แวร์</th>
              <th className="p-3 w-20">จำนวน</th>
              <th className="p-3 w-32">ราคา/หน่วย(บาท)</th>
              <th className="p-3 w-32 text-right">จำนวนเงิน(บาท)</th>
              <th className="p-3 w-[25%]">หมายเหตุ (ที่มาของราคากลาง)</th>
              <th className="p-3 w-10 text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {swFields.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">ไม่มีข้อมูลซอฟต์แวร์</td></tr>}
            {swFields.map((field, index) => {
              const row = watchedSw[index] || {};
              const rowErrors = errors?.softwareCosts?.[index] || {} as any;
              const rowTotal = (row.quantity || 0) * (row.unitPrice || 0);
              return (
                <tr key={field.id} className="border-t border-surface-variant">
                  <td className="p-2"><Input {...register(`softwareCosts.${index}.itemName`)} className={`bg-surface ${rowErrors.itemName ? 'border-status-orange' : ''}`} placeholder={rowErrors.itemName ? rowErrors.itemName.message : "ระบุชื่อซอฟต์แวร์"} /></td>
                  <td className="p-2"><Input type="number" {...register(`softwareCosts.${index}.quantity`, { valueAsNumber: true })} className={`bg-surface ${rowErrors.quantity ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-2"><Input type="number" {...register(`softwareCosts.${index}.unitPrice`, { valueAsNumber: true })} className={`bg-surface ${rowErrors.unitPrice ? 'border-status-orange' : ''}`} /></td>
                  <td className="p-2 text-right font-bold text-primary">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  <td className="p-2 relative">
                    <Select value={row.reference || ""} onValueChange={(val) => setValue(`softwareCosts.${index}.reference`, val, { shouldValidate: true })}>
                      <SelectTrigger className={`bg-surface ${rowErrors.reference ? 'border-status-orange' : ''}`}><SelectValue placeholder="เลือกที่มา" /></SelectTrigger>
                      <SelectContent>
                        {REFERENCE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {rowErrors.reference && <AlertCircle className="w-4 h-4 text-status-orange absolute right-4 top-4" />}
                  </td>
                  <td className="p-2 text-center"><Button type="button" onClick={() => removeSw(index)} variant="ghost" size="icon" className="text-status-orange hover:bg-red-100 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right font-bold text-sm text-foreground">รวมหมวดซอฟต์แวร์: {totalSwCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
    </div>
  );
};