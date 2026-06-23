// src/app/(protected)/projects/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Folder,
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
  CheckCircle2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DocumentFile = {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image";
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

  // --- State สำหรับ Diagrams 4 ช่อง ---
  const [systemDiagram, setSystemDiagram] = useState<DocumentFile | null>(null);
  const [networkDiagram, setNetworkDiagram] = useState<DocumentFile | null>(
    null,
  );
  const [useCaseDiagram, setUseCaseDiagram] = useState<DocumentFile | null>(
    null,
  );
  const [securityDiagram, setSecurityDiagram] = useState<DocumentFile | null>(
    null,
  );

  // คำนวณจำนวนไฟล์ที่อัปโหลดไปแล้ว (สำหรับแสดงบน Header)
  const uploadedDiagramsCount = [
    systemDiagram,
    networkDiagram,
    useCaseDiagram,
    securityDiagram,
  ].filter(Boolean).length;

  const [presentation, setPresentation] = useState<DocumentFile | null>(null);
  const [quotation, setQuotation] = useState<DocumentFile | null>({
    id: "q1",
    name: "ใบเสนอราคา_บ.เอบีซี.pdf",
    type: "pdf",
    size: "1.2 MB",
  });
  const [onePage, setOnePage] = useState<DocumentFile | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<DocumentFile | null>(null);

  const removeFile = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    id?: string,
  ) => {
    if (id) {
      setter((prev: DocumentFile[]) => prev.filter((f) => f.id !== id));
    } else {
      setter(null);
    }
  };

  // --- UI Helper 1: กล่องไฟล์และปุ่มอัปโหลด สำหรับแบบ List View (เล็กและคลีน) ---
  const MandatoryDocRow = ({
    title,
    accept,
    file,
    onRemove,
  }: {
    title: string;
    accept: string;
    file: DocumentFile | null;
    onRemove: () => void;
  }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/50 transition-colors gap-4">
        <div>
          <p className="text-[15px] font-bold text-[#191c20]">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            รองรับไฟล์ {accept.replace(/\./g, " ").toUpperCase()}
          </p>
        </div>

        <div className="sm:w-1/2 flex justify-end">
          {file ? (
            // แสดง Chip ไฟล์เมื่ออัปโหลดแล้ว
            <div className="flex items-center justify-between pl-2 pr-3 py-2 bg-white rounded-full border border-[#D1CDC7] group hover:border-[#00734b]/40 transition-all shadow-sm w-full max-w-75">
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`p-2 rounded-full shrink-0 ${file.type === "pdf" ? "text-red-500 bg-red-50" : "text-orange-500 bg-orange-50"}`}
                >
                  {file.type === "pdf" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Presentation className="w-4 h-4" />
                  )}
                </div>
                <span className="text-sm font-bold text-[#191c20] truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={onRemove}
                className="p-1.5 ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // แสดงปุ่มอัปโหลด (Pill Button)
            <label className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#D1CDC7] rounded-full text-sm font-bold text-[#3f4942] hover:bg-surface-variant hover:text-[#191c20] transition-colors cursor-pointer w-full sm:w-auto shadow-sm">
              <UploadCloud className="w-4 h-4" />
              อัปโหลดไฟล์
              <input type="file" accept={accept} className="hidden" />
            </label>
          )}
        </div>
      </div>
    );
  };

  // --- UI Helper 2: กล่องอัปโหลดใหญ่ สำหรับ Diagrams (แบบ Grid) ---
  const DiagramPreviewCard = ({
    file,
    onRemove,
  }: {
    file: DocumentFile;
    onRemove: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-surface rounded-[20px] border border-[#D1CDC7] group hover:border-[#00734b]/40 transition-all shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2.5 rounded-full shrink-0 text-blue-500 bg-blue-50">
          <FileImage className="w-5 h-5" />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-bold text-[#191c20] truncate">
            {file.name}
          </span>
          {file.size && (
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {file.size}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const DiagramUploadPlaceholder = ({ title }: { title: string }) => (
    <label className="border-2 border-dashed border-[#D1CDC7] rounded-[20px] p-6 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 hover:border-[#00734b]/50 transition-colors cursor-pointer group h-full min-h-[140px]">
      <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#00734b]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#00734b]" />
      </div>
      <span className="text-sm font-bold text-[#3f4942] group-hover:text-[#191c20] transition-colors">
        {title}
      </span>
      <span className="text-xs text-muted-foreground mt-1">
        รองรับไฟล์ PNG, JPG หรือ webP
      </span>
      <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" />
    </label>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* ย้อนกลับ */}
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#191c20] w-fit transition-colors px-2"
      >
        <ArrowLeftIcon className="w-4 h-4" /> กลับไปหน้ารวมโครงการ
      </button>

      {/* 1. Project Info Header */}
      <div className="bg-white p-6 md:p-10 rounded-container border border-[#D1CDC7] shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00734b]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start gap-4 z-10">
          <div className="flex items-start gap-5">
            <div className="size-16 bg-[#00734b]/10 text-[#00734b] rounded-full shrink-0 flex items-center justify-center border border-[#00734b]/20">
              <Folder className="w-7 h-7" />
            </div>
            <div className="mt-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs text-slate-500 bg-surface px-2.5 py-1 rounded-full border border-[#D1CDC7]">
                  {projectDetail.id}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  กล่องโครงการใหม่
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight">
                {projectDetail.name}
              </h1>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="rounded-full border-[1.5px] font-bold shrink-0 mt-1"
          >
            {isEditingInfo ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" /> บันทึก
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" /> แก้ไข
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 z-10 p-5 bg-surface/50 rounded-[24px]">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              หน่วยงานที่รับผิดชอบ
            </Label>
            {isEditingInfo ? (
              <Input
                value={projectDetail.agency}
                onChange={(e) =>
                  setProjectDetail({ ...projectDetail, agency: e.target.value })
                }
                className="h-12 rounded-full border-[#D1CDC7] bg-white px-4"
              />
            ) : (
              <div className="flex items-center gap-2.5 font-semibold text-[#191c20] px-1">
                <Building2 className="w-5 h-5 text-[#00734b]" />{" "}
                {projectDetail.agency}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              ปีงบประมาณ
            </Label>
            {isEditingInfo ? (
              <Input
                type="number"
                value={projectDetail.fiscalYear}
                onChange={(e) =>
                  setProjectDetail({
                    ...projectDetail,
                    fiscalYear: parseInt(e.target.value),
                  })
                }
                className="h-12 rounded-full border-[#D1CDC7] bg-white px-4 w-40"
              />
            ) : (
              <div className="flex items-center gap-2.5 font-semibold text-[#191c20] px-1">
                <CalendarDays className="w-5 h-5 text-[#00734b]" /> พ.ศ.{" "}
                {projectDetail.fiscalYear}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Call to Action (Proposal Form) */}
      {!projectDetail.hasProposal && (
        <div className="bg-orange-50/80 border border-status-orange/30 p-8 rounded-container flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-status-orange/10 text-status-orange rounded-full shrink-0 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#191c20] text-lg">
                ขั้นตอนถัดไป: จัดทำข้อเสนอโครงการ
              </h3>
              <p className="text-[15px] text-slate-600 mt-1">
                กรุณากรอกแบบฟอร์ม 5 หมวดหลักให้ครบถ้วน เพื่อยื่นพิจารณา
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              router.push(`/projects/${projectId}/proposal/create`)
            }
            className="font-bold gap-2 bg-status-orange hover:bg-[#d65f00] text-white rounded-full px-8 h-14 shadow-sm shrink-0 w-full md:w-auto text-base"
          >
            <FileSpreadsheet className="w-5 h-5" />
            เริ่มเขียนแบบฟอร์ม
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. เอกสารประกอบโครงการ (Mandatory - List View) */}
      {/* ========================================================= */}
      <div className="space-y-6 mt-4">
        <div className="px-2">
          <h2 className="text-xl font-extrabold text-[#191c20] flex items-center gap-2">
            เอกสารประกอบโครงการ{" "}
            <span className="text-status-orange text-lg">*</span>
          </h2>
          <span className="text-sm text-slate-500 mt-1 flex flex-row space-x-1">
            <p>กรุณาอัปโหลดเอกสารสำคัญเหล่านี้ให้ครบถ้วนก่อนส่งโครงการ</p>
            <p className="text-status-orange">(บังคับ)</p>
          </span>
 
        </div>

        <Card className="rounded-container border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          {/* ลบ Padding ออก เพื่อให้เส้นแบ่ง (divide-y) ชนขอบสวยงาม */}
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-[#ededf4]">
              <MandatoryDocRow
                title="Presentation (PowerPoint)"
                accept=".ppt,.pptx"
                file={presentation}
                onRemove={() => removeFile(setPresentation)}
              />
              <MandatoryDocRow
                title="ใบเสนอราคา (PDF)"
                accept=".pdf"
                file={quotation}
                onRemove={() => removeFile(setQuotation)}
              />
              <MandatoryDocRow
                title="สรุปโครงการ One Page (PDF)"
                accept=".pdf"
                file={onePage}
                onRemove={() => removeFile(setOnePage)}
              />
              <MandatoryDocRow
                title="หนังสือรับรองจาก รผว. (PDF)"
                accept=".pdf"
                file={approvalDoc}
                onRemove={() => removeFile(setApprovalDoc)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* ========================================================= */}
      {/* 4. Diagrams (Optional - Fixed 4 Slots) */}
      {/* ========================================================= */}
      <div className="space-y-6 mt-4">
        <div className="px-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c20]">
              สถาปัตยกรรมและรูปภาพระบบ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              อัปโหลดภาพประกอบระบบเพิ่มเติม{" "}
              <span className="font-semibold text-slate-400">(ถ้ามี)</span>
            </p>
          </div>
        </div>

        <Card className="rounded-[40px] border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#ededf4] px-8 py-4 flex flex-row items-center justify-between rounded-none bg-surface/30">
            <CardTitle className="text-lg font-bold text-[#191c20]">
              ไฟล์รูปภาพประกอบ 4 หมวด
            </CardTitle>
            <span className="bg-white text-slate-600 px-4 py-1.5 rounded-full border border-[#D1CDC7] text-xs font-bold shadow-sm">
              อัปโหลดแล้ว {uploadedDiagramsCount} / 4
            </span>
          </CardHeader>
          <CardContent className="p-8">
            {/* ปรับเป็น Grid 2x2 เพื่อให้มีพื้นที่แสดงชื่อที่ยาวๆ ได้อย่างสวยงาม */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {/* ช่องที่ 1 */}
              <div className="space-y-3 my-1">
                <Label className="text-sm font-semibold text-[#191c20]">
                  1. แผนผังการเชื่อมโยงระบบ (System Diagram)
                </Label>
                {systemDiagram ? (
                  <DiagramPreviewCard
                    file={systemDiagram}
                    onRemove={() => removeFile(setSystemDiagram)}
                  />
                ) : (
                  <DiagramUploadPlaceholder title="อัปโหลดรูป System Diagram" />
                )}
              </div>

              {/* ช่องที่ 2 */}
              <div className="space-y-2 my-1">
                <Label className="text-sm font-semibold text-[#191c20]">
                  2. แผนผังการเชื่อมโยงเครือข่าย (Network Diagram)
                </Label>
                {networkDiagram ? (
                  <DiagramPreviewCard
                    file={networkDiagram}
                    onRemove={() => removeFile(setNetworkDiagram)}
                  />
                ) : (
                  <DiagramUploadPlaceholder title="อัปโหลดรูป Network Diagram" />
                )}
              </div>

              {/* ช่องที่ 3 */}
              <div className="space-y-3 my-1">
                <Label className="text-sm font-semibold text-[#191c20]">
                  3. แผนภาพแสดงปฏิสัมพันธ์ระหว่างระบบงาน (Use Case)
                </Label>
                {useCaseDiagram ? (
                  <DiagramPreviewCard
                    file={useCaseDiagram}
                    onRemove={() => removeFile(setUseCaseDiagram)}
                  />
                ) : (
                  <DiagramUploadPlaceholder title="อัปโหลดรูป Use Case Diagram" />
                )}
              </div>

              {/* ช่องที่ 4 */}
              <div className="space-y-3 my-1">
                <Label className="text-sm font-semibold text-[#191c20]">
                  4. การรักษาความมั่นคงปลอดภัยสารสนเทศ (Network, System, and Information Security)
                </Label>
                {securityDiagram ? (
                  <DiagramPreviewCard
                    file={securityDiagram}
                    onRemove={() => removeFile(setSecurityDiagram)}
                  />
                ) : (
                  <DiagramUploadPlaceholder title="อัปโหลดรูป Security Diagram" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
}
