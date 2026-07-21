"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Paperclip,
  Presentation,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadModal } from "./FileUploadModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export type SharedFileValue = {
  id: string;
  name: string;
  type?: string;
  mimeType?: string;
  size?: string;
  url?: string;
  file?: File | string;
  description?: string;
  uploader?: {
    userId: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type FileUploadFieldProps = {
  projectId: string;
  docTypeId?: number;
  title: string;
  accept?: string;
  value?: SharedFileValue | string | null;
  onChange: (value: SharedFileValue | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
  showDescription?: boolean;
  descriptionRequired?: boolean;
  descriptionError?: string;
  canManage?: boolean;
  className?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ?? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081"}/api/v1`;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function fileKind(fileName: string, mimeType = "") {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (mimeType.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(extension ?? "")) return "image";
  if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
  if (mimeType.includes("presentation") || ["ppt", "pptx"].includes(extension ?? "")) return "ppt";
  if (mimeType.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(extension ?? "")) return "spreadsheet";
  return "other";
}

function FileTypeIcon({ kind }: { kind: string }) {
  if (kind === "image") return <FileImage className="h-4 w-4" aria-hidden="true" />;
  if (kind === "ppt") return <Presentation className="h-4 w-4" aria-hidden="true" />;
  if (kind === "spreadsheet") return <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />;
  return <FileText className="h-4 w-4" aria-hidden="true" />;
}

function getSource(value: SharedFileValue | string | null | undefined) {
  if (!value) return { name: "", source: "", mimeType: "", kind: "other" };
  if (typeof value === "string") {
    const name = decodeURIComponent(value.split("/").pop() || "Uploaded file");
    return { name, source: value, mimeType: "", kind: fileKind(name) };
  }
  const name = value.name || "Uploaded file";
  const source = typeof value.file === "string" ? value.file : value.url || "";
  return {
    name,
    source,
    mimeType: value.mimeType || "",
    kind: fileKind(name, value.mimeType || value.type || ""),
  };
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const tokens = accept.split(",").map((token) => token.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}

async function uploadProjectFile(file: File, projectId: string, docTypeId: number, description: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("projectId", projectId);
  body.append("docTypeId", String(docTypeId));
  body.append("description", description.trim());

  const response = await fetch(`${API_BASE}/uploads/document`, {
    method: "POST",
    credentials: "include",
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.data?.url) {
    throw new Error(payload.message ?? payload.error ?? "File upload failed");
  }
  return payload.data as {
    attachmentId?: string;
    url: string;
    uploader?: SharedFileValue["uploader"];
  };
}

export async function deleteProjectFile(fileId: string) {
  const response = await fetch(`${API_BASE}/uploads/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? payload.error ?? "File deletion failed");
}

export function FileAttachment({
  value,
  onRemove,
  canManage = true,
  className,
}: {
  value: SharedFileValue | string;
  onRemove?: () => void | Promise<void>;
  canManage?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const source = useMemo(() => getSource(value), [value]);
  const canPreview = source.kind === "image" || source.kind === "pdf";

  const openFile = () => {
    if (!source.source) return;
    if (canPreview) {
      setOpen(true);
      return;
    }
    const link = document.createElement("a");
    link.href = source.source;
    link.download = source.name;
    link.rel = "noopener";
    link.click();
  };

  return (
    <>
      <div className={cn("flex min-w-0 items-center gap-3 rounded-sm border border-slate-200 bg-white px-3 py-2.5 shadow-sm", className)}>
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          source.kind === "pdf" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700",
        )}>
          <FileTypeIcon kind={source.kind} />
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={openFile}
            disabled={!source.source}
            className="block max-w-full truncate text-left text-sm font-semibold text-slate-800 underline-offset-2 hover:text-primary hover:underline disabled:cursor-default disabled:no-underline"
            title={canPreview ? "Preview file" : "Download file"}
          >
            {source.name}
          </button>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
            <span>{canPreview ? "Click to preview" : "Click to download"}</span>
            {typeof value !== "string" && value.uploader && (
              <span className="truncate">
                • Uploaded by {value.uploader.firstName} {value.uploader.lastName}
              </span>
            )}
          </div>
          {typeof value !== "string" && value.description && (
            <p className="mt-1 truncate text-xs text-slate-600" title={value.description}>
              {value.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {canPreview ? (
            <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 sm:inline-flex">
              Preview
            </span>
          ) : (
            <Download className="hidden h-4 w-4 text-slate-400 sm:block" aria-label="Download" />
          )}
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void onRemove()}
              disabled={!canManage}
              className="text-slate-400 hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${source.name}`}
              title={canManage ? "Remove file" : "File removal is disabled"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[min(92vh,900px)] w-[min(96vw,1100px)] max-w-none flex-col p-4 sm:p-6">
          <DialogHeader className="shrink-0 pr-10">
            <DialogTitle className="truncate">{source.name}</DialogTitle>
            <DialogDescription>{canPreview ? "File preview" : "File download"}</DialogDescription>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
            {source.kind === "image" ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={source.source} alt={source.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <iframe src={source.source} title={source.name} className="h-full w-full border-0" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function FileUploadField({
  projectId,
  docTypeId,
  title,
  accept,
  value,
  onChange,
  onUploadingChange,
  showDescription = false,
  descriptionRequired = false,
  descriptionError,
  canManage = true,
  className,
}: FileUploadFieldProps) {
  const queryClient = useQueryClient();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const source = getSource(value);
  const current = typeof value === "string"
    ? { id: "uploaded", name: source.name, url: value, type: source.kind }
    : value;

  const setUploading = (next: boolean) => {
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const handleUpload = async (file: File, description: string) => {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) throw new Error("Please provide a description for this file.");
    if (!matchesAccept(file, accept)) {
      throw new Error(`Unsupported file type. Allowed: ${accept || "this file type"}.`);
    }
    if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE_BYTES) {
      throw new Error(`PDF files must be smaller than ${formatBytes(MAX_PDF_SIZE_BYTES)}.`);
    }
    if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(`Images must be smaller than ${formatBytes(MAX_IMAGE_SIZE_BYTES)} before compression.`);
    }

    setError(null);
    setUploading(true);
    try {
      let uploadFile = file;
      if (file.type.startsWith("image/")) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.82,
          fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
        });
        uploadFile = new File([compressed], file.name, {
          type: compressed.type,
          lastModified: Date.now(),
        });
      }

      const uploaded = await uploadProjectFile(uploadFile, projectId, docTypeId ?? 8, trimmedDescription);
      onChange({
        id: uploaded.attachmentId ?? crypto.randomUUID(),
        name: file.name,
        type: fileKind(file.name, file.type),
        mimeType: file.type,
        size: formatBytes(uploadFile.size),
        url: uploaded.url,
        file: uploaded.url,
        description: trimmedDescription,
        uploader: uploaded.uploader ?? null,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["proposals", "draft", projectId] }),
      ]);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "File upload failed.";
      setError(message);
      toast.error("File upload failed", { description: message });
      throw uploadError instanceof Error ? uploadError : new Error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!current || isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      if (UUID_PATTERN.test(current.id)) await deleteProjectFile(current.id);
      onChange(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["proposals", "draft", projectId] }),
      ]);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "File deletion failed.";
      setError(message);
      toast.error("File deletion failed", { description: message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className={cn(
      "rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4",
      className,
    )}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-800">{title}</h3>
              <p className="truncate text-xs text-slate-500">
                {current ? "File attached" : accept ? `Accepted: ${accept}` : "No file attached"}
              </p>
            </div>
          </div>
        </div>

        {!current && canManage && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setUploadModalOpen(true)}
            disabled={isUploading}
            className="w-full shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 sm:w-auto"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload file
          </Button>
        )}
      </div>

      <div className="mt-3">
        {current ? (
          <FileAttachment
            value={current}
            onRemove={handleRemove}
            canManage={canManage && !isDeleting}
          />
        ) : canManage ? (
          <div className=" border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
            Select a file and add its description to upload it.
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Attachments are read-only at this project stage.
          </div>
        )}
      </div>

      {current && showDescription && !current.description && descriptionRequired && canManage && (
        <Input
          value={current.description || ""}
          onChange={(event) => onChange({ ...current, description: event.target.value })}
          placeholder="Description is required"
          className={cn("mt-3 h-9 text-sm", descriptionError && "border-red-500")}
        />
      )}

      {(error || descriptionError) && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error || descriptionError}
        </p>
      )}

      {current && !error && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Saved to project attachments
        </p>
      )}

      {canManage && (
        <FileUploadModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          title={title}
          accept={accept}
          onUpload={handleUpload}
        />
      )}
    </section>
  );
}
