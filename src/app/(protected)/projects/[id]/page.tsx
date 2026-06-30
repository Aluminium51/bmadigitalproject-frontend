// src/app/(protected)/projects/[id]/page.tsx
// Project Workspace — Tab-based Enterprise UI
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Clock,
  UploadCloud,
  FileText,
  FileImage,
  Presentation,
  Trash2,
  Plus,
  Paperclip,
  CheckCircle,
  Send,
  ClipboardList,
  FolderOpen,
  History,
  Target,
  Layers,
  DollarSign,
  Users,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

  const [projectDetail] = useState({
    id: projectId,
    name: "โครงการพัฒนาระบบสารสนเทศบริหารจัดการข้อมูลภายในองค์กร",
    agency: "สำนักการแพทย์",
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

  // --- State: Additional Docs ---
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

  // --- Helper Component: Info Icon with Tooltip ---
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

  // --- UI Component: Document List Row ---
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
          <div className={`mt-0.5 size-9 rounded-md flex items-center justify-center shrink-0 ${file ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
            {file ? <CheckCircle className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c20] flex items-center gap-2">
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
            <div className="flex items-center justify-between pl-3 pr-2 py-2 bg-white rounded-md border border-slate-200 hover:border-red-200 transition-all shadow-sm w-full max-w-sm">
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
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0"
                title="ลบไฟล์"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#D1CDC7] rounded-md text-sm font-bold text-[#3f4942] hover:bg-slate-50 hover:text-[#191c20] hover:border-[#00734b] transition-all cursor-pointer w-full sm:w-auto shadow-sm">
              <UploadCloud className="w-4 h-4" />
              อัปโหลดไฟล์
              <input type="file" accept={accept} className="hidden" />
            </label>
          )}
        </div>
      </div>
    );
  };

  // --- UI Component: Diagram Preview Card ---
  const DiagramPreviewCard = ({ file, onRemove }: { file: DocumentFile; onRemove: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-md border border-blue-200 group hover:border-blue-300 hover:shadow-sm transition-all h-full min-h-[120px]">
      <div className="flex items-center gap-4 overflow-hidden min-w-0">
        <div className="p-3 rounded-md shrink-0 text-blue-600 bg-blue-100/50 border border-blue-200">
          <FileImage className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-[#191c20] truncate block w-full">{file.name}</span>
          {file.size && <span className="text-[11px] font-medium text-slate-500 mt-0.5">{file.size}</span>}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0 ml-2"
        title="ลบไฟล์รูปภาพ"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  // --- UI Component: Diagram Upload Placeholder ---
  const DiagramUploadPlaceholder = ({ title }: { title: string }) => (
    <label className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-[#00734b]/50 hover:shadow-sm transition-all cursor-pointer group h-full min-h-[120px]">
      <div className="w-11 h-11 bg-white shadow-sm border border-slate-200 group-hover:bg-[#00734b]/10 group-hover:border-[#00734b]/20 rounded-md flex items-center justify-center mb-3 transition-colors">
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

  // ─── Default tab ───
  const defaultTab = projectDetail.hasProposal ? "tab-timeline" : "tab-proposal";

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 mx-auto w-full animate-in fade-in duration-500">

      {/* ════════════════════════════════════════════════════════════
          1. TOP HEADER SECTION (Always Visible)
         ════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 mb-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00734b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้ารวมโครงการ
        </button>

        {/* Header Card */}
        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left side */}
              <div className="space-y-4 min-w-0 flex-1">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-status-orange border-orange-200 font-bold text-[11px] px-2.5 py-0.5 rounded-md"
                  >
                    แบบร่าง (Draft)
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {projectDetail.id}
                  </span>
                </div>

                {/* Project Name */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight leading-snug break-words">
                  {projectDetail.name}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      หน่วยงานที่รับผิดชอบ
                    </p>
                    <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                      <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                        <Building2 className="w-4 h-4 text-[#00734b]" />
                      </div>
                      {projectDetail.agency}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      ปีงบประมาณ
                    </p>
                    <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                      <div className="p-1.5 bg-[#00734b]/10 rounded-md">
                        <CalendarDays className="w-4 h-4 text-[#00734b]" />
                      </div>
                      พ.ศ. {projectDetail.fiscalYear}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: Action Button */}
              <Button
                className="gap-2 bg-[#00734b] hover:bg-[#005838] text-white rounded-md px-6 h-11 font-bold shadow-sm shrink-0 self-start transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                ส่งข้อเสนอโครงการ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════
          2. TABS NAVIGATION
         ════════════════════════════════════════════════════════════ */}
      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
        <TabsList className="bg-white border border-[#D1CDC7] h-auto w-full sm:w-auto self-start shadow-sm mb-5 p-1 rounded-full inline-flex">
          
          <TabsTrigger
            value="tab-proposal"
            id="tab-proposal"
            className="
              flex items-center gap-2 px-5 h-10 rounded-full font-bold text-sm text-slate-500
              transition-all duration-300 ease-out
              hover:text-[#00734b]
              data-[state=active]:bg-[#00734b] data-[state=active]:text-white 
              data-[state=active]:shadow-md data-[state=active]:scale-[1.05]
              group
            "
          >
            <ClipboardList className="w-4 h-4 transition-transform duration-300 group-data-[state=active]:scale-110" />
            ข้อเสนอโครงการ
          </TabsTrigger>

          <TabsTrigger
            value="tab-documents"
            id="tab-documents"
            className="
              flex items-center gap-2 px-5 h-10 rounded-full font-bold text-sm text-slate-500
              transition-all duration-300 ease-out
              hover:text-[#00734b]
              data-[state=active]:bg-[#00734b] data-[state=active]:text-white 
              data-[state=active]:shadow-md data-[state=active]:scale-[1.05]
              group
            "
          >
            <FolderOpen className="w-4 h-4 transition-transform duration-300 group-data-[state=active]:scale-110" />
            เอกสารแนบ
          </TabsTrigger>

          <TabsTrigger
            value="tab-timeline"
            id="tab-timeline"
            className="
              flex items-center gap-2 px-5 h-10 rounded-full font-bold text-sm text-slate-500
              transition-all duration-300 ease-out
              hover:text-[#00734b]
              data-[state=active]:bg-[#00734b] data-[state=active]:text-white 
              data-[state=active]:shadow-md data-[state=active]:scale-[1.05]
              group
            "
          >
            <History className="w-4 h-4 transition-transform duration-300 group-data-[state=active]:scale-110" />
            ประวัติและมติ
          </TabsTrigger>
          
        </TabsList>

        {/* ──────────────────────────────────────────────────────────
            TAB 1: PROPOSAL (ข้อเสนอโครงการ)
           ────────────────────────────────────────────────────────── */}
        <TabsContent value="tab-proposal" className="flex-1 mt-0">
          {!projectDetail.hasProposal ? (
            /* CTA: No proposal yet */
            <Card className="rounded-md border-orange-200 bg-orange-50/50 shadow-sm">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="size-12 bg-white text-status-orange rounded-md shrink-0 flex items-center justify-center shadow-sm border border-orange-200">
                    <Clock className="w-6 h-6" />
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
                  className="font-bold gap-2 bg-status-orange hover:bg-[#d65f00] text-white rounded-md px-8 h-12 shadow-sm shrink-0 w-full md:w-auto transition-all active:scale-95"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  เริ่มเขียนแบบฟอร์ม
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Read-Only Proposal Summary Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: General Info */}
              <Card className="rounded-md border-[#D1CDC7] shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-[#191c20]">หลักการและเหตุผล</h3>
                  </div>
                  <Separator />
                  <div className="space-y-3 text-sm text-[#3f4942]">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">วัตถุประสงค์</p>
                      <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100">
                        เพื่อพัฒนาระบบสารสนเทศสำหรับบริหารจัดการข้อมูลภายในองค์กรให้มีประสิทธิภาพ ลดขั้นตอนการทำงานซ้ำซ้อน
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">หลักการ</p>
                      <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100">
                        สนับสนุนนโยบายรัฐบาลดิจิทัลและแผนยุทธศาสตร์ด้านเทคโนโลยีสารสนเทศของกรุงเทพมหานคร
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Strategic Alignment */}
              <Card className="rounded-md border-[#D1CDC7] shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-violet-50 rounded-md border border-violet-200">
                      <Layers className="w-4 h-4 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-[#191c20]">ความสอดคล้องกับยุทธศาสตร์</h3>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {["ยุทธศาสตร์ที่ 1: การพัฒนาระบบดิจิทัลภาครัฐ", "เป้าประสงค์: เพิ่มประสิทธิภาพการบริหารจัดการ", "ตัวชี้วัด: ลดระยะเวลาดำเนินการ 30%"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-md p-3 border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-[#00734b] shrink-0 mt-0.5" />
                        <span className="text-[#3f4942]">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Budget Summary */}
              <Card className="rounded-md border-[#D1CDC7] shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 rounded-md border border-emerald-200">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-[#191c20]">สรุปงบประมาณ</h3>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-md p-4 border border-blue-100 text-center">
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">งบ IT</p>
                      <p className="text-xl font-extrabold text-blue-700 mt-1">12.5</p>
                      <p className="text-[10px] text-blue-500">ล้านบาท</p>
                    </div>
                    <div className="bg-amber-50 rounded-md p-4 border border-amber-100 text-center">
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">งบ HR</p>
                      <p className="text-xl font-extrabold text-amber-700 mt-1">3.2</p>
                      <p className="text-[10px] text-amber-500">ล้านบาท</p>
                    </div>
                    <div className="bg-emerald-50 rounded-md p-4 border border-emerald-100 text-center">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">รวมทั้งหมด</p>
                      <p className="text-xl font-extrabold text-emerald-700 mt-1">15.7</p>
                      <p className="text-[10px] text-emerald-500">ล้านบาท</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Readiness & Roadmap */}
              <Card className="rounded-md border-[#D1CDC7] shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-[#191c20]">ความพร้อมด้านบุคลากรและแผนงาน</h3>
                  </div>
                  <Separator />
                  <div className="space-y-3 text-sm text-[#3f4942]">
                    <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ทีมงานที่รับผิดชอบ</p>
                      <p>ฝ่ายพัฒนาระบบสารสนเทศ จำนวน 8 คน (เจ้าหน้าที่ IT 5 คน, ผู้ประสานงาน 3 คน)</p>
                    </div>
                    <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ระยะเวลาดำเนินการ</p>
                      <p>12 เดือน (ตุลาคม 2568 – กันยายน 2569)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ──────────────────────────────────────────────────────────
            TAB 2: DOCUMENTS (เอกสารแนบ)
           ────────────────────────────────────────────────────────── */}
        <TabsContent value="tab-documents" className="flex-1 mt-0 space-y-6">

          {/* Section: Mandatory Documents */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#191c20]">
                  เอกสารประกอบโครงการ (บังคับ)
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  กรุณาอัปโหลดเอกสารสำคัญเหล่านี้ให้ครบถ้วนก่อนส่งโครงการ
                </p>
              </div>
              <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold text-xs rounded-md px-3 py-1 shadow-sm shrink-0 self-start">
                อัปโหลดแล้ว {mandatoryUploadedCount} / 4
              </Badge>
            </div>

            <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
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

          {/* Section: Architecture Diagrams */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#191c20]">
                  สถาปัตยกรรมและรูปภาพระบบ
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  แผนผังประกอบเพื่อความชัดเจนในการประเมินระบบ <span className="font-semibold text-slate-400">(ถ้ามี)</span>
                </p>
              </div>
              <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold text-xs rounded-md px-3 py-1 shadow-sm shrink-0 self-start">
                อัปโหลดแล้ว <span className="text-[#00734b]">{diagramsUploadedCount}</span> / 4
              </Badge>
            </div>

            <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Section: Additional Documents */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#191c20]">
                  เอกสารอ้างอิงเพิ่มเติม
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  เอกสารอื่นๆ ที่เกี่ยวข้องกับโครงการ (TOR, รายละเอียดคุณลักษณะ ฯลฯ)
                </p>
              </div>
              <label className="flex items-center justify-center gap-2 px-5 py-2 bg-[#00734b]/10 text-[#00734b] border border-[#00734b]/20 rounded-md text-sm font-bold hover:bg-[#00734b] hover:text-white transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0 self-start">
                <Plus className="w-4 h-4" />
                เพิ่มเอกสาร
                <input type="file" multiple onChange={handleAddAdditionalDoc} className="hidden" />
              </label>
            </div>

            <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                {additionalDocs.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100">
                    {additionalDocs.map((doc) => (
                      <DocListRow
                        key={doc.id}
                        title={doc.name.split('.')[0]}
                        file={doc}
                        onRemove={() => removeFile(setAdditionalDocs, doc.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-md flex items-center justify-center mb-4 border border-slate-200">
                      <Paperclip className="w-7 h-7 text-slate-300" />
                    </div>
                    <h3 className="text-base font-bold text-slate-700">ยังไม่มีเอกสารเพิ่มเติม</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">
                      คุณสามารถอัปโหลดไฟล์เอกสารอ้างอิงอื่นๆ ที่จะเป็นประโยชน์ต่อการพิจารณาโครงการได้ที่นี่
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* ──────────────────────────────────────────────────────────
            TAB 3: TIMELINE (ประวัติและมติ)
           ────────────────────────────────────────────────────────── */}
        <TabsContent value="tab-timeline" className="flex-1 mt-0">
          <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-md flex items-center justify-center mb-4 border border-slate-200">
                <History className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700">
                ประวัติการดำเนินงานและมติที่ประชุม
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                ประวัติการดำเนินงานและมติที่ประชุมจะแสดงที่นี่ เมื่อโครงการเข้าสู่ขั้นตอนการพิจารณา
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}