// ProjectStep3.tsx
import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ProposalStep3Values } from "../types";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/custom/RichTextarea";
import { Label } from "@/components/ui/label";
import { EAStrategySection } from "./EAStrategySection";
import { CloudUpload, FileImage, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

// --- Component สำหรับอัปโหลด 1 ไฟล์รูปภาพ + คำอธิบาย ---
const SingleFileUploadWithDescBox = ({ title, name, watch, setValue, errors }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ดึงค่ามาเป็น Object เดี่ยวๆ (ถ้าไม่มีให้เป็น null)
  const currentFile = watch(name);
  const isFull = !!currentFile; // มีไฟล์อยู่แล้วหรือยัง

  // Effect: คอยสร้างและทำลาย Preview URL หรือดักจับตอน Refresh
  useEffect(() => {
    // 1. ถ้าไม่มีค่าอะไรเลย (กรณีปกติที่ยังไม่ได้อัปโหลด)
    if (!currentFile) {
      setPreviewUrl(null);
      return;
    }

    // 2. ดักจับ Ghost Object! 
    // เช็คว่ามี currentFile แต่ข้างในไม่ใช่ File หรือ Blob ของแท้ (เกิดจากการ Refresh)
    if (!currentFile.file || !(currentFile.file instanceof File || currentFile.file instanceof Blob)) {
      console.warn(`[Auto-Clean] ตรวจพบไฟล์ที่ไม่สมบูรณ์ในฟิลด์ ${name} (เกิดจากการ Refresh) ระบบทำการล้างค่า...`);
      
      setPreviewUrl(null);
      
      // สั่งเคลียร์ค่าใน React Hook Form ทิ้งทันที บังคับให้ User อัปโหลดใหม่
      setValue(name, null, { shouldValidate: true }); 
      return;
    }
    
    // 3. กรณีเป็นไฟล์ของแท้ (อัปโหลดใหม่)
    try {
      const objectUrl = URL.createObjectURL(currentFile.file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("ไม่สามารถสร้าง Preview ภาพได้:", error);
      setPreviewUrl(null);
    }
  }, [currentFile, name, setValue]);

  const handleFilesAdded = async (files: FileList | File[]) => {
    if (isFull || files.length === 0) return;

    const originalFile = Array.from(files)[0];

    if (!originalFile.type.startsWith("image/")) {
      alert("รองรับเฉพาะไฟล์รูปภาพเท่านั้น (เช่น PNG, JPG)");
      return;
    }

    setIsCompressing(true); // เริ่มแสดง Loading

    try {
      // ตั้งค่า Options สำหรับการบีบอัด (เน้นเพื่อนำไปใส่ Word)
      const options = {
        maxSizeMB: 2, // บีบไม่ให้เกิน 2MB (ไฟล์ Word จะได้ไม่หนัก)
        maxWidthOrHeight: 1920, // ย่อขนาดความกว้าง/ยาวสูงสุด
        useWebWorker: true,
        // บังคับให้เป็น JPEG เสมอ (ยกเว้นต้นฉบับเป็น PNG ให้คงไว้) เพื่อให้ Word เปิดได้ชัวร์ๆ
        fileType: originalFile.type === "image/png" ? "image/png" : "image/jpeg",
      };

      // ทำการบีบอัด
      const compressedBlob = await imageCompression(originalFile, options);
      
      // แปลง Blob กลับเป็น File Object เพื่อให้ React Hook Form และ Document Generator ทำงานต่อได้ปกติ
      const compressedFile = new File([compressedBlob], originalFile.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });

      const mappedFile = {
        id: Math.random().toString(36).substring(7),
        file: compressedFile, // ใช้ไฟล์ที่บีบอัดแล้ว
        description: "",
      };

      setValue(name, mappedFile, { shouldValidate: true });

    } catch (error) {
      console.error("Image compression error:", error);
      alert("เกิดข้อผิดพลาดในการบีบอัดรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsCompressing(false); // ปิด Loading
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    // เคลียร์ค่าด้วย null แทน Array ว่าง
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
          {/* บังคับให้หน้าต่างเลือกไฟล์แสดงเฉพาะรูปภาพ */}
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
export const ProposalStep3 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProposalStep3Values>();

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
          <RichTextarea {...register("appArchitecture")} placeholder="อธิบายการทำงานร่วมกันโดยการแลกเปลี่ยนข้อมูล (กด Tab เพื่อย่อหน้า)" rows={4} className={cn("resize-none", errors.appArchitecture && "border-status-orange focus-visible:ring-status-orange")}  />
          {errors.appArchitecture && (
            <p className="text-sm text-status-orange flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {errors.appArchitecture.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>หน่วยงานเจ้าของข้อมูล <span className="text-status-orange">*</span></Label>
          <Input {...register("dataOwner")} placeholder="ระบุชื่อหน่วยงาน" className={cn(errors.dataOwner && "border-status-orange focus-visible:ring-status-orange")} />
            {errors.dataOwner && (
            <p className="text-sm text-status-orange flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {errors.dataOwner.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>แนวทางการแลกเปลี่ยน/เชื่อมโยงข้อมูล <span className="text-status-orange">*</span></Label>
          <RichTextarea {...register("dataExchangePlan")} placeholder="ระบุแนวทางการเชื่อมโยงข้อมูล (กด Tab เพื่อย่อหน้า)" rows={4} className={cn("resize-none", errors.dataExchangePlan && "border-status-orange focus-visible:ring-status-orange")} />
          {errors.dataExchangePlan && (
            <p className="text-sm text-status-orange flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {errors.dataExchangePlan.message} 
            </p>
          )}
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
          <SingleFileUploadWithDescBox 
            title="Use Case Diagram" 
            name="useCaseDiagramFile"
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
          <SingleFileUploadWithDescBox 
            title="Security Diagram" 
            name="securityDiagramFile"
            watch={watch} 
            setValue={setValue}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};