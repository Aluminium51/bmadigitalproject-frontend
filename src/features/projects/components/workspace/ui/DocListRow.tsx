import type { DocumentFile } from "../../../types/workspace";
import { FileUploadField, type SharedFileValue } from "./FileUploadField";

interface DocListRowProps {
  projectId: string;
  title: string;
  accept?: string;
  file: DocumentFile | null;
  onChange: (file: DocumentFile | null) => void;
  isRequired?: boolean;
}

export function DocListRow({ projectId, title, accept, file, onChange, isRequired = false }: DocListRowProps) {
  return (
    <FileUploadField
      projectId={projectId}
      docTypeId={8}
      title={`${title}${isRequired ? " *" : ""}`}
      accept={accept}
      value={file as SharedFileValue | null}
      onChange={(next) => onChange(next as DocumentFile | null)}
    />
  );
}
