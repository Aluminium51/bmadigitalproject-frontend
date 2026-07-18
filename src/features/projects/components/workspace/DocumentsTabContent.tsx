import { Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectDocuments } from "../../hooks/useProjectDocuments";
import type { DocumentFile } from "../../types/workspace";
import { FileAttachment, FileUploadField } from "./ui/FileUploadField";

const EMPTY_ATTACHMENTS: Parameters<typeof useProjectDocuments>[0] = [];

type DocumentField = {
  docTypeId: number;
  title: string;
  accept: string;
  file: DocumentFile | null;
  required?: boolean;
  setFile: (file: DocumentFile | null) => void;
};

export function DocumentsTabContent({ projectId, initialAttachments = EMPTY_ATTACHMENTS }: { projectId: string; initialAttachments?: Parameters<typeof useProjectDocuments>[0] }) {
  const documents = useProjectDocuments(initialAttachments);
  const mandatory: DocumentField[] = [
    { docTypeId: 5, title: "Presentation", accept: ".ppt,.pptx", file: documents.presentation, setFile: documents.setPresentation, required: true },
    { docTypeId: 9, title: "Quotation", accept: ".pdf", file: documents.quotation, setFile: documents.setQuotation, required: true },
    { docTypeId: 10, title: "One Page Summary", accept: ".pdf", file: documents.onePage, setFile: documents.setOnePage, required: true },
    { docTypeId: 11, title: "Approval Document", accept: ".pdf", file: documents.approvalDoc, setFile: documents.setApprovalDoc, required: true },
  ];
  const diagrams: DocumentField[] = [
    { docTypeId: 1, title: "System Diagram", accept: ".png,.jpg,.jpeg,.webp", file: documents.systemDiagram, setFile: documents.setSystemDiagram },
    { docTypeId: 2, title: "Network Diagram", accept: ".png,.jpg,.jpeg,.webp", file: documents.networkDiagram, setFile: documents.setNetworkDiagram },
    { docTypeId: 3, title: "Use Case Diagram", accept: ".png,.jpg,.jpeg,.webp", file: documents.useCaseDiagram, setFile: documents.setUseCaseDiagram },
    { docTypeId: 4, title: "Security Diagram", accept: ".png,.jpg,.jpeg,.webp", file: documents.securityDiagram, setFile: documents.setSecurityDiagram },
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#191c20]">Project documents</h2>
            <p className="text-sm text-slate-500">Upload files using the same validation, optimization, and modal preview as the proposal form.</p>
          </div>
          <Badge variant="outline">Uploaded {documents.mandatoryUploadedCount} / 4</Badge>
        </div>
        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
          <CardContent className="p-4 grid gap-4 md:grid-cols-2">
            {mandatory.map((field) => (
              <FileUploadField
                key={field.title}
                projectId={projectId}
                docTypeId={field.docTypeId}
                title={`${field.title}${field.required ? " *" : ""}`}
                accept={field.accept}
                value={field.file}
                onChange={(file) => field.setFile(file as DocumentFile | null)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#191c20]">Architecture diagrams</h2>
            <p className="text-sm text-slate-500">Images are resized and compressed before upload.</p>
          </div>
          <Badge variant="outline">Uploaded {documents.diagramsUploadedCount} / 4</Badge>
        </div>
        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
          <CardContent className="p-4 grid gap-4 md:grid-cols-2">
            {diagrams.map((field) => (
              <FileUploadField
                key={field.title}
                projectId={projectId}
                docTypeId={field.docTypeId}
                title={field.title}
                accept={field.accept}
                value={field.file}
                onChange={(file) => field.setFile(file as DocumentFile | null)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#191c20]">Additional documents</h2>
          <p className="text-sm text-slate-500">Unsupported preview formats download directly when selected.</p>
        </div>
        <FileUploadField
          projectId={projectId}
          docTypeId={8}
          title="Add document"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp"
          value={null}
          onChange={(file) => file && documents.addAdditionalDocument(file as DocumentFile)}
        />
        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
          <CardContent className="p-4 space-y-3">
            {documents.additionalDocs.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-center text-slate-400">
                <Paperclip className="w-7 h-7 mb-2" />
                <p className="text-sm">No additional documents</p>
              </div>
            ) : (
              documents.additionalDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 border-b last:border-b-0 pb-3 last:pb-0">
                  <FileAttachment value={doc} onRemove={() => documents.removeAdditionalDoc(doc.id)} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
