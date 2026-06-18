// ProjectStep3.tsx
import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ProjectStep3Values } from "../types";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/custom/RichTextarea";
import { Label } from "@/components/ui/label";
import { EAStrategySection } from "./EAStrategySection";
import { CloudUpload, FileImage, X, AlertCircle } from "lucide-react";

// --- 🟢 Component สำหรับอัปโหลด 1 ไฟล์รูปภาพ + คำอธิบาย ---
const SingleFileUploadWithDescBox = ({ title, name, watch, setValue, errors }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 🟢 ดึงค่ามาเป็น Object เดี่ยวๆ (ถ้าไม่มีให้เป็น null)
  const currentFile = watch(name);
  const isFull = !!currentFile; // มีไฟล์อยู่แล้วหรือยัง

  // Effect: คอยสร้างและทำลาย Preview URL เมื่อไฟล์เปลี่ยน
  useEffect(() => {
    // 1. เช็คว่ามีข้อมูลไฟล์หรือไม่
    // 2. สำคัญ: เช็คด้วยว่าต้องเป็น instance ของ File หรือ Blob ของแท้เท่านั้น (ดักจับ Ghost Object ตอน Reload)
    if (
      !currentFile || 
      !currentFile.file || 
      !(currentFile.file instanceof File || currentFile.file instanceof Blob)
    ) {
      setPreviewUrl(null);
      return;
    }
    
    try {
      // สร้าง Local URL จาก File Object
      const objectUrl = URL.createObjectURL(currentFile.file);
      setPreviewUrl(objectUrl);

      // ทำลาย URL ทิ้งเมื่อ Component ถูก Unmount หรือไฟล์เปลี่ยน
      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("ไม่สามารถสร้าง Preview ภาพได้:", error);
      setPreviewUrl(null);
    }
  }, [currentFile]);

  const handleFilesAdded = (files: FileList | File[]) => {
    if (isFull || files.length === 0) return;

    const file = Array.from(files)[0];

    // 🟢 ตรวจสอบว่าเป็นไฟล์รูปภาพเท่านั้น (เผื่อกรณีลากไฟล์จากนอกเบราว์เซอร์มาวาง)
    if (!file.type.startsWith("image/")) {
      alert("รองรับเฉพาะไฟล์รูปภาพเท่านั้น (เช่น PNG, JPG)");
      return;
    }

    const mappedFile = {
      id: Math.random().toString(36).substring(7),
      file: file,
      description: "",
    };

    // 🟢 เซ็ตค่าเป็น Object ไม่ใช่ Array แล้ว
    setValue(name, mappedFile, { shouldValidate: true });
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
    // 🟢 เคลียร์ค่าด้วย null แทน Array ว่าง
    setValue(name, null, { shouldValidate: true });
  };

  const updateDescription = (newDesc: string) => {
    if (currentFile) {
      setValue(name, { ...currentFile, description: newDesc }, { shouldValidate: true });
    }
  };

  // ดึง Error ของฟิลด์นี้มาตรงๆ (ไม่ต้อง [0] แล้ว)
  const fieldError = errors[name] as any;

  return (
    <div className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-surface">
      <Label className="text-sm font-bold text-foreground">{title}</Label>

      {previewUrl && (
        <div className="relative w-full h-48 bg-slate-100 border-b border-border/50 flex items-center justify-center p-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain drop-shadow-sm rounded-sm"
            />
        </div>
      )}

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
          {/* 🟢 บังคับให้หน้าต่างเลือกไฟล์แสดงเฉพาะรูปภาพ */}
          <input 
            type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" ref={fileInputRef}
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
          />
          <CloudUpload className="w-6 h-6 text-primary/70 mb-2" />
          <p className="text-sm font-medium text-foreground">คลิก หรือ ลากรูปภาพมาวางที่นี่</p>
          <p className="text-xs mt-1 text-muted-foreground">รองรับ 1 ไฟล์รูปภาพ (PNG, JPG)</p>
        </div>
      )}

      {isFull && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 p-3 bg-surface-container-low border border-border/50 rounded-lg animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileImage className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">{currentFile.file.name}</span>
              </div>
              <button type="button" onClick={removeFile} className="p-1 rounded-full text-muted-foreground hover:bg-red-100 hover:text-red-600 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <Input 
                placeholder="กรุณาระบุคำอธิบายรูปภาพ (บังคับ) *" 
                value={currentFile.description}
                onChange={(e) => updateDescription(e.target.value)}
                className={`bg-surface text-sm h-9 ${fieldError?.description ? 'border-status-orange focus-visible:ring-status-orange' : ''}`}
              />
              {/* 🟢 จัดการ Error ของคำอธิบายให้ถูกต้อง */}
              {fieldError?.description && (
                <p className="text-xs text-status-orange mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldError.description.message}
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
  // ✅ ลบ watch("projectImage") ทิ้งไปแล้ว เพราะไม่ได้ใช้ในหน้านี้
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectStep3Values>();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">3. สถาปัตยกรรมองค์กร (EA)</h2>

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
          <h3 className="text-base font-bold text-foreground">แนบไฟล์แผนภาพรูปภาพ (Diagrams)</h3>
          <p className="text-sm text-slate-gray">รองรับ 1 ไฟล์รูปภาพต่อหัวข้อ พร้อมบังคับระบุคำอธิบาย</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleFileUploadWithDescBox 
            title="System Diagram" 
            name="systemDiagramFile"
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
          <SingleFileUploadWithDescBox 
            title="Network Diagram" 
            name="networkDiagramFile"
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};