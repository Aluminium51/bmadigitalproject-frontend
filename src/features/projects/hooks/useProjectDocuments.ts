import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { DocumentFile } from "../types/workspace";

export function useProjectDocuments() {
  const [presentation, setPresentation] = useState<DocumentFile | null>(null);
  const [quotation, setQuotation] = useState<DocumentFile | null>({
    id: "q1",
    name: "ใบเสนอราคา_บ.เอบีซี.pdf",
    type: "pdf",
    size: "1.2 MB",
  });
  const [onePage, setOnePage] = useState<DocumentFile | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<DocumentFile | null>(null);

  const [systemDiagram, setSystemDiagram] = useState<DocumentFile | null>(null);
  const [networkDiagram, setNetworkDiagram] = useState<DocumentFile | null>(null);
  const [useCaseDiagram, setUseCaseDiagram] = useState<DocumentFile | null>(null);
  const [securityDiagram, setSecurityDiagram] = useState<DocumentFile | null>(null);

  const [additionalDocs, setAdditionalDocs] = useState<DocumentFile[]>([]);

  const mandatoryUploadedCount = [presentation, quotation, onePage, approvalDoc].filter(
    Boolean
  ).length;

  const diagramsUploadedCount = [
    systemDiagram,
    networkDiagram,
    useCaseDiagram,
    securityDiagram,
  ].filter(Boolean).length;

  const removeFile = (setter: Dispatch<SetStateAction<DocumentFile | null>>) => {
    setter(null);
  };

  const removeAdditionalDoc = (id: string) => {
    setAdditionalDocs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddAdditionalDoc = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc: DocumentFile = {
        id: Math.random().toString(),
        name: file.name,
        type: file.type.includes("pdf")
          ? "pdf"
          : file.type.includes("presentation")
            ? "ppt"
            : file.type.includes("image")
              ? "image"
              : "other",
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      };
      setAdditionalDocs((prev) => [...prev, newDoc]);
    }
  };

  return {
    presentation,
    quotation,
    onePage,
    approvalDoc,
    systemDiagram,
    networkDiagram,
    useCaseDiagram,
    securityDiagram,
    additionalDocs,
    mandatoryUploadedCount,
    diagramsUploadedCount,
    setPresentation,
    setQuotation,
    setOnePage,
    setApprovalDoc,
    setSystemDiagram,
    setNetworkDiagram,
    setUseCaseDiagram,
    setSecurityDiagram,
    removeFile,
    removeAdditionalDoc,
    handleAddAdditionalDoc,
  };
}
