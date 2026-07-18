import type { DocumentFile } from "../../../types/workspace";
import { FileUploadField } from "./FileUploadField";

interface DiagramUploadPlaceholderProps {
  projectId: string;
  title: string;
  onChange: (file: DocumentFile | null) => void;
}

export function DiagramUploadPlaceholder({ projectId, title, onChange }: DiagramUploadPlaceholderProps) {
  return (
    <FileUploadField
      projectId={projectId}
      docTypeId={1}
      title={title}
      accept=".png,.jpg,.jpeg,.webp"
      value={null}
      onChange={(next) => onChange(next as DocumentFile | null)}
    />
  );
}
