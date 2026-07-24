"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileCheck2, History, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProjectDocuments, type ProjectAttachment } from "../../hooks/useProjectDocuments";
import { deleteProjectFile, FileAttachment, FileUploadField } from "./ui/FileUploadField";
import type { DocumentFile } from "../../types/workspace";
import { getProjectAttachmentTypesAction } from "@/features/projects/actions/project-attachment.actions";

const EMPTY_ATTACHMENTS: ProjectAttachment[] = [];

type DocumentField = {
  docTypeName: string;
  docTypeId?: number;
  title: string;
  accept: string;
  file: DocumentFile | null;
  setFile: (file: DocumentFile | null) => void;
};

function formatDate(value: string | Date | undefined) {
  if (!value) return "ไม่ระบุวันที่";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));
}

export function DocumentsTabContent({
  projectId,
  initialAttachments = EMPTY_ATTACHMENTS,
  canManage = true,
}: {
  projectId: string;
  initialAttachments?: ProjectAttachment[];
  canManage?: boolean;
}) {
  const documents = useProjectDocuments(initialAttachments);
  const queryClient = useQueryClient();
  const { data: attachmentTypesResponse } = useQuery({
    queryKey: ["lookups", "project-attachment-types"],
    queryFn: getProjectAttachmentTypesAction,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const attachmentTypeIds = new Map(
    (attachmentTypesResponse?.data ?? []).map((type) => [type.name, type.id]),
  );
  const getAttachmentTypeId = (name: string) => attachmentTypeIds.get(name);

  const invalidateProjectData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["proposals", "draft", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["proposals", "submitted", projectId] }),
    ]);
  };

  const handleRemoveFile = async (id: string, removeLocal?: () => void) => {
    try {
      if (id !== "uploaded") await deleteProjectFile(id);
      removeLocal?.();
      await invalidateProjectData();
    } catch (error) {
      toast.error("ลบเอกสารไม่สำเร็จ", {
        description:
          error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const requiredDocuments: DocumentField[] = [
    {
      docTypeName: "presentation",
      docTypeId: getAttachmentTypeId("presentation"),
      title: "Presentation",
      accept: ".ppt,.pptx",
      file: documents.presentation,
      setFile: documents.setPresentation,
    },
    {
      docTypeName: "quotation",
      docTypeId: getAttachmentTypeId("quotation"),
      title: "ใบเสนอราคา",
      accept: ".pdf",
      file: documents.quotation,
      setFile: documents.setQuotation,
    },
    {
      docTypeName: "one_page_summary",
      docTypeId: getAttachmentTypeId("one_page_summary"),
      title: "One page",
      accept: ".pdf",
      file: documents.onePage,
      setFile: documents.setOnePage,
    },
  ];

  const diagrams: DocumentField[] = [
    {
      docTypeName: "system_diagram",
      docTypeId: getAttachmentTypeId("system_diagram"),
      title: "System Diagram",
      accept: ".png,.jpg,.jpeg,.webp",
      file: documents.systemDiagram,
      setFile: documents.setSystemDiagram,
    },
    {
      docTypeName: "network_diagram",
      docTypeId: getAttachmentTypeId("network_diagram"),
      title: "Network Diagram",
      accept: ".png,.jpg,.jpeg,.webp",
      file: documents.networkDiagram,
      setFile: documents.setNetworkDiagram,
    },
    {
      docTypeName: "use_case_diagram",
      docTypeId: getAttachmentTypeId("use_case_diagram"),
      title: "Use Case Diagram",
      accept: ".png,.jpg,.jpeg,.webp",
      file: documents.useCaseDiagram,
      setFile: documents.setUseCaseDiagram,
    },
    {
      docTypeName: "security_diagram",
      docTypeId: getAttachmentTypeId("security_diagram"),
      title: "Security Diagram",
      accept: ".png,.jpg,.jpeg,.webp",
      file: documents.securityDiagram,
      setFile: documents.setSecurityDiagram,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-amber-200 border bg-amber-50">
        <CardHeader className="border-b border-amber-200 b-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-extrabold text-slate-900">
                    เอกสารประกอบการพิจารณาพร้อมลายเซ็นรับรอง
                  </CardTitle>
                  <Badge className="border-amber-300 bg-amber-100 text-amber-800">
                    จำเป็น
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  กรุณาexportแบบฟอร์มที่ท่านกรอกในระบบ และอัปโหลดเอกสารที่มีลายเซ็นรับรองจากผู้มีอำนาจลงนาม
                </p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit border-amber-300 bg-white/70">
              {documents.approvalDocuments.length > 0
                ? `${documents.approvalDocuments.length} เวอร์ชัน`
                : "ยังไม่มีเอกสาร"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-5">
          <FileUploadField
            projectId={projectId}
            docTypeId={getAttachmentTypeId("approval_document")}
            title="เอกสารอนุมัติโครงการ"
            accept=".pdf"
            value={documents.latestApprovalDocument}
            onChange={(file) => documents.setApprovalDoc(file as DocumentFile | null)}
            canManage={canManage}
            allowNewVersion
            uploadButtonLabel="อัปโหลดเวอร์ชันใหม่"
            showDescription
            className="border-amber-200 bg-white/80"
          />

          {documents.approvalDocumentHistory.length > 0 && (
            <Accordion type="single" collapsible className="rounded-lg border border-amber-200 bg-white/70 px-3">
              <AccordionItem value="approval-history" className="border-0">
                <AccordionTrigger className="py-3 font-bold text-slate-800 hover:no-underline">
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4 text-amber-700" />
                    ประวัติเวอร์ชัน ({documents.approvalDocumentHistory.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {documents.approvalDocumentHistory.map((document) => (
                      <div key={document.id} className="space-y-1">
                        <FileAttachment
                          value={document}
                          canManage={canManage || document.canDelete === true}
                          onRemove={() =>
                            void handleRemoveFile(document.id)
                          }
                        />
                        <p className="pl-12 text-[11px] text-slate-500">
                          อัปโหลดเมื่อ {formatDate(document.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">เอกสารประกอบโครงการ</h2>
            <p className="text-sm text-slate-500">เอกสารที่ใช้ประกอบการพิจารณาโครงการ</p>
          </div>
          <Badge variant="outline">
            อัปโหลดแล้ว {requiredDocuments.filter((document) => document.file).length} / {requiredDocuments.length}
          </Badge>
        </div>
        <Card className="rounded-md border-[#D1CDC7] bg-white shadow-sm">
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            {requiredDocuments.map((field) => (
              <FileUploadField
                key={field.docTypeName}
                projectId={projectId}
                docTypeId={field.docTypeId}
                title={field.title}
                accept={field.accept}
                value={field.file}
                onChange={(file) => field.setFile(file as DocumentFile | null)}
                canManage={canManage}
                showDescription
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">แผนภาพระบบ</h2>
          <p className="text-sm text-slate-500">รูปภาพจะถูกปรับขนาดและบีบอัดก่อนอัปโหลด</p>
        </div>
        <Card className="rounded-md border-[#D1CDC7] bg-white shadow-sm">
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            {diagrams.map((field) => (
              <FileUploadField
                key={field.docTypeName}
                projectId={projectId}
                docTypeId={field.docTypeId}
                title={field.title}
                accept={field.accept}
                value={field.file}
                onChange={(file) => field.setFile(file as DocumentFile | null)}
                canManage={canManage}
                showDescription
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">เอกสารเพิ่มเติม</h2>
          <p className="text-sm text-slate-500">
            เอกสารรูปแบบอื่นจะถูกดาวน์โหลดโดยตรงเมื่อเลือกไฟล์
          </p>
        </div>
        <FileUploadField
          projectId={projectId}
          docTypeId={getAttachmentTypeId("other")}
          title="เอกสารเพิ่มเติม"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp"
          value={null}
          onChange={(file) =>
            file && documents.addAdditionalDocument(file as DocumentFile)
          }
          canManage={canManage}
          showDescription
        />
        <Card className="rounded-md border-[#D1CDC7] bg-white shadow-sm">
          <CardContent className="space-y-3 p-4">
            {documents.additionalDocs.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center text-slate-400">
                <Paperclip className="mb-2 h-7 w-7" />
                <p className="text-sm">ยังไม่มีเอกสารแนบ</p>
              </div>
            ) : (
              documents.additionalDocs.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <FileAttachment
                    value={document}
                    canManage={canManage}
                    onRemove={() =>
                      void handleRemoveFile(document.id, () =>
                        documents.removeAdditionalDoc(document.id),
                      )
                    }
                    className="w-full"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
