import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DocumentFile } from "../types/workspace";

export type ProjectAttachment = {
  id: string;
  projectId: string;
  docTypeId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt?: string | Date;
};

const EMPTY_ATTACHMENTS: ProjectAttachment[] = [];

function getDocumentType(fileName: string, mimeType: string): DocumentFile["type"] {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (mimeType.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(extension ?? "")) return "image";
  if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
  if (mimeType.includes("presentation") || ["ppt", "pptx"].includes(extension ?? "")) return "ppt";
  return "other";
}

function mapAttachment(attachment: ProjectAttachment): DocumentFile {
  return {
    id: attachment.id,
    name: attachment.fileName,
    type: getDocumentType(attachment.fileName, attachment.fileType),
    mimeType: attachment.fileType,
    url: attachment.fileUrl,
    file: attachment.fileUrl,
  };
}

export function useProjectDocuments(initialAttachments: ProjectAttachment[] = EMPTY_ATTACHMENTS) {
  const [presentation, setPresentation] = useState<DocumentFile | null>(null);
  const [quotation, setQuotation] = useState<DocumentFile | null>(null);
  const [onePage, setOnePage] = useState<DocumentFile | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<DocumentFile | null>(null);
  const [systemDiagram, setSystemDiagram] = useState<DocumentFile | null>(null);
  const [networkDiagram, setNetworkDiagram] = useState<DocumentFile | null>(null);
  const [useCaseDiagram, setUseCaseDiagram] = useState<DocumentFile | null>(null);
  const [securityDiagram, setSecurityDiagram] = useState<DocumentFile | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<DocumentFile[]>([]);

  const latestByType = useMemo(() => {
    const latest = new Map<number, ProjectAttachment>();
    for (const attachment of initialAttachments) {
      const current = latest.get(attachment.docTypeId);
      if (!current || new Date(attachment.createdAt ?? 0).getTime() > new Date(current.createdAt ?? 0).getTime()) {
        latest.set(attachment.docTypeId, attachment);
      }
    }
    return latest;
  }, [initialAttachments]);

  useEffect(() => {
    const get = (docTypeId: number) => {
      const attachment = latestByType.get(docTypeId);
      return attachment ? mapAttachment(attachment) : null;
    };
    setPresentation(get(5));
    setQuotation(get(9));
    setOnePage(get(10));
    setApprovalDoc(get(11));
    setSystemDiagram(get(1));
    setNetworkDiagram(get(2));
    setUseCaseDiagram(get(3));
    setSecurityDiagram(get(4));
    setAdditionalDocs(initialAttachments.filter((attachment) => attachment.docTypeId === 8).map(mapAttachment));
  }, [initialAttachments, latestByType]);

  const mandatoryUploadedCount = [presentation, quotation, onePage, approvalDoc].filter(Boolean).length;
  const diagramsUploadedCount = [systemDiagram, networkDiagram, useCaseDiagram, securityDiagram].filter(Boolean).length;
  const removeFile = (setter: Dispatch<SetStateAction<DocumentFile | null>>) => setter(null);
  const removeAdditionalDoc = (id: string) => setAdditionalDocs((prev) => prev.filter((file) => file.id !== id));
  const addAdditionalDocument = (file: DocumentFile) => setAdditionalDocs((prev) => [...prev, file]);

  return {
    presentation, quotation, onePage, approvalDoc, systemDiagram, networkDiagram, useCaseDiagram, securityDiagram,
    additionalDocs, mandatoryUploadedCount, diagramsUploadedCount, setPresentation, setQuotation, setOnePage,
    setApprovalDoc, setSystemDiagram, setNetworkDiagram, setUseCaseDiagram, setSecurityDiagram, removeFile,
    removeAdditionalDoc, addAdditionalDocument,
  };
}
