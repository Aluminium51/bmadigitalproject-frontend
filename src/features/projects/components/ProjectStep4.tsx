"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ProjectStep4Values } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REFERENCE_OPTIONS = [
  "เกณฑ์กระทรวง DES",
  "สืบราคาจากตลาด",
  "ราคามาตรฐานสำนักงบประมาณ",
  "อื่นๆ"
];

// --- Component ย่อยสำหรับตารางบุคลากร ---
const PersonnelTable = ({ 
  title, nameArray, control, register, watchFields, isSupport = false, errors 
}: { 
  title: string, nameArray: "personnelCoreCosts" | "personnelAsstCosts" | "personnelSuppCosts", 
  control: any, register: any, watchFields: any[], isSupport?: boolean, errors: any 
}) => {
  const { fields, append, remove } = useFieldArray({ control, name: nameArray });
  const tableErrors = errors[nameArray] || []; // ดึง Error ของตารางนี้

  const totalCost = watchFields.reduce((acc, row) => {
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
          {/* thead เหมือนเดิม... */}
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
              const rowErrors = tableErrors[index] || {}; // Error ของแถวนี้
              const calcSalary = isSupport ? (row.baseSalary || 0) : ((row.baseSalary || 0) * (row.multiplier || 1));
              const rowTotal = calcSalary * (row.personCount || 0) * (row.durationMonths || 0);

              return (
                <tr key={field.id} className="border-t border-surface-variant">
                  {/* ใส่ className เช็ค Error ที่ขอบ Input */}
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


export const ProjectStep4 = () => {
  const { register, control, setValue, formState: { errors } } = useFormContext<ProjectStep4Values>();

  // ใช้ useFieldArray และ useWatch สำหรับ Hardware, Software, และ Personnel
  const { fields: hwFields, append: appendHw, remove: removeHw } = useFieldArray({ control, name: "hardwareCosts" });
  const watchedHw = useWatch({ control, name: "hardwareCosts" }) || [];

  const { fields: swFields, append: appendSw, remove: removeSw } = useFieldArray({ control, name: "softwareCosts" });
  const watchedSw = useWatch({ control, name: "softwareCosts" }) || [];

  // ใช้ useWatch สำหรับบุคลากรแต่ละหมวด
  const watchedCore = useWatch({ control, name: "personnelCoreCosts" }) || [];
  const watchedAsst = useWatch({ control, name: "personnelAsstCosts" }) || [];
  const watchedSupp = useWatch({ control, name: "personnelSuppCosts" }) || [];

  // คำนวณผลรวมของแต่ละหมวดและผลรวมทั้งหมด
  const totalHwCost = watchedHw.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);
  const totalSwCost = watchedSw.reduce((acc, row) => acc + ((row.quantity || 0) * (row.unitPrice || 0)), 0);
  const totalCore = watchedCore.reduce((acc, row) => acc + (((row.baseSalary || 0) * (row.multiplier || 1)) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalAsst = watchedAsst.reduce((acc, row) => acc + (((row.baseSalary || 0) * (row.multiplier || 1)) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  const totalSupp = watchedSupp.reduce((acc, row) => acc + ((row.baseSalary || 0) * (row.personCount || 0) * (row.durationMonths || 0)), 0);
  
  // คำนวณผลรวมทั้งหมด
  const grandTotal = totalHwCost + totalSwCost + totalCore + totalAsst + totalSupp;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">4. รายการค่าใช้จ่ายตามโครงการ (เฉพาะด้าน IT)</h2>

      {/* --- ตารางที่ 1: Hardware --- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label className="text-md font-bold text-foreground">1. ค่าใช้จ่ายครุภัณฑ์คอมพิวเตอร์ที่จัดหาในโครงการ</Label>
          <Button type="button" onClick={() => appendHw({ itemName: "", quantity: 1, unitPrice: "", reference: "" } as any)} size="sm" className="rounded-full gap-2"><Plus className="w-4 h-4"/> เพิ่มรายการ</Button>
        </div>

        <div className="overflow-x-auto border border-border rounded-md shadow-sm">
          <table className="w-full text-left min-w-200 text-sm">
            {/* ... thead คงเดิม ... */}
            <thead className="bg-surface-container-low text-slate-gray">
              <tr>
                <th className="p-3 w-[40%]">รายการ</th>
                <th className="p-3 w-20">จำนวน</th>
                <th className="p-3 w-32">ราคา/หน่วย(บาท)</th>
                <th className="p-3 w-32 text-right">รวม(บาท)</th>
                <th className="p-3 w-[25%]">หมายเหตุ (ที่มาของราคากลาง)</th>
                <th className="p-3 w-10 text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {hwFields.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">ไม่มีข้อมูลครุภัณฑ์</td></tr>}
              {hwFields.map((field, index) => {
                const row = watchedHw[index] || {};
                const rowErrors = errors?.hardwareCosts?.[index] || {} as any; // ดึง Error แถวนี้
                const rowTotal = (row.quantity || 0) * (row.unitPrice || 0);
                return (
                  <tr key={field.id} className="border-t border-surface-variant">
                    <td className="p-2"><Input {...register(`hardwareCosts.${index}.itemName`)} className={`bg-surface ${rowErrors.itemName ? 'border-status-orange' : ''}`} placeholder={rowErrors.itemName ? rowErrors.itemName.message : "ระบุชื่อครุภัณฑ์"} /></td>
                    <td className="p-2"><Input type="number" {...register(`hardwareCosts.${index}.quantity`, { valueAsNumber: true })} className={`bg-surface ${rowErrors.quantity ? 'border-status-orange' : ''}`} /></td>
                    <td className="p-2"><Input type="number" {...register(`hardwareCosts.${index}.unitPrice`, { valueAsNumber: true })} className={`bg-surface ${rowErrors.unitPrice ? 'border-status-orange' : ''}`} /></td>
                    <td className="p-2 text-right font-bold text-primary">{rowTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="p-2 relative">
                      <Select value={row.reference || ""} onValueChange={(val) => setValue(`hardwareCosts.${index}.reference`, val, { shouldValidate: true })}>
                        <SelectTrigger className={`bg-surface ${rowErrors.reference ? 'border-status-orange' : ''}`}><SelectValue placeholder="เลือกที่มา" /></SelectTrigger>
                        <SelectContent>
                          {REFERENCE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {rowErrors.reference && <AlertCircle className="w-4 h-4 text-status-orange absolute right-4 top-4" />}
                    </td>
                    <td className="p-2 text-center"><Button type="button" onClick={() => removeHw(index)} variant="ghost" size="icon" className="text-status-orange hover:bg-red-100 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right font-bold text-sm text-foreground">รวมหมวดครุภัณฑ์: {totalHwCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</div>
      </div>

      {/* --- ตารางที่ 2: Software --- */}
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
                const rowErrors = errors?.softwareCosts?.[index] || {} as any; // ดึง Error แถวนี้
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

      {/* --- ตารางที่ 3: บุคลากร --- */}
      <div>
        <Label className="text-md font-bold text-foreground block mb-2">3. ค่าใช้จ่ายบุคลากรที่ใช้ในการพัฒนาระบบ</Label>
        
        {/* ส่ง prop errors ลงไปด้วย */}
        <PersonnelTable title="บุคลากรหลัก" nameArray="personnelCoreCosts" control={control} register={register} watchFields={watchedCore} errors={errors} />
        <PersonnelTable title="บุคลากรผู้ช่วย" nameArray="personnelAsstCosts" control={control} register={register} watchFields={watchedAsst} errors={errors} />
        <PersonnelTable title="บุคลากรสนับสนุน" nameArray="personnelSuppCosts" control={control} register={register} watchFields={watchedSupp} isSupport={true} errors={errors} />

      </div>

      {/* --- สรุปรวม Grand Total --- */}
      <div className="bg-primary-container text-primary p-6 rounded-xl text-right mt-4 shadow-md flex justify-between items-center">
        <span className="text-lg font-medium opacity-90">รวมงบประมาณด้าน IT ทั้งสิ้น</span>
        <span className="text-3xl font-black">{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</span>
      </div>
    </div>
  );
};