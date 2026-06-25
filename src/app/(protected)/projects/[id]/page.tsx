// src/app/(protected)/projects/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  UploadCloud,
  FileText,
  FileImage,
  Presentation,
  Trash2,
  Plus,
  Paperclip,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DocumentFile = {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "other";
  size?: string;
  url?: string;
};

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [projectDetail, setProjectDetail] = useState({
    id: projectId,
    name: "โครงการพัฒนาระบบสารสนเทศบริหารจัดการข้อมูลภายในองค์กร",
    agency: "สำนักยุทธศาสตร์และประเมินผล",
    fiscalYear: 2569,
    status: "Draft",
    hasProposal: false,
  });

  // --- State: Mandatory Docs ---
  const [presentation, setPresentation] = useState<DocumentFile | null>(null);
  const [quotation, setQuotation] = useState<DocumentFile | null>({
    id: "q1",
    name: "ใบเสนอราคา_บ.เอบีซี.pdf",
    type: "pdf",
    size: "1.2 MB",
  });
  const [onePage, setOnePage] = useState<DocumentFile | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<DocumentFile | null>(null);

  const mandatoryUploadedCount = [presentation, quotation, onePage, approvalDoc].filter(Boolean).length;

  // --- State: Diagrams ---
  const [systemDiagram, setSystemDiagram] = useState<DocumentFile | null>(null);
  const [networkDiagram, setNetworkDiagram] = useState<DocumentFile | null>(null);
  const [useCaseDiagram, setUseCaseDiagram] = useState<DocumentFile | null>(null);
  const [securityDiagram, setSecurityDiagram] = useState<DocumentFile | null>(null);

  const diagramsUploadedCount = [systemDiagram, networkDiagram, useCaseDiagram, securityDiagram].filter(Boolean).length;

  // --- State: Additional Docs (ใหม่) ---
  const [additionalDocs, setAdditionalDocs] = useState<DocumentFile[]>([]);

  // --- Helper Functions ---
  const removeFile = (setter: React.Dispatch<React.SetStateAction<any>>, id?: string) => {
    if (id) {
      setter((prev: DocumentFile[]) => prev.filter((f) => f.id !== id));
    } else {
      setter(null);
    }
  };

  const handleAddAdditionalDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc: DocumentFile = {
        id: Math.random().toString(),
        name: file.name,
        type: file.type.includes("pdf") ? "pdf" : file.type.includes("presentation") ? "ppt" : file.type.includes("image") ? "image" : "other",
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      };
      setAdditionalDocs([...additionalDocs, newDoc]);
    }
  };

  // Helper Component: Info Icon with Tooltip
