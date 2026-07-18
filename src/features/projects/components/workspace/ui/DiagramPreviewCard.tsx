import type { DocumentFile } from "../../../types/workspace";
import { FileUploadField } from "./FileUploadField";

interface DiagramPreviewCardProps {
  projectId: string;
  title: string;
  file: DocumentFile;
  onChange: (file: DocumentFile | null) => void;
}

export function DiagramPreviewCard({ projectId, title, file, onChange }: DiagramPreviewCardProps) {
  return (
    <FileUploadField
      projectId={projectId}
      docTypeId={1}
      title={title}
      accept=".png,.jpg,.jpeg,.webp"
      value={file}
      onChange={(next) => onChange(next as DocumentFile | null)}
    />
  );
}
