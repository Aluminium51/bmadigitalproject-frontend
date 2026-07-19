"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import {
  AlertCircle,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Loader2,
  Presentation,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type FileUploadFieldProps = {
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

function getIcon(kind: string) {
  if (kind === "image") return FileImage;
  if (kind === "ppt") return Presentation;
  if (kind === "spreadsheet") return FileSpreadsheet;
  return FileText;
}

function getSource(value: SharedFileValue | string | null | undefined) {
  if (!value) return { name: "", source: "", mimeType: "", kind: "other" };
  if (typeof value === "string") {
    const name = value.split("/").pop() || "Uploaded file";
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

async function uploadProjectFile(file: File, projectId: string, docTypeId: number, description?: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("projectId", projectId);
  body.append("docTypeId", String(docTypeId));
  if (description?.trim()) body.append("description", description.trim());
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
    fileName?: string;
    fileSize?: number;
    contentType?: string;
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
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const source = useMemo(() => getSource(value), [value]);
  const Icon = getIcon(source.kind);
  const canPreview = source.kind === "image" || source.kind === "pdf";
  const previewSource = objectUrl || source.source;

  useEffect(() => {
    if (typeof value === "string" || typeof value.file !== "object" || !value.file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(value.file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const openFile = () => {
    if (!previewSource) return;
    if (canPreview) {
      setOpen(true);
      return;
    }
    const link = document.createElement("a");
    link.href = previewSource;
    link.download = source.name;
    link.rel = "noopener";
    link.click();
  };

  return (
    <>
      <div className={cn("flex items-center gap-2 min-w-0", className)}>
        <button
          type="button"
          onClick={openFile}
          disabled={!previewSource}
          className="flex items-center gap-2 min-w-0 text-left hover:text-primary disabled:cursor-default"
          title={canPreview ? "Preview file" : "Download file"}
        >
          <Icon className={cn("w-4 h-4 shrink-0", source.kind === "pdf" ? "text-red-500" : "text-primary")} />
          <span className="truncate text-sm font-medium underline-offset-2 hover:underline">{source.name}</span>
        </button>
        {!canPreview && previewSource && <Download className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        {onRemove && (
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => void onRemove()} disabled={!canManage} className="shrink-0 text-muted-foreground hover:text-red-600">
            <X className="w-4 h-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        )}
      </div>
      {typeof value !== "string" && value.uploader && (
        <span className="ml-6 text-[11px] text-muted-foreground truncate">
          Uploaded by {value.uploader.firstName} {value.uploader.lastName}
        </span>
      )}
      {typeof value !== "string" && value.description && (
        <span className="ml-6 text-[11px] text-muted-foreground truncate" title={value.description}>
          {value.description}
        </span>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(96vw,1100px)] max-w-none h-[min(92vh,900px)] p-4 flex flex-col">
          <DialogHeader className="shrink-0 pr-10">
            <DialogTitle className="truncate">{source.name}</DialogTitle>
            <DialogDescription>File preview</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
            {source.kind === "image" ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previewSource} alt={source.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <iframe src={previewSource} title={source.name} className="w-full h-full border-0" />
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
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const source = getSource(value);
  const current = typeof value === "string" ? { id: "uploaded", name: source.name, url: value, type: source.kind } : value;

  const setUploading = (next: boolean) => {
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const handleFile = async (file: File) => {
    if (!matchesAccept(file, accept)) {
      setError(`Unsupported file type. Allowed: ${accept || "this file type"}.`);
      return;
    }
    if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE_BYTES) {
      setError(`PDF files must be smaller than ${formatBytes(MAX_PDF_SIZE_BYTES)}.`);
      return;
    }
    if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Images must be smaller than ${formatBytes(MAX_IMAGE_SIZE_BYTES)} before compression.`);
      return;
    }

    setError(null);
    if (showDescription && descriptionRequired && !descriptionDraft.trim()) {
      setError("Please provide a description for this file.");
      return;
    }
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
        uploadFile = new File([compressed], file.name, { type: compressed.type, lastModified: Date.now() });
      }
      const uploaded = await uploadProjectFile(uploadFile, projectId, docTypeId ?? 8, descriptionDraft);
      onChange({
        id: uploaded.attachmentId ?? crypto.randomUUID(),
        name: file.name,
        type: fileKind(file.name, file.type),
        mimeType: file.type,
        size: formatBytes(uploadFile.size),
        url: uploaded.url,
        file: uploaded.url,
        description: descriptionDraft.trim(),
        uploader: uploaded.uploader ?? null,
      });
      setDescriptionDraft("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["proposals", "draft", projectId] }),
      ]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "File upload failed.");
      toast.error("File upload failed", {
        description: uploadError instanceof Error ? uploadError.message : "Please try again.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!current || isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      const persistedAttachmentId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(current.id);
      if (persistedAttachmentId) await deleteProjectFile(current.id);
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !value) void handleFile(file);
  };

  return (
    <div className={cn("flex flex-col gap-2 px-3 py-2 border border-border rounded-lg bg-surface", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground truncate">{title}</span>
        {current && <FileAttachment value={current} onRemove={handleRemove} canManage={canManage && !isDeleting} className="max-w-[70%]" />}
      </div>

      {!current && (
        canManage ? <div
          className={cn("flex items-center gap-2 rounded-md border border-dashed px-2 py-1.5 transition-colors", isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50", isUploading && "pointer-events-none opacity-60")}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); }} disabled={isUploading} />
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading} className="h-7 px-2 text-xs">
            {isUploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5 mr-1" />}
            {isUploading ? "Uploading" : "Choose file"}
          </Button>
          <span className="text-[11px] text-muted-foreground truncate">or drag here · {accept || "supported file"}</span>
        </div> : <p className="text-xs text-muted-foreground">Attachments are read-only at this project stage.</p>
      )}

      {!current && showDescription && canManage && (
        <Input
          value={descriptionDraft}
          onChange={(event) => setDescriptionDraft(event.target.value)}
          placeholder={descriptionRequired ? "Description is required" : "Description (optional)"}
          className={cn("h-8 text-sm", descriptionError && "border-red-500")}
        />
      )}
      {current && showDescription && (
        current.description ? (
          <p className="text-xs text-muted-foreground truncate" title={current.description}>Description: {current.description}</p>
        ) : descriptionRequired && canManage ? (
          <Input
            value={current.description || ""}
            onChange={(event) => onChange({ ...current, description: event.target.value })}
            placeholder="Description is required"
            className={cn("h-8 text-sm", descriptionError && "border-red-500")}
          />
        ) : null
      )}
      {(error || descriptionError) && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error || descriptionError}</p>}
    </div>
  );
}
