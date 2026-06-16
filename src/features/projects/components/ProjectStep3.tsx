// ProjectStep3.tsx
import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ProjectStep3Values } from "../types";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/custom/RichTextarea";
import { Label } from "@/components/ui/label";
import { EAStrategySection } from "./EAStrategySection";
import { CloudUpload, FileImage, X, AlertCircle } from "lucide-react";

// --- 🟢 Component สำหรับอัปโหลด 1 ไฟล์ + คำอธิบาย ---
const SingleFileUploadWithDescBox = ({ title, name, watch, setValue, errors }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFiles: any[] = watch(name) || [];
  const isFull = currentFiles.length >= 1; // ล็อกโควต้าไว้ที่ 1 ไฟล์

  const handleFilesAdded = (files: FileList | File[]) => {
    if (isFull || files.length === 0) return;

    // เลือกแค่ไฟล์แรกไฟล์เดียว
    const mappedFile = {
      id: Math.random().toString(36).substring(7),
      file: Array.from(files)[0],
      description: "",
    };

    setValue(name, [mappedFile], { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setValue(name, [], { shouldValidate: true }); // เคลียร์เป็น Array ว่าง
  };

  const updateDescription = (newDesc: string) => {
    if (currentFiles.length > 0) {
      const updated = [{ ...currentFiles[0], description: newDesc }];
      setValue(name, updated, { shouldValidate: true });
    }
  };

  const fieldErrors = errors[name] as any;

  return (
    <div className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-surface">
      <Label className="text-sm font-bold text-foreground">{title}</Label>

      {/* กล่อง Drag & Drop (ซ่อนเมื่ออัปโหลดแล้ว 1 รูป) */}
      {!isFull && (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-surface-container-low hover:bg-surface-variant/30 hover:border-primary/50'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" accept="image/*,.pdf" className="hidden" ref={fileInputRef}
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
          />
          <CloudUpload className="w-6 h-6 text-primary/70 mb-2" />
          <p className="text-sm font-medium text-foreground">คลิก หรือ ลากไฟล์มาวางที่นี่</p>
          <p className="text-xs mt-1 text-muted-foreground">รองรับ 1 ไฟล์รูปภาพหรือ PDF</p>
        </div>
      )}

      {/* แสดงไฟล์ที่อัปโหลดแล้ว */}
      {isFull && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 p-3 bg-surface-container-low border border-border/50 rounded-lg animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileImage className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">{currentFiles[0].file.name}</span>
              </div>
              <button type="button" onClick={removeFile} className="p-1 rounded-full text-muted-foreground hover:bg-red-100 hover:text-red-600 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* ช่องกรอกคำอธิบาย (บังคับ) */}
            <div className="relative">
              <Input 
                placeholder="กรุณาระบุคำอธิบายรูปภาพ (บังคับ) *" 
                value={currentFiles[0].description}
                onChange={(e) => updateDescription(e.target.value)}
                className={`bg-surface text-sm h-9 ${fieldErrors?.[0]?.description ? 'border-status-orange focus-visible:ring-status-orange' : ''}`}
              />
              {fieldErrors?.[0]?.description && (
                <p className="text-xs text-status-orange mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors[0].description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Component หลัก ---
export const ProjectStep3 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectStep3Values>();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">3. สถาปัตยกรรมองค์กร (EA)</h2>

      {/* ... (EAStrategySection และ Input อื่นๆ คงเดิม) ... */}
      <EAStrategySection />

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label>ระเบียบ/กฎหมาย/ข้อบังคับที่เป็นอุปสรรค</Label>
          <RichTextarea {...register("obstacleLaws")} placeholder="ระบุรายละเอียด หรือพิมพ์ 'ไม่มี' (กด Tab เพื่อย่อหน้า)" rows={3} className="resize-none" />
        </div>
        <div className="space-y-2">
          <Label>สถาปัตยกรรมด้านระบบสารสนเทศ (Application Architecture) <span className="text-status-orange">*</span></Label>
          <RichTextarea {...register("appArchitecture")} placeholder="อธิบายการทำงานร่วมกันโดยการแลกเปลี่ยนข้อมูล (กด Tab เพื่อย่อหน้า)" rows={4} className="resize-none" />
        </div>
        <div className="space-y-2">
          <Label>หน่วยงานเจ้าของข้อมูล <span className="text-status-orange">*</span></Label>
          <Input {...register("dataOwner")} placeholder="ระบุชื่อหน่วยงาน" />
        </div>
        <div className="space-y-2">
          <Label>แนวทางการแลกเปลี่ยน/เชื่อมโยงข้อมูล <span className="text-status-orange">*</span></Label>
          <RichTextarea {...register("dataExchangePlan")} placeholder="ระบุแนวทางการเชื่อมโยงข้อมูล (กด Tab เพื่อย่อหน้า)" rows={4} className="resize-none" />
        </div>
      </div>

      {/* --- ส่วนแนบไฟล์ (UI อัปโหลด 1 รูป + คำอธิบาย) --- */}
      <div className="border-t border-border pt-6 mt-2">
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground">แนบไฟล์แผนภาพ (Diagrams)</h3>
          <p className="text-sm text-slate-gray">รองรับ 1 ไฟล์ต่อหัวข้อ พร้อมบังคับระบุคำอธิบายรูปภาพ</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleFileUploadWithDescBox 
            title="System Diagram" 
            name="systemDiagramFiles" 
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
          <SingleFileUploadWithDescBox 
            title="Network Diagram" 
            name="networkDiagramFiles" 
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};