const InfoIconWithTooltip = ({ content }: { content: React.ReactNode }) => (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-slate-400 hover:text-[#00734b] transition-colors focus:outline-none"
          >
            <Info className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-[#00734b] text-white p-3 rounded-md shadow-lg z-50 border-none [&_svg]:fill-[#00734b] [&_svg]:bg-[#00734b]"
        >
          {content} 
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // --- UI Components ---

  // 1. Mandatory & Additional List Row
  const DocListRow = ({
    title,
    accept,
    file,
    onRemove,
    isRequired = false,
  }: {
    title: string;
    accept?: string;
    file: DocumentFile | null;
    onRemove: () => void;
    isRequired?: boolean;
  }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/80 transition-colors gap-4 group">
        <div className="flex gap-4 items-start">
          <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 ${file ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            {file ? <CheckCircle className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#191c20] flex items-center gap-2">
              {title} 
              {isRequired && <span className="text-status-orange text-xs">*</span>}
            </p>
            {accept && (
              <p className="text-xs text-muted-foreground mt-0.5">
                รองรับไฟล์ {accept.replace(/\./g, " ").toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <div className="sm:w-1/2 flex justify-end">
          {file ? (
            <div className="flex items-center justify-between pl-3 pr-2 py-2 bg-white rounded-full border border-slate-200 hover:border-red-200 transition-all shadow-sm w-full max-w-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-1.5 rounded-md shrink-0 ${file.type === "pdf" ? "text-red-500 bg-red-50" : file.type === "ppt" ? "text-orange-500 bg-orange-50" : "text-blue-500 bg-blue-50"}`}>
                  {file.type === "pdf" ? <FileText className="w-4 h-4" /> : file.type === "ppt" ? <Presentation className="w-4 h-4" /> : <FileImage className="w-4 h-4" />}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold text-[#191c20] truncate">{file.name}</span>
                  {file.size && <span className="text-[10px] text-slate-400 leading-none">{file.size}</span>}
                </div>
              </div>
              <button
                onClick={onRemove}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all shrink-0"
                title="ลบไฟล์"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#D1CDC7] rounded-full text-sm font-bold text-[#3f4942] hover:bg-surface-variant hover:text-[#191c20] hover:border-[#00734b] transition-all cursor-pointer w-full sm:w-auto shadow-sm">
              <UploadCloud className="w-4 h-4" />
              อัปโหลดไฟล์
              <input type="file" accept={accept} className="hidden" />
            </label>
          )}
        </div>
      </div>
    );
  };

  // 2. Diagram Grid Card
  const DiagramPreviewCard = ({ file, onRemove }: { file: DocumentFile; onRemove: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-[16px] border border-blue-100 group hover:border-blue-300 hover:shadow-sm transition-all h-full min-h-[120px]">
      <div className="flex items-center gap-4 overflow-hidden min-w-0"> {/* 🌟 เพิ่ม min-w-0 ป้องกัน Overflow */}
        <div className="p-3 rounded-xl shrink-0 text-blue-600 bg-blue-100/50 shadow-inner">
          <FileImage className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0"> {/* 🌟 เพิ่ม min-w-0 ตรงนี้ด้วย */}
          <span className="text-sm font-bold text-[#191c20] truncate block w-full">{file.name}</span>
          {file.size && <span className="text-[11px] font-medium text-slate-500 mt-0.5">{file.size}</span>}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all shrink-0 ml-2"
        title="ลบไฟล์รูปภาพ"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  const DiagramUploadPlaceholder = ({ title }: { title: string }) => (
    <label className="border-2 border-dashed border-slate-300 rounded-[16px] p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-white hover:border-[#00734b]/50 hover:shadow-sm transition-all cursor-pointer group h-full min-h-[120px]">
      <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 group-hover:bg-[#00734b]/10 group-hover:border-[#00734b]/20 rounded-full flex items-center justify-center mb-3 transition-colors">
        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#00734b]" />
      </div>
      <span className="text-sm font-bold text-slate-600 group-hover:text-[#191c20] transition-colors line-clamp-2 px-2">
        {title}
      </span>
      <span className="text-[11px] font-medium text-slate-400 mt-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
        PNG, JPG, WebP
      </span>
      <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" />
    </label>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 mx-auto w-full animate-in fade-in duration-500">
      
      {/* --- Breadcrumb --- */}
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00734b] w-fit transition-colors px-1"
      >
        <ArrowLeftIcon className="w-4 h-4" /> กลับไปหน้ารวมโครงการ
      </button>

      {/* --- 1. Project Info Header --- */}
      <Card className="rounded-[24px] border-[#D1CDC7] shadow-sm overflow-hidden relative bg-white">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00734b]/5 via-[#00734b]/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <CardContent className="p-6 sm:p-8 md:p-10 relative z-10 flex flex-col">
          
          {/* Section 1: Tags (Status & ID) */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-status-orange border border-orange-200 shadow-sm">
              แบบร่าง (Draft)
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {projectDetail.id}
            </span>
          </div>

          {/* Section 2: Project Title (Responsive & Long Text Support) */}
          <div className="w-full max-w-4xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight leading-snug break-words">
              {projectDetail.name}
            </h1>
          </div>

          {/* Section 3: Project Meta Details */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-10 mt-8 pt-6 border-t border-slate-100">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                หน่วยงานที่รับผิดชอบ
              </p>
              <div className="flex items-center gap-2.5 font-medium text-[#191c20] text-sm sm:text-base">
                <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                  <Building2 className="w-4 h-4 text-[#00734b]" />
                </div>
                {projectDetail.agency}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                ปีงบประมาณ
              </p>
              <div className="flex items-center gap-2.5 font-medium text-[#191c20] text-sm sm:text-base">
                <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                  <CalendarDays className="w-4 h-4 text-[#00734b]" />
                </div>
                พ.ศ. {projectDetail.fiscalYear}
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>

      {/* --- 2. Call to Action (Proposal Form) --- */}
      {!projectDetail.hasProposal && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50/30 border border-orange-200 p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-white text-status-orange rounded-full shrink-0 flex items-center justify-center shadow-sm border border-orange-100">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#191c20] text-lg">
                ขั้นตอนถัดไป: จัดทำข้อเสนอโครงการ (Proposal)
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                กรุณากรอกรายละเอียดโครงการทั้ง 5 หมวดหลัก เพื่อใช้ในการพิจารณาอนุมัติ
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/projects/${projectId}/proposal/create`)}
            className="font-bold gap-2 bg-status-orange hover:bg-[#d65f00] text-white rounded-full px-8 h-12 shadow-md shrink-0 w-full md:w-auto transition-transform active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5" />
            เริ่มเขียนแบบฟอร์ม
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* --- 3. Mandatory Documents --- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c20] flex items-center gap-2">
              เอกสารประกอบโครงการ (บังคับ)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              กรุณาอัปโหลดเอกสารสำคัญเหล่านี้ให้ครบถ้วนก่อนส่งโครงการ
            </p>
          </div>
          <span className="bg-white text-slate-600 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-sm whitespace-nowrap">
            อัปโหลดแล้ว {mandatoryUploadedCount} / 4
          </span>
        </div>

        <Card className="rounded-[20px] border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0 flex flex-col divide-y divide-slate-100">
            <DocListRow
              title="Presentation สรุปโครงการ"
              accept=".ppt,.pptx"
              file={presentation}
              onRemove={() => removeFile(setPresentation)}
              isRequired
            />
            <DocListRow
              title="ใบเสนอราคา (Quotation)"
              accept=".pdf"
              file={quotation}
              onRemove={() => removeFile(setQuotation)}
              isRequired
            />
            <DocListRow
              title="สรุปโครงการ (One Page Summary)"
              accept=".pdf"
              file={onePage}
              onRemove={() => removeFile(setOnePage)}
              isRequired
            />
            <DocListRow
              title="หนังสือรับรอง/เห็นชอบจากผู้บริหาร"
              accept=".pdf"
              file={approvalDoc}
              onRemove={() => removeFile(setApprovalDoc)}
              isRequired
            />
          </CardContent>
        </Card>
      </section>

      {/* --- 4. Architecture Diagrams --- */}
      {/* --- 4. Architecture Diagrams --- */}
      <section className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c20]">
              สถาปัตยกรรมและรูปภาพระบบ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              แผนผังประกอบเพื่อความชัดเจนในการประเมินระบบ <span className="font-semibold text-slate-400">(ถ้ามี)</span>
            </p>
          </div>
          <span className="bg-white text-slate-600 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-sm whitespace-nowrap">
            อัปโหลดแล้ว <span className="text-[#00734b] text-[13px]">{diagramsUploadedCount}</span> / 4
          </span>
        </div>

        {/* Content Section */}
        <Card className="rounded-[20px] border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="px-6 py-4 md:px-8 md:py-6"> {/* ปรับ Padding นิดหน่อยให้สมดุล */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              
              {/* Slot 1: System Diagram */}
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">1</span>
                    System Diagram
                  </Label>
                  <InfoIconWithTooltip 
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนผังการเชื่อมโยงระบบ</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงองค์ประกอบหลักของระบบ (เช่น Server, Database, Client) และการไหลของข้อมูลเบื้องต้น
                        </p>
                      </div>
                    } 
                  />
                </div>
                <div className="flex-1">
                  {systemDiagram 
                    ? <DiagramPreviewCard file={systemDiagram} onRemove={() => removeFile(setSystemDiagram)} /> 
                    : <DiagramUploadPlaceholder title="อัปโหลด System Diagram" />}
                </div>
              </div>

              {/* Slot 2: Network Diagram */}
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">2</span>
                    Network Diagram
                  </Label>
                  <InfoIconWithTooltip 
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนผังการเชื่อมโยงเครือข่าย</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงการจัดวางอุปกรณ์ Network (Router, Switch, Firewall) วง LAN/WAN และการเชื่อมต่ออินเทอร์เน็ต
                        </p>
                      </div>
                    } 
                  />
                </div>
                <div className="flex-1">
                  {networkDiagram 
                    ? <DiagramPreviewCard file={networkDiagram} onRemove={() => removeFile(setNetworkDiagram)} /> 
                    : <DiagramUploadPlaceholder title="อัปโหลด Network Diagram" />}
                </div>
              </div>

              {/* Slot 3: Use Case Diagram */}
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">3</span>
                    Use Case Diagram
                  </Label>
                  <InfoIconWithTooltip 
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนภาพแสดงปฎิสัมพันธ์ระหว่างระบบงาน</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงกลุ่มผู้ใช้งานระบบ (Actor) และสิทธิ์การเข้าถึงฟังก์ชันต่างๆ ของระบบอย่างชัดเจน
                        </p>
                      </div>
                    } 
                  />
                </div>
                <div className="flex-1">
                  {useCaseDiagram 
                    ? <DiagramPreviewCard file={useCaseDiagram} onRemove={() => removeFile(setUseCaseDiagram)} /> 
                    : <DiagramUploadPlaceholder title="อัปโหลด Use Case Diagram" />}
                </div>
              </div>

              {/* Slot 4: Security Diagram */}
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">4</span>
                    Security Diagram
                  </Label>
                  <InfoIconWithTooltip 
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">การรักษาความมั่นคงปลอดภัยสารสนเทศ (Network, System, and Information Security)</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงจุดติดตั้งระบบรักษาความปลอดภัย เช่น WAF, ระบบ Authentication, และการเข้ารหัสข้อมูล (Encryption)
                        </p>
                      </div>
                    } 
                  />
                </div>
                <div className="flex-1">
                  {securityDiagram 
                    ? <DiagramPreviewCard file={securityDiagram} onRemove={() => removeFile(setSecurityDiagram)} /> 
                    : <DiagramUploadPlaceholder title="อัปโหลด Security Diagram" />}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- 5. Additional Documents (NEW) --- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c20]">
              เอกสารอ้างอิงเพิ่มเติม
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              เอกสารอื่นๆ ที่เกี่ยวข้องกับโครงการ (TOR, รายละเอียดคุณลักษณะ ฯลฯ)
            </p>
          </div>
          <label className="flex items-center justify-center gap-2 px-5 py-2 bg-[#00734b]/10 text-[#00734b] border border-[#00734b]/20 rounded-full text-sm font-bold hover:bg-[#00734b] hover:text-white transition-all cursor-pointer shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" />
            เพิ่มเอกสาร
            <input type="file" multiple onChange={handleAddAdditionalDoc} className="hidden" />
          </label>
        </div>

        <Card className="rounded-[20px] border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            {additionalDocs.length > 0 ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {additionalDocs.map((doc) => (
                  <DocListRow
                    key={doc.id}
                    title={doc.name.split('.')[0]} // แสดงชื่อโดยตัดนามสกุลออกชั่วคราว
                    file={doc}
                    onRemove={() => removeFile(setAdditionalDocs, doc.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Paperclip className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">ยังไม่มีเอกสารเพิ่มเติม</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  คุณสามารถอัปโหลดไฟล์เอกสารอ้างอิงอื่นๆ ที่จะเป็นประโยชน์ต่อการพิจารณาโครงการได้ที่นี่
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

// Simple Arrow SVG
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}