import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { ProjectStep1Values } from "../types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProjectStep1 = () => {
  const { register, control, formState: { errors } } = useFormContext<ProjectStep1Values>();
  
  // จัดการตารางงบประมาณรายปี
  const { fields, append, remove } = useFieldArray({
    control,
    name: "budgetsByYear",  
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- ส่วนที่ 1: ข้อมูลโครงการ (Project Info) --- */}
      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-8">1. ข้อมูลทั่วไป</h2>
        <div className="w-full">
          <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
            ชื่อโครงการ <span className="text-status-orange">*</span>
          </Label>
          <Input 
            id="projectName"
            {...register("projectName")} 
            placeholder="ระบุชื่อโครงการ"
            className="mt-1.5"
          />
          {errors.projectName && <p className="mt-1 text-sm text-status-orange">{errors.projectName.message}</p>}
        </div>
      </div>

      {/* เส้นแบ่งหมวดหมู่ */}
      {/* <div className="border-t border-border" /> */}

      {/* --- ส่วนที่ 2: ส่วนราชการ (Agency Group) --- */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">ส่วนราชการที่รับผิดชอบ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <Label htmlFor="agencyName" className="text-sm font-medium text-foreground">
              ชื่อหน่วยงาน <span className="text-status-orange">*</span>
            </Label>
            <Input 
              id="agencyName"
              {...register("agencyName")} 
              className="mt-1.5"
            />
            {errors.agencyName && <p className="mt-1 text-sm text-status-orange">{errors.agencyName.message}</p>}
          </div>
          <div>
            <Label htmlFor="headOfAgency" className="text-sm font-medium text-foreground">
              หัวหน้าส่วนราชการ <span className="text-status-orange">*</span>
            </Label>
            <Input 
              id="headOfAgency"
              {...register("headOfAgency")} 
              className="mt-1.5"
              placeholder="ex. นายสมชาย ใจดี"
            />
            {errors.headOfAgency && <p className="mt-1 text-sm text-status-orange">{errors.headOfAgency.message}</p>}
          </div>
          <div>
            <Label htmlFor="dcioName" className="text-sm font-medium text-foreground">
              ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง (DCIO) <span className="text-status-orange">*</span>
            </Label>
            <Input 
              id="dcioName"
              {...register("dcioName")} 
              className="mt-1.5"
              placeholder="ex. นายสมชาย ใจดี"
            />
            {errors.dcioName && <p className="mt-1 text-sm text-status-orange">{errors.dcioName.message}</p>}
          </div>
          <div>
            <Label htmlFor="projectManager" className="text-sm font-medium text-foreground">
              ผู้รับผิดชอบโครงการ <span className="text-status-orange">*</span>
            </Label>
            <Input 
              id="projectManager"
              {...register("projectManager")} 
              className="mt-1.5"
              placeholder="ex. นายสมชาย ใจดี"
            />
            {errors.projectManager && <p className="mt-1 text-sm text-status-orange">{errors.projectManager.message}</p>}
          </div>
        </div>
      </div>

      {/* เส้นแบ่งหมวดหมู่ */}
      <div className="border-t border-border" />

      {/* --- ส่วนที่ 3: งบประมาณรายปี (Budget) --- */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-bold text-foreground">งบประมาณรายปี</h3>
          <Button 
            type="button" 
            variant="soft" 
            size="sm"
            onClick={() => append({ year: "", amount: 0, budgetType: "งบประมาณรายจ่ายประจำปี" })}
            className="rounded-full gap-2 pl-2.5"
          >
            <Plus className="w-4 h-4" /> เพิ่มปีงบประมาณ
          </Button>
        </div>
        
        {/* รายการงบประมาณ */}
        <div className="space-y-2.5">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap sm:flex-nowrap gap-3 items-start bg-surface p-4 rounded-lg border border-border shadow-sm">
              <div className="w-full sm:w-1/4">
                <Label className="text-xs text-slate-gray mb-1 block">ปี พ.ศ.</Label>
                <Input 
                  {...register(`budgetsByYear.${index}.year`)} 
                  placeholder="เช่น 2567" 
                />
              </div>
              <div className="w-full sm:flex-1">
                <Label className="text-xs text-slate-gray mb-1 block">จำนวนเงิน (บาท)</Label>
                <Input 
                  type="number" 
                  {...register(`budgetsByYear.${index}.amount`, { valueAsNumber: true })} 
                  placeholder="0.00" 
                />
              </div>
              
              {/* === เปลี่ยนมาใช้ Shadcn Select ตรงนี้ === */}
              <div className="w-full sm:flex-1">
                <Label className="text-xs text-slate-gray mb-1 block">ประเภทงบประมาณ</Label>
                <Controller
                  control={control}
                  name={`budgetsByYear.${index}.budgetType`}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value || "งบประมาณรายจ่ายประจำปี"}>
                      <SelectTrigger className="w-full h-10 bg-background border-input focus:ring-primary-light focus:border-primary-container">
                        <SelectValue placeholder="เลือกประเภทงบประมาณ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="งบประมาณรายจ่ายประจำปี">งบประมาณรายจ่ายประจำปี</SelectItem>
                        <SelectItem value="งบกลาง">งบกลาง</SelectItem>
                        <SelectItem value="งบประมาณรายจ่ายประจำปี(เพิ่มเติม)">งบประมาณรายจ่ายประจำปี(เพิ่มเติม)</SelectItem>
                        <SelectItem value="งบแปรญัตติ">งบแปรญัตติ</SelectItem>
                        <SelectItem value="เงินนอกงบประมาณ">เงินนอกงบประมาณ</SelectItem>
                        <SelectItem value="งบประมาณแผ่นดิน">งบประมาณแผ่นดิน</SelectItem>
                        
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* ================================== */}

              <div className="w-full my-auto md:ml-6 sm:w-auto flex flex-col items-center justify-center">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  className="w-full sm:w-10 rounded-md"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* สรุปรวมงบประมาณ */}
        <div className="mt-6 p-5 bg-surface-container-low/30 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Label htmlFor="totalBudget" className="text-sm font-bold text-foreground">
            รวมงบประมาณทั้งโครงการ (บาท) <span className="text-status-orange">*</span>
          </Label>
          <div className="w-full sm:w-1/3">
            <Input 
              id="totalBudget"
              type="number" 
              {...register("totalBudget", { valueAsNumber: true })} 
              placeholder="0.00"
              className="text-right font-semibold text-primary-dark"
            />
            {errors.totalBudget && <p className="mt-1 text-sm text-status-orange text-right">{errors.totalBudget.message}</p>}
          </div>
        </div>
      </div>

    </div>
  );
};