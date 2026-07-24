import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DocumentFile, ProjectResponse } from "../types/workspace";

export type ProjectAttachment = ProjectResponse["attachments"][number];

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
    description: attachment.description ?? undefined,
    createdAt: attachment.createdAt,
    canDelete:
      typeof attachment.canDelete === "boolean" ? attachment.canDelete : undefined,
    uploader: attachment.uploader,
  };
}

function compareAttachments(left: ProjectAttachment, right: ProjectAttachment) {
  const createdAtDifference =
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  return createdAtDifference || right.id.localeCompare(left.id);
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
    const latest = new Map<string, ProjectAttachment>();
    for (const attachment of [...initialAttachments].sort(compareAttachments)) {
      const typeKey = attachment.docTypeName ?? String(attachment.docTypeId);
      const current = latest.get(typeKey);
      if (!current) {
        latest.set(typeKey, attachment);
      }
    }
    return latest;
  }, [initialAttachments]);

  const approvalDocuments = useMemo(
    () =>
      initialAttachments
        .filter((attachment) => attachment.docTypeName === "approval_document")
        .sort(compareAttachments)
        .map(mapAttachment),
    [initialAttachments],
  );

  // The local values mirror the server response and are also updated immediately
  // by upload controls before the invalidated project query resolves.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const get = (docTypeName: string) => {
      const attachment = latestByType.get(docTypeName);
      return attachment ? mapAttachment(attachment) : null;
    };
    setPresentation(get("presentation"));
    setQuotation(get("quotation"));
    setOnePage(get("one_page_summary"));
    setApprovalDoc(get("approval_document"));
    setSystemDiagram(get("system_diagram"));
    setNetworkDiagram(get("network_diagram"));
    setUseCaseDiagram(get("use_case_diagram"));
    setSecurityDiagram(get("security_diagram"));
    setAdditionalDocs(
      initialAttachments
        .filter((attachment) => attachment.docTypeName === "other")
        .map(mapAttachment),
    );
  }, [initialAttachments, latestByType]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    approvalDocuments,
    latestApprovalDocument: approvalDoc ?? approvalDocuments[0] ?? null,
    approvalDocumentHistory: approvalDocuments.slice(1),
  };
}
